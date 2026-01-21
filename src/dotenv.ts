import { readFileSync } from "fs";

import { DotEnvFormatTypes } from "./dotenv.type";

function dotenv(): void {
  const buffer: string = readFileSync(`${process.cwd()}/.env`, { encoding: "utf-8" });
  const lines: string[] = buffer.split(/\n/);
  
  let key: undefined | string = undefined;
  let value: undefined | string = undefined;
  
  for(let index: number = 0; index < lines.length; index++) {
    const line: string = lines[index].trim();

    if(!isEmpty(line)) {
      if(!isValid(line)) {
        console.warn(`Unsupported syntax in your .env file on line ${index}: \"${line}\"!`);
      } else {
        key = format(DotEnvFormatTypes.KEY, collect(/[A-Za-z0-9_-]+\=+?/, line));
        value = format(DotEnvFormatTypes.VALUE, collect(/\=.*/, line));

        process.env[key] = value;
      }
    }
  }
}

function format(rule: DotEnvFormatTypes, line: string): string {
  switch(rule) {
    case DotEnvFormatTypes.KEY:
      // Remove the equal char.
      return line.slice(0, line.length - 1).trim();
    case DotEnvFormatTypes.VALUE:
      // Replace the double quotes.
      return line.slice(1, line.length).replace(/\"(\#?.*)\"/, "$1").trim();
    default:
      return line;
  };
};

function collect(pattern: RegExp, line: string): string {  
  return line.match(pattern)!.at(0)!;
};

function isValid(line: string): boolean {
  return (/\#.*/.test(line) && line.at(0) === "#") || !/\#.*/.test(line);
};

function isEmpty(line: string): boolean {
  return line === "" || line.at(0) === "#";
};

dotenv();