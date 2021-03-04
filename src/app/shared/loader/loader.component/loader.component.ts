import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../loader.service/loader.service';

@Component({
  selector: 'pg-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  visible = false;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.visible.subscribe(
        visible => this.visible = visible
    );
  }
}
