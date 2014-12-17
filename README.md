multilaNG
=========
multilaNG is a AngularJS module, allowing you to create HTML pages with internalization support easily.

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
    - default language (optional, if not provided, first of the available ones will be used).

```javascript
function YourControllerFunction($scope, i18lise) {
    i18lise($scope, ['fr', 'en'], 'en')
}
```
* Or you may simply attach **multilang** attribute to the root node of your app. Value of the attribute should contains
available languages, separated by comma. You can also specify default language by the mean of **deflang** attribute on the very same node.

```html
<html ng-app="main" lang="{{lang}}" multilang="fr, en" deflang="en">
</html>
```

In both cases do not forget to inject multilaNG into your application:
```javascript
angular.module('main', ['multilang']);
```

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

