function init() {
    $(".imagebutton").mouseenter(function() {
//                                 $(this).fadeTo(250, 0.6);
                                 $(this).addClass("mousedover");
                                 });
    $(".imagebutton").mouseleave(function() {
//                               $(this).fadeTo(250, 1);
                                 $(this).removeClass("mousedover");
                               });
}

$(document).ready(init);
