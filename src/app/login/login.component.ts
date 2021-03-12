import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../shared/loader/loader.service/loader.service';
import { LanguageService } from '../shared/services/language.service';
import { SharedService } from '../shared/services/shared-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  resourceModel: any = {};
  constructor(
    public fb: FormBuilder,
    public service: SharedService,
    public router: Router,
    public loader: LoaderService,
    private toaster: ToastrService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.forminit();
    this.languageService
      .getLanguage(this.languageService.loginModule)
      .subscribe((res) => {
        this.resourceModel = res;
      });
    this.service.logout().subscribe((res) => {
      localStorage.clear();
    });
  }

  forminit() {
    this.loginForm = this.fb.group({
      userid: ['bbadmin', Validators.required],
      password: ['bb.ad.min.9', Validators.required],
      appcode: ['ntypeadm'],
    });
  }
  get loginFormControl() {
    return this.loginForm.controls;
  }
  login() {
    this.loginForm.controls['userid'].markAsTouched();
    this.loginForm.controls['password'].markAsTouched();
    if (this.loginForm.valid) {
      this.loader.attach(this.service.login(this.loginForm.value)).subscribe(
        (res) => {
          if (res['errcode'] == 0) {
            localStorage.setItem('domainid', res['domainid']);
            localStorage.setItem('uid', res['uid']);
            this.toaster.success('Login successfully');
            this.router.navigate(['/dashboard']);
          } else {
            this.toaster.error('Userid or password incorrect');
          }
        },
        (err) => {
          this.toaster.error('Opps somethning went wrong !');
        }
      );
    }
  }
}
