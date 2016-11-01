function run() {
        var method = $("input[name='method']:checked").attr("id");
        var degrees = parseInt($("#degrees").val());
        var text = $("#trainingtext").val();
        var length = parseInt($("#length").val());
        
        var $genButton = $("#generate");
        $genButton.remove();
        $("#clear").before("<span id=\"loading\"><img align=\"middle\" src=\"loading.gif\" width=\"32px\"/>\n<span id=\"status\">Analyzing...</span></span>");
        
        setTimeout(function() {
                   var output = doMarkov(method, degrees, text, length);
                   $("#loading").remove();
                   $("#clear").before($genButton);
                   $("#output").text(output);
        }, 0);
}

var doMarkov = function(method, degrees, text, length) {
        //Break up text into symbols
        var split;
        if (method === "byLetters") {
                split = "";
        } else {
                split = " ";
        }
        var textAsSymbols = text.split(split);
        var symbols = uniq(textAsSymbols);
        var strings = [];
        //Analyze symbol combinations
//        for (var i = 0; i < textAsSymbols.length - 1; i++) {
//                
//        }
        $("#status").text("Generating...");
        //Generate text
        return symbols;
};

var uniq = function(list) {
        var uniqList = [];
        for (var i = 0; i < list.length; i++) {
                if (!contains(uniqList, list[i])) {
                        uniqList.push(list[i]);
                }
        }
        return uniqList;
}

var contains = function(list, search) {
        for (var i = 0; i < list.length; i++) {
                if (list[i] === search) {
                        return true;
                }
        }
        return false;
}

$(document).ready(function() {
        $("#generate").click(run);
});
