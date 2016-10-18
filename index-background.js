var init = function() {
        $("#menuitem-developer").hover
        (
         function () {
                $(".bg").addClass("bg-developer");
         },
         function () {
                $(".bg").removeClass("bg-developer");
         }
        );
        $("#menuitem-photographer").hover
        (
         function () {
                $(".bg").addClass("bg-photographer");
         },
         function () {
                $(".bg").removeClass("bg-photographer");
         }
        );
};

$(document).ready(init);
