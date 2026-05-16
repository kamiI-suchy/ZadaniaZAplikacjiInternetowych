# Wytłumaczenie kodu – Zadanie TS 1 (Angular)

Zadanie pokazuje podstawowe mechanizmy Angular:
- komponent główny i komponent potomny,
- przechowywanie danych w klasie komponentu,
- pipe (`lowercase`, `uppercase`, `currency`),
- dyrektywy nowej składni `@for` i `@if`,
- reaktywny stan przez `signal()`,
- binding atrybutu `[disabled]`.

---

## Plik: `app.ts`

```typescript
import { Component, signal } from '@angular/core';
import { MyStudent } from './my-student';
import { UpperCasePipe, LowerCasePipe, CurrencyPipe } from '@angular/common';
import { MyBuilding } from './my-building';
```
- Import dekoratora `Component`, API `signal`, komponentu potomnego, pipe'ów i klasy danych.

```typescript
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MyStudent, UpperCasePipe, LowerCasePipe, CurrencyPipe],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
```
- `selector: 'app-root'` – komponent osadzany jako `<app-root>`.
- `standalone: true` – komponent działa bez `NgModule`.
- `imports` – lista elementów dostępnych w szablonie (`MyStudent` i pipe'y).

```typescript
    protected readonly title = 'simple-app';
```
- Przykładowe pole tekstowe komponentu.

```typescript
    protected myData = {
        name: "Kamil",
        surname: "Suchy"
    };
```
- Obiekt z danymi osoby wyświetlanymi w widoku.

```typescript
    protected vBuildings = [
        new MyBuilding(7, "Blue house"),
        new MyBuilding(12, "Village house"),
        new MyBuilding(24, "Apartment")
    ];
    protected selectedBuilding?: MyBuilding;
```
- Tablica instancji klasy `MyBuilding`.
- `selectedBuilding?` jest opcjonalny i używany w bloku `@if`.

```typescript
    protected bToggle = false;
```
- Flaga logiczna do sterowania atrybutem `[disabled]`.

```typescript
    protected myCount = signal(0);
```
- Reaktywny licznik startujący od 0.

```typescript
    onMyToggle() {
        this.bToggle = !this.bToggle;
        this.myCount.set(this.myCount() + 1);
    }
```
- Metoda kliknięcia:
  - odwraca `bToggle`,
  - zwiększa `myCount` o 1.

```typescript
    constructor() {
        this.selectedBuilding = this.vBuildings[0];
    }
}
```
- Ustawia domyślnie pierwszy element listy jako wybrany.

---

## Plik: `app.html`

```html
<h1>My component</h1>

<div>{{myData.name}}</div>
<div>{{myData.surname}}</div>
```
- Interpolacja `{{ }}` wyświetla dane `name` i `surname`.

```html
<app-my-student></app-my-student>
<app-my-student></app-my-student>
```
- Dwukrotne osadzenie komponentu potomnego.

```html
<div>{{myData.name | lowercase}}</div>
<div>{{myData.name | uppercase}}</div>
```
- Pipe zmieniają wielkość liter w prezentacji danych.

```html
<ul>
    @for (building of vBuildings; track building){
        <li>
            {{building.name}} {{building.price | currency:"PLN"}}
        </li>
    }
</ul>
```
- `@for` iteruje po `vBuildings`.
- `currency:"PLN"` formatuje cenę jako walutę.

```html
@if (selectedBuilding){
<p>
    Wybrany={{selectedBuilding.name}}
</p>
}
```
- `@if` renderuje blok tylko, gdy `selectedBuilding` ma wartość.

```html
<button (click)="onMyToggle()">MyToggle</button>
<h2>Licznik: {{ myCount() }}</h2>
<br/><br/>
<button [disabled]="bToggle">Attribute binding</button>
```
- `(click)` wiąże zdarzenie przycisku z metodą klasy.
- `myCount()` odczytuje aktualną wartość sygnału.
- `[disabled]="bToggle"` dynamicznie ustawia atrybut przycisku.

---

## Plik: `my-student.ts`

```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-my-student',
    standalone: true,
    imports: [],
    templateUrl: './my-student.html',
    styleUrl: './my-student.css'
})
export class MyStudent {
    protected studentName = 'Kamil Suchy';
}
```
- Definicja komponentu potomnego.
- Pole `studentName` jest wyświetlane w jego szablonie.

---

## Plik: `my-student.html`

```html
<p>Komponent potomny działa: {{ studentName }}</p>
```
- Prosty widok potomny z interpolacją danych.

---

## Plik: `my-building.ts`

```typescript
export class MyBuilding {
    constructor(
        public price: number,
        public name: string) { }
}
```
- Klasa modelu danych.
- `public` w konstruktorze automatycznie tworzy właściwości obiektu.

---

## Pliki stylów

### `app.css`
```css
h1 {
    background-color: aqua;
}
```
- Styl nagłówka komponentu głównego.

### `my-student.css`
```css
p {
    margin: 8px 0;
}
```
- Styl akapitu komponentu potomnego.

---

## Podsumowanie
Kod poprawnie demonstruje podstawy Angular:
- kompozycję komponentów,
- wiązanie danych i zdarzeń,
- formatowanie przez pipe,
- control flow (`@for`, `@if`),
- reaktywność przez `signal()`.
