import { useTranslation } from "react-i18next";

// The post with its fields in the current language (post.translations.<lang>
// over the English defaults).
export default function useLocalizedPost(post) {
  const { i18n } = useTranslation();
  return { ...post, ...post.translations?.[i18n.language] };
}
