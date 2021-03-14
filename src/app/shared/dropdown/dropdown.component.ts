import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() options: Array<any>;
  @Input() placeholder: string;
  @Input() className: string;
  @Input() isReadOnly = false;
  @Output() change = new EventEmitter();
  @Output() deleteOpt = new EventEmitter();
  @HostBinding('tabindex') tabindex = 0;
  selected: number;
  key: string;
  isFocused: boolean;
  isOpen = false;
  deleteOptionSelected: number;

  constructor(private el: ElementRef) {}

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};
  private onClickCallback: (_: any) => void = () => {};

  get isSelectedValue(): boolean {
    return this.selected > -1;
  }

  get selectedValue(): any {
    return this.options[this.selected];
  }

  get isOptionsIsObjects(): boolean {
    return this.options[0] instanceof Object;
  }

  optionValue(idx: number) {
    return this.isOptionsIsObjects
      ? this.options[idx].value
      : this.options[idx];
  }

  optionText(idx: number) {
    return this.isOptionsIsObjects ? this.options[idx].text : this.options[idx];
  }

  showIconOptionSelected(idx: number) {
    return this.isOptionsIsObjects
      ? this.options[idx].count
      : this.options[idx];
  }

  @HostListener('focus')
  focusHandler() {
    if (!this.isReadOnly) {
      if (this.selected === undefined) {
        this.selected = -1;
      }
      this.isFocused = true;
    }
  }

  @HostListener('focusout')
  focusOutHandler() {
    this.isFocused = false;
    this.onTouchedCallback();
  }

  @HostListener('document:keydown', ['$event'])
  keyPressHandle(event: KeyboardEvent) {
    if (this.isFocused) {
      const key = event.code || event.key;
      switch (true) {
        case key === ' ' || key === 'Space':
          event.preventDefault();
          this.isOpen = true;
          break;
        case key === 'ArrowDown':
          event.preventDefault();
          if (this.options.length - 1 > this.selected) {
            this.selected += 1;
          }
          break;
        case key === 'ArrowUp':
          event.preventDefault();
          if (this.selected > 0) {
            this.selected -= 1;
          }
          break;
        case key === 'Enter' || key === 'NumpadEnter':
          event.preventDefault();
          if (this.selected > -1) {
            this.optionSelect(this.selected, event);
          }
          break;
      }
    }
  }

  optionSelect(idx, e: any) {
    e.stopPropagation();
    this.selected = idx;
    this.isOpen = false;
    const value = this.optionValue(this.selected);
    this.onChangeCallback(value);
    this.change.emit(value);
  }

  deleteOption(id) {
    this.deleteOptionSelected = id;
    this.isOpen = false;
    const value = this.optionValue(this.deleteOptionSelected);
    this.onClickCallback(value);
    this.deleteOpt.emit(value);
  }

  toggle(e: any) {
    this.isFocused = true;
    this.isOpen = !this.isOpen;
  }

  @HostListener('document: click', ['$event'])
  onClick(e) {
    if (this.el.nativeElement.contains(e.target)) {
      return;
    }
    this.isFocused = false;
    this.isOpen = false;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.selected = this.isOptionsIsObjects
        ? this.options.findIndex((x) => x.value === obj)
        : this.options.indexOf(obj);
    } else {
      this.selected = -1;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnClick(fn: any) {
    this.onClickCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
