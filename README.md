# dotenv.js
Small library for parsing simple .env files.

# Documentation
To use the library you only need a import the main file in your entry point, the dotenv will be automatically executed. It's important that your entry point and .env files must be located in the same location!
All parsed values will be saved into `process.env` object.
```js
import "dotenv.js" 
```
Parser support single line comments.
```
# Comment
```
Simple key - value pairs.
```
KEY=250
KEY_0=VALUE
KEY_1="VALUE"
```
A example of unsupported syntax.
```
KEY=VALUE #comment <- Comment and Key - Value Pair on the same line!
```
When you try to parse this syntax, parser will log a message.
```
Unsupported syntax in your .env file on line {line}: {content}!
```