var index = -1;
var $images;

function init() {
    $images = $(".coverimage");
    changeImage();
    setInterval(changeImage, 10000);
}

function changeImage() {
    index++;
    index %= $images.length;
    var $currImg = $($images[index]);
    $currImg.css("z-index", 1);
    $currImg.fadeIn(2000);
    $($images[mod(index - 1, $images.length)]).css("z-index", 0);
    $($images[mod(index - 2, $images.length)]).hide();
    $(".pageheader, .nav, p").css("z-index", 2);
//    console.log("Image fading in", $currImg);
//    for (var i = 0; i < 5; i++) {
//        console.log("Image " + i + " z-index", $($images[i]).css("z-index"));
//    }
}

var mod = function(x, mod) {
    var y = x % mod;
    if (y < 0) y += mod;
    return y;
}

$(document).ready(init());
