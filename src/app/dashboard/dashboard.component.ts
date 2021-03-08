import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  breadcrumbs: any = [];
  constructor(public service: SharedService, public loader: LoaderService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getsidebar()
    let fullPath: string;
    fullPath = '';
    this.breadcrumbs = this.route.snapshot.pathFromRoot
      .map(snapshot => {
        const urlSegment = snapshot.url[0];
        const title = snapshot.data.title;
        fullPath += urlSegment ? ('/' + urlSegment.path) : '';
        if (!urlSegment || !title) {
          return null;
        }
        return { link: fullPath, title: title };
      }).filter(b => b);
      console.log(this.breadcrumbs);
      
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

  addItemPage() {
    this.router.navigate(['dashboard/addItem']);
  }

}
