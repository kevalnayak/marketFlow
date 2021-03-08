import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared-service.service';

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
  popupType = '';
  typeString = '';
  orientationArry = [];
  industryArry = [];
  categoryArry = [];
  localData: void;
  accountArry = [];
  @ViewChild('checkPublic') checkPublic: ElementRef;
  @ViewChild('checkPrivate') checkPrivate: ElementRef;
  constructor(public fb: FormBuilder, private sharedService: SharedService) { }

  ngOnInit(): void {
    let data = localStorage.getItem("loginDetail");
    this.localData = JSON.parse(data);
    this.bindDropDown();
    this.formInit();
    this.Image = "../../assets/tab-img.png";
  }

  get form() {
    return this.ItemForm.controls;
  }

  bindDropDown() {
    this.sharedService.getOrienation().subscribe(res => {
      if (res['errcode'] == 0) {
        this.orientationArry = [];
        this.orientationArry.push(res['list']);
      }
    });

    //For sub domain
    this.sharedService.getSubdomain(this.localData['domainid']).subscribe(res => {
      if (res['errcode'] == 0) {
        this.accountArry = [];
        this.accountArry.push(res['domains']);
      }
    });
  }

  changeOrientation(item) {
    let newItem = item.find(x => x.themeid == this.form.sideDrop1.value);
    this.sharedService.getIndustry(newItem.themeid).subscribe(res => {
      if (res['errcode'] == 0) {
        this.industryArry = [];
        this.industryArry.push(res['list']);
      }
    });
  }

  changeIndustryType(item) {
    let newItem = item.find(x => x.themeid == this.form.sideDrop2.value);
    this.sharedService.getIndustry(newItem.themeid).subscribe(res => {
      if (res['errcode'] == 0) {
        this.categoryArry = [];
        this.categoryArry.push(res['list']);
      }
    });
  }

  createCategory() {
    let obj = {
      name: this.typeString,
      parentid: Number(this.form.sideDrop2.value)
    }
    this.sharedService.createCategory(obj).subscribe(res => {
      this.typeString = "";
    });
  }

  closePopup() {
    this.typeString = "";
  }

  addToggle() {
    this.toggleFlag ? this.toggleFlag = false : this.toggleFlag = true;
    let data = this.side.nativeElement;
    this.toggleFlag ? data.classList.add("collapse") : data.classList.remove("collapse");
  }

  formInit() {
    this.ItemForm = this.fb.group({
      sideDrop1: ['', [Validators.required]],
      sideDrop2: ['', [Validators.required]],
      sideDrop3: ['', [Validators.required]],
      name: ['', [Validators.required]],
      checkType: ['', [Validators.required]],
      formDrop: ['', [Validators.required]]
    });
  }

  onFileChanged(event) {
    let file = event.target.files[0]
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (res) => {
      this.Image = reader.result
    };
  }

  cancel() {
    this.Image = "../../assets/tab-img.png";
  }

  keyUpVlidation(event) {
    let val = event.target.value.trim();
    if (val == "") {
      this.typeString = '';
    }
  }

  save() {
    let obj = {
      fName: this.form.name.value,
      fPreviewMediaID: 445483,
      fResourceMediaID: 446167,
      fOutputType: 0,
      fStartDate: "2021-02-24",
      fEndDate: "2021-05-24",
      fMovieMediaID: -1,
      fMovieX: 0,
      fMovieY: 0,
      fRecommend: false,
      fRefMediaIDs: "",
      fOrder: 2,
      fThemeID: 2,
      fPrivateDomainID: this.form.checkType.value == "public" ? -1 : this.localData['domainid']
    }
    this.sharedService.create(obj).subscribe(res => {
      if (res['errcode'] == 0) {
        
      }
    });
  }

  changeType(event) {
    if (event.target.value == "public") {
       this.checkPrivate.nativeElement.checked = false;
    } else {
      this.checkPublic.nativeElement.checked = false;
    }

    if (!this.checkPrivate.nativeElement.checked && !this.checkPublic.nativeElement.checked){
      this.form.checkType.setValue('');
    }
  }
}
