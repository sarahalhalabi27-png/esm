import carNews from "../assets/blog/car-news.webp";
import carBg from "../assets/blog/car_bg.webp";

// TODO(api): replace with GET /api/blog-posts
// `date` is an ISO date (YYYY-MM-DD), formatted per language on display.
// A line break in a title (\n) is kept on the blog cards.
// `translations.<lang>` (optional) holds the post's title/excerpt in another
// language; English is the fallback.
// Placeholder posts (same photo and copy) until the real articles land.
export const blogPosts = [
  {
    id: "experience-luxury-and-comfort-1",
    title:
      "Experience Luxury And Comfort With ESM Limo:\nYour Go-To Limousine Service",
    excerpt: "Available With A Professional Driver, Ready For Any City Tour",
    translations: {
      ar: {
        title:
          "استمتع بالفخامة والراحة مع ESM Limo:\nخدمة الليموزين المفضلة لديك",
        excerpt: "متوفرة مع سائق محترف، وجاهزة لأي جولة في المدينة",
      },
    },
    date: "2025-01-22",
    author: "ESM Limo",
    image: carNews,
  },
  {
    id: "experience-luxury-and-comfort-2",
    title:
      "Experience Luxury And Comfort With ESM Limo:\nYour Go-To Limousine Service",
    excerpt: "Available With A Professional Driver, Ready For Any City Tour",
    translations: {
      ar: {
        title:
          "استمتع بالفخامة والراحة مع ESM Limo:\nخدمة الليموزين المفضلة لديك",
        excerpt: "متوفرة مع سائق محترف، وجاهزة لأي جولة في المدينة",
      },
    },
    date: "2025-01-22",
    author: "ESM Limo",
    image: carNews,
  },
  {
    id: "experience-luxury-and-comfort-3",
    title:
      "Experience Luxury And Comfort With ESM Limo:\nYour Go-To Limousine Service",
    excerpt: "Available With A Professional Driver, Ready For Any City Tour",
    translations: {
      ar: {
        title:
          "استمتع بالفخامة والراحة مع ESM Limo:\nخدمة الليموزين المفضلة لديك",
        excerpt: "متوفرة مع سائق محترف، وجاهزة لأي جولة في المدينة",
      },
    },
    date: "2025-01-22",
    author: "ESM Limo",
    image: carNews,
  },
];

export function findBlogPostById(postId) {
  return blogPosts.find((post) => post.id === postId) || blogPosts[0];
}

// TODO(api): replace with GET /api/blog-posts/:postId
// A post's full content. `titleAccents` / a section's `accents` are the
// words shown in teal; `translations.<lang>` mirrors the same fields in
// another language (English is the fallback).
export const blogPostDetailFallback = {
  id: "experience-luxury-and-comfort",
  title:
    "Experience Luxury And Comfort With ESM Limo:\nYour Go-To Limousine Service",
  titleAccents: ["Luxury", "ESM"],
  heroImage: carBg,
  sections: [
    {
      heading: "Why Choose ESM Limo?",
      accents: ["Why", "ESM"],
      body: "At ESM Limo, We Understand That The Journey Is Just As Important As The Destination. Our Luxury Limousines Are Equipped With State-Of-The-Art Amenities, Including Plush Seating, High-End Entertainment Systems, And Climate Control, So You Can Relax And Enjoy Every Moment Of Your Ride. With Our Dedicated, Experienced Chauffeurs Behind The Wheel, You Can Trust That Your Trip Will Be Both Smooth And Punctual.",
    },
    {
      heading: "A Service For Every Occasion",
      accents: ["Service", "Every"],
      body: "Whether You're Planning A Wedding, Corporate Event, Or A Night Out On The Town, ESM Limo Has A Vehicle To Fit Your Needs. Our Diverse Fleet Includes Everything From Sleek Sedans To Spacious Stretch Limos, All Meticulously Maintained To Ensure A Safe And Comfortable Ride. We Offer Both Hourly And Point-To-Point Services, So You Have Flexibility No Matter Your Travel Plans.",
    },
    {
      heading: "Book Your Ride Today!",
      accents: ["Book"],
      body: "Ready To Experience The Ultimate In Luxury Transportation? Booking With ESM Limo Is Easy And Fast. Simply Visit Our Website Or Contact Our Friendly Customer Service Team, And Let Us Take Care Of The Rest. We Look Forward To Making Your Next Journey Extraordinary!",
    },
  ],
  translations: {
    ar: {
      title:
        "استمتع بالفخامة والراحة مع ESM Limo:\nخدمة الليموزين المفضلة لديك",
      titleAccents: ["بالفخامة", "ESM"],
      sections: [
        {
          heading: "لماذا تختار ESM Limo؟",
          accents: ["لماذا", "ESM"],
          body: "في ESM Limo ندرك أن الرحلة لا تقل أهمية عن الوجهة. سيارات الليموزين الفاخرة لدينا مجهزة بأحدث وسائل الراحة، من مقاعد وثيرة وأنظمة ترفيه متطورة إلى التحكم بالمناخ، لتسترخي وتستمتع بكل لحظة من رحلتك. ومع سائقينا المحترفين وذوي الخبرة خلف المقود، يمكنك الاطمئنان إلى أن رحلتك ستكون سلسة وفي موعدها.",
        },
        {
          heading: "خدمة لكل مناسبة",
          accents: ["خدمة", "لكل"],
          body: "سواء كنت تخطط لحفل زفاف أو فعالية لشركتك أو سهرة في المدينة، لدى ESM Limo السيارة التي تناسب احتياجاتك. يضم أسطولنا المتنوع كل شيء من السيارات الأنيقة إلى سيارات الليموزين الفسيحة، وجميعها تحظى بعناية دقيقة لضمان رحلة آمنة ومريحة. ونقدم خدمات بالساعة ومن نقطة إلى نقطة، لتحظى بالمرونة مهما كانت خطط سفرك.",
        },
        {
          heading: "احجز رحلتك اليوم!",
          accents: ["احجز"],
          body: "هل أنت مستعد لتجربة قمة الفخامة في التنقل؟ الحجز مع ESM Limo سهل وسريع. ما عليك سوى زيارة موقعنا أو التواصل مع فريق خدمة العملاء، ودع الباقي علينا. نتطلع إلى أن نجعل رحلتك القادمة استثنائية!",
        },
      ],
    },
  },
};
