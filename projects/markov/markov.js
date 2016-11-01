function run() {
        var method = $("input[name='method']:checked").attr("id");
        var degrees = parseInt($("#degrees").val());
        var text = $("#trainingtext").val();
        var length = parseInt($("#length").val());
        var output = doMarkov(method, degrees, text, length);
        alert(output);
}

var doMarkov = function(method, degrees, text, length) {
        return method + "\n" + degrees + "\n" + text.substring(0, 10) + "\n" + length;
};

$(document).ready(function() {
        $("#generate").click(run);
});
