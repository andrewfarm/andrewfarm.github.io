var loadNavBar = function() {
        $("#navbar").load("navbar.html", grayCurrPageIcon);
};

var grayCurrPageIcon = function() {
        var $icon;
        var newIconPath;
        var page = document.location.pathname;
        if (page.endsWith("nature.html")) {
                $icon = $("#nature");
                newIconPath = "icons/nature-gray.png";
        } else if (page.endsWith("people-places.html")) {
                $icon = $("#people-places");
                newIconPath = "icons/people-places-gray.png";
        } else if (page.endsWith("things.html")) {
                $icon = $("#things");
                newIconPath = "icons/things-gray.png";
        }
        $icon.attr("src", newIconPath);
};

$(document).ready(loadNavBar);
