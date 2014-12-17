/**
    A small tool, based on AngularJS, allowing to easily create multilingual HTML pages.

    Example of usage:

<!doctype html>
<html ng-app="main" lang="{{lang}}" multilang="ru, en" deflang="en">
    <head>
        <title ng-bind="_({ru: 'По-русски', en: 'In english'})"></title>
        <meta charset="utf-8">
        <script type="text/javascript" src="js/lib/angular.min.js"></script>
        <script type="text/javascript" src="js/multilang.js"></script>
        <script type="text/javascript">
            angular.module('main', ['multilang']);
        </script>
        <style>
            .lang_switcher>span.current {font-weight: bold;}
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

    angular.module('multilang', []).directive('translate', function () {
        return function (scope, element) {
            var dict = {};

            angular.forEach(element.children(), function (lang_node) {
                dict[lang_node.getAttribute('lang').toLowerCase()] = lang_node.textContent;
                angular.element(lang_node).remove();
            });

            scope.$root.$watch('lang', function (value) {
                if (dict.hasOwnProperty(value)) {
                    element.text(dict[value]);
                }
            });

            element.removeAttr('translate');
        };
    }).directive('langswitcher', function () {
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
                var root_scope = scope.$root;

                scope.switch_to = function (lang) {
                    root_scope.lang = lang;
                };

                root_scope.$watch('lang', function (value) {
                    scope.current_lang = value;
                });
            }
        };
    }).factory('i18lise', ['$location', function ($location) {
        return function (scope, langs, def_lang) {
            var hash_val = $location.hash();

            if (langs.length === 0) {
                throw new Error('You should specify at least one language.');
            }

            scope.langs = langs;
            scope._ = function (dict) {
                return dict[scope.lang];
            };

            if (hash_val) {
                scope.lang = hash_val;
            } else if (def_lang) {
                scope.lang = def_lang;
            } else {
                scope.lang = langs[0];
            }

            scope.$watch('lang', function (value) {
                $location.hash(value);
            });
        };
    }]).directive('multilang', ['i18lise', function (i18lise) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                i18lise(
                    scope.$root,
                    (attrs.multilang || '').split(/\s?\,\s?/),
                    attrs.deflang
                );
            }
        };
    }]);
}(angular));

