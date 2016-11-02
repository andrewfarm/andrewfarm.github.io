const MILESTONE_INTERVAL = 0.1;

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
        console.log("Building unique symbol list...");
        var symbols = uniq(textAsSymbols);
        console.log("Done (" + symbols.length + " entries)");
        var strings = [];
        for (var i = 0; i < symbols.length; i++) {
                strings.push([]);
        }
        
        //Analyze symbol combinations
        console.log("Building successive symbol list...");
        var nextMilestone = MILESTONE_INTERVAL;
        for (var i = 0; i < textAsSymbols.length-1; i++) {
                var symbolIndex = symbols.indexOf(textAsSymbols[i]);
                strings[symbolIndex].push(textAsSymbols[i+1]);
                var f = i / textAsSymbols.length;
                if (f > nextMilestone) {
                        console.log(Math.floor(f * 100) + "%")
                        nextMilestone += MILESTONE_INTERVAL;
                }
        }
        console.log("Done (" + strings.length + " entries)")
        $("#status").text("Generating...");
        //Generate text
        var output = "";
        var lastSymbol = textAsSymbols[rand(textAsSymbols.length)];
        var wordCount = 0;
        console.log("Generating new text...");
        while (wordCount <= length) {
                var symbolIndex = symbols.indexOf(lastSymbol);
                var nextStrings = strings[symbolIndex];
                var nextSymbol = nextStrings[rand(nextStrings.length)];
                output += nextSymbol;
                if ((method === "byLetters") && (nextSymbol === " ")) {
                        wordCount++;
                } else if (method === "byWords") {
                        output += " ";
                        wordCount++;
                }
                lastSymbol = nextSymbol;
        }
        console.log("Done");
        return output;
};

//Generates a random integer between 0 and n - 1
var rand = function(n) {
        return Math.floor(Math.random() * n);
}

//Creates a copy of a list with all duplcates removed
var uniq = function(list) {
        var nextMilestone = MILESTONE_INTERVAL;
        var uniqList = [];
        for (var i = 0; i < list.length; i++) {
                if (!contains(uniqList, list[i])) {
                        uniqList.push(list[i]);
                }
                var f = i / list.length;
                if (f > nextMilestone) {
                        console.log(Math.floor(f * 100) + "%")
                        nextMilestone += MILESTONE_INTERVAL;
                }
        }
        return uniqList;
}

//Performs a linear search on an array
//Returns true if list contains search, false otherwise
var contains = function(list, search) {
        for (var i = 0; i < list.length; i++) {
                if (list[i] === search) {
                        return true;
                }
        }
        return false;
}

//Traverses a 2D array and returns the number of elements in the whole array
var elementCount2D = function(list) {
        var count = 0;
        for (var i = 0; i < list.length; i++) {
                for (var j = 0; j < list[i].length; j++) {
                        count++;
                }
        }
        return count;
}

$(document).ready(function() {
        $("#generate").click(run);
});
