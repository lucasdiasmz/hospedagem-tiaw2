import { icons } from "../data/icons.js";

function Icon({ name }) {
  const svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + "</svg>";
  return <i className="icon" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default Icon;
