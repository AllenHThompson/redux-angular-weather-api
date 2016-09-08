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
var app = angular.module('my-app', ['ngRoute']);


app.config(function($routeProvider) {
     $routeProvider
     .when('/', {
          templateUrl: 'overview.html',
          controller: 'MainController'
     })
     .when('/city/:cityId', {
          templateUrl: 'forecast.html',
          controller: 'ForecastController'
     });

});

app.factory('weatherService', function($http){
     return {
          getCitybyId: function(cityId, callback){
               $http({
                    method: 'GET',
                    url: 'http://api.openweathermap.org/data/2.5/forecast?',
                    params: {
                         APPID: '5f36dcc22210b91f4b0c921b058a87f8',
                         // units: 'imperial',
                         id: cityId
                    }
               }).success(function(weatherMapData){
                    callback(weatherMapData);
               });
          },
          getCityWeather: function(cityIds, callback) {
               $http({
                    method: 'GET',
                    url: 'http://api.openweathermap.org/data/2.5/group?',
                    params: {
                         APPID: '5f36dcc22210b91f4b0c921b058a87f8',
                         units: 'imperial',
                         id: cityIds.join(",")
                    }
               }).success(function(weatherMapData){
                    callback(weatherMapData);
               });
          }
     };
});
//put google map code

app.factory('googleMap', function(){
     return {
          newMap: function(lat, long, zoom) {
               var map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: lat, lng: long},
                    zoom: zoom
               });
               return map;
          },
          openInfoWindow: function(results, map) {
               var infoWindow = new google.maps.InfoWindow();
               var iconId = results.weather[0].icon;
               var cityName = results.name;
               var temperature = results.main.temp;
               var hiTemperature = results.main.temp_max;
               var lowTemperature = results.main.temp_min;
               var pressure = results.main.pressure;
               var humidity = results.main.humidity;
               var windSpeed = results.wind.speed;
               var contentString =
               '<p>' + cityName + '</br>Temp: ' + temperature + ' F</br>' + '</br>Hi-Temp: ' + hiTemperature + ' F</br>' + '</br>Low-Temp: ' + lowTemperature + ' F</br>' + '</br>Pressure: ' + pressure + '</br>' + '</br>Humidity: ' + humidity + '</br>' + '</br>Wind Speed: ' + windSpeed + ' mph</br>';
               var marker = markerDictionary[results.id];
               infoWindow.setContent(contentString);
               infoWindow.open(map, marker);
          },
          plotData: function(results, map) {
               var service = this;
               var weatherData = results.map(function(results){
                    var position = {
                         lat: results.coord.lat,
                         lng: results.coord.lon
                    };
                    var iconBase = 'http://openweathermap.org/img/w/';
                    var iconId = results.weather[0].icon;
                    var marker = new google.maps.Marker({
                         position: position,
                         map: map,
                         title: results.name,
                         animation: google.maps.Animation. DROP,
                         icon: {
                              url: iconBase + iconId + '.png',
                              size: new google.maps.Size(50, 50),
                              origin: new google.maps.Point(0, 0),
                              anchor: new google.maps.Point(25, 25)
                         }
                    });
                    markerDictionary[results.id] = marker;
                    marker.addListener('click', function(){
                         service.openInfoWindow(results, map);
                    });
                    return marker;
               });
          }
     };
});
// var infoWindows = [];
var markerDictionary = {};
app.controller('MainController', function($scope, $http, weatherService, googleMap){

     weatherService.getCityWeather(cityIds,function(weatherMapData){
          console.log(weatherMapData);
          var results = weatherMapData.list;
          $scope.results = results;
          var map = googleMap.newMap(39.99727, -94.578567, 4);
          googleMap.plotData(results, map);
     });
});

app.controller('ForecastController', function($scope, $http, $routeParams, weatherService, googleMap){

     weatherService.getCitybyId($routeParams.cityId,function(weatherMapData){
          console.log(weatherMapData);
          var results = weatherMapData.list;
          $scope.results = results;
          var map = googleMap.newMap(39.99727, -94.578567, 10);
          googleMap.plotData(results, map);
     });
});
