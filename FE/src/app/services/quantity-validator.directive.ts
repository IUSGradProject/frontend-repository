import { Directive, ElementRef, HostListener,EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appQuantityValidator]',
  standalone: true,
})
export class QuantityValidatorDirective {
    @Output() quantityExceeded = new EventEmitter<number>();
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    if (!value || isNaN(Number(value))) {
      inputElement.value = '1'; 
      return;
    }

    
    const quantity = Number(value);
    const maxQuantity = Number(this.el.nativeElement.getAttribute('max'));

    if (quantity < 1) {
      inputElement.value = '1';
    } else if (quantity > maxQuantity) {
      inputElement.value = maxQuantity.toString();
      this.quantityExceeded.emit(maxQuantity);
    }
  }

  @HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent): void {
  if (event.key === ',' || event.key === '.' || event.key === 'e') {
    event.preventDefault();
  }
}

}