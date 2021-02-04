export default function extractAuthorText(text) {
  return text.includes(":")
    ? text.slice(0, text.indexOf(":"))
    : "ERROR: Author not found in title";
}
