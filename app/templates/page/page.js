'use strict';

angular.module('bansho.view.page', ['bansho.table', 'bansho.tactical'])
    .controller('PageCtrl', ['$scope', '$routeParams', 'configManager', 'templateManager',
        function ($scope, $routeParams, configManager, templateManager) {
            templateManager.setLayout($scope.viewName);

            angular.forEach($routeParams, function (value, key) {
                templateManager.setPageParam(key, value);
            });

            $scope.components = templateManager.getLayoutComponents();
        }])

    .directive('banshoComponents', ['$compile', 'directiveBuilder', function ($compile, directiveBuilder) {
        return {
            restrict: "E",
            scope: {
                components: '='
            },
            link: function (scope, element) {
                if (angular.isArray(scope.components)) {
                    angular.forEach(scope.components, function (component, index) {
                        element.append(directiveBuilder(component.type, index));
                    });

                    $compile(element.contents())(scope);
                }
            }
        };
    }])

    .factory('directiveBuilder', function () {
        return function (type, index) {
            return "<bansho-" + type + " options=components[" + index + "] />";
        };
    });

