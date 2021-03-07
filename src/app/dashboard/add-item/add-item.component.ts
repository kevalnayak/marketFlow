import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  @ViewChild('side') side: ElementRef;
  toggleFlag = false;
  ItemForm: FormGroup;
  Image: any;
  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
    this.formInit();
    this.Image = "../../assets/tab-img.png";
  }

  addToggle() {
    this.toggleFlag ? this.toggleFlag = false : this.toggleFlag = true;
    let data = this.side.nativeElement;
    this.toggleFlag ? data.classList.add("collapse") : data.classList.remove("collapse");
  }

  formInit() {
    this.ItemForm = this.fb.group({
        sideDrop1:['',[Validators.required]],
        sideDrop2:['',[Validators.required]],
        sideDrop3:['',[Validators.required]],
        name: ['', [Validators.required]],
        checkType: ['', [Validators.required]],
        formDrop: ['', [Validators.required]]
    });
  }

  onFileChanged(event) {
    let file = event.target.files[0]
    let reader = new  FileReader();
    reader.readAsDataURL(file);
    reader.onload = (res) => {
        this.Image = reader.result
    };
  }

  cancel() {
    this.Image = "../../assets/tab-img.png";
  }
}
