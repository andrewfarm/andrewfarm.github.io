var init = function() {
        $.get("https://xkcd.com", function(data, status) {update(data, status);}, "text");
}

function update(data, status) {
        if (status === "success") {
                data = data.replace(/(\/\/)/g, "http://");
                $(data).find("#comic").appendTo($("body"));
                $("#comic img").wrap("<a href=\"http://xkcd.com\"></a>");
                $("#comic").css("margin", "2em");
        } else {
                $("body").append("<p>Whoops, something went wrong. In that case, just head over to <a href=\"http://xkcd.com\">xkcd.com</a>.</p>");
        }
}

$(document).ready(init);
