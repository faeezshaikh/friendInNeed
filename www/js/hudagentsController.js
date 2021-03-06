angular.module('starter.controllers')
.controller('HudagentsCtrl', function($scope, auth, store, $state, $timeout, HudService,$stateParams, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal,$ionicScrollDelegate,FIREBASE_URL,$cordovaCamera,$cordovaGeolocation,$cordovaLaunchNavigator,$window,$rootScope,NgMap) {
	$scope.currentCoords;
	$scope.map;
	
	function init() {
		var needyId = $stateParams.needyId; // Not using it..really.
		var lat,lon;
		
		// Call Service to get Current Co-ords
		$scope.currentCoords  = CtrlService.getCoords();
		console.log('Currnet coords:' , $scope.currentCoords.lat + ', ' + $scope.currentCoords.lon);


		if(needyId) {
			var baseRef = new Firebase(FIREBASE_URL + '/needy/' + needyId);
			
			baseRef.on("value", function(snapshot) {
				var needyPerson = snapshot.val();
				lat = needyPerson.lat;
				lon = needyPerson.long;
				}, function (errorObject) {
					console.log("The read failed: " + errorObject.code);
				});
		} else {
					lat = $scope.currentCoords.lat;
					lon = $scope.currentCoords.lon;
		}

				// Call Service to get data
		HudService.GetHudAgents(lat,lon,15).then(function(response) {
			$scope.hudagents = response.data;
		});
		
		// Initialise Map
		 NgMap.getMap().then(function(map) {
			    console.log(map.getCenter());
			    $scope.map = map;
			    console.log('markers', map.markers);
			    
			  });
	};
	init();
	
	$scope.showDetail = function(e, agent) {
		$scope.agent1 = agent;
	    $scope.map.showInfoWindow('foo-iw', agent.agcid);  // if issues with anchoring info-window to the marker , see https://github.com/allenhwkim/angularjs-google-maps/issues/505
	  };
	
	// Calculate distance of each agency from current location
	$scope.getDistance = function(agent) {
		return CtrlService.getDistanceFromLatLonInMiles($scope.currentCoords.lat,$scope.currentCoords.lon,agent.agc_ADDR_LATITUDE,agent.agc_ADDR_LONGITUDE);
	}
	
	$scope.openSite = function(link) {
		window.open(link, '_system', 'location=yes'); 
		return false;
	}
	
	$scope.launchNav = function(agent) {
		CtrlService.launchNavigation(agent.agc_ADDR_LATITUDE,agent.agc_ADDR_LONGITUDE);
	}
	
	 $scope.doRefresh = function() {
		 init();
		 $scope.$broadcast('scroll.refreshComplete');
	  }
	 
	

	
		
		
	
});