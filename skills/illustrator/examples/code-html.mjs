const htmlCharacterPattern = /[&<>"']/gu;
/** @type {Record<string, string>} */
const htmlEntities = {
  '"': "&quot;",
  "&": "&amp;",
  "'": "&#39;",
  "<": "&lt;",
  ">": "&gt;",
};

/** @param {string} value Text or attribute value to escape. */
export const escapeHtml = (value) =>
  value.replace(
    htmlCharacterPattern,
    (character) => htmlEntities[character] ?? character
  );

const fontStyleBits = { bold: 2, italic: 1, strikethrough: 8, underline: 4 };
/** @param {number} value Combined Shiki style bits. @param {number} bit Style flag. */
const hasFontStyle = (value, bit) => Math.floor(value / bit) % 2 === 1;

/**
 * Preserve source whitespace and combined Shiki styles in inline HTML.
 * @param {import("shiki").ThemedToken[]} tokens One source line's tokens.
 * @param {string} foreground Fallback token color.
 */
export const tokensToHtml = (tokens, foreground) =>
  tokens
    .map((token) => {
      const fontStyle = token.fontStyle ?? 0;
      const styles = [`color:${token.color ?? foreground}`];
      if (hasFontStyle(fontStyle, fontStyleBits.italic)) {
        styles.push("font-style:italic");
      }
      if (hasFontStyle(fontStyle, fontStyleBits.bold)) {
        styles.push("font-weight:700");
      }
      const decorations = [
        hasFontStyle(fontStyle, fontStyleBits.underline) ? "underline" : "",
        hasFontStyle(fontStyle, fontStyleBits.strikethrough)
          ? "line-through"
          : "",
      ].filter(Boolean);
      if (decorations.length > 0) {
        styles.push(`text-decoration:${decorations.join(" ")}`);
      }
      return `<span style="${escapeHtml(styles.join(";"))}">${escapeHtml(token.content)}</span>`;
    })
    .join("");
