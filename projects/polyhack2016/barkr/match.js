var latlng;
var users = [];
var matches = [];
var names = ["Rex", "Princess", "Rufus", "T-Bone", "Jefferson", "Hamilton", "Bones", "Tristen", "Kate", "Koala", "Cuddles"];
var pics = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.png"];
var keywords = ["Goofy", "Playful", "Friendly", "Shy", "Energetic", "Yelps", "Quiet"];
var currMatch = 0;


function User(name, pic, age, lat, lng, keywords) {
        this.pic = pic;
        this.name = name;
        this.age = age;
        this.lat = lat;
        this.lng = lng;
        this.keywords = keywords;
}

function init() {
        
        //Geolocate
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition
                (function(position) {
                 latlng = {
                 lat: position.coords.latitude,
                 lng: position.coords.longitude
                 };
                 var pos = new google.maps.LatLng(
                 latlng.lat,
                 latlng.lng
                 );
                 
                 //Find city
                 var geocoder = new google.maps.Geocoder;
                 geocoder.geocode({"location": pos}, function(results, status) {
                                  if (status === "OK") {
                                        show("Found You! " + results[2].formatted_address);
                                  } else {
                                        console.log("Error: " + status);
                                        ohNoes();
                                  }
                                  });
                 },
                 function() {
                 console.log("Couldn't find location information.");
                 ohNoes();
                 });
        } else {
                console.log("Geolocation not supported.");
                ohNoes();
        }
}


function ohNoes() {
        show("Oh noes! We couldn't find you!");
}

function show(msg) {
        document.getElementById("location").innerHTML = msg;
}


var match = function() {
        $("#matching").show();
        genUsers(10000, latlng.lat, latlng.lng);
        var miles = document.getElementById("dist").value;
        var rSq = miles * miles / 5000;
        matches = [];
        for (var i = 0; i < users.length; i++) {
                var distSq = distSqBetween(latlng.lat, users[i].lat, latlng.lng, users[i].lng);
                if (distSq <= rSq) {
                        matches.push(users[i]);
                }
        }
        var $is = $("#inputscreen");
        var $ms = $("#matchscreen");
        $is.css("z-index", "0");
        $ms.css("z-index", "1");
        $ms.fadeIn(500);
        $is.hide();
        loadMatch(currMatch);
}

var distSqBetween = function(lat1, lat2, lng1, lng2) {
        var dLat = lat1 - lat2;
        var dLng = lng1 - lng2;
        return dLat * dLat + dLng * dLng;
}

function genUsers(num, currLat, currLng) {
        users = [];
        for (var i = 0; i < num; i++) {
                var name = names[Math.floor(Math.random() * names.length)];
                var pic = pics[Math.floor(Math.random() * pics.length)];
                var age = Math.floor(Math.random() * 11 + 3);
                var lat = (Math.random() - 0.5) * 5 + currLat;
                var lng = (Math.random() - 0.5) * 5 + currLng;
                var kw = [];
                for (var j = 0; j < 3; j++) {
                        kw.push(keywords[Math.floor(Math.random() * keywords.length)]);
                }
                users.push(new User(name, pic, age, lat, lng, kw));
        }
}

var like = function() {
        var $ms = $("#matchscreen");
        var $ss = $("#successscreen");
        $("#success-matchpic").css("background-image", "url(portraits/" + matches[currMatch].pic + ")");
        $("#success-matchname").html(matches[currMatch].name);
        $ms.css("z-index", "0");
        $ss.css("z-index", "1");
        $ss.fadeIn(500);
        $ms.hide();
}

var notlike = function() {
        currMatch++;
        currMatch %= matches.length;
        loadMatch(currMatch);
}

function loadMatch(matchIndex) {
        if (matches.length > 0) {
                var match = matches[currMatch];
                $("#matchscreen").css("background-image", "url(portraits/" + match.pic + ")");
                $("#matchname").html(match.name);
                $("#matchage").html(match.age + " years old");
                $("#matchkeywords").html(match.keywords[0] + ", " + match.keywords[1] + ", " + match.keywords[2]);
                var latlng = {
                lat: match.lat,
                lng: match.lng
                };
                var matchloc;
                var geocoder = new google.maps.Geocoder;
                geocoder.geocode({"location": latlng}, function(results, status) {
                                 if (status === "OK") {
                                        $("#matchloc").html(results[2].formatted_address);
                                 } else {
                                        $("#matchloc").html("");
                                 }});
        }
}

$(document).ready(function() {
                  $("#match-button").click(match);
                  $("#like-button").click(like);
                  $("#notlike-button").click(notlike);
                  });
