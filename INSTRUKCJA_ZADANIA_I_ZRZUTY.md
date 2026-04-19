# Instrukcja: co zrobić w każdym zadaniu i jakie zrzuty ekranu przygotować

## Zadanie JS 1
**Co zrobić:**
- Utworzyć klasy `Controller` i `Presenter`.
- Dla kliknięć A/B/C przełączać układy X/Y/Z.
- Rysować układy z elementów `<div>` (bez `<canvas>`).
- W divach umieścić imię i nazwisko.
- Umożliwić utworzenie wielu par Controller+Presenter (z własnym zestawem przycisków i kontenerem).

**Co wysłać (dowody):**
- Kod źródłowy.
- Film z działania.

**Weryfikacja w repo:**
- Jest `Controller` i `Presenter`, działają układy X/Y/Z.
- Są 2 niezależne instancje par Controller+Presenter.
- W divach są dane: „Kamil”, „Suchy”.

---

## Zadanie JS 2
**Co zrobić:**
- Umieścić 15 różnych komponentów frontendowych (np. Bootstrap) na jednej stronie.
- Ponumerować komponenty.
- W każdym komponencie wpisać imię i nazwisko.

**Co wysłać (dowody):**
- Zrzuty ekranu strony **lub** działająca strona (bez pakowania plików).

**Weryfikacja w repo:**
- Jest 15 komponentów, ponumerowanych 1–15.
- W komponentach występuje imię i nazwisko.

---

## Zadanie JS 3
**Co zrobić:**
- Narysować inicjały na `<canvas>`.
- Użyć ścieżek (`beginPath()`), a nie tekstu (`fillText`, `strokeText`).
- Ustawić styl linii jako gradient.

**Co wysłać (dowody):**
- Zrzut ekranu z przeglądarki (widoczne inicjały).
- Zrzut ekranu kodu realizującego zadanie (lub plik txt z kodem).

**Weryfikacja w repo:**
- Inicjały rysowane przez `beginPath` i krzywe/linie.
- Gradient linii ustawiony i użyty.

---

## Zadanie JS 4 (WebGL)
**Co zrobić:**
- Z wykorzystaniem WebGL wyrysować swoje inicjały **z kropek**.

**Co wysłać (dowody):**
- Zrzut ekranu wyrenderowanych inicjałów.
- Zrzut ekranu fragmentu kodu renderowania z kropek.

**Błąd CORS, który widziałeś – co oznacza:**
- Otwierasz plik przez `file://`, a moduł JS (`MyWebGL.js`) też jest ładowany jak lokalny plik.
- Dla `file://` przeglądarka traktuje pliki jako osobne originy i blokuje importy modułów (CORS).

**Jak uruchomić poprawnie:**
1. Wejdź do folderu: `/home/runner/work/ZadaniaZAplikacjiInternetowych/ZadaniaZAplikacjiInternetowych/Zadanie JS 4/Kod z pliku PDF`
2. Uruchom lokalny serwer HTTP, np.:
   - `python -m http.server 8000`
   - albo rozszerzenie **Live Server** w VS Code
3. Otwórz w przeglądarce: `http://localhost:8000/index.html`

**Weryfikacja w repo:**
- Inicjały są budowane z punktów (`gl.POINTS`) i renderowane poprawnie.

---

## Zadanie JS 5 (Express)
**Co zrobić:**
- Zmodyfikować przykład middleware tak, by poprawna odpowiedź była dla URL z nazwiskiem (`userid`).
- Dla innej wartości `userid` zwracać błąd 403.

**Jak uruchomić:**
1. Upewnij się, że masz zainstalowane **Node.js** (https://nodejs.org/, wersja 18+).
2. Wejdź do folderu zadania:
   ```
   cd "Zadanie JS 5/Kod z pliku PDF"
   ```
3. Zainicjuj projekt i zainstaluj Express:
   ```
   npm init -y
   npm install express
   ```
4. Uruchom serwer:
   ```
   node server.mjs
   ```
   Konsola powinna wypisać: `MyServer ready on http://localhost:3000!`
5. Otwórz w przeglądarce:
   - Poprawny przypadek (kod 200): `http://localhost:3000/user/suchy/book/1`
   - Błędny przypadek (kod 403): `http://localhost:3000/user/inny/book/1`
6. Zatrzymaj serwer skrótem **Ctrl + C**.

**Co wysłać (dowody):**
- Zrzut URL z nazwiskiem + poprawna odpowiedź w przeglądarce.
- Zrzut konsoli serwera dla powyższego przypadku.
- Zrzut URL z inną wartością + wynik w przeglądarce.
- Zrzut konsoli serwera dla błędnego przypadku (widoczne odebrane parametry).
- Zrzut fragmentów kodu, które były zmieniane.

**Weryfikacja w repo:**
- Dla `userid = suchy` przechodzi middleware i zwraca poprawną odpowiedź.
- Dla innej wartości zwraca 403.

---

## Zadanie PHP 1 (PHP + MySQL)
**Co zrobić:**
- Utworzyć tabelę i dodać min. 4 rekordy (w tym własne imię i nazwisko).
- W przeglądarce wywołać skrypt PHP z `id` wskazującym swój rekord oraz inny rekord.

**Jak uruchomić:**
1. Zainstaluj **XAMPP** (https://www.apachefriends.org/) i uruchom moduły **Apache** oraz **MySQL** z panelu XAMPP Control Panel.
2. Zaimportuj bazę danych — w wierszu poleceń:
   ```
   mysql -u root -p < "Zadanie PHP 1/Kod z pliku PDF/setup.sql"
   ```
   (hasło root w XAMPP domyślnie jest puste — wciśnij Enter)  
   Alternatywnie: otwórz **phpMyAdmin** (`http://localhost/phpmyadmin`), wybierz zakładkę „Import” i wskaż plik `setup.sql`.
3. Skopiuj folder `Zadanie PHP 1/Kod z pliku PDF/` do katalogu `C:\\xampp\\htdocs\\php1\\` (Windows) lub `/opt/lampp/htdocs/php1/` (Linux/Mac).
4. Otwórz w przeglądarce:
   - Własny rekord (Kamil Suchy, id=1): `http://localhost/php1/index.php?id=1`
   - Inny rekord: `http://localhost/php1/index.php?id=2`
5. Sprawdź tabelę w phpMyAdmin: baza `MyDB`, tabela `MyTable`.

**Co wysłać (dowody):**
- Zrzut tabeli z rekordami.
- Zrzut URL + wynik strony dla własnego rekordu.
- Zrzut URL + wynik strony dla innego rekordu.
- Zrzut kodu PHP.

**Weryfikacja w repo:**
- `setup.sql` tworzy bazę/tabelę i dodaje 4 rekordy (w tym „Kamil Suchy”).
- `index.php` pobiera `id`, waliduje i wyświetla dane rekordu.

---

## Krótka checklista przed oddaniem
- [ ] Zadanie JS 1: kod + film działania.
- [ ] Zadanie JS 2: zrzuty 15 komponentów (lub działająca strona).
- [ ] Zadanie JS 3: zrzut inicjałów + zrzut kodu.
- [ ] Zadanie JS 4: uruchomione przez HTTP, zrzut inicjałów + zrzut kodu renderowania kropek.
- [ ] Zadanie JS 5: 2 scenariusze (poprawny i 403) + zrzuty przeglądarki i konsoli.
- [ ] Zadanie PHP 1: zrzut tabeli + 2 URL-e + zrzut kodu PHP.
