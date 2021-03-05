import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LanguageService {
  
  private Language = 'eng'
  public loginModule = `../../../assets/language/${this.Language}/login.json`
  constructor(private http: HttpClient) {

  }
  
  getLanguage(language) {
    return this.http.get(language); 
  }
}


