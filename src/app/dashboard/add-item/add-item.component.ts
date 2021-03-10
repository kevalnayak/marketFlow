import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/shared/loader/loader.service/loader.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SharedService } from 'src/app/shared/services/shared-service.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
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
  uid: any;
  payloadImg: any;
  payloadFile: any;
  @ViewChild('checkPublic') checkPublic: ElementRef;
  @ViewChild('checkPrivate') checkPrivate: ElementRef;
  @ViewChild('closebutton') closebutton: ElementRef;
  @ViewChild('account') account: ElementRef;
  
  checkedFlag = true;
  constructor(
    public fb: FormBuilder,
    private sharedService: SharedService,
    private languageService: LanguageService,
    public loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.languageService
      .getLanguage(this.languageService.addItemModule)
      .subscribe((res) => {
        this.resourceModel = res;
      });
    let data = localStorage.getItem('loginDetail');
    this.localData = JSON.parse(data);
    this.bindDropDown();
    this.formInit();
    this.uid = this.localData['uid'];
  }

  ngAfterViewInit() {
    this.checkPublic.nativeElement.checked = true;
    this.form.publiccheckType.setValue('public');
    this.account.nativeElement.disabled = true;
    this.checkedFlag = false;
  }

  get form() {
    return this.ItemForm.controls;
  }

  bindDropDown() {
    //this.sharedService.getOrienation().subscribe(res => {
    // if (res['errcode'] == 0) {
    this.orientationArry = [];
    let obj = [
      {
        themeid: '0',
        name: 'potrait',
      },
      {
        themeid: '1',
        name: 'landscape',
      },
    ];
    this.orientationArry.push(obj);
    //  }
    // });

    //For sub domain
    this.loader
      .attach(this.sharedService.getSubdomain(this.localData['domainid']))
      .subscribe((res) => {
        if (res['errcode'] == 0) {
          this.accountArry = [];
          this.accountArry.push(res['domains']);
        }
      });
  }

  changeOrientation(item) {
    //let newItem = item.find(x => x.themeid == this.form.sideDrop1.value);
    this.loader
      .attach(this.sharedService.getIndustry(Number(this.form.sideDrop1.value)))
      .subscribe((res) => {
        if (res['errcode'] == 0) {
          this.industryArry = [];
          this.industryArry.push(res['list']);
        }
      });
  }

  changeIndustryType(item) {
    //let newItem = item.find(x => x.themeid == this.form.sideDrop2.value);
    this.loader
      .attach(this.sharedService.getIndustry(Number(this.form.sideDrop2.value)))
      .subscribe((res) => {
        if (res['errcode'] == 0) {
          this.categoryArry = [];
          this.categoryArry.push(res['list']);
        }
      });
  }

  createCategory() {
    let obj = {
      name: this.typeString,
      parentid:
        this.popupType == 'Category Type'
          ? Number(this.form.sideDrop2.value)
          : -1,
      editable: Number(this.form.sideDrop1.value),
    };
    this.loader
      .attach(this.sharedService.createCategory(obj))
      .subscribe((res) => {
        this.typeString = '';
        this.closebutton.nativeElement.click();
      });
  }

  closePopup() {
    this.typeString = '';
  }

  addToggle() {
    this.toggleFlag ? (this.toggleFlag = false) : (this.toggleFlag = true);
    let data = this.side.nativeElement;
    this.toggleFlag
      ? data.classList.add('collapse')
      : data.classList.remove('collapse');
  }

  formInit() {
    this.ItemForm = this.fb.group({
      sideDrop1: [''],
      sideDrop2: [''],
      sideDrop3: [''],
      name: ['', [Validators.required]],
      checkType: [''],
      formDrop: [''],
      fPreviewMediaID: [''],
      fResourceMediaID: [''],
      privatecheckType: [''],
      publiccheckType: ['']
    });
  }

  onFileChanged(files, type) {
    if (type === 'img') {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        const imageUrlBase64 = reader.result;
        this.Image = reader.result;
        const blob = this.b64toBlob(imageUrlBase64.slice(23));
        const filename = Math.random().toString(20).substr(2, 6) + '.jpg';
        this.payloadImg = new FormData();
        this.payloadImg.append('uploadedfile', blob, filename);
        // this.uploadfileOrImage(this.payloadImg, 'img');
      };
    } else if (type === 'htr') {
      const fileToUpload = files.item(0);
      if (files.length === 0) {
        return;
      }
      const extension = fileToUpload.name.split('.').pop().toUpperCase();
      if (!['HTR'].includes(extension)) {
        return false;
      }
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => { };
      this.payloadFile = new FormData();
      this.payloadFile.append('uploadedfile', fileToUpload);
    }
  }

 async uploadfileOrImage(payload, type) {
   await this.sharedService.uploadImageAndFile(payload, this.uid).toPromise().then(
      (res) => {
        if (res['errcode'] === 0) {
          if (type === 'img') {
            this.ItemForm.controls.fPreviewMediaID.setValue(res['result']);
          } else {
            this.ItemForm.controls.fResourceMediaID.setValue(res['result']);
          }
        } else {
          type === 'img'
            ? this.ItemForm.controls.fPreviewMediaID.setValue('')
            : this.ItemForm.controls.fResourceMediaID.setValue('');
        }
      },
      (err) => { }
    );
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = b64Data;//atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  cancel() {
    this.Image = '../../assets/tab-img.png';
  }

  keyUpVlidation(event) {
    let val = event.target.value.trim();
    if (val == '') {
      this.typeString = '';
    }
  }

  async save() {
    console.log(this.payloadImg, 'imagg');
    console.log(this.payloadFile, 'htrrr');
    await this.uploadfileOrImage(this.payloadImg, 'img');
    await this.uploadfileOrImage(this.payloadFile, 'htr');
    var d = new Date();
    var nd = new Date(new Date().setMonth(d.getMonth() + 3));
    let obj = {
      fName: this.form.name.value,
      fPreviewMediaID: this.form.fPreviewMediaID.value,
      fResourceMediaID: this.form.fResourceMediaID.value,
      fOutputType: 0,
      fStartDate: d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),
      fEndDate: nd.getFullYear() + '-' + (nd.getMonth()+1) + '-' + nd.getDate(),
      fMovieMediaID: -1,
      fMovieX: 0,
      fMovieY: 0,
      fRecommend: false,
      fRefMediaIDs: '',
      fOrder: 2,
      fThemeID: 2,
      fPrivateDomainID: this.checkPublic.nativeElement.checked ? -1 : this.localData['domainid'],
    };
    this.loader.attach(this.sharedService.create(obj)).subscribe((res) => {
      if (res['errcode'] == 0) {
      }
    });
  }

  changeType(event) {
    if (event.target.value == 'public') {
      this.checkedFlag = false;
      this.form.formDrop.setValue(null);
      this.form.formDrop.setValidators(null);
      this.form.formDrop.updateValueAndValidity();
      this.account.nativeElement.disabled = true;
      this.checkPublic.nativeElement.checked = true;
      this.checkPrivate.nativeElement.checked = false;
      this.form.publiccheckType.setValue('public');
    } else {
      this.checkedFlag = false;
      this.account.nativeElement.disabled = false;
      this.form.formDrop.setValidators(Validators.required);
      this.form.formDrop.updateValueAndValidity();
      this.checkPrivate.nativeElement.checked = true;
      this.checkPublic.nativeElement.checked = false;
      this.form.privatecheckType.setValue('private');
    }

    if (
      !this.checkPrivate.nativeElement.checked &&
      !this.checkPublic.nativeElement.checked
    ) {
      this.form.publiccheckType.setValue('');
      this.form.privatecheckType.setValue('');
    }
  }
}
