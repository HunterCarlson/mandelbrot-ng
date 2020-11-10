import { Component, ElementRef, ViewChild } from '@angular/core';
import { Mandelbrot } from './mandelbrot';
import { Pixel } from './pixel';

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

  draw(): void {
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
}
