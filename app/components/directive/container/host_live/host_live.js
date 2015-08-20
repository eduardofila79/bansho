'use strict';

angular.module('bansho.container')
    .directive('banshoHostLive', function () {
        return {
            restrict: 'E',
            templateUrl: 'components/directive/container/host_live/host_live.html',
            link: function (scope) {
                scope.param = scope.$parent.param;
                scope.$parent.addDirectiveParamRequirements('host');
            }
        };
    });