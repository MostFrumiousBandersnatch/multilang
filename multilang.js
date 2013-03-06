/**
    A small tool, based on AngularJS, allowing to easily create multilingual HTML pages.

    Example of usage:

<!doctype html>
<html ng-app="main" ng-controller="RootController" lang="{{lang}}">
    <head>
        <title ng-bind="_({ru: 'По-русски', en: 'In english'})"></title>
        <meta charset="utf-8">
        <script type="text/javascript" src="js/lib/angular-1.0.1.min.js"></script>
        <script type="text/javascript" src="js/multilang.js"></script>
        <script type="text/javascript">
            angular.module(
                'main',
                ['multilang']
            ).controller(
                'RootController',
                function  ($scope, i18lise) {
                    i18lise($scope, 'en')
                }
            )
        </script>
        <style>
            .lang_switcher>span.current {font-weight: bold;}
            .lang_switcher>span:nth-child(even)::before {content: " | ";}
        </style>
    </head>
    <body>
        <langswitcher langs="ru, en"></langswitcher>
        <hr/>
        <p translate>
            <span lang="en">Hello World!</span>
            <span lang="ru">Всем привет!</span>
        </p>
    </body>
</html>

    Ivan Kondratyev <ivanbright@gmail.com>  2013
 */

(function (angular) {
    "use strict";

    angular.module('multilang', []).directive('translate', function () {
        return function (scope, element, attrs) {
            var dict = {};

            Array.prototype.forEach.call(element.children(), function (lang_node) {
                dict[lang_node.getAttribute('lang').toLowerCase()] = lang_node.textContent;
                angular.element(lang_node).remove();
            });

            scope.$watch('lang', function (value) {
                if (dict.hasOwnProperty(value)) {
                    element.text(dict[value]);
                }
            });

            element.removeAttr('translate');
        };
    }).directive('langswitcher', function ($location) {
        function switch_to(lang, scope) {
            scope.lang = lang;
        }

        return {
            restrict: 'E',
            replace: true,
            template: '<span class="lang_switcher"></span>',

            link: function (scope, element, attrs, ctrl) {
                var langs = attrs.langs.split(/\s?\,\s?/),
                    spans = {},
                    root_scope = scope.$root;

                element.children().remove();

                langs.forEach(function (lang) {
                    spans[lang] = angular.element('<span>' + lang + '</span>').bind('click', root_scope.$apply.bind(root_scope, switch_to.bind(null, lang)));
                    element.append(spans[lang]);
                });

                root_scope.$watch('lang', function (value) {
                    element.children().removeClass('current');
                    spans[value].addClass('current');
                    $location.hash(value);
                });

                element.removeAttr('langs');
            }
        };
    }).factory('i18lise', function ($location) {
        return function (scope, def_lang) {
            var hash_val = $location.hash();

            scope._ = function (dict) {
                return dict[scope.lang];
            };

            if (hash_val) {
                scope.$root.lang = hash_val;
            } else if (def_lang) {
                scope.$root.lang = def_lang;
            }
        };
    });
}(angular));