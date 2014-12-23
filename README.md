multilaNG
=========
multilaNG is a AngularJS module, allowing you to create HTML pages with internalization support easily.

#Features
* Ability to create few independently internationalized scopes in one app.
* Integrtion with native directives like ng-repeat.
* Built-in language switcher.

#Installation
Via bower:
```
bower install angular-multilang
```

#Usage
1. Bootstrap your application
----------------------------
There are two options:

* You can either inject the function i18lise into your controller and invoke it passing three parameters:
    - scope object,
    - list of available languages,
    - default language (optional, if not provided, first of the available ones will be used),
    - boolean flag intended to indicate whether selected language must be reflected in location's hash or not.
Note, that two or more globally i18lised scopes on one page do not make any sense.

```javascript
function YourControllerFunction($scope, i18lise) {
    i18lise($scope, ['fr', 'en'], 'en', true)
}
```
* Or you may simply attach **multilang** attribute to the root node of your app. Value of the attribute should contains
available languages, separated by comma. You can also specify default language by the mean of **deflang** attribute,
and the global flag by the mean of **global** on the very same node.

```html
<html ng-app="main" lang="{{current_lang}}" multilang="fr, en" deflang="en" global>
</html>
```

In both cases do not forget to inject multilaNG into your application:
```javascript
angular.module('main', ['multilang']);
```
Selected language is accessible through property of the i18nalised scope named  **current_lang**.

2. Specify the multi-language content
-------------------------------------
For every sentence or phrase you want to be available in different languages, you can set up all the translations in a two ways:
 - using **translate** directive and nested tags;

```html
<span translate>
    <span lang="fr">Bon jour!</span>
    <span lang="en">Hello!</span>
</span>
```
 - using special function called **_** ( this approach is suitable for attribute values but works with the text nodes as well).
This function is available in every i18lised scope.

```html
<img alt="{{ _({fr: 'Bon jour!', en: 'Hello!'}) }}"/>
```

3. Put the switching widget on the page
---------------------------------------
```html
<langswitcher></langswitcher>
```
This widget looks like a set of a links (separated by a tube character, for instance).
Click on each of them invokes setting the corresponding language as current for the root scope of your controller.
You can allocate as many switchers for one i18lised scope, as you want to.
All of them will behave without contradiction with another ones.
