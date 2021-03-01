export default function formatStoryText(text) {
  // Removes html markup and trims whitespace from edges
  let formattedText = "";

  formattedText = text
    // Replace all HTML tags with a space
    .replace(/<.+?>/g, " ")
    // Replace multiple consecutive spaces with a single space
    .replace(/  +/g, " ")
    // Remove spaces between end of words and punctuation marks
    .replace(/\s\W/g, (match) => {
      return match.replace(/\s/, "");
    })
    .trim();

  // Replaces typographic characters with ASCII characters
  return formattedText
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/‘/g, "'")
    .replace(/’/g, "'")
    .replace(/—/g, " - ");
}
