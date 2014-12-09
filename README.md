multilaNG
=========
multilaNG is a AngularJS module, allowing you to create HTML pages with internalization support easily.


#Usage
1. Bootstrap your controller
----------------------------
You have to inject the function i18lise into your controller and invoke it passing two parameters:
- scope object
- string denoting the default language

```javascript
function YourControllerFunction($scope, i18lise) {
    i18lise($scope, 'en')
}
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
Specify desired languages via comma-separated codes in the **lang** attribute.
```html
<langswitcher langs="ru, en"></langswitcher>
```
This widget looks like a set of a links (separated by a tube character, for instance).
Cliking on each of them invokes setting the corresponding language as current for the scope of your controller.

