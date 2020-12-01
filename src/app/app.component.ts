import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Mandelbrot } from './mandelbrot';
import * as convert from 'color-convert';
import { RGB } from 'color-convert/conversions';
import { AppService } from './app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  title: string = 'mandelbrot-ng';
  size: number = 800;
  maxIterations: number = 100;
  hueStep: number = 36;
  hueOffset: number = 0;

  private mandelbrot = new Mandelbrot();
  private ctx: CanvasRenderingContext2D;
  private pixels: number[][];
  subscription: Subscription;

  constructor(
    private appService: AppService,
    private _ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.appService.windowSizeChangedBS.subscribe(
      (value) => {
        // console.log('start subscription trigger');
        this.size = value - 16;
        this._ref.detectChanges();
        this.reInit();
        // console.log('end subscription trigger');
      }
    );
  }

  reInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    // console.time('gen');
    // console.log(
    //   `Generating Mandelbrot set ${this.size} px square with ${this.maxIterations} max iterations`
    // );
    this.pixels = this.mandelbrot.generate(this.size, this.maxIterations);
    // console.timeEnd('gen');

    this.draw();
  }

  ngOnDestroy() {
    this.subscription = null;
  }

  draw(): void {
    // console.log('start drawImageBuffer');
    // console.time('draw');

    // Get copy of actual imagedata (for the whole canvas area)
    const imageData = this.ctx.getImageData(0, 0, this.size, this.size);
    // Create a buffer that's the same size as our canvas image data
    const buf = new ArrayBuffer(imageData.data.length);
    // 'Live' 8 bit clamped view to our buffer, we'll use this for writing to the canvas
    const buf8 = new Uint8ClampedArray(buf);
    // 'Live' 32 bit view into our buffer, we'll use this for drawing
    const buf32 = new Uint32Array(buf);

    for (let y = 0; y < this.size; y++) {
      const yw = y * this.size;
      for (let x = 0; x < this.size; x++) {
        let color: RGB;
        if (this.pixels[x][y] == this.maxIterations || this.pixels[x][y] == 0) {
          color = convert.hex.rgb('#000000');
        } else {
          color = this.mapIterationToRgb(this.pixels[x][y]);
        }
        // RGBA stored in a 32bit uint
        buf32[yw + x] =
          (255 << 24) | //A
          (color[2] << 16) | //B
          (color[1] << 8) | //G
          color[0]; //R
      }
    }

    // Update imageData and put it to our drawing context
    imageData.data.set(buf8);
    this.ctx.putImageData(imageData, 0, 0);

    // console.timeEnd('draw');
    // console.log('end drawImageBuffer');
  }

  // TODO: move this to a Dict so we don't have to recalculate each time
  mapIterationToRgbHex(i: number): string {
    const hue = this.hueStep * (i - 1) + this.hueOffset;
    const colorHex = convert.hsl.hex([hue % 360, 100, 50]);
    return `#${colorHex}`;
  }

  mapIterationToRgb(i: number): RGB {
    const hue = this.hueStep * (i - 1) + this.hueOffset;
    const colorRgb = convert.hsl.rgb([hue % 360, 100, 50]);
    return colorRgb;
  }
}
