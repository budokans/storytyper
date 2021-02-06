export default function formatStoryText(text) {
  // Removes html markup and trims whitespace from edges
  let formattedText = "";
  formattedText = text
    // Removes opening HTML tags
    .replace(/(<[a-z]>)/g, "")
    // Turns <br> into a single space
    .replace(/(<[a-z]+>)/g, " ")
    // Replaces closing HTML tags with a single space.
    .replace(/(<\/[a-z]+>)/g, " ")
    .trim();

  // Replaces typographic characters with ASCII characters
  return formattedText
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/‘/g, "'")
    .replace(/’/g, "'")
    .replace(/—/g, " - ");
}
