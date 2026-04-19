# Wytłumaczenie kodu – Zadanie JS 5 (Express)

Zadanie polega na stworzeniu serwera HTTP z użyciem frameworka **Express.js**.
Serwer sprawdza, czy w URL przekazano właściwy `userid` — jeśli tak, zwraca odpowiedź 200;
jeśli nie, zwraca błąd 403.

---

## Plik: `server.mjs`

```javascript
import express from 'express';
// Importuje framework Express z zainstalowanego pakietu npm.
// Rozszerzenie .mjs oznacza moduł ES6 (zamiast CommonJS require).

const
    app  = express(), // Tworzy instancję aplikacji Express – główny obiekt serwera
    port = 3000;      // Numer portu, na którym będzie nasłuchiwał serwer

// ── Trasa GET / ───────────────────────────────────────────────────────────────
app.get('/',
    (req, res) => res.send('From MyApp')
)
// app.get(ścieżka, handler) – rejestruje obsługę żądania GET pod podaną ścieżką.
// req  – obiekt żądania (Request): zawiera dane od klienta (URL, nagłówki, parametry)
// res  – obiekt odpowiedzi (Response): metody do wysyłania odpowiedzi klientowi
// res.send('From MyApp') – wysyła tekst jako odpowiedź HTTP 200

// ── Middleware logujące dla /about ────────────────────────────────────────────
app.get('/about',
    (req, res, next) => {
        console.log('%s %s - %s', (new Date).toString(), req.method, req.url),
        // Loguje na konsolę serwera: datę, metodę HTTP (GET) i URL żądania
        next()
        // next() – przekazuje sterowanie do NASTĘPNEGO handlera dla tej trasy.
        // Bez wywołania next() żądanie „utknęłoby" w tym middleware.
    }
)
// Middleware – pośredni handler, który nie wysyła odpowiedzi, tylko przetwarza żądanie.

app.get('/about',
    (req, res) => res.send('My About')
)
// Drugi handler dla /about – wysyła faktyczną odpowiedź (po wywołaniu next() wyżej).

// ── Trasa /about/contact ──────────────────────────────────────────────────────
app.get('/about/contact',
    (req, res) => res.send('My Contact')
)
// Prosta trasa zwracająca tekst kontaktowy.

// ── Serwowanie plików statycznych ─────────────────────────────────────────────
app.use('myStorage', express.static('myimages'))
// express.static('myimages') – udostępnia pliki z folderu myimages pod ścieżką /myStorage.
// np. http://localhost:3000/myStorage/photo.jpg → plik myimages/photo.jpg

// ── Trasa z parametrami: /user/:userid/book/:bookid ───────────────────────────
app.get('/user/:userid/book/:bookid', (req, res, next) => {
    // :userid i :bookid – parametry URL (dynamiczne fragmenty ścieżki)

    const aUserId = req.params.userid?.toLowerCase(),
    // req.params.userid – wartość parametru z URL (np. "Suchy" → "suchy")
    // ?.toLowerCase()   – opcjonalne chainowanie; konwertuje na małe litery (case-insensitive)
          aBookId = req.params.bookid
    // req.params.bookid – wartość parametru bookid (np. "1")

    console.log(`UserID=${aUserId}`)  // Loguje odebrany userId na konsoli serwera
    console.log(`BookID=${aBookId}`)  // Loguje odebrany bookId na konsoli serwera

    if ('suchy' !== aUserId) {
        // Sprawdza czy userid to "suchy" (nazwisko autora)
        next(403)  // Przekazuje błąd 403 do handlera błędów (app.use niżej)
        return     // Kończy wykonanie tego handlera (nie wywołuje res.send)
    }

    res.locals.userData = {
        UserID: aUserId,
        BookID: aBookId
    }
    // res.locals – obiekt do przechowywania danych między handlerami dla tego żądania.
    // Dane zapisane tutaj są dostępne w następnym handlerze tej samej trasy.

    next();
    // Wywołuje następny handler (poniżej), który wyśle odpowiedź.
    // Nie przekazujemy kodu błędu → następny handler jest normalny, nie error handler.
})

// ── Drugi handler dla /user/:userid/book/:bookid ──────────────────────────────
app.get('/user/:userid/book/:bookid',
    (req, res) => {
        const userData = res.locals.userData;
        // Odczytuje dane zapisane przez poprzedni middleware

        res.send(`My user=${userData.UserID} and My Book=${userData.BookID}`)
        // Wysyła odpowiedź tekstową z danymi użytkownika i książki (HTTP 200)
    }
)

// ── Globalny handler błędów ───────────────────────────────────────────────────
app.use(function (err, req, res, next) {
    // Handler z 4 parametrami (err, req, res, next) – Express rozpoznaje to jako error handler.
    // Jest wywoływany gdy gdziekolwiek w kodzie wywołano next(err) z wartością błędu.
    res.status(err).send('My error')
    // res.status(err) – ustawia kod statusu HTTP na wartość przekazaną do next() (np. 403)
    // .send('My error') – wysyła tekst "My error" z tym kodem statusu
})

// ── Uruchomienie serwera ──────────────────────────────────────────────────────
app.listen(port,
    () => console.log(`MyServer ready on http://localhost:${port}!`)
)
// app.listen(port, callback) – uruchamia serwer HTTP na podanym porcie.
// Callback jest wywoływany jednorazowo gdy serwer jest gotowy do przyjmowania połączeń.
```
