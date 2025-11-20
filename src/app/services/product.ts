import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ProductModel } from '../../model/Product';

@Injectable({
  providedIn: 'root',
})
export class Product {

  PRODUCTS_API_URL: string = environment.API_URL;
  private products: any = [];
  constructor(private http: HttpClient) {
    this.getAllProducts();
  }

  options = new HttpHeaders({ 'Content-Type': 'application/json' });


  getAllProducts(): Observable<ProductModel[]> {

    return this.http.get<ProductModel[]>(this.PRODUCTS_API_URL).pipe(
      tap((data: any) => console.log('Data Fetched:' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  addProduct(product: ProductModel): Observable<any> {
    console.log("adding service..");

    return this.http
      .post(this.PRODUCTS_API_URL, product, {
        headers: this.options,
      })
      .pipe(catchError(this.handleError));
  }


  updateProduct(product: ProductModel): Observable<any> {
    // const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("updating service..");

    return this.http
      .put<any>(`${this.PRODUCTS_API_URL}/${product.id}`, product, {
        headers: this.options,
      })
      .pipe(
        tap((_: any) => console.log(`updated ProductModel id=${product.id}`)),
        catchError(this.handleError)
      );
  }
  deleteProduct(customerId: number): Observable<any> {
    console.log("deleting service..");
    console.log(`${this.PRODUCTS_API_URL}/${customerId}`);

    const url = `${this.PRODUCTS_API_URL}/${customerId}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }
  private handleError(err: HttpErrorResponse): Observable<any> {
    let errMsg = '';
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', err.error.message);
      errMsg = err.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(`Backend returned code ${err.status}`);
      errMsg = err.error.status;
    }
    return throwError(() => errMsg);
  }

}