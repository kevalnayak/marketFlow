import { Component, Input, Output, EventEmitter, TemplateRef, ViewChild, ContentChild } from '@angular/core';

/**
 * Provide the ng-select component with an accessible fallback to <select> for screen readers
 */
@Component({
  selector: 'ng-select-accessible[displayField]',
  templateUrl: './dropdown.component.html',
  styleUrls: [ './dropdown.component.scss' ]
})
export class NgSelectAccessibleComponent  {

  @ContentChild('labelTemplate', {static: false}) labelTemplate: TemplateRef<any>;;
  @ContentChild('optionTemplate', {static: false}) optionTemplate: TemplateRef<any>;;

  @Input() ariaLabel = 'Select';
  @Input() items;
  @Input() displayField; //what field shows in dropdown options
  @Input() placeholder = 'Select something';
  @Input() model;
  @Output() update: EventEmitter<any> = new EventEmitter();
  selectField;

  ngOnInit(){
    this.selectField = 'item.'+this.displayField;
  }
  /**
   * Emit selected model to parent
   */
  modelChanged(){
    this.update.emit(this.model);
  }
}
