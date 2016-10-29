var loadTitleText = function() {
        var $thumbnails = $("#thumbnails").children();
        for (var i = 0; i < $thumbnails.length; i++) {
                var $img = $thumbnails.eq(i).children().first();
                var filename = getFileName($img.attr("src"));
                $img.attr("title", filename);
        }
};

var getFileName = function(path) {
        return path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
};

$(document).ready(loadTitleText);
