export default function formatStoryText(text) {
  // Remove html markup and trim whitespace from edges
  let formattedText = "";
  formattedText = text
    // Removeses opening HTML tags
    .replace(/(<[a-z]>)/g, "")
    // Turns <br> into a single space
    .replace(/(<[a-z]+>)/g, " ")
    // Replaces closing HTML tags with a single space.
    .replace(/(<\/[a-z]+>)/g, " ")
    .trim();

  // Replace typographic characters with ASCII characters
  return formattedText
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/‘/g, "'")
    .replace(/’/g, "'")
    .replace(/—/g, " - ");
}
