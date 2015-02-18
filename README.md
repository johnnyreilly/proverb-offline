# Proverb [![Build Status](https://ci.appveyor.com/api/projects/status/github/johnnyreilly/proverb-offline?retina=true)](https://ci.appveyor.com/project/JohnReilly/proverb-offline)[![TypeScript definitions on DefinitelyTyped](http://definitelytyped.org/badges/standard-flat.svg)](http://definitelytyped.org)

Proverb is a simple app that stores the wise sayings of sages.  This is a collection of variations upon a the proverb theme.  Different versions of "Proverb" built using different technologies and techniques for kicks and giggles.  It's a playground for me.  

This repository is using the following technologies:

- ASP.Net Web API 2.2
- Entity Framework 6.1.1 Code First
- TypeScript 1.3
- AngularJS 1.3
- SQL Server 2008 R2

The focus of this repository is starting the journey towards creating an "offline" version of Proverb.  That is to say one that works like a native app.  This will be implemented with a little help from Service Worker (and so will initially only work on super-up-to-date browsers).

## Getting Started

You need to install [node and npm](http://nodejs.org/). Once you've done that you'll need to install Gulp and Bower globally at the command line:

```
npm install -g bower
install npm -g gulp
```

Inside the Proverb.Web folder you'll need to install the packages that Gulp and Bower use, to do that just type:

```
bower install
npm install
```

In order that you can run your GulpJS build tasks.  If you want to use the Visual Studio Task Runner then you can find it [here](https://visualstudiogallery.msdn.microsoft.com/8e1b4368-4afb-467a-bc13-9650572db708).  But you could just use the command line inside the Proverb.Web folder like this:

```
gulp
```

## Licence

Copyright © 2014 [John Reilly](twitter.com/johnny_reilly). This project is licensed under the [MIT license](http://opensource.org/licenses/mit-license.php).
