import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../shared/loader/loader.service/loader.service';
import { SharedService } from '../shared/services/shared-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(public fb: FormBuilder, public service: SharedService,
    public router: Router, public loader: LoaderService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.forminit()
  }

  forminit() {
    this.loginForm = this.fb.group({
      userid: ['', Validators.required],
      password: ['', Validators.required],
      appcode: ['ntypeadm']
    })
  }
  get loginFormControl() {
    return this.loginForm.controls;
  }
  login() {
    this.loginForm.controls['userid'].markAsTouched();
    this.loginForm.controls['password'].markAsTouched();
    if (this.loginForm.valid) {
      this.loader.attach(this.service.login(this.loginForm.value))
        .subscribe(res => {
          
          if (res['errcode'] == 0) {
            this.toaster.success("Login successfully");
            this.router.navigate(['/dashboard'])
          } else {
            this.toaster.error("Userid or password incorrect");
          }
        }, err => {
          this.toaster.error("Opps somethning went wrong !");
          console.log(err);
        })
    }
  }
}
