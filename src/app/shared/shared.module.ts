import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectAccessibleComponent } from './dropdown/dropdown.component';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [NgSelectAccessibleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ModalModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    NgSelectAccessibleComponent,
  ],
})
export class SharedModule { }
