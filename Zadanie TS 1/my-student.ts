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
