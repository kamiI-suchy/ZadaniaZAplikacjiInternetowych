# Wytłumaczenie kodu – Zadanie JS 4 (WebGL)

Zadanie polega na narysowaniu inicjałów **K** i **S** w WebGL jako zbioru kropeK (`gl.POINTS`).
Kod dzieli się na dwa pliki: `MyWebGL.js` (klasa pomocnicza) i `index.html` (logika rysowania).

---

## Plik: `MyWebGL.js`

```javascript
class MyWebGL {
    // Klasa pomocnicza opakowująca niskopозomowe operacje WebGL.
    // Przechowuje referencje do kontekstu GL, shaderów i programu.

    gl;        // Kontekst WebGL (odpowiednik ctx w Canvas 2D)
    VShader;   // Skompilowany vertex shader
    FShader;   // Skompilowany fragment shader
    Program;   // Zlinkowany program GPU (para VShader + FShader)

    static createGL(aCanvas, avAttribs) {
        // Metoda statyczna – próbuje uzyskać kontekst WebGL z elementu <canvas>.
        // Próbuje różnych nazw kontekstu, bo starsze przeglądarki używały innych prefiksów.
        if (!aCanvas) {
            console.error("createGL:!aCanvas", aCanvas) // Błąd: canvas nie istnieje
            return null
        }
        const avstrNames = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        // Lista nazw kontekstu: "webgl" – standard; pozostałe – stare przeglądarki/silniki

        let gl = null, n = avstrNames.length;
        for (let i = 0; i < n; i++) {
            try {
                gl = aCanvas.getContext(avstrNames[i], avAttribs) // Próba uzyskania kontekstu
            } catch (e) {
                // Ignoruje błąd – dana nazwa może nie być obsługiwana
            }
            if (gl) { break } // Jeśli kontekst udało się uzyskać – przerywa pętlę
        }
        return gl // Zwraca kontekst WebGL lub null jeśli przeglądarka nie obsługuje WebGL
    }

    initGL(aCanvas, abDebug) {
        // Inicjalizuje kontekst WebGL; opcjonalnie włącza tryb debugowania.
        let gl = MyWebGL.createGL(aCanvas)
        if (!gl) { return null }
        if (abDebug) {
            gl = WebGLDebugUtils.makeDebugContext(gl)
            // W trybie debug każde wywołanie WebGL jest sprawdzane pod kątem błędów
        }
        this.gl = gl // Zapamiętuje kontekst w obiekcie
        return gl
    }

    initShadersAndMakeCurrent(astrVertexShader, astrFragmentShader) {
        // Kompiluje i linkuje shadery, a następnie ustawia program jako aktywny.
        const gl = this.gl
        if (!gl) { console.error("initShadersAndMakeCurrent:!gl"); return null }

        const aProgram = this.initShaders(astrVertexShader, astrFragmentShader);
        // Kompiluje oba shadery i tworzy program GPU

        if (!aProgram) { console.error("initShadersAndMakeCurrent:this.initShaders failed"); return null }

        gl.useProgram(aProgram) // Aktywuje program GPU – od teraz rysowanie używa tych shaderów
        return aProgram
    }

    initShaders(astrVertexShader, astrFragmentShader) {
        // Kompiluje dwa shadery i linkuje je w jeden program.
        const gl = this.gl
        if (!gl) { console.error("initShaders:!gl"); return null }
        if (0 >= astrVertexShader.length)   { console.error("initShaders:astrVertexShader empty");   return null }
        if (0 >= astrFragmentShader.length) { console.error("initShaders:astrFragmentShader empty"); return null }

        const aVShader = this.createShaderObject(gl.VERTEX_SHADER,   astrVertexShader);
        // Kompiluje vertex shader (oblicza pozycje wierzchołków)
        if (!aVShader) { console.error("initShaders:aVShader undefined"); return null }

        const aFShader = this.createShaderObject(gl.FRAGMENT_SHADER, astrFragmentShader);
        // Kompiluje fragment shader (oblicza kolor każdego piksela)
        if (!aFShader) {
            console.error("initShaders:aFShader undefined")
            gl.deleteShader(aVShader) // Zwalnia pamięć GPU dla vertex shadera
            return null
        }

        const aProgram = this.createProgramObject(aVShader, aFShader);
        // Linkuje oba shadery w jeden program wykonywalny na GPU
        if (!aProgram) {
            console.error("initShaders:createProgram failed")
            gl.deleteShader(aVShader) // Sprzątanie przy błędzie
            gl.deleteShader(aFShader)
            return null
        }

        this.VShader = aVShader  // Zapamiętuje referencje do shaderów
        this.FShader = aFShader
        this.Program = aProgram
        return aProgram
    }

    createShaderObject(aeShaderType, astrSource) {
        // Tworzy i kompiluje pojedynczy shader z kodu źródłowego GLSL.
        const gl = this.gl;
        if (!gl) { console.error("createShaderObject:!gl"); return null }

        const aShader = gl.createShader(aeShaderType);
        // Tworzy obiekt shadera na GPU (vertex lub fragment)
        if (!aShader) { console.error("createShaderObject:gl.createShader failed"); return null }

        gl.shaderSource(aShader, astrSource);  // Ładuje kod źródłowy GLSL do shadera
        gl.compileShader(aShader);             // Kompiluje shader na GPU

        if (!gl.getShaderParameter(aShader, gl.COMPILE_STATUS)) {
            // Sprawdza czy kompilacja się powiodła
            console.error(`Failed to compile shader: ${gl.getShaderInfoLog(aShader)}`)
            // getShaderInfoLog zwraca komunikat błędu kompilatora GLSL
            gl.deleteShader(aShader) // Zwalnia pamięć GPU
            return null
        }
        return aShader // Zwraca skompilowany shader
    }

    createProgramObject(aVShader, aFShader) {
        // Tworzy program GPU przez zlinkowanie vertex i fragment shadera.
        const gl = this.gl;
        if (!gl)      { console.error("createProgramObject:!gl");             return null }
        if (!aVShader){ console.error("createProgramObject:aVShader undefined"); return null }
        if (!aFShader){ console.error("createProgramObject:aFShader undefined"); return null }

        const aProgram = gl.createProgram();   // Tworzy pusty program GPU
        if (!aProgram) { console.error("createProgramObject:gl.createProgram failed"); return null }

        gl.attachShader(aProgram, aVShader);   // Dołącza vertex shader do programu
        gl.attachShader(aProgram, aFShader);   // Dołącza fragment shader do programu
        gl.linkProgram(aProgram);              // Linkuje – łączy shadery w jeden wykonywalny potok

        if (!gl.getProgramParameter(aProgram, gl.LINK_STATUS)) {
            // Sprawdza czy linkowanie się powiodło
            console.error(`Failed to link program: ${gl.getProgramInfoLog(aProgram)}`)
            gl.deleteProgram(aProgram) // Usuwa program przy błędzie
            return null
        }
        return aProgram // Zwraca gotowy program GPU
    }
}
export default MyWebGL; // Eksportuje klasę jako domyślny eksport modułu ES6
```

---

## Plik: `index.html` – skrypt główny

### Shadery GLSL

```javascript
const astrVertexShader =
    "attribute vec2 a_Position; \n"  +
    // attribute – zmienna wejściowa na wierzchołek; vec2 = wektor 2D (x, y)
    "attribute float a_PointSize; \n" +
    // a_PointSize – rozmiar punktu w pikselach dla danego wierzchołka
    "void main() { \n" +
    "   gl_Position = vec4(a_Position, 0.0, 1.0); \n" +
    // gl_Position – wbudowana zmienna; vec4(x, y, z, w); z=0 (2D), w=1 (normalizacja)
    "   gl_PointSize = a_PointSize; \n" +
    // gl_PointSize – wbudowana zmienna ustawiająca rozmiar wyrenderowanego punktu
    "} \n";

const astrFragmentShader =
    "precision mediump float;\n" +
    // precision mediump – precyzja zmiennoprzecinkowa: medium (wystarczająca dla 2D)
    "uniform vec4 u_FragColor;\n" +
    // uniform – zmienna wspólna dla wszystkich fragmentów; vec4 = kolor RGBA
    "void main() {\n" +
    "   gl_FragColor = u_FragColor;\n" +
    // gl_FragColor – kolor wynikowy piksela; pobieramy z przekazanego uniformu
    "} \n";
```

### Inicjalizacja WebGL

```javascript
window.onload = () => {
    // Cały kod uruchamia się po załadowaniu strony (DOM i canvas są gotowe)

    const aMyWebGL = new MyWebGL();
    const aCanvas  = document.getElementById("id_Canvas");
    const gl = aMyWebGL.initGL(aCanvas, false)
    // false = tryb debug wyłączony; gdyby true, każde wywołanie WebGL byłoby logowane

    if (!gl) { console.error("Failed to get the rendering context for WebGL"); return }

    const aProgram = aMyWebGL.initShadersAndMakeCurrent(astrVertexShader, astrFragmentShader);
    if (!aProgram) { console.error("!aProgram"); return }

    const a_Position = gl.getAttribLocation(aProgram, "a_Position");
    // getAttribLocation – pobiera numer "slotu" atrybutu a_Position w shaderze
    // Potrzebne do przekazania danych z CPU (JS) do GPU (shader)
    if (0 > a_Position) { console.error("Failed to get the storage location of a_Position"); return }

    const a_PointSize = gl.getAttribLocation(aProgram, "a_PointSize");
    // Analogicznie dla rozmiaru punktu
    if (0 > a_PointSize) { console.error("Failed to get the storage location of a_PointSize"); return }

    const u_FragColor = gl.getUniformLocation(aProgram, "u_FragColor");
    // getUniformLocation – lokalizacja uniformu (kolor fragmentów) – wspólna dla wszystkich punktów
    if (!u_FragColor) { console.error("Failed to get the storage location of u_FragColor"); return }
```

### Budowanie punktów inicjałów

```javascript
    const points = []
    // Tablica przechowująca dane punktów: [x1, y1, size1, x2, y2, size2, ...]
    // Współrzędne WebGL: (0,0) = środek ekranu; zakres X i Y: od -1.0 do 1.0

    const addPoint = (x, y, size = 8) => points.push(x, y, size)
    // Pomocnicza funkcja: dodaje jeden punkt do tablicy

    const addLine = (x1, y1, x2, y2, step = 0.08, size = 8) => {
        // Symuluje linię jako serię gęsto rozmieszczonych punktów
        const distance = Math.hypot(x2 - x1, y2 - y1)
        // Math.hypot – oblicza długość odcinka (tw. Pitagorasa)
        const count = Math.max(2, Math.ceil(distance / step))
        // count = liczba kroków; ceil zaokrągla w górę; max(2,...) gwarantuje min. 2 punkty
        for (let i = 0; i <= count; i++) {
            const t = i / count          // t – parametr interpolacji: od 0.0 (start) do 1.0 (koniec)
            addPoint(
                x1 + (x2 - x1) * t,     // Interpolacja liniowa X
                y1 + (y2 - y1) * t,     // Interpolacja liniowa Y
                size
            )
        }
    }

    // ── Litera K ──────────────────────────────────────────────
    addLine(-0.85, 0.7, -0.85, -0.7)  // Pionowa kreska K (od góry do dołu, x=-0.85)
    addLine(-0.85, 0.05, -0.45, 0.7)  // Górne ramię K (od środka w prawo-górę)
    addLine(-0.85, 0.05, -0.45, -0.7) // Dolne ramię K (od środka w prawo-dół)

    // ── Litera S ──────────────────────────────────────────────
    // S zbudowana z dwóch łuków: górny (otwarty w prawo) + dolny (otwarty w lewo)
    addLine(0.55, 0.70,  0.15, 0.70)  // pasek górny: prawy → lewy
    addLine(0.15, 0.70,  0.10, 0.48)  // lewa krawędź górnego łuku – w dół
    addLine(0.10, 0.48,  0.20, 0.22)  // dół górnego łuku – skręt w prawo
    addLine(0.20, 0.22,  0.40, 0.08)  // podejście do środka od lewej
    addLine(0.40, 0.08,  0.58, -0.08) // talii S – przejście ze środka w prawo
    addLine(0.58, -0.08, 0.60, -0.32) // prawa krawędź dolnego łuku – w dół
    addLine(0.60, -0.32, 0.48, -0.55) // dół dolnego łuku – skręt w lewo
    addLine(0.48, -0.55, 0.15, -0.70) // pasek dolny: prawy → lewy
```

### Przesyłanie danych do GPU i rysowanie

```javascript
    const data  = new Float32Array(points) // Konwertuje tablicę JS na tablicę 32-bitowych floatów (format GPU)
    const FSIZE = data.BYTES_PER_ELEMENT   // Rozmiar jednego float = 4 bajty

    const buffer = gl.createBuffer()      // Tworzy bufor pamięci na GPU (VBO – Vertex Buffer Object)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer) // Ustawia bufor jako aktywny
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    // Przesyła dane (wszystkie punkty) z pamięci JS do pamięci GPU
    // STATIC_DRAW = dane nie będą zmieniane (optymalizacja)

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0)
    // Opisuje jak czytać dane atrybutu a_Position z bufora:
    // – 2 wartości float na punkt (x, y)
    // – FSIZE*3 = krok (stride) = 12 bajtów między wierzchołkami (x, y, size)
    // – 0 = offset (x zaczyna się od bajtu 0)
    gl.enableVertexAttribArray(a_Position) // Aktywuje atrybut a_Position

    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2)
    // 1 wartość float na punkt (size)
    // offset = FSIZE*2 = 8 bajtów (size jest trzecią wartością w trójce x,y,size)
    gl.enableVertexAttribArray(a_PointSize) // Aktywuje atrybut a_PointSize

    gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0)
    // Ustawia kolor: R=0, G=1, B=0, A=1 → zielony, w pełni nieprzezroczysty

    gl.clearColor(0.0, 0.0, 0.0, 1.0) // Kolor czyszczenia tła = czarny
    gl.clear(gl.COLOR_BUFFER_BIT)      // Czyści bufor koloru (tło staje się czarne)

    gl.drawArrays(gl.POINTS, 0, data.length / 3)
    // Rysuje punkty: gl.POINTS – każdy wierzchołek = osobny punkt
    // data.length / 3 = liczba punktów (każdy ma 3 wartości: x, y, size)
}
```
