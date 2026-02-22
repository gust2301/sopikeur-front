import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-city-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './city-select.component.html',
  styleUrl: './city-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CitySelectComponent),
      multi: true,
    },
  ],
})
export class CitySelectComponent implements ControlValueAccessor, OnChanges {
  @Input() label = 'Ville';
  @Input() placeholder = 'Ex : Dakar, Saly, Thiès…';
  @Input() cities: string[] = [];
  @Input() required = false;
  @Input() showError = false;

  @Output() readonly selected = new EventEmitter<string>();

  readonly listId = `city-select-${Math.random().toString(36).slice(2, 9)}`;
  value = '';
  filteredCities: string[] = [];
  isOpen = false;
  activeIndex = -1;
  disabled = false;

  private closeTimeout?: ReturnType<typeof setTimeout>;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cities']) {
      this.filterCities(this.value);
    }
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
    this.filterCities(this.value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onInput(value: string): void {
    this.value = value;
    this.onChange(this.value);
    this.filterCities(value);
    this.isOpen = true;
  }

  onFocus(): void {
    this.filterCities(this.value);
    this.isOpen = true;
  }

  onBlur(): void {
    this.onTouched();
    this.closeTimeout = setTimeout(() => {
      this.isOpen = false;
    }, 120);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isOpen = false;
      this.activeIndex = -1;
      return;
    }

    if (!this.isOpen || this.filteredCities.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.filteredCities.length;
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = this.activeIndex <= 0 ? this.filteredCities.length - 1 : this.activeIndex - 1;
      return;
    }

    if (event.key === 'Enter' && this.activeIndex >= 0) {
      event.preventDefault();
      this.selectCity(this.filteredCities[this.activeIndex]);
    }
  }

  selectCity(city: string): void {
    this.value = city;
    this.onChange(city);
    this.onTouched();
    this.selected.emit(city);
    this.isOpen = false;
    this.activeIndex = -1;
  }

  shouldShowError(): boolean {
    return this.required && this.showError && !this.value.trim();
  }

  trackByCity(_: number, city: string): string {
    return city;
  }

  private filterCities(search: string): void {
    const q = search.trim().toLowerCase();
    if (!q) {
      this.filteredCities = this.cities.slice(0, 6);
      this.activeIndex = this.filteredCities.length > 0 ? 0 : -1;
      return;
    }

    this.filteredCities = this.cities.filter(city => city.toLowerCase().includes(q)).slice(0, 6);
    this.activeIndex = this.filteredCities.length > 0 ? 0 : -1;
  }
}
