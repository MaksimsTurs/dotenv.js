import { readFileSync } from "node:fs";

const DEFAULT_PATH = `${process.cwd()}/.env`;

/**
 *  @param {string} [path] path to the .env file, otherwise `${process.cwd()}/.env`.
 *  @returns {void}
 */
export default function dotenv(path = DEFAULT_PATH) {
  const buffer = readFileSync(path, { encoding: "ascii" });
  const lines = buffer.split(/\n/);

  for(let index = 0; index < lines.length; index++) {
    const line = lines[index];

    // A=V smallest possible valid env variable. 
    if(line.length < 3) {
      console.error(`[dotenv]: Variable on line ${index} has either no value or key!`);
    } else {
      if(isComment(line)) {
        // Skip all comments.
        continue;
      }

      const keyEndIndex = line.indexOf("=");
      const valueStartIndex = keyEndIndex + 1;
      const key = getKey(keyEndIndex, line);

      if(isEmptyStr(key)) {
        console.error(`[dotenv]: Variable on line ${index} has no key!`);
      } else {
        let value = "";

        if(isMultilineString(valueStartIndex, line)) {
          const stringDelimiter = getStringDelimiter(valueStartIndex, line);
          const indexRef = { index: index + 1 };

          value = getValue(valueStartIndex, line);
          value += collectMultilineString(indexRef, lines, stringDelimiter);
          index = indexRef.index;
        } else {
          value = getValue(valueStartIndex, line);
        }

        process.env[key] = formatString(value);
      }
    }
  }
};
/**
 *  @param {number} end
 *  @param {string} line
 *  @returns {string}
 */
function getKey(end, line) {
  return line.slice(0, end);
};
/**
 *  @param {number} start
 *  @param {string} line
 *  @returns {string}
 */
function getValue(start, line) {
  return line.slice(start, line.length);
};
/**
 *  @param {number} start
 *  @param {string} line
 *  @returns {string}
 */
function getStringDelimiter(start, line) {
  return line[start];
};
/**
 *  @param {{ index: number }} indexRef
 *  @param {string[]} lines
 *  @param {string} delimiter
 *  @returns {void}
 */
function collectMultilineString(indexRef, lines, delimiter) {
  let string = "";

  for(let index = indexRef.index; index < lines.length; index++) {
    const indexOfDelimiter = lines[index].indexOf(delimiter);

    if(indexOfDelimiter >= 0) {
      indexRef.index = index;
      string += lines[index];
      return string;
    } else {
      string += lines[index];
    }
  }

  console.log(`[dotenv]: Multiline string with start on line ${indexRef.index} is not closed with ${delimiter}!`);
};
/**
 *  @param {string} value
 *  @returns {string}
 */
function formatString(value) {
  return value.replace(/^['"`](.+)['"`]$/, "$1");
};
/**
 *  @param {string} line
 *  @returns {boolean}
 */
function isComment(line) {
  return line[0] === "#";
};
/**
 *  @param {string} line
 *  @returns {boolean}
 */
function isEmptyStr(line) {
  return line.length === 0;
};
/**
 *  @param {number} start
 *  @param {string} line
 *  @returns {boolean}
 */
function isMultilineString(start, line) {
  return((line[start] === "\"" ||
          line[start] === "'" ||
          line[start] === "`") &&
         (line[line.length - 1] != "\"" &&
          line[line.length - 1] != "'" &&
          line[line.length - 1] != "`")
  );
};
