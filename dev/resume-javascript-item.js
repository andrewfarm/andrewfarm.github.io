var $jstext;
var finalChars = "JavaScript".split("");
var chars;
var text;
var nbsp = "\xa0";
var currIndex = 0;
var intervalMillis = 50;
var intervalSeconds = intervalMillis / 1000;
var timeSearching = 0;
var timeToSearch;
var timerID;
var caretVisible = false;

var init = function() {
        $jstext = $("li#javascript span");
        chars = $jstext.text().split("");
        chars.pop();
        genTimeToSearch();
        $(window).on("scroll", detectScroll);
}

var detectScroll = function() {
        var textBottom = $jstext.offset().top + $jstext.outerHeight() - $(window).height();
        var windowScroll = $(window).scrollTop();
        if (windowScroll > textBottom) {
                $(window).off("scroll");
                timerID = setInterval(animateText, intervalMillis);
        }
};

var animateText = function() {
        for (var i = currIndex; i < chars.length; i++) {
                var charCode = Math.floor(Math.random() * 94 + 33);
                chars[i] =  String.fromCharCode(charCode);
        }
        timeSearching += intervalSeconds;
        if (timeSearching >= timeToSearch) {
                timeSearching = 0;
                chars[currIndex] = finalChars[currIndex];
                currIndex++;
                if (currIndex >= chars.length) {
                        clearInterval(timerID);
                        setInterval(animateCaret, 500);
                } else {
                        genTimeToSearch();
                }
        }
        text = chars.join("");
        $jstext.text(text + nbsp);
};

var animateCaret = function() {
        var lastChar = text;
        caretVisible = !caretVisible;
        if (caretVisible) {
                lastChar = "_";
        } else {
                lastChar = nbsp;
        }
        $jstext.text(text + lastChar);
};

var genTimeToSearch = function() {
        timeToSearch = Math.random();
};

$(document).ready(init);
