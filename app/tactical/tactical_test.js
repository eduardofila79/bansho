'use strict';

describe('Tactical module', function() {

  beforeEach(module('adagios.tactical'));

  describe('TacticalCtrl', function() {

    it('should be defined', inject(function($controller) {
      var scope = {};
      var ctrl = $controller('TacticalCtrl', {$scope:scope});

      expect(ctrl).toBeDefined();
    }));

  });
});
