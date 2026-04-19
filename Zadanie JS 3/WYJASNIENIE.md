# Wytłumaczenie kodu – Zadanie JS 3

Zadanie polega na narysowaniu inicjałów **K** i **S** na elemencie `<canvas>` przy użyciu
ścieżek (`beginPath`) i gradientu — bez użycia funkcji tekstowych (`fillText`/`strokeText`).

---

## Plik: `index.html`

### Sekcja `<head>` i style

```html
<!DOCTYPE html>           <!-- Deklaracja standardu HTML5 -->
<html lang="pl">          <!-- Język strony – polski -->
<head>
    <meta charset="UTF-8"> <!-- Kodowanie UTF-8 dla polskich znaków -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Zapobiega automatycznemu powiększaniu na urządzeniach mobilnych -->

    <title>Zadanie JS 3</title>

    <style>
        body {
            margin: 0;                   /* Usuwa domyślny margines przeglądarki */
            font-family: Arial, sans-serif; /* Czcionka bezszeryfowa */
            background: #111;            /* Ciemnoszare tło całej strony */
            color: #fff;                 /* Biały kolor tekstu */
        }
        main {
            display: grid;               /* Layout siatki CSS Grid */
            place-items: center;         /* Centruje zawartość poziomo i pionowo */
            min-height: 100vh;           /* Minimum pełna wysokość okna przeglądarki */
            gap: 16px;                   /* Odstęp 16px między nagłówkiem a canvasem */
        }
        canvas {
            background: #fff;            /* Białe tło płótna (inicjały rysowane na bieli) */
            border: 2px solid #333;      /* Ciemnoszara ramka wokół canvasa */
        }
    </style>
</head>
```

### Sekcja `<body>`

```html
<body>
    <main>
        <h1>Inicjały KS na canvas</h1>         <!-- Nagłówek strony -->
        <canvas id="canvas" width="700" height="300"></canvas>
        <!-- canvas – płótno 700×300 pikseli, na którym rysuje JavaScript.
             id="canvas" pozwala skryptowi znaleźć element przez getElementById. -->
    </main>
```

### Skrypt JavaScript

```javascript
const canvas = document.getElementById("canvas"); // Pobiera element <canvas> z DOM
const ctx = canvas.getContext("2d");               // Tworzy kontekst 2D – obiekt z metodami rysowania

// ── Gradient ──────────────────────────────────────────────────────────────────
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
// Tworzy gradient liniowy od punktu (0,0) [lewy górny róg] do (700,300) [prawy dolny].
// Oznacza to, że kolor zmienia się po przekątnej.

gradient.addColorStop(0,   "#007bff"); // Na początku (0%) – niebieski
gradient.addColorStop(0.5, "#8e44ad"); // W połowie   (50%) – fioletowy
gradient.addColorStop(1,   "#ff3b30"); // Na końcu   (100%) – czerwony

// ── Wspólne ustawienia linii ──────────────────────────────────────────────────
ctx.lineWidth   = 14;        // Grubość linii = 14 pikseli
ctx.lineCap     = "round";   // Zaokrąglone końce linii (zamiast kwadratowych)
ctx.lineJoin    = "round";   // Zaokrąglone narożniki przy połączeniach linii
ctx.strokeStyle = gradient;  // Kolor/styl obrysu = zdefiniowany wcześniej gradient

// ── Litera K ─────────────────────────────────────────────────────────────────
ctx.beginPath();           // Zaczyna nową ścieżkę (czyści poprzednie punkty)

ctx.moveTo(120, 60);       // Przesuwa „pióro" do (120, 60) – góra pionowej kreski K
ctx.lineTo(120, 240);      // Rysuje pionową kreskę K w dół do (120, 240)

ctx.moveTo(120, 150);      // Przesuwa do środka pionowej kreski (150 = połowa 60–240)
ctx.lineTo(240, 60);       // Rysuje górne ramię K do prawego górnego rogu

ctx.moveTo(120, 150);      // Wraca do środka
ctx.lineTo(240, 240);      // Rysuje dolne ramię K do prawego dolnego rogu

ctx.stroke();              // Rysuje całą skonstruowaną ścieżkę K na ekranie

// ── Litera S ─────────────────────────────────────────────────────────────────
ctx.beginPath();           // Nowa ścieżka – oddzielna od K

ctx.moveTo(460, 70);       // Pióro w punkcie startowym górnej krzywej S

ctx.bezierCurveTo(360, 40, 330, 150, 440, 160);
// Krzywa Béziera III stopnia (punkt kontrolny 1: 360,40; punkt kontrolny 2: 330,150;
// punkt końcowy: 440,160).
// Rysuje górny łuk S – krzywa wygina się w lewo, tworząc górną część litery.

ctx.bezierCurveTo(560, 170, 530, 280, 430, 240);
// Druga krzywa Béziera (punkt kontrolny 1: 560,170; punkt kontrolny 2: 530,280;
// punkt końcowy: 430,240).
// Rysuje dolny łuk S – krzywa wygina się w prawo, tworząc dolną część litery.

ctx.stroke(); // Rysuje oba łuki S na ekranie
```
