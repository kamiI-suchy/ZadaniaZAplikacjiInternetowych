# Ogólne wytłumaczenie – jak działa kod we wszystkich zadaniach

Ten plik zawiera skrótowy opis mechanizmów technicznych użytych w każdym zadaniu
bez wchodzenia w szczegóły linijka po linijce (te znajdziesz w plikach `WYJASNIENIE.md`
w każdym folderze zadania).

---

## Zadanie JS 1 – Wzorzec MVP (Model-View-Presenter) z CSS Grid

### Jak działa
Strona zawiera dwie niezależne pary przycisków + kontener.
Każda para jest obsługiwana przez oddzielne obiekty `Controller` i `Presenter`.

```
Użytkownik klika przycisk A/B/C
        ↓
Controller.buttonClicked(layout)
        ↓
Presenter.showLayout(layout)
        ↓
Presenter czyści kontener (innerHTML = "")
        ↓
Presenter tworzy <div class="grid3/grid4"> i kafelki <div class="box">
        ↓
Kafelki są umieszczone w siatce CSS Grid na określonych pozycjach (gridRow/gridColumn)
        ↓
Układ X / Y / Z pojawia się na stronie
```

### Kluczowe koncepcje
| Technologia | Zastosowanie |
|---|---|
| **Klasy ES6** | `class Controller` i `class Presenter` – podział odpowiedzialności |
| **data-layout** | Atrybut HTML niosący informację o układzie do JS bez dodatkowych zmiennych globalnych |
| **CSS Grid** | `grid-template-columns/rows` + `grid-row/grid-column` – precyzyjne pozycjonowanie kafelków |
| **innerHTML = ""** | Czyści DOM przed rysowaniem nowego układu |
| **querySelectorAll** | Pobiera wiele elementów naraz jako NodeList, po której można iterować `forEach` |

---

## Zadanie JS 2 – Bootstrap 5 (biblioteka CSS/JS)

### Jak działa
Strona HTML importuje Bootstrap z CDN. Bootstrap dostarcza gotowe klasy CSS i skrypty JS.
Wystarczy dodać odpowiednie klasy do elementów HTML, a Bootstrap automatycznie je ostyluje.

```
Przeglądarka ładuje stronę
        ↓
Pobiera Bootstrap CSS z CDN (cdn.jsdelivr.net)
        ↓
Parsuje HTML – klasy Bootstrap (np. btn-primary, alert) są dopasowywane do reguł CSS
        ↓
Pobiera Bootstrap JS bundle (zawiera też Popper.js)
        ↓
Bootstrap JS inicjalizuje interaktywne komponenty:
– Modal (data-bs-toggle="modal")
– Accordion (data-bs-toggle="collapse")
– Dropdown (data-bs-toggle="dropdown")
– Offcanvas (data-bs-toggle="offcanvas")
        ↓
Strona jest w pełni stylizowana i interaktywna
```

### Kluczowe koncepcje
| Technologia | Zastosowanie |
|---|---|
| **CDN** | Pliki CSS/JS Bootstrapa pobierane z zewnętrznych serwerów – bez instalacji lokalnej |
| **Klasy narzędziowe** | `mb-4`, `py-3`, `me-2` – margin/padding bez pisania własnego CSS |
| **data-bs-\*** | Atrybuty HTML aktywujące zachowanie Bootstrap JS (np. toggle, target, dismiss) |
| **Komponenty** | Gotowe struktury HTML (Card, Modal, Navbar) działające po dodaniu klas Bootstrap |

---

## Zadanie JS 3 – Canvas 2D z gradientem i krzywymi Béziera

### Jak działa
JavaScript rysuje inicjały K i S na elemencie `<canvas>` przy użyciu kontekstu 2D.
Inicjały są budowane ze ścieżek (linii i krzywych), a nie z tekstu.

```
Pobierz <canvas> z DOM → utwórz kontekst 2D (getContext("2d"))
        ↓
Utwórz gradient liniowy (createLinearGradient) z 3 zatrzymaniami koloru
        ↓
Ustaw styl linii: lineWidth, lineCap, lineJoin, strokeStyle = gradient
        ↓
Litera K:
    beginPath() → moveTo/lineTo (3 odcinki) → stroke()
        ↓
Litera S:
    beginPath() → moveTo → 2× bezierCurveTo → stroke()
```

### Kluczowe koncepcje
| API | Opis |
|---|---|
| **getContext("2d")** | Tworzy obiekt `CanvasRenderingContext2D` z wszystkimi metodami rysowania |
| **beginPath()** | Czyści bieżącą ścieżkę – konieczne przed rysowaniem nowej figury |
| **moveTo(x, y)** | Przesuwa „wirtualne pióro" bez rysowania |
| **lineTo(x, y)** | Rysuje prostą linię od bieżącej pozycji pióra do (x,y) |
| **bezierCurveTo(cx1,cy1,cx2,cy2,x,y)** | Rysuje gładką krzywą trzeciego stopnia z dwoma punktami kontrolnymi |
| **stroke()** | Rysuje całą skonstruowaną ścieżkę na ekranie z aktualnym stylem (`strokeStyle`) |
| **createLinearGradient** | Gradient wzdłuż prostej linii; `addColorStop` dodaje przejście koloru |

---

## Zadanie JS 4 – WebGL z punktami (gl.POINTS)

### Jak działa
WebGL to niskopoziomowe API graficzne 3D/2D oparte na OpenGL ES.
Rysowanie odbywa się na GPU za pomocą małych programów zwanych **shaderami** (GLSL).
Inicjały są zbudowane z wielu blisko rozmieszczonych punktów (`gl.POINTS`).

```
Inicjalizacja:
    getContext("webgl") → utwórz shadery GLSL → skompiluj → zlinkuj w program GPU
        ↓
Przygotowanie danych:
    Oblicz punkty inicjałów (addLine = interpolacja liniowa punktów)
    → Float32Array (tablica bajtów, format GPU)
        ↓
Przesył danych do GPU:
    createBuffer → bindBuffer → bufferData (JS → pamięć GPU)
        ↓
Konfiguracja atrybutów:
    vertexAttribPointer (opisuje jak czytać bufor: x,y,size co 12 bajtów)
    enableVertexAttribArray (aktywuje atrybut)
        ↓
Ustawienie uniformu:
    uniform4f (kolor zielony dla wszystkich punktów)
        ↓
Rysowanie:
    clearColor + clear (czarne tło) → drawArrays(gl.POINTS, ...) (każdy punkt = kwadrat)
```

### Kluczowe koncepcje
| Pojęcie | Opis |
|---|---|
| **Vertex Shader** | Program GLSL uruchamiany dla każdego wierzchołka; ustawia `gl_Position` i `gl_PointSize` |
| **Fragment Shader** | Program GLSL uruchamiany dla każdego piksela; ustawia `gl_FragColor` |
| **attribute** | Zmienna wejściowa shadera – różna dla każdego wierzchołka (pozycja, rozmiar) |
| **uniform** | Zmienna stała dla całego wywołania drawArrays (kolor) |
| **VBO (Vertex Buffer Object)** | Bufor pamięci GPU przechowujący dane wierzchołków |
| **stride i offset** | Opisują układ danych w buforze: co ile bajtów jest następny wierzchołek i gdzie zaczyna się atrybut |
| **gl.POINTS** | Tryb rysowania: każdy wierzchołek = osobny kwadratowy punkt o rozmiarze `gl_PointSize` |
| **Float32Array** | Tablica JS przechowująca 32-bitowe liczby zmiennoprzecinkowe (format natywny GPU) |
| **CORS przy file://** | Przeglądarka blokuje importy modułów ES6 gdy plik otwierany jest bezpośrednio (file://); rozwiązanie: lokalny serwer HTTP |

---

## Zadanie JS 5 – Express.js (serwer HTTP z middleware)

### Jak działa
Express to framework dla Node.js upraszczający tworzenie serwerów HTTP.
Serwer obsługuje trasy (routes) z dynamicznymi parametrami URL i łańcuchami middleware.

```
node server.mjs → app.listen(3000) → serwer czeka na połączenia
        ↓
Klient wysyła: GET /user/suchy/book/1
        ↓
Express dopasowuje trasę: /user/:userid/book/:bookid
        ↓
1. Middleware #1: loguje userId i bookId na konsoli
   → sprawdza: czy userid === "suchy"?
        ↓ TAK                            ↓ NIE
   res.locals.userData = {...}        next(403)
   next()                                  ↓
        ↓                        Error handler: res.status(403).send("My error")
   Middleware #2: wysyła odpowiedź
   res.send("My user=suchy and My Book=1")
```

### Kluczowe koncepcje
| Pojęcie | Opis |
|---|---|
| **app.get(path, handler)** | Rejestruje obsługę żądania GET pod podaną ścieżką |
| **:param** | Dynamiczny segment URL; wartość dostępna przez `req.params.param` |
| **Middleware** | Funkcja `(req, res, next)` – przetwarza żądanie i przekazuje je dalej przez `next()` |
| **next()** | Bez argumentu: przekazuje do następnego handlera tej samej trasy |
| **next(err)** | Z argumentem: pomija normalne handlery i przeskakuje do error handlera |
| **Error handler** | Funkcja `(err, req, res, next)` z 4 parametrami – obsługuje błędy przekazane przez `next(err)` |
| **res.locals** | Obiekt do przekazywania danych między handlerami w ramach jednego żądania |
| **res.status(code)** | Ustawia kod statusu HTTP odpowiedzi (np. 403 = Forbidden) |
| **ES Module (.mjs)** | `import` zamiast `require` – nowoczesny system modułów JavaScript |

---

## Zadanie PHP 1 – PHP + MySQL (skrypt CGI z bazą danych)

### Jak działa
Serwer Apache uruchamia skrypt PHP dla każdego żądania HTTP.
PHP łączy się z MySQL, wykonuje zapytanie SQL i generuje HTML odesłany do przeglądarki.

```
Przeglądarka: GET /index.php?id=1
        ↓
Apache uruchamia interpreter PHP z plikiem index.php
        ↓
PHP sprawdza $_GET['id']:
    – brak id        → echo "Missing id" + exit
    – id nie jest liczbą → echo "Invalid id" + exit
        ↓
PHP łączy się z MySQL (new mysqli(...))
        ↓
Wykonuje: SELECT * FROM MyTable WHERE id = 1
        ↓
Pobiera wiersz: fetch_assoc() → tablica asocjacyjna
        ↓
PHP generuje HTML z danymi rekordu:
    echo "<div>Imię <b>$name</b></div>"
        ↓
Apache odsyła wygenerowany HTML do przeglądarki
        ↓
Przeglądarka wyświetla stronę z danymi osoby
```

### Kluczowe koncepcje
| Pojęcie | Opis |
|---|---|
| **$_GET / $_REQUEST** | Superglobalne tablice PHP z parametrami URL |
| **filter_var + FILTER_SANITIZE_NUMBER_INT** | Usuwa niebezpieczne znaki – ochrona przed SQL injection |
| **filter_var + FILTER_VALIDATE_INT** | Sprawdza czy wartość jest poprawną liczbą całkowitą |
| **new mysqli(...)** | Tworzy połączenie z bazą MySQL (rozszerzenie MySQLi = MySQL Improved) |
| **$db->query($sql)** | Wykonuje zapytanie SQL; zwraca `MySQLi_Result` lub `false` |
| **fetch_assoc()** | Pobiera jeden wiersz wyniku jako tablicę asocjacyjną (klucz = nazwa kolumny) |
| **?? operator** | Null coalescing: `$x ?? 'domyślna'` – zwraca wartość lub domyślną jeśli null |
| **AUTO_INCREMENT** | MySQL automatycznie nadaje kolejne wartości id przy INSERT |
| **DEFAULT CURRENT_TIMESTAMP** | Pole Added wypełniane automatycznie aktualną datą i czasem |
