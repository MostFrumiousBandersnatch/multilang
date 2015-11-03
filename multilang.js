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

    Ivan Kondratyev <ivanbright@gmail.com>  2015
 */

/*global angular*/
(function (angular) {
    "use strict";

    angular.module(
        'multilang', []
    /**
     * @ngdoc directive
     * @name translate
     * @module multilang
     * @restrict E
     *
     * @description
     * Defines an atomic multilingual block. Must contains particular translation
     * in nested tags (tag name does not matter) with langauge code specified in lang
     * attribute.
     *
     * @example
     * ```
     * <p translate>
     *      <span lang="en">Hello World!</span>
     *      <span lang="ru">Всем привет!</span>
     * </p>
     * ```
     */
    ).directive('translate', ['$interpolate', function ($interpolate) {
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
    /**
     * @ngdoc function
     * @name i18lise
     * @module multilang
     * @kind function
     *
     * @description
     * Invokes i18n for the scope.
     * @param {$rootScope.Scope} scope - scope to wrap.
     * @param {Array} langs - list of language codes to operate with.
     * @param {String} [def_lang] - language code for initial setup.
     */
    }).factory('i18lise', ['$location', function ($location) {
        return function (scope, langs, def_lang, global) {
            var hash_val = $location.hash(), initial_lang;

            if (scope.i18lised) {
                //Since nested i18n does not make sense,
                //skip processing in such a case.
                return;
            }

            if (!angular.isArray(langs) || langs.length < 2) {
                throw new Error('You should specify at least two languages.');
            }

            if (def_lang && langs.indexOf(def_lang) === -1) {
                throw new Error('Default language should be one of avaliable ones.');
            }

            scope.langs = langs;
            scope._ = function (dict) {
                return dict[scope.current_lang];
            };

            if (global && hash_val) {
                initial_lang = hash_val;
            } else if (def_lang) {
                initial_lang = def_lang;
            } else {
                initial_lang = langs[0];
            }

            scope.$on('switch_lang', function (event, value) {
                event.stopPropagation();

                if (scope.langs.indexOf(value) === -1) {
                    throw new Error(value + ' is not supported.');
                }

                if (global) {
                    $location.hash(value);
                }
                scope.current_lang = value;
            });

            scope.current_lang = initial_lang;
            scope.i18lised = true;
        };
    /**
     * @ngdoc directive
     * @name multilang
     * @module multilang
     * @restrict A
     * @element ANY
     *
     * @description
     * Basically, a wrapper for {@link i18lise `i18lise`} Assuming a value
     * containing comma-separated list of language codes.
     * Also pays attention for optional attributes deflang and global,
     * strictly correponds to the paranters of {@link i18lise `i18lise`}.
     *
     * @example
        <example module="multilangExample"  animations="false">
           <file name="index.html">
                <div multilang="ru, en">
                    <langswitcher></langswitcher>
                    <hr/>
                    <p translate>
                        <span lang="en">Hello World!</span>
                        <span lang="ru">Всем привет!</span>
                    </p>
                </div>
            </file>
             <file name="script.js">
                angular.module('multilangExample', ['multilang']);
            </file>
        </example>
     */
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
