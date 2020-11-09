export class Pixel {
  constructor(private ctx: CanvasRenderingContext2D) {}
  drawSquare(x: number, y: number, z: number) {
    this.ctx.fillRect(x * z, y * z, z, z);
  }
  drawPixel(x: number, y: number) {
    this.ctx.fillRect(x, y, 1, 1);
  }
}
