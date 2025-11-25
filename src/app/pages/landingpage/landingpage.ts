import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Product } from '../../services/product';
import { ProductModel } from '../../../model/Product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './landingpage.html',
  styleUrl: './landingpage.css',
})
export class Landingpage {
  name: string = ''
  errorMessage = '';

  products: ProductModel[] = []

  constructor(private productService: Product) {
    productService.getAllProducts().subscribe({
      next: products => this.products = products,
      error: err => this.errorMessage = err.message
    });
  }

  validateInp(e: any) {
    console.log(e);
    console.log(e?.target);
    e.target.style.backgroundColor = "greenyellow"
    console.log(e?.target?.value);
  }
  getFullStars(rate: number) {
    return Array(Math.round(rate)).fill(0);
  }

  getEmptyStars(rate: number) {
    return Array(5 - Math.round(rate)).fill(0);
  }
}
