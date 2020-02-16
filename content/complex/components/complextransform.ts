// =============================================================================
// ComplexTransform Component
// (c) Mathigon
// =============================================================================

import {flatten, tabulate2D} from '@mathigon/core';
import {Point, Line} from '@mathigon/fermat';
import {CanvasView, CustomElementView, register, slide} from '@mathigon/boost';
import {Complex} from '@mathigon/fermat';
import {Select} from '../../shared/types';

// -------------------------------------------------------------------------
// Component

let width  = 2000;
let height = 2000;

let xStart = -(width/2);
let xEnd   = (width/2);
let yStart = -(height/2);
let yEnd   = (height/2);

let complexNumberOne  = new Complex(getRandomCoordinates(xStart,xEnd), getRandomCoordinates(yStart,yEnd)); //gets random coordinates between within the plane
let complexNumberTwo  = new Complex(getRandomCoordinates(xStart,xEnd), getRandomCoordinates(yStart,yEnd));
let complexSum        = Complex.sum(complexNumberOne,complexNumberTwo);
let complexDifference = Complex.difference(complexNumberOne,complexNumberTwo);
let complexProduct    = Complex.product(complexNumberOne,complexNumberTwo);
let complexQuotient   = Complex.quotient(complexNumberOne,complexNumberTwo);


@register('x-complex-transform', {templateId: '#complex-transform'})
export class ComplexTransform extends CustomElementView {

  ready() {
    const $canvas = this.$('canvas') as CanvasView;
    const context = $canvas.ctx;

    context.translate((width/2), (height/2));

    drawPlane(context,width,height);

    drawCircle(context, complexNumberOne.re ,complexNumberOne.im);
    drawCircle(context, complexNumberTwo.re ,complexNumberTwo.im);
    drawCircle(context, complexSum.re,complexSum.im,"blue");
    // drawCircle(context, complexQuotient.re,complexQuotient.im,"red");
    // drawCircle(context, complexProduct.re,complexProduct.im,"green");
    // drawCircle(context, complexDifference.re,complexDifference.im,"teal");


    // slide($canvas, {
    //  // start: p => drawCircle(context, randomCoordinate() ,randomCoordinate()),
    //   end: () => this.trigger('draw'),
    //   justInside: true
    // });
  }
}

// -------------------------------------------------------------------------
// Utility Functions

function drawPlane(context:CanvasRenderingContext2D, width: number, height: number) {
  context.save();
  context.fillStyle = 'black'; // text color
  context.font = '48px Monospace';

  // draw vertical from X to Height
  for (let x = -width; x < width; x += 100) {
    if(x===0){
      context.lineWidth = 10;
      context.strokeStyle = 'black';
    }

    context.beginPath();
    context.moveTo(x, -height);
    context.lineTo(x, height);
    context.stroke();
    context.strokeStyle = 'gray';
    context.lineWidth = 2;

    // draw text
    context.fillText(String(x/100), x+5, 50)
  }

  // draw horizontal from Y to Width
  for (let y = -height; y < height; y += 100) {
    if(y===0){
      context.lineWidth = 10;
      context.strokeStyle = 'black';
      context.fillStyle = 'white';
    }
    context.beginPath();
    context.moveTo(-width, y);
    context.lineTo(width, y);
    context.stroke();
    context.strokeStyle = 'gray';
    context.lineWidth = 2;

    // draw text
    context.fillText(String(-y/100), 10, y);
    context.fillStyle = 'black';
  }
}

function drawCircle(context:CanvasRenderingContext2D  ,re: number,im: number,color: string = "black",size: number = 30) {
  let coordinates = {//mapping the actual complex numbers to the pixels on the canvas
    x:Math.round(re)*100,
    y:Math.round(im)*100
  };
  context.beginPath();
  context.arc(coordinates.x, coordinates.y, size, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
  drawLabel(context,Math.round(re),Math.round(im),coordinates);
}

function drawLabel(context:CanvasRenderingContext2D, x:number,y:number,coords) {
  context.fillStyle = 'black';
  if(coords.x >=xStart && coords.x <= xStart/2 || coords.x >0 && coords.x <= xEnd/2 ){//labels are placed to the right of the circle
    if((-y)<0) {
    context.fillText("["+String(x) + "-" + String(y) + "i]", coords.x+30, coords.y+10);
    }else{
    context.fillText("["+String(x) + "+" + String(-y) + "i]", coords.x+30, coords.y+10);
    }
  }else if(coords.x >= xStart/2 && coords.x <= 0 || coords.x >=xEnd/2 && coords.x <= xEnd){ //labels are placed to the left of the circle
    if((-y)<0) {
      context.fillText("["+String(x) + "-" + String(y) + "i]", coords.x-230, coords.y+10);
    }else{
      context.fillText("["+String(x) + "+" + String(-y) + "i]", coords.x-230, coords.y+10);
    }
  }

}

function getRandomCoordinates(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min)/100);
}
// -------------------------------------------------------------------------