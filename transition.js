var init = function() {
        var duration = 640;
        
        $(".nav").click
        (
         function(event) {
                event.preventDefault();
                transition(duration, $(event.target).attr("href"));
         }
        );
}

function transition(duration, href) {
        var $a = $("#abovewater");
        var $b = $("#belowwater");
        var $c = $("#surface");
        
        $("div, .fadeout").not(".transition").animate
        (
         {opacity: 0},
         {duration: duration, queue: false}
        );
        $a.animate
        (
         {opacity: 1},
         {duration: duration, queue: true}
        );
        
        $.easing.drop = function(x,t,b,c,d) {
                return x * x;
        };
        
        $.easing.spread = function(x,t,b,c,d) {
                return 1 - (1 - x) * (1 - x);
        }
        
        $a.animate
        (
         {marginTop: "250px", backgroundColor: "#b0121a"},
         {duration: duration * 2, easing: "drop", queue: true},
         "drop"
        );
        $a.promise().done(function()
          {
                var aOffset = $a.offset();
                $c.css("top", aOffset.top + 17);
                $c.css("left", aOffset.left);
                $c.css("display", "absolute");
                $c.show();
                $c.animate
                (
                 {opacity: 1, width: "200px", left: "-=100px"},
                 {duration: 500, easing: "spread", queue: false},
                 "spread"
                );
                $b.css("top", aOffset.top + 20);
                $b.css("left", aOffset.left - 350);
                $b.css("display", "absolute");
                $b.show();
                $a.hide();
          });
        
        setTimeout
        (
         function() {
                $("body").fadeOut(2000);
         
                //redirect
                $("body").promise().done
                (
                 function () {
                 document.location.href = href;
                 }
                );
         },
         4000
         );
}

$(document).ready(init);
