/**
 * A single tile rendered as SVG
 */
export class Tile {
  root: SVGElement;
  tileFactoryId: string;

  constructor(tileFactoryId: string) {
    this.tileFactoryId = tileFactoryId;

    this.root = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.root.classList.add('tile');
    this.root.setAttribute('viewBox', '0 0 100 100');
    this.root.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    this.root.style.width = `100px`;
    this.root.style.height = `100px`;
    this.root.style.position = 'absolute';

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#${tileFactoryId}`);
    this.root.appendChild(use);
  }

  setPosition(x: number, y: number) {
    this.root.style.left = `${x}px`;
    this.root.style.top = `${y}px)`;
  }
}
