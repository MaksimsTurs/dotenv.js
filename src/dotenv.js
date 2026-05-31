import { readFileSync } from "node:fs";

const DEFAULT_PATH = `${process.cwd()}/.env`;
const PARSE_STEPS = {
  NONE: -1,
  KEY:   0,
  EQUAL: 1,
  VALUE: 2
};
const STATE = {
  step: PARSE_STEPS.KEY,
  text: "",
  col: 0,
};

/**
 *  @param {string} [path] path to the .env file, otherwise `${process.cwd()}/.env`.
 *  @returns {void}
 */
export default function dotenv(path = DEFAULT_PATH) {
  let key = "";
  let value = "";
  
  try {
    STATE.text = readFileSync(path, { encoding: "ascii" });
  } catch(error) {
    console.error(`[dotenv.js]: Error while reading the file ${path} is occur.`)
    console.error(`[dotenv.js]: ${error.message}`);
  }

  while(!isEOF()) {
    switch(STATE.step) {
      case PARSE_STEPS.KEY:
        key = parseKey();
        // Skip equal character
        STATE.col++;
        STATE.step = PARSE_STEPS.VALUE;
      break;
      case PARSE_STEPS.VALUE:
        value = parseValue();
        skipSpecialCharacters();
        process.env[key] = value;
        
        key = "";
        value = "";
        
        STATE.step = PARSE_STEPS.KEY;
      break;
    }
  }
};
/**
 *  @returns {string}
 */
function parseKey() {
  let key = "";

  while(!isEndOfKey()) {
    key += STATE.text[STATE.col++];
  }

  return key;
};
/**
 *  @returns {string}
 */
function parseValue() {
  if(isString()) {
    return parseString();
  } else {
    return parseAny();
  }
};
/**
 *  @returns {string}
 */
function parseString() {
  let value = ""

  STATE.col++

  while(!isEndOfString()) {
    value += STATE.text[STATE.col++]
  }
  
  STATE.col++

  return value
}
/**
 *  @returns {string}
 */
function parseAny() {
  let value = ""

  while(!isEndOfAny()) {
    value += STATE.text[STATE.col++]
  }

  return value
};
/**
 *  @returns {void}
 */
function skipSpecialCharacters() {
  while(STATE.col < STATE.text.length && isSpecialCharacter()) {
    STATE.col++
  }
};
/**
 *  @returns {boolean}
 */
function isSpecialCharacter() {
  return(
    STATE.text[STATE.col] === "\n" ||
    STATE.text[STATE.col] === "\r"
  );
};
/**
 *  @returns {boolean}
 */
function isEOF() {
  return STATE.col > STATE.text.length
}
/**
 *  @returns {boolean}
 */
function isEndOfString() {
  return STATE.col >= STATE.text.length || STATE.text[STATE.col] === "`";
};
/**
 *  @returns {boolean}
 */
function isEndOfAny() {
  return STATE.col >= STATE.text.length || STATE.text[STATE.col] === "\n";
};
/**
 *  @returns {boolean}
 */
function isEndOfKey() {
  return STATE.col >= STATE.text.length || STATE.text[STATE.col] === "=";
};
/**
 *  @returns {boolean}
 */
function isString() {
  return STATE.text[STATE.col] === "`";
};
