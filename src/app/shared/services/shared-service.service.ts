import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) { }

  login(data) {
    return this.http.post(`${environment.url}common/login`, data);
  }

  sidebarMenu() {
    return this.http.get(`${environment.url}theme/getthemes/0`, { withCredentials: true })
  }
}
