var gl;

var horizAspect = 480.0/640.0;

function start() {
        var canvas = document.getElementById("glCanvas");
        
        //Initialize context
        gl = initWebGL(canvas);
        
        //Check that WebGL is working
        if (!gl) {
                return;
        }
        
        gl.clearColor(0, 0, 0, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function initWebGL(canvas) {
        gl = null;
        
        //Try to grab the standard context. if it fails, fallback to experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webg;");
        
        if (!gl) {
                alert("Unable to initialize WebGL. Your browser may not support it.");
        }
        
        return gl;
}

function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");
        
        //create shader program
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, fragmentShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        
        //check if it fails
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                console.log("Error linking the shader program: " +
                            gl.getProgramInfoLog(shaderProgram));
        }
        
        gl.useProgram(shaderProgram);
        
        vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPositionLocation");
        gl.enableVertexAttribArray(vertexPositionAttribute);
}

function getShader(gl, id, type) {
        var shaderScript, theSource, currentChild, shader;
        
        //get shader script from DOM
        shaderScript = document.getElementById(id);
        if (!shaderScript) {
                console.log("Shader script \"" + id + "\" not found");
                return null;
        }
        
        //get shader source from script element
        theSource = shaderScript.text;
        
        //determine type of shader
        if (!type) {
                if (shaderScript.type == "x-shader/x-fragment") {
                        type = gl.FRAGMENT_SHADER;
                } else if (shaderScript.type == "x-shader/x-vertex") {
                        type = gl.VERTEX_SHADER;
                } else {
                        console.log("unknown shader type: \"" + shaderScript.type + "\"");
                }
        }
        
        //create shader
        shader = gl.createShader(type);
        gl.shaderSource(shader, theSource);
        
        //compile shader
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log("Error compiling the shader: " + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
        }
        
        return shader;
}
