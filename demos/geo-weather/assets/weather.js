// HTML5 Geolocation based Weather App.
// Weather data is courtesy of OpenWeatherMap.org API.
// Author: Santhosh Sundar | github.com/Gigacore

(function() {

	var lat, lng;

	navigator.geolocation.getCurrentPosition(function(pos) {
		lat = pos.coords.latitude;
		lng = pos.coords.longitude;

		$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&units=metric', function(data) {
			var template = $('#template').html();
			$('#weather').html(_.template(template,{data:data}));
			$('img').attr('src', 'assets/weather_conditions/'+data.weather[0].description.toLowerCase().replace(/ /g, '_')+'.jpg');
		});
	});

})();