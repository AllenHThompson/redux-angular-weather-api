var cityIds = [
     4180439,
     5128638,
     4560349,
     4726206,
     4671654,
     5809844,
     5368361,
     5391811,
     5308655,
     4684888,
     4887398,
     5391959,
     5392171,
     4164138,
     4273837,
     5746545,
     4699066,
     5419384,
     4990729
];
var app = angular.module('my-app', ['ngRoute', 'googleMapFactory']);

app.config(function($routeProvider) {
     $routeProvider
     .when('/', {
          controller: 'WeatherMapController',
          templateUrl: 'overview.html'
     })
     .when('/city/:cityId', {
          controller: 'ForecastController',
          templateUrl: 'forecast.html'
     });
});

app.controller('ForecastController', function($scope, googleMap, $routeParams, weatherService) {
     var cityId = $routeParams.cityId;
     weatherService.getForecastForCity(cityId, function(weatherMapData){

          var results = weatherMapData.list;
          $scope.results = results;
          // var map = googleMap.newMap(39.99727, -94.578567, 10);
          // googleMap.plotData(results, map);
     });
});

app.factory('weatherService', function($http){
     var someMethod = function(cityIds, callback) {
          $http({
               url: 'http://api.openweathermap.org/data/2.5/group',
               params: {
                    id: cityIds.join(','),
                    units: 'imperial',
                    APPID: APPID
               }
          }).success(function(data) {
               callback(data);
          });
     };
     var someOtherMethod = function(cityId, callback) {
          $http({
               url: 'http://api.openweathermap.org/data/2.5/forecast',
               params: {
                    id: cityId,
                    units: 'imperial',
                    APPID: APPID
               }
          }).success(callback);
     };
     var APPID = 'e9348133b64a0819b26b734ad2ec4a19';
     return {
          getWeatherByCityIds: someMethod,
          getForecastForCity: someOtherMethod
     };
});
//put google map code



var infoWindows = [];
var markerDictionary = {};

app.controller('WeatherMapController', function($scope, $http, weatherService, googleMap){

     $scope.openInfoWindow = function(result) {
          googleMap.openInfoWindow(result);
     };

     weatherService.getWeatherByCityIds(cityIds, function(weatherMapData){
          var results = weatherMapData.list;
          $scope.results = results;
          var map = googleMap.newMap(39.99727, -94.578567, 4);
          googleMap.plotData(results, map);
     });
});
