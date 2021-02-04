function extractAuthorText(text) {
  return text.includes(":")
    ? text.slice(0, text.indexOf(":"))
    : "ERROR: Author not found in title";
}

function extractTitleText(text) {
  return text.includes(":")
    ? text.slice(text.indexOf(":") + 2, text.length)
    : text;
}

export { extractAuthorText, extractTitleText };
