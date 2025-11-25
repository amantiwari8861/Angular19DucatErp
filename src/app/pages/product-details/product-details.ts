import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModel } from '../../../model/Product';
import { Product } from '../../services/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {

  id!: any;
  loading: boolean = true;
  product!: ProductModel;
  errorMessage!: string;
  constructor(private route: ActivatedRoute, private productService: Product) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    this.getProductById(id);
    console.log('Product ID:', id);
  }

  getProductById(id: any) {
    this.productService.getProductById(id).subscribe({
      next: product => {
        console.log(product);
        this.product = product;
        this.loading = false;

      },
      error: err => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    })
    console.log(this.product);

  }
}
