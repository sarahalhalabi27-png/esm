// A post's title in the dashboard's language (English when there's no
// Arabic yet), on one line.
export const localTitle = (post, language) =>
  (post.content[language]?.title || post.content.en.title).replace(/\n/g, " ");

// "Luxury, ESM" <-> ["Luxury", "ESM"] for the highlighted-words fields.
export const wordsToText = (words = []) => words.join(", ");
export const textToWords = (text = "") =>
  text
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);
