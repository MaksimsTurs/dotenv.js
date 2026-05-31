# dotenv.js
Simple utility library for .env file parsing.

## Content
+ [Installation](#installation)
+ [Example](#example)
+ [API](#api)
    + [dotenv](#api-dotenv)

## [Installation](#installation)
npm\
```npm install --save-dev @maksims/dotenv.js```

pnpm\
```pnpm add sax @maksims/dotenv.js```

yarn\
```yarn add @maksims/dotenv.js```

## [Example](#example)
For example here is you `.env` file
```env
VAR1=`Some text`
VAR2=12345
VAR3=false
```
by default library will search the `.env` file in you working directory
```js
import dotenv from "@maksims/dotenv.js";

dotenv();
```
but you can pass you custom path to the function
```js
import dotenv from "@maksims/dotenv.js";

dotenv("path/to/you/.env");
```
the result for both of calls will be
```js
{
    ...you default env variables,
    VAR1: "Some text",
    VAR2: "12345",
    VAR3: "false"
}
```

## [API](#api)
### [dotenv](#api-dotenv)
Collect all variables from `.env` file and save them into `process.env` object.
The library supports all kinds of types, numbers, strings, booleans, but have some constrains.\
🟥 Variables can not be on the same line\
🟥  Comments are not supported\
🟥 Strings must be wraped into ` character
