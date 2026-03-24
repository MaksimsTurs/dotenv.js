import { readFileSync } from "node:fs";

const DEFAULT_PATH = `${process.cwd()}/.env`;

/**
 *  @param {string} [path] path to the .env file, otherwise `${process.cwd()}/.env`.
 *  @returns {void}
 */
function dotenv(path = DEFAULT_PATH) {
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
      const key = getKey(keyEndIndex, line);

      if(isEmptyStr(key)) {
        console.error(`[dotenv]: Variable on line ${index} has no key!`);
      } else {
        const value = getValue(keyEndIndex + 1, line);
        process.env[key] = value;
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

dotenv();
