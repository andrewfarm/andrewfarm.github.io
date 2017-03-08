function start() {
        var apiKey = "AIzaSyA28BA-B8v8gS00K1H6-YqL4ECgaesI314";
        
        var bpm = 125;
        var fps = 30;
        var floatyVel = -64;
        var floatyPxPerFrame = floatyVel / fps;
        var floatyWidth = 75;
        
        var fonts = [
                {family: "Georgia"},
                {family: "Helvetica"},
                {family: "Arial Black"},
                {family: "Comic Sans MS"},
                {family: "Impact"},
                {family: "Courier New"},
                {family: "Lucida Console"}
        ];
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                        fonts = JSON.parse(this.responseText).items;
                }
        }
        xmlhttp.open("GET", "https://www.googleapis.com/webfonts/v1/webfonts?key="
                     + apiKey, true);
        xmlhttp.send();
        
        var body = document.getElementById("body");
        var text = document.getElementById("text");
        var floatiesdiv = document.getElementById("floaties");
        var bghue = 0;
        
        //animate
        window.setInterval(function() {
                //adjust hue
                bghue = (bghue + 20) % 360;
                var bgHSV = {
                        h: bghue,
                        s: 100,
                        v: 100
                };
                var textHSV= {
                        h: (bghue + 180) % 360,
                        s: 100,
                        v: 100
                }
                var bgcolor = Color(bgHSV).toString();
                var textcolor = Color(textHSV).toString();
                body.style.backgroundColor = bgcolor;
                text.style.color = textcolor;
                
                //animate floaties
                for (var i = 0; i < floatiesdiv.children.length; i++) {
                        var floaty = floatiesdiv.children[i];
                        
                        //move floaties across the screen
                        var x = parseFloat(floaty.dataset.x);
                        floaty.dataset.x = x + floatyPxPerFrame;
                        floaty.style.left = floaty.dataset.x + "px";
                        
                        if (x + floatyWidth < 0) {
                                //remove off-screen floaties
                                floatiesdiv.removeChild(floaty);
                        } else {
                                //make floaties bob up and down
                                var floatAngle = parseFloat(floaty.dataset.floatAngle);
                                floaty.dataset.y = parseFloat(floaty.dataset.y) +
                                        (2 * Math.sin(floatAngle));
                                floaty.dataset.floatAngle = floatAngle + 0.1;
                                floaty.style.top = floaty.dataset.y + "px";
                        }
                }
        }, 1000 / fps);
        
        //change font
        var fontlink = document.getElementById("fontlink");
        var nextFont = fonts[Math.floor(Math.random() * fonts.length)].family;
        window.setInterval(function() {
                nextFont = fonts[Math.floor(Math.random() * fonts.length)].family;
                fontlink.href = "https://fonts.googleapis.com/css?family=" + nextFont;
                text.style.fontFamily = nextFont;
        }, 60000 / bpm);
        
        //add new floaties
        window.setInterval(function() {
                var x = window.innerWidth;
                var y = Math.random() * window.innerHeight;
                var newFloaty = document.createElement("img");
                newFloaty.src = "Ian.png";
                newFloaty.style.position = "absolute";
                newFloaty.style.width = floatyWidth + "px";
                newFloaty.style.left = x + "px";
                newFloaty.style.top = y + "px";
                newFloaty.style.zIndex = "-1";
                newFloaty.dataset.x = x;
                newFloaty.dataset.y = y;
                newFloaty.dataset.floatAngle = Math.random() * 2 * Math.PI;
                floatiesdiv.appendChild(newFloaty);
        }, 2000);
}
