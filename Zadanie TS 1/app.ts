import { Component, signal } from '@angular/core';
import { MyStudent } from './my-student';
import { UpperCasePipe, LowerCasePipe, CurrencyPipe } from '@angular/common';
import { MyBuilding } from './my-building';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MyStudent, UpperCasePipe, LowerCasePipe, CurrencyPipe],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    protected readonly title = 'simple-app';

    protected myData = {
        name: "Kamil",
        surname: "Suchy"
    };

    protected vBuildings = [
        new MyBuilding(7, "Blue house"),
        new MyBuilding(12, "Village house"),
        new MyBuilding(24, "Apartment")
    ];
    protected selectedBuilding?: MyBuilding;

    protected bToggle = false;

    protected myCount = signal(0);

    onMyToggle() {
        this.bToggle = !this.bToggle;

        this.myCount.set(this.myCount() + 1);
    }

    constructor() {
        this.selectedBuilding = this.vBuildings[0];
    }
}
