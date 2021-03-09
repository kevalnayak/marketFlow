import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/shared/loader/loader.service/loader.service';
import { LanguageService } from 'src/app/shared/services/language.service';
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
  resourceModel: any = {};
  @ViewChild('checkPublic') checkPublic: ElementRef;
  @ViewChild('checkPrivate') checkPrivate: ElementRef;
  @ViewChild('closebutton') closebutton: ElementRef;
  constructor(public fb: FormBuilder, private sharedService: SharedService, private languageService: LanguageService, public loader: LoaderService) { }

  ngOnInit(): void {
    this.languageService.getLanguage(this.languageService.addItemModule).subscribe(res => {
      this.resourceModel = res;
    });
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
    //this.sharedService.getOrienation().subscribe(res => {
    // if (res['errcode'] == 0) {
    this.orientationArry = [];
    let obj = [{
      themeid: "0",
      name: "potrait"
    },
    {
      themeid: "1",
      name: "landscape"
    }
    ]
    this.orientationArry.push(obj);
    //  }
    // });

    //For sub domain
    this.loader.attach(this.sharedService.getSubdomain(this.localData['domainid'])).subscribe(res => {
      if (res['errcode'] == 0) {
        this.accountArry = [];
        this.accountArry.push(res['domains']);
      }
    });
  }

  changeOrientation(item) {
    //let newItem = item.find(x => x.themeid == this.form.sideDrop1.value);
    this.loader.attach(this.sharedService.getIndustry(Number(this.form.sideDrop1.value))).subscribe(res => {
      if (res['errcode'] == 0) {
        this.industryArry = [];
        this.industryArry.push(res['list']);
      }
    });
  }

  changeIndustryType(item) {
    //let newItem = item.find(x => x.themeid == this.form.sideDrop2.value);
    this.loader.attach(this.sharedService.getIndustry(Number(this.form.sideDrop2.value))).subscribe(res => {
      if (res['errcode'] == 0) {
        this.categoryArry = [];
        this.categoryArry.push(res['list']);
      }
    });
  }

  createCategory() {
    let obj = {
      name: this.typeString,
      parentid: (this.popupType == "Category Type") ? Number(this.form.sideDrop2.value) : -1,
      editable: Number(this.form.sideDrop1.value)
    }
    this.loader.attach(this.sharedService.createCategory(obj)).subscribe(res => {
      this.typeString = "";
      this.closebutton.nativeElement.click();
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
    if (event.target.files[0].type.includes("image")) {
      let file = event.target.files[0]
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (res) => {
        this.Image = reader.result
      };
    } else if (event.target.files[0].type == "") {

    }

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
    var d = new Date()
    var nd = new Date(d.setMonth(d.getMonth()+3))
    let obj = {
      fName: this.form.name.value,
      fPreviewMediaID: 445483,
      fResourceMediaID: 446167,
      fOutputType: 0,
      fStartDate: d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(),
      fEndDate: nd.getFullYear() + '-' + nd.getMonth() + '-' + nd.getDate(),
      fMovieMediaID: -1,
      fMovieX: 0,
      fMovieY: 0,
      fRecommend: false,
      fRefMediaIDs: "",
      fOrder: 2,
      fThemeID: 2,
      fPrivateDomainID: this.form.checkType.value == "public" ? -1 : this.localData['domainid']
    }
    this.loader.attach(this.sharedService.create(obj)).subscribe(res => {
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

    if (!this.checkPrivate.nativeElement.checked && !this.checkPublic.nativeElement.checked) {
      this.form.checkType.reset();
    }
    console.log(this.ItemForm.value)
  }
}
