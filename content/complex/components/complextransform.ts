// =============================================================================
// ComplexTransform Component
// (c) Mathigon
// =============================================================================

import {flatten, tabulate2D} from '@mathigon/core';
import {Point, Line} from '@mathigon/fermat';
import {CanvasView, CustomElementView, register, slide,hover} from '@mathigon/boost';
import {Complex} from '@mathigon/fermat';
import {Select} from '../../shared/types';
import {numberline} from "../../exploding-dots/functions";

// -------------------------------------------------------------------------
// Component

const width  = 2000;
const height = 2000;

const xStart = -(width/2);
const xEnd   = (width/2);
const yStart = -(height/2);
const yEnd   = (height/2);

@register('x-complex-transform', {templateId: '#complex-transform'})
export class ComplexTransform extends CustomElementView {

  ready() {
    const $canvas = this.$('canvas') as CanvasView;
    const context = $canvas.ctx;
    context.translate((width/2), (height/2));// change the origin of the canvas to its center from the top left corner

    let complexNumberOne  = new Complex(getRandomCoordinates(xStart/2,xEnd/2), getRandomCoordinates(yStart/2,yEnd/2)); //gets random coordinates within the plane
    let complexNumberTwo  = new Complex(getRandomCoordinates(xStart/2,xEnd/2), getRandomCoordinates(yStart/2,yEnd/2));
    //Flags to mark the complex number to be moved
    let complexOneActive = false;
    let complexTwoActive = false;
    const arithmeticOperations = ["Sum","Product","Difference","Quotient"]; // Possible arithmetic operations
    let activeArithmeticOperation = arithmeticOperations[0]; // 0 - Sum, 1 - Difference, 2 - Product, 3 - Quotient

    drawPlane(context,width,height,complexNumberOne,complexNumberTwo,activeArithmeticOperation);//Initial Plane with the randomly generated complex numbers
    slide($canvas, {
        start: p => {//Identify which circle has been selected and flag them as active
           let selectedComplexNumber = new Complex(Math.round((p.x-1000) /100),Math.round((p.y-1000) /100));
          if(selectedComplexNumber.re===complexNumberOne.re && selectedComplexNumber.im===complexNumberOne.im) {
            complexOneActive= true;
          }else if(selectedComplexNumber.re===complexNumberTwo.re && selectedComplexNumber.im===complexNumberTwo.im) {
            complexTwoActive= true;
          }else{
            console.log("Please move an existing complex number");
          }
        },
        "move": p =>{// Move the active Complex number
          let selectedComplexNumber = new Complex(Math.round((p.x-1000) /100),Math.round((p.y-1000) /100));
           if(complexOneActive) {
             complexNumberOne = selectedComplexNumber;
             drawPlane(context, width, height, complexNumberOne, complexNumberTwo, activeArithmeticOperation);
           }else if(complexTwoActive) {
             complexNumberTwo = selectedComplexNumber;
             drawPlane(context, width, height,complexNumberOne, complexNumberTwo, activeArithmeticOperation);
           }
        },
         end: () => {// Deactivate Complex number once moved
          complexTwoActive= false;
         complexOneActive= false;
         },
      "justInside": true //Limit movement to within the canvas
       });

    //Tab Switching - Changes the arithmetic operation
    const $groups = this.$('x-select.tabs') as Select;
    $groups.on('change', $active => {
      clearCanvas(context);
      activeArithmeticOperation = $active.data.value;
      drawPlane(context,width,height,complexNumberOne,complexNumberTwo,activeArithmeticOperation);
    });

  }
}

// -------------------------------------------------------------------------
// Canvas Drawing Functions

function drawPlane(context:CanvasRenderingContext2D, width: number, height:number,z1: any, z2:any, operation :string ) {
  clearCanvas(context);
  drawGraph(context,width,height);

  let complexArithmetic:any;
  let circleColor: any;
  if(operation == "Sum"){
    complexArithmetic = Complex.sum(z1,z2);
    circleColor = "blue";
  }else if(operation == "Quotient"){
    complexArithmetic   = Complex.quotient(z1,z2);
    circleColor = "red";
  }else if(operation == "Product"){
    complexArithmetic  = Complex.product(z1,z2);
    circleColor = "green";
  }else if(operation == "Difference"){
    complexArithmetic = Complex.difference(z1,z2);
    circleColor = "teal"
  }else{
    console.log("Invalid Argument : Complex Arithemtic Operations");
  }
  drawLine(context,0,0,(z1.re*100),(z1.im*100),5,"black"); // Line from 0 -> z1
  drawLine(context,0,0,(z2.re*100),(z2.im*100),5,"black"); // Line from 0 -> z2
  drawLine(context,(z1.re*100),(z1.im*100),(Math.round(complexArithmetic.re)*100),(Math.round(complexArithmetic.im)*100),5,circleColor); // Line from z1 -> output of Calculation
  drawLine(context,(z2.re*100),(z2.im*100),(Math.round(complexArithmetic.re)*100),(Math.round(complexArithmetic.im)*100),5,circleColor); // Line from z2 -> output of Calculation

  //Drawing Circles over the lines
  drawCircle(context, z1.re ,z1.im);
  drawCircle(context, z2.re ,z2.im);
  drawCircle(context, complexArithmetic.re,complexArithmetic.im,circleColor);
}

function drawGraph(context:CanvasRenderingContext2D, width: number, height: number) {
  context.fillStyle = 'black';
  context.font = '45px Monospace';

  // Vertical lines
  for (let x = -width; x < width; x += 100) {
    if(x===0){
      drawLine(context,x,-height,x,height,10,"black");
    }
    drawLine(context,x,-height,x,height,2);
    context.fillText(String(x/100), x+5, 50)// Labels for the graph
  }

  // Horizontal lines
  for (let y = -height; y < height; y += 100) {
    if(y===0){
      drawLine(context,-width,y,width,y,10,"black");
      context.fillStyle = "rgba(255, 255, 255, 0)";
    }
    drawLine(context,-width,y,width,y,2);
    context.fillText(String(-y/100), 10, y);// Labels for the graph
    context.fillStyle = "black";
  }
}

function drawLine(context:CanvasRenderingContext2D, lineStartX: number, lineStartY:number, lineEndX: number, lineEndY: number, lineThickness: number, lineColour= "grey" ) {
  if(lineColour){
    context.strokeStyle = lineColour;
  }
  if(width){
    context.lineWidth = lineThickness;
  }
  context.beginPath();
  context.moveTo(lineStartX, lineStartY);
  context.lineTo(lineEndX, lineEndY);
  context.stroke();
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

function drawLabel(context:CanvasRenderingContext2D, x:number,y:number,coords:any) {
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

function clearCanvas(context: CanvasRenderingContext2D) {
  context.save();

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, width, height);

  context.restore();
}
// -------------------------------------------------------------------------