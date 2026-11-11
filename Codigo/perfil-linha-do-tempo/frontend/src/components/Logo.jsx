function Logo({ variante }) {
  let corForte = "#8FA9DB";
  let corClara = "#CAD6EF";

  if (variante === "escuro") {
    corForte = "#406399";
    corClara = "#8FA9DB";
  }

  return (
    <span className="brand-logo" aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <circle cx="19" cy="9" r="5.5" fill={corForte} />
        <circle cx="31" cy="13" r="4.5" fill={corClara} />
        <path d="M13 19c-5 5-6 13-1 19 6 7 19 7 25-1" stroke={corForte} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M19 23c3 5 10 6 15 1" stroke={corClara} strokeWidth="5" fill="none" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default Logo;
