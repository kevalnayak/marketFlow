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
  submenus = [[], []]
  templateList = []
  tabs = []
  lvl1: any;
  lvl2: any;
  lvl3: any;
  current:any;
  ngOnInit(): void {
    this.getLevels('first', -1)

  }

  getLevels(flag, id) {
    this.loader.attach(this.service.sidebarMenu(id))
      .subscribe((res: any) => {

        if (res.errcode == 0) {
          res = res.list.sort((a, b) => { return b.order - a.order })
          switch (flag) {
            case 'first':
              this.submenus = res
                .reduce((result, element) => {
                  result[element.editable == 0 ? 0 : 1].push(element);
                  return result;
                }, [[], []]);
              break;
            case 'second':
              this.tabs = res
            case 'third':
              this.templateList = res
            default:
              break;
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
  // addTheme() {
  //   this.service.addTheme({ "name": "Portrait", "parentid": -1 }).subscribe((PortraitData: any) => {
  //     if (PortraitData.errcode == 0) {
  //       this.service.addTheme({ "name": "Landscape", "parentid": -1 }).subscribe((LandscapeData: any) => {
  //         if (LandscapeData.errcode == 0) {
  //           this.getsidebar()
  //         }
  //       })
  //     } else {
  //       console.log(PortraitData);
  //     }
  //   })
  // }
  // loadTab(data) {
  //   this.service.sidebarMenu(data.themeid).subscribe((res: any) => {
  //     console.log(res, "lvl3");
  //     if (res.errcode == 0) {
  //       this.tabs = res.list
  //     } else {
  //       console.log(res);
  //     }
  //   })
  // }
}
