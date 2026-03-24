# dotenv.js
Small and simple javascript library for parsing .env files.

# Documentation
Here a simple example how to use the library.
```js
import dotenv from "@maksims/dotenv.js";

dotenv();
```
The library will synchronously load all variables from your `.env` file and put them\
into `process.env` object, therefore, it's important to first call `dotenv` function and\
then access variables that you need. If you need, you can provide your path to `.env` file.
```js
import dotenv from "@maksims/dotenv.js";

dotenv("path/to/my/.env");
```
