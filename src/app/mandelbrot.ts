import * as math from 'mathjs';
import { Complex } from 'mathjs';

const maxR = 2;

export class Mandelbrot {
  minX = -2;
  maxX = 2;
  minY = -2;
  maxY = 2;

  numericWidth = this.maxX - this.minX;
  numericHeight = this.maxY - this.minY;

  escapeValues: number[][] = [];

  public generate(pxSize: number, maxIterations: number): number[][] {
    const deltaX = this.numericWidth / pxSize;
    const deltaY = this.numericHeight / pxSize;

    for (let i = 0; i < pxSize; i++) {
      this.escapeValues[i] = [];
      const re = this.minX + i * deltaX;
      for (let j = 0; j < pxSize; j++) {
        const im = this.minY + j * deltaY;
        let c: Complex = math.complex(re, im);
        const iterations = this.iterateZ(c, maxIterations);
        this.escapeValues[i][j] = iterations;
      }
    }
    return this.escapeValues;
  }

  iterateZ(c: Complex, maxIterations: number): number {
    let iterations = 0;
    let z = math.complex(0, 0);
    // iterate until escape or limit reached
    while (iterations < maxIterations) {
      let z2 = math.add(math.square(z), c) as Complex;
      const r = z2.toPolar().r;
      if (r > maxR) {
        break;
      }
      z = z2;
      iterations++;
    }
    return iterations;
  }
}
