import * as math from 'mathjs';
import { Complex } from 'mathjs';

export class Mandelbrot {
  minX = -2;
  maxX = 2;
  minY = -2;
  maxY = 2;
  maxAbs = 2;

  maxIterations = 10;

  numericWidth = this.maxX - this.minX;
  numericHeight = this.maxY - this.minY;

  escapeValues: [number][number];

  generate(pxSize: number) {
    const deltaX = this.numericWidth / pxSize;
    const deltaY = this.numericHeight / pxSize;

    for (let i = 0; i < pxSize; i++) {
      const re = this.minX + i * deltaX;
      for (let j = 0; j < pxSize; j++) {
        const im = this.minY + j * deltaY;

        let z: Complex = math.complex(re, im);
        const iterations = this.iterateZ(z);
        this.escapeValues[i][j] = iterations;
      }
    }
  }

  iterateZ(z: Complex): number {
    let iterations = 0;
    // iterate until escape or limit reached
    return iterations;
  }
}
