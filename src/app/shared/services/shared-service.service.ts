import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private http: HttpClient) { }

  login(data) {
    return this.http.post(`${environment.url}common/login`, data);
  }

  logout() {
    return this.http.get(`${environment.url}common/logout`);
  }

  sidebarMenu(id) {
    return this.http.get(`${environment.url}theme/getthemes/${id}`);
  }

  addTheme(data) {
    return this.http.post(`${environment.url}theme/add`, data);
  }

  getOrienation() {
    return this.http.get(`${environment.url}theme/getthemes/-1`);
  }

  getIndustry(id) {
    return this.http.get(`${environment.url}theme/getthemes/${id}`);
  }

  createCategory(data) {
    return this.http.post(`${environment.url}theme/add`, data);
  }

  getSubdomain(data) {
    return this.http.get(`${environment.url}common/subdomains/${data}`);
  }

  create(data) {
    return this.http.post(
      `${environment.url}httemplate/createbasetemplate`,
      data
    );
  }

  uploadImageAndFile(data, uid) {
    return this.http.post(
      `${environment.url}common/genericupload/?completeUploadClass=adc.dsms.db.acMediaCompleteUpload,adc.dsms.db&uid=${uid}`,
      data
    );
  }

  deleteTheme(id) {
    return this.http.get(`${environment.url}theme/delete/${id}`)
  }
}
