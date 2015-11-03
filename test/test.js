'use strict';

/*global jasmine, describe, it, beforeEach, afterEach, module,
    expect, inject
*/
describe("Basic multilang test suite", function() {
    beforeEach(function () {
        module('multilang');
    });

    describe('i18lise', function () {
        var i18liseFactory;

        beforeEach(inject(function (i18lise) {
            i18liseFactory = i18lise;
        }));

        it('should exists',
            function () {
                expect(i18liseFactory).toBeDefined();
            }
        );

        it('should mark the scope',
            inject(function ($rootScope) {
                var s = $rootScope.$new();

                i18liseFactory(s, ['en', 'fr']);

                expect(s.i18lised).toBeTruthy();
                expect(s.langs).toEqual(['en', 'fr']);
            })
        );

        it('should not allow empty lists',
            inject(function ($rootScope) {
                var s = $rootScope.$new(),
                    err_msg = 'You should specify at least two languages.';

                expect(
                    i18liseFactory.bind(null, s, [])
                ).toThrowError(
                    Error, err_msg
                );

                expect(
                    i18liseFactory.bind(null, s, ['en'])
                ).toThrowError(
                    Error, err_msg
                );
            })
        );

        it('should reject incorrect default language',
            inject(function ($rootScope) {
                var s = $rootScope.$new();

                expect(
                    i18liseFactory.bind(null, s, ['en', 'fr'], 'ru')
                ).toThrowError(
                    Error,
                    'Default language should be one of avaliable ones.'
                );
            })
        );

        it('should take default langauge into account',
            inject(function ($rootScope) {
                var s = $rootScope.$new();

                i18liseFactory(s, ['en', 'fr'], 'fr');
                expect(s.current_lang).toBe('fr');
            })
        );

        it('should take location hash into account',
            inject(function ($rootScope, $location) {
                var s = $rootScope.$new();

                $location.hash('en')
                i18liseFactory(s, ['en', 'fr'], 'fr', true);
                expect(s.current_lang).toBe('en');
            })
        );

        it('should ignore location hash unless it`s global',
            inject(function ($rootScope, $location) {
                var s = $rootScope.$new();

                $location.hash('en')
                i18liseFactory(s, ['en', 'fr'], 'fr', false);
                expect(s.current_lang).toBe('fr');
            })
        );

        it('should handle absence of default language properly',
            inject(function ($rootScope) {
                var s = $rootScope.$new();

                i18liseFactory(s, ['en', 'fr']);
                expect(s.current_lang).toBe('en');
            })
        );

        it('should allow to wrap scope only once',
            inject(function ($rootScope) {
                var s = $rootScope.$new();

                i18liseFactory(s, ['ru', 'se']);
                i18liseFactory(s, ['en', 'fr']);

                expect(s.langs).toEqual(['ru', 'se']);
            })
        );

        it('should switch language when event being raised',
            inject(function ($rootScope) {
                var s = $rootScope.$new();

                i18liseFactory(s, ['en', 'fr']);
                expect(s.current_lang).toBe('en');

                s.$emit('switch_lang', 'fr');
                expect(s.current_lang).toBe('fr');
            })
        );

        it('should throw error encountering unknown language',
            inject(function ($rootScope) {
                var s = $rootScope.$new();

                i18liseFactory(s, ['en', 'ru']);
                expect(
                     s.$emit.bind(s, 'switch_lang', 'fr')
                ).toThrowError(
                    Error, 'fr is not supported.'
                );
            })
        );

        it('should provide translation function',
            inject(function ($rootScope) {
                var s = $rootScope.$new(),
                    dict = {fr: 'Bon jour!', en: 'Hello!'};

                i18liseFactory(s, ['en', 'fr']);
                expect(angular.isFunction(s._)).toBeTruthy();
                expect(s._(dict)).toBe('Hello!');

                s.$emit('switch_lang', 'fr');
                expect(s._(dict)).toBe('Bon jour!');
            })
        );
    });

    describe('translate', function () {
        it('got to watch the scope', function () {
            var e = angular.element([
                '<h1 translate>',
                    '<span lang="en">Hello World!</span>',
                    '<span lang="ru">Всем привет!</span>',
                '</h1>',
            ].join('')), s;

            angular.bootstrap(e, ['multilang']);
            s = e.scope();

            s.$apply(function (scope) {
                scope.current_lang = 'ru';
            });
            expect(e.text()).toBe('Всем привет!');

            s.$apply(function (scope) {
                scope.current_lang = 'en';
            });
            expect(e.text()).toBe('Hello World!');
        });

        it('got to perform in conjunction with multilang', function () {
            var e = angular.element([
                '<h1 multilang="ru, en" translate>',
                    '<span lang="en">Hello World!</span>',
                    '<span lang="ru">Всем привет!</span>',
                '</h1>',
            ].join('')), s;

            angular.bootstrap(e, ['multilang']);
            s = e.scope();

            expect(e.text()).toBe('Всем привет!');

            s.$emit('switch_lang', 'en');
            s.$digest();
            expect(e.text()).toBe('Hello World!');
        });

    });
});
