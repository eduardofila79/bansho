'use strict';

angular.module('adagios.table', ['ngRoute',
                                 'adagios.live'
                                 ])

    .controller('TableCtrl', ['$scope', 'GetServices', function ($scope, GetServices) {

        var requestFields = [];

        // The module directory name must be cell_ + key
        $scope.cellToFieldsMap = {
            host: [ 'host_state', 'host_name' ],
            service_check: ['state', 'description', 'plugin_output' ],
            duration: ['last_state_change'],
            last_check: ['last_check']
        };

        $scope.cells = ['host', 'service_check', 'duration', 'last_check'];

        angular.forEach($scope.cells, function (key, value) {
            angular.forEach($scope.cellToFieldsMap[key], function (_value) {
                requestFields.push(_value);
            });
        });

        new GetServices(requestFields)
            .success(function (data) {
                $scope.entries = data;
            });
    }])

    .directive('adgTable', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'table/table.html'
        };
    })

    .directive('adgCell', function () {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                scope.getTemplateUrl = function () {
                    if (attrs.type) {
                        return 'table/cell_' + attrs.type + '/cell_' + attrs.type + '.html';
                    }
                    console.error('<adg-cell> "type" attribute is undefined');
                };
            },
            template: '<div ng-include="getTemplateUrl()"></div>'
        };
    });
