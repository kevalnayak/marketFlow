import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    private promiseCount = 0;
    visible = new BehaviorSubject<boolean>(false);

    show(): void {
        this.visible.next(true);
    }

    hide(): void {
        this.visible.next(false);
    }

    attach<T>(subject: Promise<T>): Promise<T>;
    attach<T>(subject: Observable<T>): Observable<T>;
    attach(subject: any): any {
        this.promiseCount++;
        this.show();
        if (subject instanceof Promise) {
            return subject
                .then(this.detach.bind(this))
                .catch(this.detach.bind(this));
        }
        if (subject instanceof Observable) {
            return subject.pipe(
                finalize(this.detach.bind(this))
            );
        }
    }


    detach(res?: any): any {
        this.promiseCount--;
        if (this.promiseCount > 0) {
            this.show();
        } else {
            this.hide();
        }
        return res;
    }
}
