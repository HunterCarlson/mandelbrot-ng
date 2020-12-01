import { Inject, Injectable } from '@angular/core';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(@Inject('windowObject') private window: Window) {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(10),
        map((event: UIEvent) => {
          let w = event['currentTarget'] as Window;
          return w.innerWidth;
        })
        // tap((x) => console.log(`size: ${x}`))
      )
      .subscribe((size) => {
        this.windowSizeChangedBS.next(size);
      });
  }

  readonly windowSizeChangedBS = new BehaviorSubject(this.window.innerWidth);
}
