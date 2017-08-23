function setupCallbacks(shape) {
        var $about = $("#about-" + shape);
        $("." + shape).hover(
                function() {
                        $about.css("opacity", "100");
                },
                function() {
                        $about.css("opacity", "0");
                }
        );
}

function init() {
        ["triangle", "square", "hexagon", "circle"].forEach(setupCallbacks);
}

$(document).ready(init);
