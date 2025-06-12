import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoV } from '../../models/lov.model';
import { MatInputModule, MatLabel } from '@angular/material/input';
import {  MatOptionModule } from '@angular/material/core';
import { ProductService } from '../../services/products.service';
import { CommonModule, } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router} from '@angular/router';
import { NgxCurrencyDirective } from 'ngx-currency'
import { EditProduct } from '../../models/product/edit.product.model';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatLabel,
    MatOptionModule,
    CommonModule,
    NgxCurrencyDirective,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
   encapsulation: ViewEncapsulation.None,
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  productId!: string;
  formattedPrice: string = '';
  categories: LoV[] = [];
  brands: LoV[] = [];
  styles: LoV[] = [];
  powers: LoV[] = [];
  
  constructor(
    private fb: FormBuilder, 
    private productService: ProductService, 
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.initializeForm()
    this.getId()
  }

  private getId(): void{
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
  }

  public ngOnInit(): void {
    this.loadCategories()
    this.loadBrands()
    this.loadStyles()
    this.loadPowers()

    if(this.productId != undefined)
      this.loadProduct()
  }

  openSnackBar(message: string, action: string, className: string): void {
    console.log('Opening SnackBar with class:', className);
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [className]
    });
    
  }

  initializeForm(): void{
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      soldItems: [0, Validators.required],
      available: [0, Validators.required],
      categoryId: ['', Validators.required],
      brandId: ['', Validators.required],
      styleId: ['', Validators.required],
    })
  }

  loadProduct(){
    this.productService.getProductById(this.productId).subscribe(product => {
      this.productForm.patchValue(product);
    });
  }

  loadCategories(){
    this.productService.getCategories().subscribe(
      response => this.categories = response
    )
  }

  loadStyles(){
    this.productService.getStyles().subscribe(
      response => this.styles = response
    )
  }

  loadBrands(){
    this.productService.getBrands().subscribe(
      response => this.brands = response
    )
  }

  loadPowers(){
    this.productService.getPowers().subscribe(
      response => this.powers = response
    )
  }

  onSubmit(){
    if(this.productForm.valid){
      const editedProduct = this.productForm.value as EditProduct;
      editedProduct.productId = this.productId;
      editedProduct.powerId = 1
      
      if(this.productId != undefined)
        this.productService.updateProduct(editedProduct).subscribe(response => {
          this.router.navigate(['/dashboard']);
        });
      else 
      this.productService.createProduct(editedProduct).subscribe(response => {
        this.router.navigate(['/dashboard']);
        this.openSnackBar("Product has been successfully updated!", 'Close', 'toast-info');
      });
    }
  }

  goBack(event: Event): void {
    event.preventDefault();
    this.location.back();
  }
}
