# Wytłumaczenie kodu – Zadanie JS 2

Zadanie polega na umieszczeniu 15 różnych komponentów frontendowych z biblioteki
Bootstrap na jednej stronie HTML, ponumerowanych i zawierających imię i nazwisko.

---

## Plik: `index.html`

### Sekcja `<head>`

```html
<!DOCTYPE html>                         <!-- Deklaracja standardu HTML5 -->
<html lang="pl">                        <!-- Korzeń dokumentu; lang="pl" – język polski -->
<head>
    <meta charset="UTF-8">             <!-- Kodowanie UTF-8 – obsługa polskich znaków -->
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <!-- Metatag viewport: strona nie jest powiększana na urządzeniach mobilnych -->

    <title>Zadanie JS 2</title>        <!-- Tytuł w zakładce przeglądarki -->

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
          rel="stylesheet">
    <!-- Importuje arkusz CSS Bootstrapa 5.3.8 z CDN (sieci dystrybucji treści).
         CDN oznacza, że plik jest pobierany z zewnętrznych serwerów – nie ma potrzeby
         instalowania Bootstrapa lokalnie. -->
</head>
```

### Sekcja `<body>`

```html
<body class="bg-light">
<!-- bg-light – klasa Bootstrap ustawiająca jasne szare tło strony -->

    <main class="container py-4">
    <!-- container – Bootstrap ogranicza szerokość i centruje treść -->
    <!-- py-4    – padding pionowy (góra i dół) = 4 jednostki Bootstrapa (~1.5rem) -->

        <h1 class="mb-4">15 komponentów frontendowych — Kamil Suchy</h1>
        <!-- mb-4 – margin-bottom = 4 jednostki; nagłówek z odstępem od reszty -->
```

### Komponenty (1–15)

Każdy komponent jest zawarty w `<section class="mb-3">` — sekcja z małym dolnym odstępem.

```html
<!-- 1. Alert -->
<div class="alert alert-primary">To jest alert.</div>
<!-- alert         – klasa Bootstrap tworząca kolorowe powiadomienie -->
<!-- alert-primary – niebieski wariant alertu -->

<!-- 2. Badge -->
<span class="badge text-bg-success">Nowość</span>
<!-- badge         – małe oznaczenie (np. liczba powiadomień) -->
<!-- text-bg-success – zielone tło i biały tekst (kontrast Bootstrap 5) -->

<!-- 3. Breadcrumb -->
<ol class="breadcrumb">
    <li class="breadcrumb-item">Start</li>
    <li class="breadcrumb-item active">Profil</li>
</ol>
<!-- Ścieżka nawigacyjna; active oznacza aktualną stronę -->

<!-- 4. Buttons -->
<button class="btn btn-primary me-2">Akcja</button>
<button class="btn btn-outline-secondary">Anuluj</button>
<!-- btn            – bazowa klasa przycisku Bootstrap -->
<!-- btn-primary    – pełny niebieski przycisk -->
<!-- btn-outline-secondary – przycisk z obwódką (bez wypełnienia) -->
<!-- me-2           – margin-end (prawy) = 2 jednostki, odstęp między przyciskami -->

<!-- 5. Button group -->
<div class="btn-group">
    <button class="btn btn-outline-dark">Lewo</button>
    <button class="btn btn-outline-dark">Środek</button>
    <button class="btn btn-outline-dark">Prawo</button>
</div>
<!-- btn-group – grupuje przyciski bez przerw; obwódki łączą się w jeden pasek -->

<!-- 6. Card -->
<div class="card">
    <div class="card-body">Treść karty: Kamil Suchy.</div>
</div>
<!-- card      – kontener z cieniem i ramką -->
<!-- card-body – wewnętrzny padding zawartości -->

<!-- 7. Accordion -->
<div class="accordion" id="acc1">
    <div class="accordion-item">
        <h3 class="accordion-header">
            <button class="accordion-button"
                    data-bs-toggle="collapse"
                    data-bs-target="#c1">Pokaż</button>
            <!-- data-bs-toggle="collapse" – Bootstrap JS obsługuje zwijanie/rozwijanie -->
            <!-- data-bs-target="#c1"      – wskazuje element do zwijania -->
        </h3>
        <div id="c1" class="accordion-collapse collapse show"
             data-bs-parent="#acc1">
            <!-- collapse show – sekcja domyślnie rozwinięta -->
            <!-- data-bs-parent – zamyka inne sekcje akordeonu przy otwieraniu tej -->
            <div class="accordion-body">Zawartość akordeonu.</div>
        </div>
    </div>
</div>

<!-- 8. Dropdown -->
<div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle"
            data-bs-toggle="dropdown">Menu</button>
    <!-- dropdown-toggle – dodaje strzałkę; data-bs-toggle="dropdown" uruchamia listę -->
    <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Profil</a></li>
        <li><a class="dropdown-item" href="#">Ustawienia</a></li>
    </ul>
</div>

<!-- 9. List group -->
<ul class="list-group">
    <li class="list-group-item">Element 1</li>
    <li class="list-group-item">Element 2</li>
</ul>
<!-- Stylizowana lista z obwódkami – zastępuje domyślne punktory -->

<!-- 10. Modal -->
<button class="btn btn-warning"
        data-bs-toggle="modal"
        data-bs-target="#m1">Otwórz modal</button>
<!-- data-bs-toggle="modal" + data-bs-target="#m1" – Bootstrap JS otwiera okno modalne o id m1 -->

<div class="modal fade" id="m1" tabindex="-1">
    <!-- fade     – efekt przenikania przy pojawianiu się -->
    <!-- tabindex="-1" – element nie jest dostępny przez Tab (tylko przez modal) -->
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title fs-5">Modal</h3>
                <button class="btn-close" data-bs-dismiss="modal"></button>
                <!-- btn-close + data-bs-dismiss="modal" – przycisk zamykający modal (×) -->
            </div>
            <div class="modal-body">Modal użytkownika: Kamil Suchy.</div>
        </div>
    </div>
</div>

<!-- 11. Navbar -->
<nav class="navbar navbar-expand-lg bg-body-tertiary border rounded px-2">
    <!-- navbar-expand-lg – menu jest rozwinięte na ekranach ≥ lg; na mniejszych chowane -->
    <!-- bg-body-tertiary – tło dopasowane do motywu strony -->
    <!-- border rounded   – ramka z zaokrąglonymi narożnikami -->
    <a class="navbar-brand" href="#">KS</a>
    <!-- navbar-brand – logo/nazwa w navbarze -->
    <div class="navbar-nav">
        <a class="nav-link active" href="#">Start</a>  <!-- active – podświetla aktywną stronę -->
        <a class="nav-link" href="#">Kontakt</a>
    </div>
</nav>

<!-- 12. Offcanvas (panel boczny) -->
<button class="btn btn-info"
        data-bs-toggle="offcanvas"
        data-bs-target="#o1">Otwórz panel</button>
<div class="offcanvas offcanvas-start" id="o1">
    <!-- offcanvas-start – panel wysuwa się z lewej strony ekranu -->
    <div class="offcanvas-header">
        <h3 class="offcanvas-title fs-5">Offcanvas</h3>
        <button class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">Panel boczny — Kamil Suchy.</div>
</div>

<!-- 13. Pagination -->
<ul class="pagination">
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active"><a class="page-link" href="#">2</a></li>
    <!-- active – strona 2 jest aktualnie zaznaczona -->
    <li class="page-item"><a class="page-link" href="#">3</a></li>
</ul>

<!-- 14. Progress bar -->
<div class="progress">
    <div class="progress-bar w-75">75%</div>
    <!-- w-75 – szerokość paska = 75% kontenera; Bootstrap oblicza to przez CSS -->
</div>

<!-- 15. Spinner -->
<div class="spinner-border text-danger" role="status"></div>
<!-- spinner-border – animowany okrągły wskaźnik ładowania -->
<!-- text-danger    – kolor czerwony -->
<!-- role="status"  – dostępność: czytnik ekranu interpretuje jako element statusu -->
```

### Koniec `<body>`

```html
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Skrypt JS Bootstrapa ładowany NA KOŃCU body (po całym HTML).
         bootstrap.bundle.min.js zawiera zarówno Bootstrap JS, jak i bibliotekę Popper.js
         (potrzebną do dropdownów, tooltipów itp.).
         Umieszczenie na końcu gwarantuje, że DOM jest gotowy przed wykonaniem skryptu. -->
</body>
</html>
```
