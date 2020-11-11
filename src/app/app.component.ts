import { Component, ElementRef, ViewChild } from '@angular/core';
import { Mandelbrot } from './mandelbrot';
import { Pixel } from './pixel';
import * as convert from 'color-convert';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  title = 'mandelbrot-ng';
  size = 800;
  maxIterations = 100;

  private mandelbrot = new Mandelbrot();

  private ctx: CanvasRenderingContext2D;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawBlackAndWhite(): void {
    const px = new Pixel(this.ctx);
    const pixels = this.mandelbrot.generate(this.size, this.maxIterations);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (pixels[i][j] < this.maxIterations) {
          this.ctx.fillStyle = 'black';
        } else {
          this.ctx.fillStyle = 'white';
        }
        px.drawPixel(i, j);
      }
    }
  }

  drawColor(): void {
    const px = new Pixel(this.ctx);
    const pixels = this.mandelbrot.generate(this.size, this.maxIterations);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (pixels[i][j] == this.maxIterations || pixels[i][j] == 0) {
          this.ctx.fillStyle = 'black';
        } else {
          this.ctx.fillStyle = this.mapIterationToRgb(pixels[i][j]);
        }
        px.drawPixel(i, j);
      }
    }
  }

  // TODO: move this to a Dict so we don't have to recalculate each time
  mapIterationToRgb(i: number): string {
    const hueStep = 360 / this.maxIterations;
    const hue = hueStep * i;
    const colorHex = convert.hsl.hex([hue, 100, 50]);
    return `#${colorHex}`;
  }
}
