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
      // If the punctuation mark following the space is a wrapping punctuation mark, do nothing, otherwise remove the space
      const wrappingPuncFollowsSpace =
        match.charAt(1) === "'" ||
        match.charAt(1) === '"' ||
        match.charAt(1) === ")" ||
        match.charAt(1) === "." ||
        match.charAt(1) === ","
          ? true
          : false;
      return wrappingPuncFollowsSpace ? match.replace(/\s/, "") : match;
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
