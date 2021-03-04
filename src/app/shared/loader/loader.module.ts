import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from './loader.service/loader.service';
import { LoaderComponent } from './loader.component/loader.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LoaderComponent
    ],
    providers: [
        LoaderService
    ],
    exports: [
        LoaderComponent
    ]
})
export class LoaderModule {

}

