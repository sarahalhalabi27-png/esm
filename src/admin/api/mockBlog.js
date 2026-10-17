import { blogPosts, blogPostDetailFallback } from "../../data/blogPostsData.js";

// Mock blog posts and comments until the backend exists, seeded from the
// website's blog data. Changes last until the page reloads.
//
// A post, as the backend should send it:
// {
//   id,                       the URL slug (/blog/:id), set when created
//   status: "published" | "draft",
//   publishedAt: "YYYY-MM-DD", author,
//   image: url | null,        the blog card photo
//   heroImage: url | null,    the post page's header photo (card photo if empty)
//   content: {
//     en: { title, excerpt, titleAccents: [words], sections: [{ heading, accents: [words], body }] },
//     ar: { ...same; empty fields fall back to English on the website }
//   },
//   updatedAt, commentCount (approved + pending)
// }
// A comment:
// { id, postId, postTitle, name, email, website, comment, createdAt,
//   status: "pending" | "approved" | "spam" }

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const copy = (value) => structuredClone(value);

function apiError(code, status) {
  const error = new Error(code);
  error.status = status;
  return error;
}

const emptyContent = () => ({
  title: "",
  excerpt: "",
  titleAccents: [],
  sections: [],
});

function contentFrom(source) {
  return {
    title: source.title ?? "",
    excerpt: source.excerpt ?? "",
    titleAccents: [...(source.titleAccents ?? [])],
    sections: (source.sections ?? []).map((s) => ({
      heading: s.heading ?? "",
      accents: [...(s.accents ?? [])],
      body: s.body ?? "",
    })),
  };
}

let posts = [
  ...blogPosts.map((post, index) => ({
    id: post.id,
    status: "published",
    publishedAt: post.date,
    author: post.author,
    image: post.image ?? null,
    heroImage: blogPostDetailFallback.heroImage ?? null,
    content: {
      en: contentFrom({ ...blogPostDetailFallback, ...post }),
      ar: contentFrom({
        ...blogPostDetailFallback.translations.ar,
        ...post.translations?.ar,
      }),
    },
    updatedAt: new Date(Date.now() - (index + 3) * 864e5).toISOString(),
  })),
  {
    id: "dubai-by-night",
    status: "draft",
    publishedAt: "",
    author: "ESM Limo",
    image: null,
    heroImage: null,
    content: {
      en: {
        title: "Dubai By Night:\nFive Places To See From A Limousine",
        excerpt: "Our chauffeurs' favourite evening route through the city",
        titleAccents: ["Night"],
        sections: [
          {
            heading: "Start At Downtown",
            accents: ["Downtown"],
            body: "Begin with the Dubai Fountain show at the foot of the Burj Khalifa…",
          },
        ],
      },
      ar: emptyContent(),
    },
    updatedAt: new Date(Date.now() - 864e5).toISOString(),
  },
];

const COMMENTERS = [
  ["Sarah Johnson", "https://sarahtravels.example.com"],
  ["Omar Haddad", ""],
  ["Emma Wilson", ""],
  ["Khalid Al Suwaidi", "https://alsuwaidi.example.ae"],
  ["Layla Nasser", ""],
  ["James Carter", ""],
];
const COMMENT_TEXTS = [
  "Booked the hourly service for my parents' anniversary, it was perfect. Thank you!",
  "Do you also offer this in Abu Dhabi?",
  "Great article, the airport transfer tip saved us a lot of stress.",
  "How early should I book for a wedding in December?",
  "تجربة رائعة، السائق كان محترفاً جداً وفي الموعد.",
  "Is a child seat available on request?",
];
const SPAM = [
  [
    "Best Deals 4U",
    "http://cheap-pills.example.biz",
    "CLICK HERE for cheap watches!!! best price best price",
  ],
  [
    "SEO Expert",
    "http://rank-fast.example.biz",
    "I can get your site to #1 on Google, contact me now",
  ],
];

let comments = (() => {
  const list = [];
  const now = Date.now();
  let n = 0;
  posts
    .filter((p) => p.status === "published")
    .forEach((post, postIndex) => {
      for (let i = 0; i < 5; i += 1) {
        const [name, website] =
          COMMENTERS[(postIndex * 2 + i) % COMMENTERS.length];
        n += 1;
        list.push({
          id: String(900 + n),
          postId: post.id,
          name,
          email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
          website,
          comment: COMMENT_TEXTS[(postIndex + i) % COMMENT_TEXTS.length],
          createdAt: new Date(now - n * 7.5 * 36e5).toISOString(),
          status: i < 2 ? "pending" : "approved",
        });
      }
    });
  SPAM.forEach(([name, website, comment], i) => {
    n += 1;
    list.push({
      id: String(900 + n),
      postId: posts[0].id,
      name,
      email: `spam${i}@example.biz`,
      website,
      comment,
      createdAt: new Date(now - (i + 1) * 5 * 36e5).toISOString(),
      status: i === 0 ? "pending" : "spam",
    });
  });
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
})();

const postTitle = (postId) =>
  (posts.find((p) => p.id === postId)?.content.en.title ?? "").replace(
    /\n/g,
    " "
  );

const postOut = (post) => ({
  ...post,
  commentCount: comments.filter(
    (c) => c.postId === post.id && c.status !== "spam"
  ).length,
});

const commentOut = (comment) => ({
  ...comment,
  postTitle: postTitle(comment.postId),
});

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\n/g, " ")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

// ----- posts -----

// GET /admin/blog/posts?status&q -> { items, counts: { all, published, draft } }
// Most recently updated first.
export async function listPosts({ status = "", q = "" } = {}) {
  await delay();
  const needle = q.trim().toLowerCase();
  const found = posts
    .filter(
      (p) =>
        !needle ||
        p.content.en.title.toLowerCase().includes(needle) ||
        p.content.ar.title.includes(q.trim())
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return copy({
    items: found.filter((p) => !status || p.status === status).map(postOut),
    counts: {
      all: found.length,
      published: found.filter((p) => p.status === "published").length,
      draft: found.filter((p) => p.status === "draft").length,
    },
  });
}

// GET /admin/blog/posts/:id
export async function getPost(id) {
  await delay(200);
  const post = posts.find((p) => p.id === id);
  if (!post) throw apiError("NOT_FOUND", 404);
  return copy(postOut(post));
}

// POST /admin/blog/posts  { id?, ...fields }  (409 SLUG_TAKEN)
// The slug defaults to one made from the English title.
export async function createPost(fields) {
  await delay();
  const id =
    slugify(fields.id || fields.content.en.title) || `post-${Date.now()}`;
  if (posts.some((p) => p.id === id)) throw apiError("SLUG_TAKEN", 409);
  const post = { ...fields, id, updatedAt: new Date().toISOString() };
  posts = [...posts, post];
  return copy(postOut(post));
}

// PATCH /admin/blog/posts/:id  { ...changed fields }  (the slug can't change)
export async function updatePost({ id, ...changes }) {
  await delay();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) throw apiError("NOT_FOUND", 404);
  posts[index] = {
    ...posts[index],
    ...changes,
    id,
    updatedAt: new Date().toISOString(),
  };
  return copy(postOut(posts[index]));
}

// DELETE /admin/blog/posts/:id   (its comments go with it)
export async function deletePost(id) {
  await delay();
  if (!posts.some((p) => p.id === id)) throw apiError("NOT_FOUND", 404);
  posts = posts.filter((p) => p.id !== id);
  comments = comments.filter((c) => c.postId !== id);
  return { id };
}

// ----- comments -----

// GET /admin/comments?status&q&post&page&pageSize
//   status: "pending" (default) | "approved" | "spam"
// -> { items, total, page, pageSize, counts: { pending, approved, spam } }
export async function listComments({
  status = "pending",
  q = "",
  post = "",
  page = 1,
  pageSize = 20,
} = {}) {
  await delay();
  const needle = q.trim().toLowerCase();
  const found = comments.filter(
    (c) =>
      (!post || c.postId === post) &&
      (!needle ||
        [c.name, c.email, c.comment].some((v) =>
          v.toLowerCase().includes(needle)
        ))
  );
  const list = found.filter((c) => c.status === (status || "pending"));
  const start = (page - 1) * pageSize;
  return copy({
    items: list.slice(start, start + pageSize).map(commentOut),
    total: list.length,
    page,
    pageSize,
    counts: {
      pending: found.filter((c) => c.status === "pending").length,
      approved: found.filter((c) => c.status === "approved").length,
      spam: found.filter((c) => c.status === "spam").length,
    },
  });
}

// GET /admin/comments/stats -> { pending }
export async function getCommentStats() {
  await delay(150);
  return { pending: comments.filter((c) => c.status === "pending").length };
}

// POST /admin/comments/bulk  { ids: [...], action: "approve" | "pending" | "spam" | "delete" }
// One comment or many; -> { updated: count }
export async function moderateComments({ ids, action }) {
  await delay();
  const targets = new Set(ids);
  if (action === "delete") {
    const before = comments.length;
    comments = comments.filter((c) => !targets.has(c.id));
    return { updated: before - comments.length };
  }
  const status = { approve: "approved", pending: "pending", spam: "spam" }[
    action
  ];
  if (!status) throw apiError("BAD_ACTION", 400);
  comments = comments.map((c) => (targets.has(c.id) ? { ...c, status } : c));
  return { updated: targets.size };
}
