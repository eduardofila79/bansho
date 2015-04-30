'use strict';

angular.module('bansho.view.dashboard', ['ngRoute',
                                          'bansho.utils.promiseManager',
                                          'bansho.tactical',
                                          'bansho.table',
                                          'bansho.live'
                                         ])

    .value('dashboardConfig', {})

    .controller('DashboardCtrl', ['$scope', '$routeParams', '$interval', 'dashboardConfig', 'getObjects',
        'TableConfigObj', 'TacticalConfigObj', 'getHostOpenProblems', 'getServiceOpenProblems', 'getHostProblems',
        'getServiceProblems', 'promisesManager',
        function ($scope, $routeParams, $interval, dashboardConfig, getObjects, TableConfigObj, TacticalConfigObj, getHostOpenProblems,
            getServiceOpenProblems, getHostProblems, getServiceProblems, promisesManager) {
            var components = [],
                component,
                config,
                viewName = $scope.viewName,
                i = 0,
                getData;

            $scope.dashboardTitle = dashboardConfig[viewName].title;
            $scope.dashboardTemplate = dashboardConfig[viewName].template;
            $scope.dashboardRefreshInterval = dashboardConfig[viewName].refreshInterval;

            $scope.dashboardTactical = [];
            $scope.dashboardTables = [];

            components = dashboardConfig[viewName].components;

            for (i = 0; i < components.length; i += 1) {
                component = components[i];
                config = component.config;

                if (component.type === 'table') {
                    $scope.dashboardTables.push(new TableConfigObj(config));
                } else if (component.type === 'tactical') {
                    $scope.dashboardTactical.push(new TacticalConfigObj(config));
                }
            }

            getData = function () {
                getHostOpenProblems().success(function (data) {
                    $scope.nbHostOpenProblems = data.length;
                    getServiceOpenProblems().then(function (openProblems) {
                        $scope.nbServiceOpenProblems = openProblems.length;
                        $scope.totalOpenProblems = $scope.nbServiceOpenProblems + $scope.nbHostOpenProblems;
                    });
                });

                getHostProblems().success(function (data) {
                    $scope.nbHostProblems = data.length;
                    getServiceProblems().success(function (data) {
                        $scope.nbServiceProblems = data.length;
                        $scope.totalProblems = $scope.nbHostProblems + $scope.nbServiceProblems;
                    });
                });
            };

            if ($scope.dashboardRefreshInterval !== 0) {
                promisesManager.addAjaxPromise(
                    $interval(getData, $scope.dashboardRefreshInterval * 1000)
                );
            }

            getData();
        }])

    .run(['readConfig', 'dashboardConfig', function (readConfig, dashboardConfig) {
        var viewsConfig = readConfig.data;

        angular.forEach(viewsConfig, function (config, view) {
            if (config.template === 'dashboard') {
                dashboardConfig[view] = config;
            }
        });
    }]);
