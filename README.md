Islyngten
=========

`Islyngten` is a tiny JavaScript library supplying I18N translation support for Node.js and the browser.
It provides simple, yet powerful solutions for multiple plural forms and interpolation. 
`Islyngten` has no dependencies.


Features
--------
* Context support
* Simple plural form
* Multiple plural forms
* Interpolation


Getting started
---------------

### Node.js

Install `islyngten` using npm.

```shell
npm install islyngten --save
```

Then require it into any module.

```js
const Islyngten = require('islyngten');
const i18n = new Islyngten();
```

### Browser
`Islyngten` has no dependencies, which makes it easy to include in a browser.

You can download the latest release from the repository
* [`islyngten.js`](https://github.com/tbillenstein/islyngten/blob/master/islyngten.js) unminified, including comments
* [`islyngten.min.js`](https://github.com/tbillenstein/islyngten/blob/master/islyngten.min.js) minified version

Use a script tag to directly add `Islyngten` to the global scope.

```html
<script src="islyngten.min.js"></script>
<script>
  const i18n = new Islyngten();
  ...
</script>
```


Usage
-----
```js
const i18n = new Islyngten();

// Prepare i18n by adding translation resources for different languages.
// Note: The first parameter to `resources()` serves as a `context`. 
//       This allows you to structure your translation tables to your needs.
//       You are free to choose whatever string you like.
i18n.resources('myapp', 'de', {
  "Do you really want to delete the file {{filename}}?": 
    "Wollen Sie die Datei {{filename}} wirklich l&ouml;schen?"
});

i18n.resources('myapp', 'fr', {
  "Do you really want to delete the file {{filename}}?": 
    "Voulez-vous vraiment supprimer le fichier {{filename}}?"
});

// Translation is not necessary for locale 'en', so original english text will be supplied.
var rb = i18n.resourceBundle('myapp', 'en');
var translation = rb._("Do you really want to delete the file {{filename}}?", {
  '{{filename}}': "test.txt"
});

// -> returns "Do you really want to delete the file test.txt?"

// German translation will be supplied for locale 'de'.
rb = i18n.resourceBundle('myapp', 'de');
translation = rb._("Do you really want to delete the file {{filename}}?", {
  '{{filename}}': "test.txt"
});

// -> returns "Wollen Sie die Datei test.txt wirklich l&ouml;schen?"

// French translation will be supplied for locale 'fr'.
rb = i18n.resourceBundle('myapp', 'fr');
translation = rb._("Do you really want to delete the file {{filename}}?", {
  '{{filename}}': "test.txt"
});

// -> returns "Voulez-vous vraiment supprimer le fichier test.txt?"
```


Simple example
--------------
```js
const i18n = new Islyngten();

// Prepare i18n by adding translation resources for different languages.
i18n.resources('animals', 'de', {
  "dog": "Hund",
  "cat": "Katze",
  "mouse": "Maus"
});

i18n.resources('animals', 'fr', {
  "dog": "chien",
  "cat": "chat",
  "mouse": "souris"
});

// To access the translations, get a resource bundle for the desired language ...
var rb = i18n.resourceBundle('animals', 'de');

// ... and request the text.
rb.get("dog"); // -> returns "Hund"
rb.t("dog");   // -> returns "Hund"
rb._("dog");   // -> returns "Hund"

// Note: t() and _() are aliases for the get() method.

// Select a different language.
var rbfr = i18n.resourceBundle('animals', 'fr');

rbfr._("dog");   // -> returns "chien"

// If no translation was found the original text is returned.
rbfr._("elephant"); // -> returns "elephant"
```


More examples
-------------
### Simple plural
```js
const i18n = new Islyngten();

i18n.resources('questions', 'de', {
  "Delete the selected file?": "Selektierte Datei entfernen?",
  "Delete the selected files?": "Selektierte Dateien entfernen?"
});

var rb = i18n.resourceBundle('questions', 'de');

// Note: tt() and __() are aliases for the nget() method.
var fileCount = 1;
var translation = rb.__("Delete the selected file?", "Delete the selected files?", fileCount);
// translation -> "Selektierte Datei entfernen?"

fileCount = 4;
translation = rb.__("Delete the selected file?", "Delete the selected files?", fileCount);
// translation -> "Selektierte Dateien entfernen?"
```

### Simple plural with variables (interpolation)
```js
const i18n = new Islyngten();

i18n.resources('dingdong', 'de', {
  "The list contains $count item": "Die Liste enth&auml;lt $count Eintrag",
  "The list contains $count items": "Die Liste enth&auml;lt $count Eintr&auml;ge"
});

var rb = i18n.resourceBundle('dingdong', 'de');

// Note: tt() and __() are aliases for the nget() method.
var count = 0;
var translation = rb.__("The list contains $count item", "The list contains $count items", count, {
  '$count': count
});
// translation -> "Die Liste enth&auml;lt 0 Eintr&auml;ge"

count = 1;
translation = rb.__("The list contains $count item", "The list contains $count items", count, {
  '$count': count
});
// translation -> "Die Liste enth&auml;lt 1 Eintrag"

count = 12;
translation = rb.__("The list contains $count item", "The list contains $count items", count, {
  '$count': count
});
// translation -> "Die Liste enth&auml;lt 12 Eintr&auml;ge
```

### Multiple plural forms

The previous examle showed an easy way to support simple plural forms by using the `nget()` [` __()`, `tt()` ] methods.
But what, if you need to translate in other languages where multiple plural forms exist? 
For example, in Polish, the word "file" pluralises like this: 
* 1 plik
* 2,3,4 pliki
* 5-21 plików
* 22-24 pliki
* 25-31 plików

(More details [here](http://www.gnu.org/software/gettext/manual/html_node/Plural-forms.html))

```js
const i18n = new Islyngten();

i18n.resources('multi', 'pl', {
  "file": "plik",
  "files": {
    // Various forms of specifiying the range of numbers are supported.
    '2,3,4': "pliki",
    '5-21': "plików",
    '22-24': "pliki",
    '25-31': "plików"
  }
});

const rb = i18n.resourceBundle('multi', 'pl');

var translation = rb.__("file", "files", 1);
// translation -> "plik"

translation = rb.__("file", "files", 2);
// translation -> "pliki"

translation = rb.__("file", "files", 3);
// translation -> "pliki"

translation = rb.__("file", "files", 4);
// translation -> "pliki"

translation = rb.__("file", "files", 5);
// translation -> "plików"

translation = rb.__("file", "files", 6);
// translation -> "plików"

translation = rb.__("file", "files", 20);
// translation -> "plików"

translation = rb.__("file", "files", 23);
// translation -> "pliki"

translation = rb.__("file", "files", 30);
// translation -> "plików"
```

### Interpolation

```js
  const i18n = new Islyngten();

  i18n.resources('interpol', 'de', {
    "Height must be within {{arg0}} and {{arg1}} cm.": 
      "H&ouml;he muss innerhalb von {{arg0}} und {{arg1}} cm liegen."
  });

  const rb = i18n.resourceBundle('interpol', 'de');

  // There are no specification on how to name your variables. Choose whatever format you like.

  const translation = rb._("Height must be within {{arg0}} and {{arg1}} cm.", {
      '{{arg0}}': "120",
      '{{arg1}}': "250"
    });
  // translation -> "H&ouml;he muss innerhalb von 120 und 250 cm liegen."
```


Even more examples
------------------
Please refer to the [test spec](https://github.com/tbillenstein/islyngten/blob/master/spec/IslyngtenSpec.js) for more examples.


Testing
-------
We use 
* [JSHint](https://jshint.com/) for static code analysis.
* [Jasmine testing framework](https://jasmine.github.io/index.html) for testing.
* [Karma test runner](https://karma-runner.github.io/latest/index.html) for testing in the browser.
* [Istanbul test coverage framework](https://istanbul.js.org/) for tracking test coverage.

Steps to be taken
* Clone or download the repository.
* Change into the project directory.
* Use `npm install` to install all development dependencies.
* Use `npm runt lint` to run static code analysis. 
* Use `npm test` to run the tests. 
* Use `npm run coverage` to track test coverage. 
* The output should display successful execution results and a code coverage map.


Build
-----
* Clone or download the repository.
* Change into project directory.
* Use `npm run build` in project directory to build `islyngten.min.js` from `islyngten.js`.


Contribution
------------
Please use [Github issues](https://github.com/tbillenstein/islyngten/issues) for requests.

Pull requests are welcome.


Issues
------
We use GitHub issues to track bugs. Please ensure your bug description is clear and has sufficient instructions to be 
able to reproduce the issue.

The absolute best way to report a bug is to submit a pull request including a new failing test which describes the bug. 
When the bug is fixed, your pull request can then be merged.

The next best way to report a bug is to provide a reduced test case on jsFiddle or jsBin or produce exact code inline 
in the issue which will reproduce the bug.


Support
-------
* Send us an email: [tb@thomasbillenstein.com](mailto:tb@thomasbillenstein.com)
* Follow us on Twitter: [@tbillenstein](https://x.com/tbillenstein/)


Changelog
---------
v1.1.0
* Update npm modules.
* Update and extend test environment.
* Add static code analysis tool JSHint.
* Add Karma test runner.
* Fix JSHint issues.
* Replace uglify-js by terser for minification.
* Update README.

v1.0.3
* Update npm modules.

v1.0.2
* Update npm modules.

v1.0.1
* Update npm modules.

v1.0.0
* Initial public release


License
-------
Copyright (c) 2013-present, tbillenstein. `Islyngten` is licensed under the [MIT License](https://github.com/tbillenstein/islyngten/blob/master/LICENSE).
