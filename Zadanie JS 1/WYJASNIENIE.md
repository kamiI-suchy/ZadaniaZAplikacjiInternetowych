# Wytłumaczenie kodu – Zadanie JS 1

Zadanie polega na stworzeniu dwóch niezależnych par **Controller + Presenter**,
które wyświetlają różne układy (X / Y / Z) po kliknięciu przycisków A / B / C.

---

## Plik: `strona.html`

```html
<!DOCTYPE html>                          <!-- Deklaracja standardu HTML5 -->
<html lang="PL">                         <!-- Korzeń dokumentu; lang="PL" – język polski -->
<head>
    <meta charset="UTF-8">              <!-- Kodowanie znaków UTF-8 (polskie litery) -->
    <meta name="viewport" ...>          <!-- Strona skaluje się poprawnie na urządzeniach mobilnych -->
    <link rel="stylesheet" href="style.css"> <!-- Podpięcie zewnętrznego arkusza CSS -->
    <title>Strona</title>               <!-- Tytuł widoczny w zakładce przeglądarki -->
</head>
<body>
    <div id="pair1" class="pair">       <!-- Kontener pierwszej pary Controller+Presenter -->
        <h2>Para 1</h2>                 <!-- Nagłówek opisujący parę -->
        <button data-layout="A">A</button> <!-- Przycisk A; atrybut data-layout="A" niesie informację o układzie -->
        <button data-layout="B">B</button> <!-- Przycisk B -->
        <button data-layout="C">C</button> <!-- Przycisk C -->
        <div id="layout1" class="layout"></div> <!-- Pusty kontener – tu Presenter wstawia układ -->
    </div>

    <div id="pair2" class="pair">       <!-- Kontener drugiej, niezależnej pary -->
        <h2>Para 2</h2>
        <button data-layout="A">A</button>
        <button data-layout="B">B</button>
        <button data-layout="C">C</button>
        <div id="layout2" class="layout"></div>
    </div>

    <script type="text/javascript" src="skrypt.js"></script> <!-- Ładowanie logiki JS na końcu body (DOM już istnieje) -->
</body>
</html>
```

---

## Plik: `style.css`

```css
.pair {
    display: inline-block;   /* Para wyświetla się jako element blokowy w linii – obie pary obok siebie */
    vertical-align: top;     /* Wyrównanie do góry, gdy pary mają różne wysokości */
    margin: 20px;            /* Odstęp z każdej strony pary */
}

.layout {
    margin-top: 20px;        /* Odstęp między przyciskami a wyrenderowanym układem */
}

.grid3 {
    display: grid;                          /* CSS Grid – siatka */
    grid-template-columns: repeat(3, 100px); /* 3 kolumny po 100px każda */
    grid-template-rows: repeat(3, 100px);    /* 3 wiersze po 100px każdy */
    gap: 10px;                              /* Odstęp między komórkami siatki */
    border: 4px solid black;               /* Ramka wokół całej siatki */
    padding: 10px;                         /* Wewnętrzny odstęp siatki od ramki */
    width: fit-content;                    /* Siatka ma szerokość dopasowaną do zawartości */
}

.grid4 {
    display: grid;
    grid-template-columns: repeat(4, 100px); /* 4 kolumny – siatka 4×4 dla układu Z */
    grid-template-rows: repeat(4, 100px);
    gap: 10px;
    border: 4px solid black;
    padding: 10px;
    width: fit-content;
}

.box {
    background-color: lightblue; /* Jasnoniebieski kolor tła kafelka */
    display: flex;               /* Flexbox wewnątrz kafelka – centrowanie tekstu */
    justify-content: center;     /* Wyśrodkowanie poziome tekstu */
    align-items: center;         /* Wyśrodkowanie pionowe tekstu */
    font-weight: bold;           /* Tekst pogrubiony */
    border: 2px solid darkblue; /* Granatowa ramka kafelka */
}
```

---

## Plik: `skrypt.js`

```javascript
class Presenter {
    // Klasa Presenter odpowiada WYŁĄCZNIE za renderowanie układu w DOM.
    // Nie wie nic o przyciskach – tylko o kontenerze i typach układów.

    constructor(container) {
        this.container = container; // Zapamiętuje referencję do elementu DOM, w którym będą rysowane układy
    }

    showLayout(type) {
        // Wywoływana przez Controller; czyści kontener i rysuje odpowiedni układ
        this.container.innerHTML = ""; // Usuwa poprzednio wyrenderowany układ

        if (type === "A") this.layoutX(); // Typ A → układ X (przekątna w siatce 3×3)
        if (type === "B") this.layoutY(); // Typ B → układ Y (środkowy wiersz w siatce 3×3)
        if (type === "C") this.layoutZ(); // Typ C → układ Z (narożniki w siatce 4×4)
    }

    createBox(text, row, col) {
        // Fabryka kafelka: tworzy <div class="box"> z tekstem na pozycji (row, col) w CSS Grid
        const div = document.createElement("div"); // Tworzy nowy element <div>
        div.className = "box";                     // Nadaje klasę CSS "box" (style w style.css)
        div.textContent = text;                    // Ustawia widoczny tekst kafelka
        div.style.gridRow = row;                   // Umieszcza div w podanym wierszu siatki
        div.style.gridColumn = col;                // Umieszcza div w podanej kolumnie siatki
        return div;                                // Zwraca gotowy element do dodania do siatki
    }

    layoutX() {
        // Układ X: trzy kafelki po głównej przekątnej siatki 3×3
        const grid = document.createElement("div"); // Tworzy kontener siatki
        grid.className = "grid3";                   // Klasa CSS definiuje siatkę 3×3

        grid.appendChild(this.createBox("Kamil", 1, 1)); // Kafelek "Kamil" – wiersz 1, kolumna 1 (lewy górny)
        grid.appendChild(this.createBox("Suchy", 2, 2)); // Kafelek "Suchy" – wiersz 2, kolumna 2 (środek)
        grid.appendChild(this.createBox("1",     3, 3)); // Kafelek "1"     – wiersz 3, kolumna 3 (prawy dolny)

        this.container.appendChild(grid); // Wstawia siatkę do kontenera na stronie
    }

    layoutY() {
        // Układ Y: trzy kafelki w jednym wierszu (poziomy pas w środku siatki 3×3)
        const grid = document.createElement("div");
        grid.className = "grid3";

        grid.appendChild(this.createBox("Kamil", 2, 1)); // wiersz 2, kolumna 1
        grid.appendChild(this.createBox("Suchy", 2, 2)); // wiersz 2, kolumna 2
        grid.appendChild(this.createBox("1",     2, 3)); // wiersz 2, kolumna 3

        this.container.appendChild(grid);
    }

    layoutZ() {
        // Układ Z: cztery kafelki w narożnikach siatki 4×4
        const grid = document.createElement("div");
        grid.className = "grid4"; // Klasa CSS definiuje siatkę 4×4

        grid.appendChild(this.createBox("Kamil", 1, 1)); // lewy górny narożnik
        grid.appendChild(this.createBox("Suchy", 1, 2)); // drugi od lewej w górnym wierszu
        grid.appendChild(this.createBox("1",     4, 3)); // trzecia kolumna, dolny wiersz
        grid.appendChild(this.createBox("2",     4, 4)); // prawy dolny narożnik

        this.container.appendChild(grid);
    }
}

class Controller {
    // Klasa Controller obsługuje przyciski i deleguje renderowanie do Presentera.
    // Oddziela logikę zdarzeń (kliknięcia) od logiki wyświetlania.

    constructor(buttons, container) {
        this.presenter = new Presenter(container); // Tworzy Presenter dla tego zestawu przycisków
        this.init(buttons);                        // Rejestruje obsługę kliknięć na przekazanych przyciskach
    }

    init(buttons) {
        buttons.forEach(button => {                     // Iteruje po każdym przycisku z NodeList
            button.addEventListener("click", (e) => {   // Nasłuchuje zdarzenia "click"
                this.buttonClicked(e.target.dataset.layout); // Odczytuje atrybut data-layout klikniętego przycisku
            });
        });
    }

    buttonClicked(layout) {
        this.presenter.showLayout(layout); // Przekazuje nazwę układu do Presentera
    }
}

// Tworzenie pierwszej pary: przyciski z #pair1, kontener #layout1
new Controller(
    document.querySelectorAll("#pair1 button"), // Pobiera wszystkie przyciski wewnątrz #pair1
    document.getElementById("layout1")          // Pobiera kontener dla pierwszej pary
);

// Tworzenie drugiej, niezależnej pary: przyciski z #pair2, kontener #layout2
new Controller(
    document.querySelectorAll("#pair2 button"),
    document.getElementById("layout2")
);
// Obie instancje Controller działają niezależnie – kliknięcie w Parze 1 nie wpływa na Parę 2
```
