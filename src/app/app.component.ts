import { Component, ElementRef, ViewChild } from '@angular/core';
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

  private ctx: CanvasRenderingContext2D;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  draw(): void {
    this.ctx.fillStyle = 'red';
    const px = new Pixel(this.ctx);
    px.drawPixel(1, 1);
  }
}
