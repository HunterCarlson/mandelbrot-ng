import { Component, ElementRef, ViewChild } from '@angular/core';
import { Mandelbrot } from './mandelbrot';
import * as convert from 'color-convert';
import { RGB } from 'color-convert/conversions';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('audioPlayer')
  audioPlayer: ElementRef<HTMLAudioElement>;
  audioIsPlaying: boolean = false;

  title: string = 'mandelbrot-ng';
  size: number;
  maxIterations: number = 100;
  hueStep: number = 36;
  hueOffset: number = 0;

  private mandelbrot = new Mandelbrot();
  private ctx: CanvasRenderingContext2D;
  private pixels: number[][];

  constructor() {
    this.size = window.innerWidth - 16;
    // console.log(`Canvas init to ${this.size}px`);
  }

  onResized(event: ResizedEvent): void {
    this.size = event.newWidth - 16;
    // console.log(`Canvas resized to ${this.size}px`);
    this.reInit();
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
  mapIterationToRgb(i: number): RGB {
    const hue = this.hueStep * (i - 1) + this.hueOffset;
    const colorRgb = convert.hsl.rgb([hue % 360, 100, 50]);
    return colorRgb;
  }

  toggleAudio(): void {
    if (this.audioIsPlaying) {
      this.audioPlayer.nativeElement.pause();
      this.audioPlayer.nativeElement.currentTime = 0;
    } else {
      this.audioPlayer.nativeElement.play();
    }
    this.audioIsPlaying = !this.audioIsPlaying;
  }

  onAudioEnded() {
    this.audioIsPlaying = false;
  }
}
