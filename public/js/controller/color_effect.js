/**
 * Created by ved on 23/3/15.
 */

var app= angular.module('colorEffectApp',[]);

app.controller('colorEffect', function ($scope) {
    var draw = SVG('drawing');
    var image = draw.image('img/top.jpg');
    image.size(200, 200);

    var x= 50;
    $scope.hue = function () {
       x = x+10;
        image.filter(function(add) {
            add.colorMatrix('hueRotate', x)
        })

    };
    $scope.invert = function () {
        image.filter(function(add) {
            add.componentTransfer({
                rgb: { type: 'table', tableValues: [1, 0] }
            })
        })
    };
    $scope.sepiatone = function () {
        image.filter(function(add) {
            add.colorMatrix('matrix', [ .343, .669, .119, 0, 0
                , .249, .626, .130, 0, 0
                , .172, .334, .111, 0, 0
                , .000, .000, .000, 1, 0 ])
        })
    };
    $scope.posterize= function () {
        image.filter(function(add) {
            add.componentTransfer({
                rgb: { type: 'discrete', tableValues: [0, 0.2, 0.4, 0.6, 0.8, 1] }
            })
        })
    };
    $scope.contrast = function () {
        image.filter(function(add) {
            var amount = 1.5;

            add.componentTransfer({
                rgb: { type: 'linear', slope: amount, intercept: -(0.3 * amount) + 0.3 }
            })
        })
    };
    $scope.desaturate = function () {
        image.filter(function(add) {
            add.colorMatrix('saturate', 0)
        })
    };
    $scope.lighten = function () {
        image.filter(function(add) {
            add.componentTransfer({
                rgb: { type: 'linear', slope: 1.5, intercept: 0.2 }
            })
        })
    }

    $scope.gamma1 = function () {
        image.filter(function(add) {
            add.componentTransfer({
                g: { type: 'gamma', amplitude: 1, exponent: 0.5 }
            })
        })
    };

    $scope.gamma2 = function () {
        image.filter(function(add) {
            add.componentTransfer({
                g: { type: 'gamma', amplitude: 1, exponent: 0.5, offset: -0.1 }
            })
        })
    };

    $scope.unfilter = function() {
        image.unfilter()
    }
});