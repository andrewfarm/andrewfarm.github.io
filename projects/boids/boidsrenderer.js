function init() {
        var canvas = document.getElementById("canvas");
        //make fullscreen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        var c = canvas.getContext("2d");
        
        //test
        c.fillStyle = "#ff0000";
        c.fillRect(0, 0, c.canvas.clientWidth, c.canvas.clientHeight);
}
