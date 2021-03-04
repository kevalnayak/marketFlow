import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from '../shared/loader/loader.service/loader.service';
import { SharedService } from '../shared/services/shared-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('side') side: ElementRef;
  toggleFlag = false;
  constructor(public service: SharedService, public loader: LoaderService) { }

  ngOnInit(): void {
    this.getsidebar()
  }

  getsidebar() {
    this.loader.attach(this.service.sidebarMenu())
      .subscribe(res => {
        console.log(res);        
      })
  }
  addToggle() {
    this.toggleFlag ? this.toggleFlag = false : this.toggleFlag = true;
    let data = this.side.nativeElement;
    this.toggleFlag ? data.classList.add("collapse") : data.classList.remove("collapse");
  }

}
