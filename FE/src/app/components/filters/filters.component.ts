import { Component, ChangeDetectionStrategy, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChildren, QueryList, SimpleChanges } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/products.service';
import { LoV } from '../../models/lov.model';
import { FilterRequest } from '../../models/filter.request.model';
import { MatSelectModule } from '@angular/material/select';
import { getSortData } from '../../data/sort.data';
import { Sort } from '../../models/sort.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-filter',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatCard,
    MatCardContent,
    FormsModule,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class FiltersComponent implements OnInit {
  @Input() selectedCategories!: number[]; 
  @Input() categories!: LoV[];
  @Input() resetFilters?: boolean;
  @Input() sorts?: Sort[];
  @Output() filterRequest = new EventEmitter<FilterRequest>();
  @ViewChildren('checkbox') checkboxes!: QueryList<MatCheckbox>;
  styles!: LoV[];
  brands!: LoV[];
  minPrice: number = 0;
  maxPrice: number = 500;
  //selectedCategories!: number[]
  selectedStyles!: number[];
  selectedBrands!: number[];
  categoriesVisible: boolean = false;
  stylesVisible: boolean = false;
 // colorsVisible: boolean = false;

  currentPriceRange: [number, number] = [50, 300];

  constructor(private productService: ProductService){
    this.initialize()
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetFilters'] && changes['resetFilters'].currentValue === true) 
      this.clearFilters()
    else{
      this.loadStyles()
      this.loadBrands()
    }
  }

  loadStyles(){
    this.productService.getStyles().subscribe(
      data => this.styles = data
    )
  }

  loadBrands(){
    this.productService.getBrands().subscribe(
      data => this.brands = data
    )
  }

  getFilterRequest(): void {
    this.filterRequest.emit({
      categories: this.selectedCategories,
      styles: this.selectedStyles,
      brands: this.selectedBrands,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    })
  }

  updateSelection(id: number, selectionArray: number[], event: any): void {
    if (event.checked) {
      selectionArray.push(id);
    } else {
      const index = selectionArray.indexOf(id);
      if (index > -1) {
        selectionArray.splice(index, 1);
      }
    }
  }

  initialize(){
    //this.selectedCategories = [];
    this.selectedStyles = [];
    this.selectedBrands = [];
    this.minPrice = 0;
    this.maxPrice = 20000;
    this.currentPriceRange = [0, 500];
  }

  clearFilters(){
    this.initialize()
    this.checkboxes?.forEach((checkbox) => {
      checkbox.checked = false;
    });
  
    this.filterRequest.emit({
      categories: this.selectedCategories,
      styles: [],
      brands: [],
      minPrice: 0,
      maxPrice: 50000
    });
  }

  onChange(event: any){
    this.filterRequest.emit({
      categories: this.selectedCategories || [],
      styles: this.selectedStyles || [],
      brands: this.selectedBrands || [],
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    });
    
  }
}
