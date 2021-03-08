import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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
  level1 = [];
  tabs = []

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
  }

  getsidebar() {
    this.loader.attach(this.service.sidebarMenu(-1))
      .subscribe((res: any) => {
        if (res.errcode == 0) {
          if (res.list.length == 0) {
            this.addTheme();
          } else {
            this.level1 = res.list.sort((a, b) => { return b.order - a.order })
            let urls = []
            this.level1.forEach(x => {
              urls.push(this.service.sidebarMenu(x.themeid))
            })
            this.loader.attach(forkJoin(urls)).subscribe((res: any) => {
              if (res.length != 0) {
                this.level1.forEach((x, i) => {
                  this.level1[i]['submenus'] = res[i].list.sort((a, b) => { return b.order - a.order })
                })
              }
              console.log(this.level1);
            })
          }
        }
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

  addTheme() {
    this.service.addTheme({ "name": "Portrait", "parentid": -1 }).subscribe((PortraitData: any) => {
      if (PortraitData.errcode == 0) {
        this.service.addTheme({ "name": "Landscape", "parentid": -1 }).subscribe((LandscapeData: any) => {
          if (LandscapeData.errcode == 0) {
            this.getsidebar()
          }
        })
      } else {
        console.log(PortraitData);
      }
    })
  }
  loadTab(data) {
    this.service.sidebarMenu(data.themeid).subscribe((res: any) => {
      console.log(res, "lvl3");
      if (res.errcode == 0) {
        this.tabs = res.list
      } else {
        console.log(res);        
      }
    })
  }
}
