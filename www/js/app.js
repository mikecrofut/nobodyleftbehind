// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('eventMap', {
    url: '/',
    templateUrl: 'templates/eventMap.html',
    controller: 'EventMapController'
  });
 
  $urlRouterProvider.otherwise("/");

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.controller('EventMapController', function($scope, $ionicLoading) {
 
  var map = null;
  //hard-coded web api url
  var webApiUrl = 'http://192.168.1.138/nlb.web/api/';

  //hard-coded event id
  var eventId = '1';
 
  //TODO get members from web service
  var members = [
    {
      Name: 'Mike Crofut',
      Position: new google.maps.LatLng(45.52, -122.64),
      ImageUrl: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfa1/v/t1.0-1/c39.39.491.491/s200x200/35023_10200964531659336_972225816_n.jpg?oh=4b7f608bd6681e1a0803cbd2f2be852a&oe=560D40D6&__gda__=1440553278_e49b00b5af315aee6aa9de275cd7b4fd'   
    },
    {
      Name: 'Emiluz Lopez',
      Position: new google.maps.LatLng(45.53, -122.63),
      ImageUrl: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/v/t1.0-1/c33.0.200.200/p200x200/37609_414411069349_1695064_n.jpg?oh=dc8d76d2ba1d508ec8d20f8f5037d4c8&oe=5608D43B&__gda__=1439419187_29bf9a55b338d1e652dddc76f6e84993' 
    }
  ];

  var setMyLocation = function(pos) {
    map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

    //my location
    var myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        map: map,
        title: "My Location"
    });

    //other member's location
    for(var x = 0; x < members.length; ++x)
    {
      addMemberToMap(members[x]);
    }

    //round the corners
    // createRoundedMarkers();
  };

  var addMemberToMap = function(member)
  {

    // Origins, anchor positions and coordinates of the marker
    // increase in the X direction to the right and in
    // the Y direction down.
    var image = {
      url: member.ImageUrl,
      // This marker is 20 pixels wide by 32 pixels tall.
      //size: new google.maps.Size(20, 32),
      scaledSize: new google.maps.Size(40, 40), // scaled size
      // The origin for this image is 0,0.
      origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      anchor: new google.maps.Point(0, 32)
    };
    // Shapes define the clickable region of the icon.
    // The type defines an HTML &lt;area&gt; element 'poly' which
    // traces out a polygon as a series of X,Y points. The final
    // coordinate closes the poly by connecting to the first
    // coordinate.
    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18 , 1],
        type: 'poly'
    };

    var myLocation = new google.maps.Marker({
    //var myLocation = new MarkerWithLabel({
      position: member.Position,
      map: map,
      icon: image,
      shape: shape,
      title: member.Name,
      //labelClass: "memberMarker"
      //zIndex: 1
      //animation:google.maps.Animation.BOUNCE
      //size: new google.maps.Size(100, 39),
    });

  };


  var noGeoLocation = function(err) {
     
      
    var content = 'Error: The Geolocation service failed. Code='+ err.code + '; Message=' + err.message;
    
    if(map != null)
    {

      var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
      };

      var infowindow = new google.maps.InfoWindow(options);
      map.setCenter(options.position);

    }
  };

  var getEvent = function() {
    $.getJSON(webApiUrl + 'events/' + eventId)
        .done(function (data) {
          $scope.Event = data;
        })
        .fail(function (jqXHR, textStatus, err) {
          alert('Error: ' + err);
        });
  };

  google.maps.event.addDomListener(window, 'load', function() {
      var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

      var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

       // Try HTML5 geolocation
      if(navigator.geolocation) {

        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
          setMyLocation,
          noGeoLocation,
          options
          );
      }
      else
      {
        noGeoLocation(null);
      }


      $scope.map = map;
  });

  getEvent();
 
});
