/**
    A small tool, based on AngularJS, allowing to easily create multilingual HTML pages.

    Example of usage:

<!doctype html>
<html ng-app="main" lang="{{current_lang}}" multilang="ru, en" deflang="en" global>
    <head>
        <title ng-bind="_({ru: 'По-русски', en: 'In english'})"></title>
        <meta charset="utf-8">
        <script type="text/javascript" src="js/lib/angular.min.js"></script>
        <script type="text/javascript" src="js/multilang.js"></script>
        <script type="text/javascript">
            angular.module('main', ['multilang']);
        </script>
        <style>
            .lang_switcher>span {cursor: pointer;}
            .lang_switcher>span.current {font-weight: bold; cursor: default;}
            .lang_switcher>span:nth-child(n+2)::before{content: " | ";}
        </style>
    </head>
    <body>
        <langswitcher></langswitcher>
        <hr/>
        <p translate>
            <span lang="en">Hello World!</span>
            <span lang="ru">Всем привет!</span>
        </p>
    </body>
</html>

    Ivan Kondratyev <ivanbright@gmail.com>  2014
 */

/*global angular*/
(function (angular) {
    "use strict";

    angular.module('multilang', []).directive('translate', ['$interpolate', function ($interpolate) {
        return {
            terminal: true,
            compile: function compile_translator(element) {
                var dict = {};

                angular.forEach(element.children(), function (lang_node) {
                    dict[lang_node.getAttribute('lang').toLowerCase()] = $interpolate(lang_node.textContent);
                    angular.element(lang_node).remove();
                });

                element.removeAttr('translate');

                return function link_translator(scope, element) {
                    scope.$watch('current_lang', function (value) {
                        if (dict.hasOwnProperty(value)) {
                            element.text(dict[value](scope));
                        }
                    });
                };
            }
        };
    }]).directive('langswitcher', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: [
                '<span class="lang_switcher">',
                '    <span class="{{current_lang == lang && \'current\' || \'\'}}" ng-click="switch_to(lang)" ng-repeat="lang in langs">{{lang}}</span>',
                '</span>'
            ].join(''),
            link: function (scope) {
                scope.switch_to = function (lang) {
                    scope.$emit('switch_lang', lang);
                };
            }
        };
    }).factory('i18lise', ['$location', function ($location) {
        return function (scope, langs, def_lang, global) {
            var hash_val = $location.hash(), initial_lang;

            if (scope.i18lised) {
                //Since nested i18n does not make sense,
                //skip processing in such a case.
                return;
            }

            if (langs.length === 0) {
                throw new Error('You should specify at least one language.');
            }

            scope.langs = langs;
            scope._ = function (dict) {
                return dict[scope.current_lang];
            };

            if (hash_val) {
                initial_lang = hash_val;
            } else if (def_lang) {
                initial_lang = def_lang;
            } else {
                initial_lang = langs[0];
            }

            scope.$on('switch_lang', function (event, value) {
                event.stopPropagation();

                if (global) {
                    $location.hash(value);
                }
                scope.current_lang = value;
            });

            scope.current_lang = initial_lang;
            scope.i18lised = true;
        };
    }]).directive('multilang', ['i18lise', function (i18lise) {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {
                i18lise(
                    scope,
                    (attrs.multilang || '').split(/\s?\,\s?/),
                    attrs.deflang,
                    attrs.global !== undefined
                );
            }
        };
    }]);
}(angular));
