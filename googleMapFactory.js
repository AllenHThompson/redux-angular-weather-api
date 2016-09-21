googleMapModule.module('googleMapModule', [])
.factory('googleMap', function() {     
//app.factory('googleMap', function() {
     return {
          newMap: function(lat, long, zoom) {
               var mapOptions = {
                    center: {lat: lat, lng: long},
                    zoom: zoom
               };
               var map = new google.maps.Map(document.getElementById('map'), mapOptions);
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
               marker.addListener('click', function() {
                 infoWindow.close();
               });
               console.log(infoWindow)
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
