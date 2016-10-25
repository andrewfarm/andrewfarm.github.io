var init = function() {
        $(".projects div").hover
        (
         function() {
                $(this).find("h6").addClass("show");
         },
         function() {
                $(this).find("h6").removeClass("show");
         }
        );
};

$(document).ready(init);
