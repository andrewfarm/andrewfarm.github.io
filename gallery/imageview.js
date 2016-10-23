var imgCount;
var currImg;

var initImageView = function() {
        imgCount = $("#thumbnails").children().length;
        $(".imageview").load("imageview.html", initEventHandlers);
}

var initEventHandlers = function() {
        $(".thumbnail").click
        (
         function() {
                currImg = $(this).parent().index();
                updateView();
                $(".glasspane").addClass("darkened");
                $(".imageview").addClass("visible");
         }
        );
        
        $(".glasspane, #closebutton").click
        (
         function() {
                $(".glasspane").removeClass("darkened");
                $(".imageview").removeClass("visible");
         }
        );
        
        $(".img-nav#back").click
        (
         function() {
                currImg--;
                updateView();
         }
         );
        
        $(".img-nav#next").click
        (
         function() {
                currImg++;
                updateView();
         }
        );
}

var updateView = function() {
        currImg %= imgCount;
        var $img = $("#thumbnails").children().eq(currImg).children().first();
        var hdPath = getHDImagePath($img.attr("src"));
        var caption = $img.attr("alt");
        $("#view").attr("src", hdPath);
        $("#caption").html(caption);
}

var getHDImagePath = function(thumbnailPath) {
        return thumbnailPath.replace(/(thumbnails\/)/g, "");
}

$(document).ready(initImageView);
