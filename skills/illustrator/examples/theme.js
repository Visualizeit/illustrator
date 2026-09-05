import { readFile } from "node:fs/promises";

const tokenPattern = /--(?<name>[\w-]+)\s*:\s*(?<value>[^;]+);/gu;

/**
 * Load a bundled Tailwind theme and expose its values for SVG attributes.
 * CSS custom properties work in HTML styles, but Takumi does not resolve
 * `var()` in SVG presentation attributes such as `fill` and `stroke`.
 *
 * @param {URL} url Theme CSS file to load.
 */
export const loadTheme = async (url) => {
  const css = await readFile(url, "utf-8");
  const tokens = new Map();
  for (const match of css.matchAll(tokenPattern)) {
    const name = match.groups?.name;
    const tokenValue = match.groups?.value;
    if (name && tokenValue) {
      tokens.set(name, tokenValue.trim());
    }
  }

  /** @param {string} name Token name to resolve. */
  const value = (name) => {
    const token = tokens.get(name.replace(/^--/u, ""));
    if (token === undefined) {
      throw new Error(`Theme token is missing: --${name.replace(/^--/u, "")}`);
    }
    return token;
  };

  /** @param {string} name Color token suffix. */
  const color = (name) => value(`color-${name}`);
  /** @param {string} name Font token suffix. */
  const font = (name) => value(`font-${name}`);
  /** @param {string} name Numeric token name. */
  const number = (name) => Number(value(name).replace(/(?:px|em)$/u, ""));

  return { color, css, font, number, value };
};
