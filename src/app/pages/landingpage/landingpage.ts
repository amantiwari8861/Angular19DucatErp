import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-landingpage',
  imports: [CommonModule, FormsModule],
  templateUrl: './landingpage.html',
  styleUrl: './landingpage.css',
})
export class Landingpage {
  name: string = ''

  validateInp(e: any) {
    console.log(e);
    console.log(e?.target);
    e.target.style.backgroundColor = "greenyellow"
    console.log(e?.target?.value);
  }
}
