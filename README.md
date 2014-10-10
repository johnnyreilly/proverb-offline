# Proverb [![Build Status](https://ci.appveyor.com/api/projects/status/github/johnnyreilly/proverb-gulp?retina=true)](https://ci.appveyor.com/project/JohnReilly/proverb-gulp)

Proverb is a simple app that stores the wise sayings of sages.  This is a collection of variations upon a the proverb theme.  Different versions of "Proverb" built using different technologies and techniques for kicks and giggles.  It's a playground for me.  

This repository is using the following technologies:

- ASP.Net Web API and MVC
- Entity Framework 6 Code First
- TypeScript
- AngularJS
- SQL Server

The focus of this repository is swapping out Web Optimization and using GulpJS to generate minified assets.

## Getting Started

You need to install [node and npm](http://nodejs.org/). Once you've done that you'll need to install Gulp globally at the command line:

```
install npm -g gulp
```

Inside the Proverb.Web folder you'll need to install the node packages that Gulp uses, to do that just type:

```
npm install
```

In order that you can run your GulpJS build tasks.  If you want to use the Visual Studio Task Runner then you can find it [here](https://visualstudiogallery.msdn.microsoft.com/8e1b4368-4afb-467a-bc13-9650572db708).  But you could just use the command line inside the Proverb.Web folder like this:

```
gulp
```

## Licence

Copyright © 2014 [John Reilly](twitter.com/johnny_reilly). This project is licensed under the [MIT license](http://opensource.org/licenses/mit-license.php).
