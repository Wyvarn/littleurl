Little URL
=========================

A small URL shortener microservice in Node.

Pass a URL as a parameter and receive a shortened URL in the JSON response.

If you pass an invalid URL that doesn't follow the valid http(s)://www.example.com format, the JSON response will contain an error instead.

When you visit that shortened URL, it will redirect to the original link.

```bash
$ git clone https://github.com/Wyvarn/littleurl.git
$ cd littleurl
$ npm install
# or if you are a fan of yarn like I am
$ yarn install
```
> This will get you started with the dependencies

You will need to setup MongoDB on [mlab](https://mlab.com) in order to get a mongo db uri for storing the shortened urls.

Once you have Your mongo DB setup, create a .env file at the root of your project and include this in it:

```plain
MONGODB_URI=mongodb://<USERNAME>:<PASSWORD>@ds135574.mlab.com:<PORT>/<DB_NAME>
```

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
