import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../shared/loader/loader.service/loader.service';
import { SharedService } from '../shared/services/shared-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('side') side: ElementRef;
  toggleFlag = false;
  breadcrumbs: any = [];
  modalRef: any;
  constructor(
    public shareService: SharedService,
    public loader: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService,
    private modalService: BsModalService
  ) {}
  submenus = [[], []];
  templateList = [];
  tabs = [];
  lvl1: any;
  lvl2: any;
  lvl3: any;
  current: any;
  downloadUrl: string;
  tabContentIndex = false;
  userName: string;
  @ViewChild('closebutton') closebutton: ElementRef;
  deleteid: any;
  today = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  nextMDate = new Date(new Date().setMonth(this.today.getMonth() + 1));
  async ngOnInit(): Promise<void> {
    this.userName = localStorage.getItem('userName');
    this.downloadUrl = 'https://' + localStorage.getItem('downloadurl') + '/';
    let lvl1 = await localStorage.getItem('lvl1');
    let lvl2 = await JSON.parse(localStorage.getItem('lvl2'));
    let lvl3 = await JSON.parse(localStorage.getItem('lvl3'));
    if (lvl1) {
      this.lvl1 = lvl1;
    }
    if (lvl2) {
      (this.lvl2 = lvl2['name']),
        (this.current = lvl2['name']),
        this.getLevels('second', { themeid: lvl2.themeid }, 'initTime');
    }
    if (lvl3) {
      (this.lvl3 = lvl3.data['name']),
        this.getTemplates(lvl3.data.themeid, lvl3.index, 'initTime');
    }
    this.getLevels('first', { themeid: -1 });
    this.getPolicy();
    console.log(this.nextMDate);
  }

  getPolicy() {
    this.shareService.getPolicy().subscribe(
      (res) => {
        if (res['errcode'] === 0) {
          localStorage.setItem('downloadurl', res['downloadurl']);
          localStorage.setItem('uploadurl', res['uploadurl']);
          this.downloadUrl =
            'https://' + localStorage.getItem('downloadurl') + '/';
        }
      },
      (err) => {}
    );
  }

  getLevels(flag, data, isinit?) {
    this.lvl1 ? localStorage.setItem('lvl1', this.lvl1) : '';
    this.loader
      .attach(this.shareService.sidebarMenu(data.themeid))
      .subscribe((res: any) => {
        if (res.errcode === 0) {
          res = res.list.sort((a, b) => {
            return b.order - a.order;
          });
          switch (flag) {
            case 'first':
              this.submenus = res.reduce(
                (result, element) => {
                  result[element.editable === 0 ? 0 : 1].push(element);
                  return result;
                },
                [[], []]
              );
              break;
            case 'second':
              !isinit ? localStorage.setItem('lvl2', JSON.stringify(data)) : '';
              this.templateList = [];
              this.tabs = res;
            case 'third':
            //  this.getTemplates(id);
            default:
              break;
          }
        }
      });
  }

  addToggle() {
    this.toggleFlag ? (this.toggleFlag = false) : (this.toggleFlag = true);
    let data = this.side.nativeElement;
    this.toggleFlag
      ? data.classList.add('collapse')
      : data.classList.remove('collapse');
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

  getTemplates(id, i, init?) {
    !init
      ? localStorage.setItem(
          'lvl3',
          JSON.stringify({ data: this.tabs[i], index: i })
        )
      : '';
    this.loader.attach(this.shareService.getTemplates(id)).subscribe(
      (res) => {
        if (res['errcode'] === 0) {
          this.templateList = res['list'].filter((x) => {
            return (x.isNew =
              new Date(x.fStartDate) <= this.today &&
              new Date(x.fStartDate) <= this.nextMDate);
          });
          this.setTabContent(i);
        }
      },
      (err) => {}
    );
  }

  setTabContent(index) {
    this.tabContentIndex = index;
  }

  editTemplate(data) {
    this.router.navigateByUrl('/dashboard/addItem', {
      state: data,
    });
  }
  deleteTemplate() {
    this.loader
      .attach(this.shareService.deleteTemplate(this.deleteid))
      .subscribe(
        (res) => {
          if (res['errcode'] == 0) {
            this.toaster.success('Template deleted successfully!');
            this.modalRef.hide();
            let lvl3 = JSON.parse(localStorage.getItem('lvl3'));
            this.getTemplates(lvl3.data.themeid, lvl3.index, 'initTime');
          }
        },
        (err) => {}
      );
  }
  openDeleteModal(template: TemplateRef<any>, data) {
    this.deleteid = data.fID;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  close() {
    this.modalRef.hide();
  }
}
