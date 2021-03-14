import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
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
  userName: string;
  ItemForm: FormGroup;
  Image: any;
  popupType = '';
  typeString = '';
  orientationArry = [
    { themeid: '0', name: 'Potrait' },
    { themeid: '1', name: 'Landscaape' },
  ];
  industryArry = [];
  categoryArry: { value: string; text: string; count: number }[];
  accountArry = [];
  resourceModel: any = {};
  uid: any;
  imageName: any;
  fileName: any;
  payloadImg: any;
  payloadFile: any;
  today = new Date();
  nextDate = new Date(new Date().setMonth(this.today.getMonth() + 3));
  modalRef: BsModalRef;
  templateData: any;
  accountDrp = new FormControl('');
  orientationDrp = new FormControl('');
  industryTypeDrp = new FormControl('');
  categoryDrp = new FormControl('');
  imageFileControl = new FormControl('');
  fileControl = new FormControl('');
  isUploadImageChange = false;
  isUploadFileChange = false;
  allLevels = [];
  deleteId: number;
  @ViewChild('file', { static: false }) file: ElementRef;
  @ViewChild('imageFile', { static: false }) imageFile: ElementRef;
  @ViewChild('orientation', { static: false }) orientation: ElementRef;
  @ViewChild('industryType', { static: false }) industryType: ElementRef;
  @ViewChild('category', { static: false }) category: ElementRef;
  @ViewChild('checkPublic', { static: true }) checkPublic: ElementRef;
  @ViewChild('checkPrivate', { static: true }) checkPrivate: ElementRef;
  @ViewChild('closebutton') closebutton: ElementRef;
  @ViewChild('account', { static: true }) account: ElementRef;
  @ViewChild('deleteModal', { static: false }) deleteModal: TemplateRef<any>;
  constructor(
    public fb: FormBuilder,
    private sharedService: SharedService,
    private languageService: LanguageService,
    public loader: LoaderService,
    private toaster: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    private renderer: Renderer2
  ) {
    this.templateData = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
    this.languageService
      .getLanguage(this.languageService.addItemModule)
      .subscribe((res) => {
        this.resourceModel = res;
      });
    this.bindDropDown();
    this.formInit();
    this.uid = localStorage.getItem('uid');
    if (!!this.templateData && !!this.templateData.fID) {
      this.getAllLevelsData();
      this.Image =
        'https://' +
        localStorage.getItem('downloadurl') +
        '/' +
        this.templateData.fPreviewMediaID +
        '.jpg';
      this.imageFileControl.setValue(this.Image);
      this.fileControl.setValue(this.templateData.fResourceMediaID);
      if (this.templateData.fPrivateDomainID === -1) {
        this.checkPublic.nativeElement.checked = true;
        this.account.nativeElement.disabled = true;
      } else {
        this.checkPrivate.nativeElement.checked = true;
        this.account.nativeElement.disabled = false;
      }
    }
  }

  getAllLevelsData() {
    this.sharedService.getAllLevels().subscribe(
      (res) => {
        if (res['errcode'] == 0) {
          this.allLevels = res['list'].filter(
            (x) => x.themeid === this.templateData.fThemeID
          );
          this.orientationDrp.setValue(this.allLevels[0].editable);
          this.getCategoryList(this.allLevels[0].parentid);
          this.getIndustryTypeList(this.orientationDrp.value);
          this.industryTypeDrp.setValue(this.allLevels[0].parentid);
          this.categoryDrp.setValue(this.templateData.fThemeID);
          this.orientationDrp.updateValueAndValidity();
          this.industryTypeDrp.updateValueAndValidity();
          this.categoryDrp.updateValueAndValidity();
        }
      },
      (err) => {}
    );
  }

  ngAfterViewInit() {
    if (!!this.templateData) {
    } else {
      this.checkPublic.nativeElement.checked = true;
      this.account.nativeElement.disabled = true;
      this.ItemForm.controls.fPrivateDomainID.setValue(-1);
    }
  }

  get form() {
    return this.ItemForm.controls;
  }

  bindDropDown() {
    //For sub domain
    this.loader
      .attach(this.sharedService.getSubdomain(localStorage.getItem('domainid')))
      .subscribe(
        (res) => {
          if (res['errcode'] == 0) {
            this.accountArry = res['domains'];
            if (!!this.templateData) {
              this.accountDrp.patchValue(
                this.templateData.fPrivateDomainID === -1
                  ? ''
                  : this.templateData.fPrivateDomainID
              );
              this.accountDrp.updateValueAndValidity();
            }
          }
        },
        (err) => {}
      );
  }

  changeOrientation(event) {
    if (!!event.currentTarget && !!event.currentTarget.value) {
      this.getIndustryTypeList(event.currentTarget.value);
    } else {
      if (!!event) {
        this.getIndustryTypeList(event);
      }
    }
  }

  getIndustryTypeList(id) {
    this.loader.attach(this.sharedService.getIndustry(Number(id))).subscribe(
      (res) => {
        if (res['errcode'] == 0) {
          this.industryArry = res['list'].filter(
            (x) => x.editable === Number(this.orientationDrp.value)
          );
        }
      },
      (err) => {}
    );
  }

  changeIndustryType(event) {
    if (!!event.currentTarget && !!event.currentTarget.value) {
      this.getCategoryList(this.industryType.nativeElement.value);
    } else {
      if (!!event) {
        this.getCategoryList(event);
      }
    }
  }

  async getCategoryList(id) {
    await this.loader
      .attach(this.sharedService.getIndustry(Number(id)))
      .subscribe(
        (res) => {
          if (res['errcode'] == 0) {
            this.categoryArry = res['list'].map((x) => ({
              value: x.themeid,
              text: x.name,
              count: x.count,
            }));
          }
        },
        (err) => {}
      );
  }

  changeCategory(event) {
    if (!!event) {
      this.ItemForm.controls.fThemeID.setValue(event);
    }
  }

  createCategory() {
    let obj = {
      name: this.typeString,
      parentid:
        this.popupType === 'Category Type'
          ? Number(this.industryType.nativeElement.value)
          : -1,
      editable: Number(this.orientation.nativeElement.value),
    };
    this.loader.attach(this.sharedService.createCategory(obj)).subscribe(
      (res) => {
        this.popupType === 'Category Type'
          ? this.changeIndustryType(obj.parentid)
          : this.changeOrientation(obj.parentid);
        this.typeString = '';
        this.closebutton.nativeElement.click();
      },
      (err) => {}
    );
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
      fID: [!!this.templateData ? this.templateData.fID : ''],
      fName: [
        !!this.templateData ? this.templateData.fName : '',
        Validators.required,
      ],
      fPreviewMediaID: [
        !!this.templateData ? this.templateData.fPreviewMediaID : '',
      ],
      fResourceMediaID: [
        !!this.templateData ? this.templateData.fResourceMediaID : '',
      ],
      fOutputType: [2],
      fStartDate: [
        !!this.templateData
          ? this.templateData.fStartDate
          : this.today.getFullYear() +
            '-' +
            (this.today.getMonth() + 1) +
            '-' +
            this.today.getDate(),
      ],
      fEndDate: [
        !!this.templateData
          ? this.templateData.fEndDate
          : this.nextDate.getFullYear() +
            '-' +
            (this.nextDate.getMonth() + 1) +
            '-' +
            this.nextDate.getDate(),
      ],
      fMovieMediaID: [-1],
      fMovieX: [0],
      fMovieY: [0],
      fRecommend: [false],
      fRefMediaIDs: [''],
      fOrder: [!!this.templateData ? this.templateData.fOrder : 0],
      fThemeID: [
        !!this.templateData ? this.templateData.fThemeID : '',
        Validators.required,
      ],
      fPrivateDomainID: [
        !!this.templateData ? this.templateData.fPrivateDomainID : '',
        Validators.required,
      ],
    });
  }

  onFileChanged(files, type) {
    if (type === 'img') {
      this.isUploadImageChange = true;
      this.imageName = files[0].name;
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        const imageUrlBase64 = reader.result;
        this.Image = reader.result;
        const blob = this.b64toBlob(imageUrlBase64);
        const filename = Math.random().toString(20).substr(2, 6) + '.jpg';
        this.payloadImg = new FormData();
        this.payloadImg.append('uploadedfile', blob, filename);
      };
    } else if (type === 'htr') {
      this.isUploadFileChange = true;
      this.fileName = files[0].name;
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
      reader.onload = (_event) => {};
      this.payloadFile = new FormData();
      this.payloadFile.append('uploadedfile', fileToUpload);
    }
  }

  async uploadfileOrImage(payload, type) {
    await this.sharedService
      .uploadImageAndFile(payload, this.uid)
      .toPromise()
      .then(
        (res) => {
          if (res['errcode'] === 0) {
            if (type === 'img') {
              this.ItemForm.controls.fPreviewMediaID.setValue(
                Number(res['result'])
              );
            } else {
              this.ItemForm.controls.fResourceMediaID.setValue(
                Number(res['result'])
              );
            }
          } else {
            type === 'img'
              ? this.ItemForm.controls.fPreviewMediaID.setValue('')
              : this.ItemForm.controls.fResourceMediaID.setValue('');
          }
        },
        (err) => {
          this.toaster.error(
            `Something went wrong while uploading ${
              type === 'img' ? 'Image' : 'file'
            }`
          );
        }
      );
  }

  b64toBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  cancel() {
    this.isUploadFileChange = false;
    this.isUploadImageChange = false;
    this.payloadImg = '';
    this.payloadFile = '';
    this.orientation.nativeElement.value = '';
    this.industryType.nativeElement.value = '';
    //this.category.nativeElement.value = '';
    this.imageFile.nativeElement.value = '';
    this.account.nativeElement.value = '';
    this.file.nativeElement.value = '';
    this.accountDrp.setValue('');
    this.orientationDrp.setValue('');
    this.categoryDrp.setValue('');
    this.imageFileControl.setValue('');
    this.fileControl.setValue('');
    this.router.navigate(['/dashboard']);
  }

  keyUpVlidation(event) {
    let val = event.target.value.trim();
    if (val === '') {
      this.typeString = '';
    }
  }

  async save() {
    if (this.isUploadImageChange) {
      await this.uploadfileOrImage(this.payloadImg, 'img');
    }
    if (this.isUploadFileChange) {
      await this.uploadfileOrImage(this.payloadFile, 'htr');
    }
    if (
      !!this.ItemForm.controls.fPreviewMediaID.value &&
      !!this.ItemForm.controls.fResourceMediaID.value
    ) {
      const saveMethod = !!this.ItemForm.controls.fID.value
        ? this.loader.attach(
            this.sharedService.updateTemplate(this.ItemForm.value)
          )
        : this.loader.attach(this.sharedService.create(this.ItemForm.value));
      saveMethod.subscribe(
        (res) => {
          if (res['errcode'] == 0) {
            this.toaster.success(
              this.ItemForm.controls.fID.value
                ? 'Update template Successfully!'
                : 'Create template successfully!'
            );
            this.router.navigate(['/dashboard']);
          }
        },
        (err) => {}
      );
    }
  }

  changeType(event) {
    this.ItemForm.controls.fPrivateDomainID.setValue('');
    if (event.target.value == 'public') {
      this.account.nativeElement.value = '';
      this.account.nativeElement.disabled = true;
      this.checkPublic.nativeElement.checked = true;
      this.checkPrivate.nativeElement.checked = false;
      this.ItemForm.controls.fPrivateDomainID.setValue(-1);
    } else {
      this.account.nativeElement.value = '';
      this.account.nativeElement.disabled = false;
      this.checkPrivate.nativeElement.checked = true;
      this.checkPublic.nativeElement.checked = false;
    }
  }

  changeAccount(event) {
    if (!!event.currentTarget.value) {
      this.ItemForm.controls.fPrivateDomainID.setValue(
        Number(event.currentTarget.value)
      );
    }
  }

  delete() {
    if (this.form.sideDrop3.value != '') {
      this.sharedService
        .deleteTheme(this.form.sideDrop3.value)
        .subscribe((res) => {
          if (res['errcode'] == 0) {
            this.closebutton.nativeElement.click();
          }
        });
    }
  }

  openDeleteModal(template) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
    });
  }
  // close() {
  //   setTimeout(() => {
  //     this.openDeleteModal(this.deleteModal);
  //   }, 200);
  // }

  deleteCategory(event) {
    if (!!event) {
      this.openDeleteModal(this.deleteModal);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
