# PipedBeats
---

*Random themed music for your working hours*

## What the f*ck is this?
A pure AngularJS application built on top of SoundCloud API. It provides a continuous streaming of music based on your genre preferences or a search keyword.

## Pre-requisites

### To execute it
Just a browser and a constant Internet connection.

### To make changes on it
You will need some requirements, which you can found on Internet:

* **NodeJS**: to execute Bower and Gulp
* **Bower**: to manage assets and libraries
* **Gulp**: to watch for changes, live building and deploying.

To create your development environment, first install required packages with:

```
$ npm install -g bower gulp
$ npm install
$ bower install
```

Also, you can use some `gulp` commands to make the development easy:

* `gulp`: make a development build, start a server on `localhost:3000` and watch for changes to refresh the browser automatically.
* `gulp build`: make a development build under `build` folder.
* `gulp dist`: make a distribution build (with minified assets) under `dist` folder.
* `gulp deploy`: make a distribution build and deploy it to `gh-pages` branch. Also pushes the `gh-pages` branch.

## Want to contribute?
Just make a fork of this repository, do whatever you want and make a pull request telling which changes have you implemented :D

Everyone is welcome!

## License
This code and it's build is licensed under MIT license as described in LICENSE file.
