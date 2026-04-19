class MyWebGL {

    gl;
    VShader;
    FShader;
    Program;

    static createGL(aCanvas, avAttribs) {
        if (!aCanvas) {
            console.error("createGL:!aCanvas", aCanvas)
            return null
        }
        const avstrNames = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        let gl = null, n = avstrNames.length;
        for (let i = 0; i < n; i++) {
            try {
                gl = aCanvas.getContext(avstrNames[i], avAttribs)
            } catch (e) {
            }
            if (gl) {
                break
            }
        }
        return gl
    }
    initGL(aCanvas, abDebug) {
        let gl = MyWebGL.createGL(aCanvas)
        if (!gl) {
            return null
        }
        if (abDebug) {
            gl = WebGLDebugUtils.makeDebugContext(gl)
        }
        this.gl = gl
        return gl
    }
    initShadersAndMakeCurrent(astrVertexShader, astrFragmentShader) {
        const gl = this.gl
        if (!gl) {
            console.error("initShadersAndMakeCurrent:!gl")
            return null
        }
        const aProgram = this.initShaders(astrVertexShader, astrFragmentShader);
        if (!aProgram) {
            console.error("initShadersAndMakeCurrent:this.initShaders failed")
            return null
        }
        gl.useProgram(aProgram)
        return aProgram
    }
    initShaders(astrVertexShader, astrFragmentShader) {
        const gl = this.gl
        if (!gl) {
            console.error("initShaders:!gl")
            return null
        }
        if (0 >= astrVertexShader.length) {
            console.error("initShaders:astrVertexShader empty")
            return null
        }
        if (0 >= astrFragmentShader.length) {
            console.error("initShaders:astrFragmentShader empty")
            return null
        }
        const aVShader = this.createShaderObject(gl.VERTEX_SHADER, astrVertexShader);
        if (!aVShader) {
            console.error("initShaders:aVShader undefined")
            return null
        }

        const aFShader = this.createShaderObject(gl.FRAGMENT_SHADER, astrFragmentShader);
        if (!aFShader) {
            console.error("initShaders:aFShader undefined")
            gl.deleteShader(aVShader)
            return null
        }
        const aProgram = this.createProgramObject(aVShader, aFShader);
        if (!aProgram) {
            console.error("initShaders:createProgram failed")
            gl.deleteShader(aVShader)
            gl.deleteShader(aFShader)
            return null
        }
        this.VShader = aVShader
        this.FShader = aFShader
        this.Program = aProgram
        return aProgram
    }
    createShaderObject(aeShaderType, astrSource) {
        const gl = this.gl;
        if (!gl) {
            console.error("createShaderObject:!gl")
            return null
        }
        const aShader = gl.createShader(aeShaderType);
        if (!aShader) {
            console.error("createShaderObject:gl.createShader failed")
            return null
        }
        gl.shaderSource(aShader, astrSource);
        gl.compileShader(aShader);
        if (!gl.getShaderParameter(aShader, gl.COMPILE_STATUS)) {
            console.error(`Failed to compile shader: ${gl.getShaderInfoLog(aShader)}`)
            gl.deleteShader(aShader)
            return null
        }
        return aShader
    }
    createProgramObject(aVShader, aFShader) {
        const gl = this.gl;
        if (!gl) {
            console.error("createProgramObject:!gl")
            return null
        }
        if (!aVShader) {
            console.error("createProgramObject:aVShader undefined")
            return null
        }
        if (!aFShader) {
            console.error("createProgramObject:aFShader undefined")
            return null
        }
        const aProgram = gl.createProgram();
        if (!aProgram) {
            console.error("createProgramObject:gl.createProgram failed")
            return null
        }
        gl.attachShader(aProgram, aVShader);
        gl.attachShader(aProgram, aFShader);
        gl.linkProgram(aProgram);
        if (!gl.getProgramParameter(aProgram, gl.LINK_STATUS)) {
            console.error(`Failed to link program: ${gl.getProgramInfoLog(aProgram)}`)
            gl.deleteProgram(aProgram)
            return null
        }
        return aProgram
    }
    
}
export default MyWebGL;
