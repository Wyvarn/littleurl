Little URL
=========================

A small URL shortener microservice in Node.

Pass a URL as a parameter and receive a shortened URL in the JSON response.

If you pass an invalid URL that doesn't follow the valid http(s)://www.example.com format, the JSON response will contain an error instead.

When you visit that shortened URL, it will redirect to the original link.

```bash
$ git clone
$ cd 
$ npm install
# or if you are a fan of yarn like I am
$ yarn install
```
> This will get you started

Now you can run the app

```bash
$ yarn start
# or using npm
$ npm run start
```
> This will start up the application on your local server

And that is it!

Enjoy!

\ ゜o゜)ノ
