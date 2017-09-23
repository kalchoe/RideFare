
		function initMap() {
			var myLatLng = {lat: 30.2672, lng: -97.7431};

			console.log(myLatLng);

			var map = new google.maps.Map(document.getElementById("map"), {
				zoom: 14,
				center: myLatLng
			});

			var marker1 = new google.maps.Marker({
				position: myLatLng,
				map: map,
				title: 'Hello World!'
			});
			console.log(marker1);
			// console.log(marker1.position.lat.Scopes[3].b);
			map.addListener('click', function(e) {
				placeMarker(e.latLng, map);
			});

			function placeMarker(position, map) {
				var marker2 = new google.maps.Marker({
					position: position,
					map: map
				});
				map.panTo(position);
				console.log(marker2);
			}
		}
	



	$("#submit").on("click", function(){
		
		event.preventDefault();

		var startPoint = $("#icon_start").val().trim();
		console.log(startPoint);
		var endPoint = $("#icon_end").val().trim();
		console.log(endPoint);

		var startLat;
		var startLong;
		var endLong;
		var endLat;

		// scroll to bottom of page
		$("html, body").animate({scrollTop: $(document).height()}, "slow");

		$.when(
			$.ajax({
				url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + startPoint + "&key=AIzaSyCVUpJOQ43zmN_hdo0fHcY8aGZ7WacfBzg",
				method: 'GET'
			}).done(function(response){
				console.log(response);
				startLat = response.results[0].geometry.location.lat
				console.log(startLat);
				startLong = response.results[0].geometry.location.lng 
				console.log(startLong);
			}),

		//This is the API call for the destination
		$.ajax({
			url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + endPoint + "&key=AIzaSyCVUpJOQ43zmN_hdo0fHcY8aGZ7WacfBzg",
			method: 'GET'
		}).done(function(response){
			console.log(response);
			endLat = response.results[0].geometry.location.lat
			console.log(endLat);
			
			endLong = response.results[0].geometry.location.lng 
			console.log(endLong);
		})
		).then(function (){

			$.ajax({
				url: "https://api.uber.com/v1.2/estimates/price?start_latitude=" + startLat + "&start_longitude=" + startLong + "&end_latitude=" + endLat + "&end_longitude=" + endLong,
				headers: {
					Authorization: "Token " + "i_HMTeuGY4Uob6vuVe6vW17G45oWnlIqugMwi6UA" 
				},
				
				success: function(result) {
					console.log(result);
					

					var uber = result.prices[1];
					console.log(uber)

					var uberCostEstimate = result.prices[1].estimate;
					var uberTimeEstimate = result.prices[1].duration;
					var uberDistanceEstimate = result.prices[1].distance;

					var timeSeconds = uberTimeEstimate;
                    var timeMinutes = Math.round(timeSeconds / 60);

					var time = $("<p>").text("The trip will take approximately " + timeMinutes + " minutes.");

                    var price = $("<p>").text("The estimated price will be " + uberCostEstimate);

                    var distance = $("<p>").text("The total distance of the trip is " + uberDistanceEstimate + " miles.");

                    var uberDiv = $("#uber-content");

                    uberDiv.html(time);
                    uberDiv.append(price);
                    uberDiv.append(distance);
				}
			});



            $.ajax({
                url: "https://api.lyft.com/v1/cost?start_lat=" + startLat + "&start_lng=" + startLong + "&end_lat=" + endLat + "&end_lng=" + endLong,
                headers: {
                    Authorization: "bearer " + "jpUVi1A41gLssi8agPiLKDXoNzGDXQ0LCIhl1ZBZlcz/pkpTEqLMe7abmxiTzIyFo9gVLkJ9JmCc/cDNF87f5tF0my2m7Qfy84lbV/IPOC+4FLIn6HuFMtk=" 
                },
                
                success: function(result) {

                    var lyft = result.cost_estimates[3];
                    console.log(lyft);

                    var maxPrice = lyft.estimated_cost_cents_max;
                    var minPrice = lyft.estimated_cost_cents_min;
                    

                    var maxPriceDollars = (lyft.estimated_cost_cents_max / 100);
                    var minPriceDollars = (lyft.estimated_cost_cents_min / 100);
                    

                    var timeSeconds = lyft.estimated_duration_seconds;
                    var timeMinutes = Math.round(timeSeconds / 60);

                    var estimatedDistanceMiles = lyft.estimated_distance_miles;

                    console.log("The trip will take approximately " + timeMinutes + " minutes.");

                    console.log("The total distance of the trip is " + estimatedDistanceMiles + " miles.")

                    console.log("The estimated price will be $" + minPriceDollars + "-" + maxPriceDollars + ".");

                    var time = $("<p>").text("Trip Time: " + timeMinutes + " minutes");

                    var price = $("<p>").text("Trip Price: $" + minPriceDollars + "-" + maxPriceDollars);

                    var distance = $("<p>").text("Trip Distance: " + estimatedDistanceMiles + " miles");

                    var lyftDiv = $("#lyft-content");

                    lyftDiv.html(time);
                    lyftDiv.append(price);
                    lyftDiv.append(distance);


                }
            });
		});
		
	});

