var initImageView = function() {
        $(".imageview").load("imageview.html", initEventHandlers);
}

var initEventHandlers = function() {
        $(".thumbnail").click
        (
         function() {
                var path = $(this).attr("src").replace(/(thumbnails\/)/g, "");
                $("#view").attr("src", path);
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
}

$(document).ready(initImageView);
