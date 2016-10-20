var init = function() {
        $("#edge img").hover
        (
         function() {
                $(this).attr("src", "images/projects/edge.jpg");
         },
         function() {
                $(this).attr("src", "gallery/nature/Water Lily 4.jpg");
         }
        );
};

$(document).ready(init);
