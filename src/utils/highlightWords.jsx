// Wraps the given whole words of `text` in <span className={className}> —
// e.g. the teal words in a heading ("Why Choose ESM Limo?" with ["Why",
// "ESM"]). Words match whole and case-sensitively; other text is untouched.
export default function highlightWords(text, words, className) {
  if (!text || !words?.length) return text;
  const escaped = words.map((word) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  // Unicode-aware "whole word" edges, so Arabic words match too.
  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}])(${escaped.join("|")})(?![\\p{L}\\p{N}])`,
    "u"
  );
  return text.split(pattern).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className={className}>
        {part}
      </span>
    ) : (
      part
    )
  );
}
