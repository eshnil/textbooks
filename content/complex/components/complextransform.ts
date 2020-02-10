// =============================================================================
// ComplexTransform Component
// (c) Mathigon
// =============================================================================


import {flatten, tabulate2D} from '@mathigon/core';
import {Point, Line} from '@mathigon/fermat';
import {CanvasView, CustomElementView, register, slide} from '@mathigon/boost';
import {Select} from '../../shared/types';


// -------------------------------------------------------------------------
// Symmetry Functions

const width = 1920;
const height = 1280;

const pointX1M = new Point(240, 320);
const pointX1Y1 = new Point(480, 320);
const lineX1 = new Line(new Point(0, 320), new Point(480, 320));
const lineY1 = new Line(new Point(480, 0), new Point(480, 320));
const lineY2 = new Line(new Point(640, 0), new Point(640, 320));

const pointS = new Point(360, 360);
const lineS = new Line(new Point(0, 0), new Point(360, 360));
const lineSI = new Line(new Point(0, 720), new Point(720, 0));

function grid(points: Point[], x: number, y: number) {
  return flatten<Point>(tabulate2D((i, j) =>
      points.map((p: Point) => p.shift(i * x, j * y)), width / x, height / y));
}

function applyTransforms(point: Point, [x, y]: [number, number],
                         transforms: ((p: Point) => Point)[]) {
  let points = [point.mod(x, y)];

  for (let t of transforms) {
    for (let p of points.map(p => t(p))) {
      if (!points.some(q => q.equals(p))) points.push(p);
    }
  }

  points = points.filter(p => (p.x >= 0 && p.x < x && p.y >= 0 && p.y < y));
  return grid(points, x, y);
}

function lineX(y: number) {
  return new Line(new Point(0, y), new Point(1, y));
}

function lineY(x: number) {
  return new Line(new Point(x, 0), new Point(x, 1));
}

function line(a1: number, a2: number, b1: number, b2: number) {
  return new Line(new Point(a1, a2), new Point(b1, b2));
}

export const TRANSFORMATIONS: (((p: Point) => Point[])|undefined)[] = [
  undefined,

  p => {  // p1
    const p1 = p.mod(480, 320);
    return grid([p1], 480, 320);
  },

  p => {  // p2
    const p1 = p.mod(480, 640);
    const p2 = p1.rotate(Math.PI, pointX1M);
    return grid([p1, p2], 480, 640);
  },

  p => {  // p3
    const h = 640;
    const w = h / Math.sqrt(3) / 2;
    return applyTransforms(p, [6 * w, h], [
      p => p.rotate(2 * Math.PI / 3, new Point(w, 0)),
      p => p.rotate(-2 * Math.PI / 3, new Point(w, h)),
      p => p.rotate(-2 * Math.PI / 3, new Point(5 * w, 0)),
      p => p.rotate(2 * Math.PI / 3, new Point(5 * w, h)),
      p => p.rotate(2 * Math.PI / 3, new Point(2 * w, h / 2)),
      p => p.rotate(-2 * Math.PI / 3, new Point(2 * w, h / 2)),
      p => p.rotate(2 * Math.PI / 3, new Point(4 * w, h / 2)),
      p => p.rotate(-2 * Math.PI / 3, new Point(4 * w, h / 2))
    ]);
  }

];

// -------------------------------------------------------------------------
// Component

function drawPoint(ctx: CanvasRenderingContext2D, group: number, point: Point) {
  for (let p of TRANSFORMATIONS[group]!(point)) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
    ctx.fill();
  }
}

@register('x-complex-transform', {templateId: '#complex-transform'})
export class ComplexTransform extends CustomElementView {

  ready() {
    const $canvas = this.$('canvas') as CanvasView;
    const context = $canvas.ctx;

    const $groups = this.$('x-select.tabs') as Select;
    let activeGroup = +$groups.$active.data.value!;
    $groups.on('change', $active => {
      context.clearRect(0, 0, 1e10, 1e10);
      activeGroup = +$active.data.value;
      this.trigger('switch', activeGroup);
    });

    const $colours = this.$('x-select.colours') as Select;
    context.fillStyle = $colours.$active.css('background-color')!;
    $colours.on('change', $active => {
      context.fillStyle = $active.css('background-color');
    });

    this.$('.clear')!.on('click', () => context.clearRect(0, 0, 1e10, 1e10));
    this.$('.save')!.on('click', e => e.target.href = $canvas.pngImage);

    slide($canvas, {
      start: p => drawPoint(context, activeGroup, p),
      move(p, _, last) {
        let l = new Line(last, p);
        let n = l.length / 8;
        for (let i = 0; i < n; ++i) drawPoint(context, activeGroup,
            l.at(i / n));
      },
      end: () => this.trigger('draw'),
      justInside: true
    });
  }
}
