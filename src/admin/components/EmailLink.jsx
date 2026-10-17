// An email address as a mailto link, laid out so it reads well anywhere:
// - always left-to-right (an address is Latin text, even on Arabic pages),
//   and right-aligned on Arabic pages so it lines up with its label;
// - when it doesn't fit on one line it wraps before the "@"
//   ("yousef.darwish" / "@example.com"), never in the middle of a word; only
//   an address too long for the line even then breaks inside a word.
export default function EmailLink({ email, href, className = "block" }) {
  const at = email.lastIndexOf("@");
  return (
    <a
      href={href ?? `mailto:${email}`}
      dir="ltr"
      className={`text-teal-accent hover:underline [overflow-wrap:anywhere] rtl:text-right ${className}`}
    >
      {at > 0 ? (
        <>
          {email.slice(0, at)}
          <wbr />
          {email.slice(at)}
        </>
      ) : (
        email
      )}
    </a>
  );
}
