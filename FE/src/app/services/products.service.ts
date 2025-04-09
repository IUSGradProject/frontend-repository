import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response';
import { ProductCardInfo } from '../models/product/product.card.info.model';
import { ProductOverview } from '../models/product/product.overview.model';
import { LoV } from '../models/lov.model';
import { ProductBaseInfo } from '../models/product/product.base.info.model';
import { EditProduct } from '../models/product/edit.product.model';
import { FilterRequest } from '../models/filter.request.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:5014/';

  constructor(private http: HttpClient) {}

  getPaginatedProducts(
    page: number,
    pageSize: number,
    filterRequest: FilterRequest
  ): Observable<PaginatedResponse<ProductCardInfo[]>> {
    const params = new HttpParams()
      .set('pageNumber', page)
      .set('pageSize', pageSize)

    return this.http.put<PaginatedResponse<ProductCardInfo[]>>(`${this.baseUrl}Products/All`, filterRequest, { params, withCredentials: true });
  }

  getCategories(): Observable<LoV[]> {
    return this.http.get<LoV[]>(`${this.baseUrl}Attributes/Categories`,  { withCredentials: true});
  }

  getStyles(): Observable<LoV[]> {
    return this.http.get<LoV[]>(`${this.baseUrl}Attributes/Styles`,  { withCredentials: true});
  }

  getBrands(): Observable<LoV[]> {
    return this.http.get<LoV[]>(`${this.baseUrl}Attributes/Brands`,  { withCredentials: true});
  }

  getPowers(): Observable<LoV[]> {
    return this.http.get<LoV[]>(`${this.baseUrl}Attributes/Powers`,  { withCredentials: true});
  }

  getProduct(id: string): Observable<ProductOverview> {
    return this.http.get<ProductOverview>(`${this.baseUrl}Products/${id}`,  { withCredentials: true });
  }

  getProductById(id: string){
    return this.http.get<EditProduct>(`${this.baseUrl}Products/Edit/${id}`,  { withCredentials: true });
  }

  // getProductsBase(
  //   page: number,
  //   pageSize: number
  // ): Observable<PaginatedResponse<ProductBaseInfo[]>>{
  //   const params = new HttpParams()
  //     .set('pageNumber', page)
  //     .set('pageSize', pageSize)

  //   return this.http.get<PaginatedResponse<ProductBaseInfo[]>>(`${this.baseUrl}Products/Base`, { params, withCredentials: true });
  // }

  deleteProduct(id: string){
    return this.http.delete(`${this.baseUrl}Products/${id}`,  { withCredentials: true });
  }

  updateProduct(product: EditProduct){
    return this.http.put(`${this.baseUrl}Products/`, product, { withCredentials: true });
  }

  createProduct(product: EditProduct){
    return this.http.post(`${this.baseUrl}Products/`, product, { withCredentials: true });
  }

  getAllProducts(
    page: number,
    pageSize: number,
  ): Observable<PaginatedResponse<ProductBaseInfo[]>> {
    const params = new HttpParams()
      .set('pageNumber', page)
      .set('pageSize', pageSize)

    return this.http.get<PaginatedResponse<ProductBaseInfo[]>>(`${this.baseUrl}Products/All`, { params, withCredentials: true });
  }

  getDeletedProducts(): Observable<ProductBaseInfo[]> {
    return this.http.get<ProductBaseInfo[]>(`${this.baseUrl}Products/Deleted`, { withCredentials: true });
  }
  
  restoreProduct(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}Products/Restore/${id}`, null, { withCredentials: true });
  }

  getSoldOutProducts(): Observable<ProductBaseInfo[]> {
    return this.http.get<ProductBaseInfo[]>(`${this.baseUrl}Products/soldout`, { withCredentials: true });
  }
  
}
