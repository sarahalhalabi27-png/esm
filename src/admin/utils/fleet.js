// A category's name in the current language, falling back to English.
export const categoryName = (category, language) =>
  category?.name?.[language] || category?.name?.en || "";
