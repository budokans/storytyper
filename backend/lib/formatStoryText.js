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
        match.charAt(1) === "'" || '"' || "(" || ")";
      return !wrappingPuncFollowsSpace ? match.replace(/\s/, "") : match;
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

// C'est magnifique , this thing called love. Since we met, you do something to me and anything goes. You're easy to love so let's misbehave night and day. Blow, Gabriel, blow! It's just one of those things: we shall never be younger. Come along with me. How could we be wrong?
