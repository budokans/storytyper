function extractAuthorText(text) {
  return text.slice(0, text.indexOf(":"));
}

function extractTitleText(text) {
  return text.slice(text.indexOf(":") + 2, text.length);
}

export { extractAuthorText, extractTitleText };
