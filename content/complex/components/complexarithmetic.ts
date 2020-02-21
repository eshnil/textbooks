// =============================================================================
// ComplexArithmetic Component
// (c) Mathigon
// =============================================================================

import { CanvasView, CustomElementView, register, slide } from '@mathigon/boost';
import { Complex } from '@mathigon/fermat';
import { Select } from '../../shared/types';

// -------------------------------------------------------------------------
// Global Variables used by utility functions and runtime components

//size of the canvas element
const width  = 2000;
const height = 2000;

// -------------------------------------------------------------------------
// Component

@register('x-complex-arithmetic', {templateId: '#complex-arithmetic'})
export class Complexarithmetic extends CustomElementView {

  ready() {
    const $arithmeticOperations = this.$('x-select.tabs') as Select;
    const $canvas = this.$('canvas') as CanvasView;
    const context = $canvas.ctx;

    context.translate((width/2), (height/2));// Change the origin of the canvas to its center from the top left corner

    let complexNumberOne  = new Complex(getRandomNumber(-5,5), getRandomNumber(-5,5)); // z1
    let complexNumberTwo  = new Complex(getRandomNumber(-5,5), getRandomNumber(-5,5)); // z2

    //Flags that signify if a complex number can be dragged
    let draggable = {
      z1 : false,
      z2 : false
    };

    let activeArithmeticOperation = "Sum"; //Possible operations - Sum, Difference, Product, Quotient

    complexPlane(context,width,height,complexNumberOne,complexNumberTwo,activeArithmeticOperation);//Initial Plane with the randomly generated complex numbers that are added

    //Change the arithmetic operation to the selected tab
    $arithmeticOperations.on('change', $active => {
      activeArithmeticOperation = $active.data.value;
      complexPlane(context,width,height,complexNumberOne,complexNumberTwo,activeArithmeticOperation);
    });

    slide($canvas, {

      //Identify first click coordinates to check if and which complex number has been selected and flag selected number as draggable
        start: p => {
           let initialComplexNumber = new Complex(Math.round((p.x-1000) /100),Math.round((p.y-1000) /100)); //get the complex number present in the first click's coordinates
          if(initialComplexNumber.re===complexNumberOne.re && initialComplexNumber.im===complexNumberOne.im) {
            draggable.z1= true;
          }else if(initialComplexNumber.re===complexNumberTwo.re && initialComplexNumber.im===complexNumberTwo.im) {
            draggable.z2= true;
          }else{
            console.log("Please move an existing complex number");
          }
        },

      // Drag the Complex number selected by the user's initial click location
        "move": p =>{
          let selectedComplexNumber = new Complex(Math.round((p.x-1000) /100),Math.round((p.y-1000) /100));
           if(draggable.z1) {
             complexNumberOne = selectedComplexNumber;
           }else if(draggable.z2) {
             complexNumberTwo = selectedComplexNumber;
           }
          complexPlane(context, width, height, complexNumberOne, complexNumberTwo, activeArithmeticOperation);
        },

      // De-flag Complex number once moved
         end: () => {
          draggable.z2= false;
         draggable.z1= false;
         },

      "justInside": true //Limit movement to within the canvas
    });
  }
}

// -------------------------------------------------------------------------
// Canvas Functions

function complexPlane(context:CanvasRenderingContext2D, width: number, height:number,z1: any, z2:any, operation :string ) {
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
  for (let x = -width; x < width; x += 100) {//splitting each quadrant into 10 values
    if(x===0){
      drawLine(context,x,-height,x,height,10,"black");
      context.fillStyle = "rgba(255, 255, 255, 0)";//0 Label for the Y axis is transparent
    }else{
      context.fillStyle = "black";
      drawLine(context,x,-height,x,height);
  }
    context.fillText(String(x/100), x, 50)// Labels for the graph
  }

  // Horizontal lines
  for (let y = -height; y < height; y += 100) {
    if(y===0){
      drawLine(context,-width,y,width,y,10,"black");
      context.fillText(String(-y/100), 10, y+50);
    }else{
      drawLine(context,-width,y,width,y);
      context.fillText(String(-y/100), 10, y+5);
    }
  }
}

function drawLine(context:CanvasRenderingContext2D, lineStartX: number, lineStartY:number, lineEndX: number, lineEndY: number, lineThickness= 2, lineColour= "grey" ) {
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

function drawCircle(context:CanvasRenderingContext2D  ,re: number,im: number, color = "black",size = 30) {
  let coordinates = {//mapping the actual complex numbers to the pixels on the canvas
    x:Math.round(re)*100,
    y:Math.round(im)*100
  };
  context.beginPath();
  context.arc(coordinates.x, coordinates.y, size, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();

  if(color==="black"){ //overlays arrows heads over z1 and z2 which are always black in color
    drawDragLabel(context,coordinates);
  }

  drawLabel(context,Math.round(re),Math.round(im),coordinates);

  function drawLabel(context:CanvasRenderingContext2D, x:number,y:number,coords:any) {
    //first and last horizontal coordinates of the plane
    const xStart = -(width/2);
    const xEnd   = (width/2);

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
  function drawDragLabel(context:CanvasRenderingContext2D,point:any,arrowLength = 12){
    // Drawing 4 arrow heads spanning 23 pixels from the center of the circle moving in all 4 movable directions
    drawArrow(context,point.x,point.y,point.x,point.y+23,arrowLength);
    drawArrow(context,point.x,point.y,point.x,point.y-23,arrowLength);
    drawArrow(context,point.x,point.y,point.x+23,point.y,arrowLength);
    drawArrow(context,point.x,point.y,point.x-23,point.y,arrowLength);

    function drawArrow(context:CanvasRenderingContext2D, fromx:number, fromy:number, tox:number, toy:number, headlen:number, arrowAngle = 4) {
      let dx = tox - fromx;
      let dy = toy - fromy;
      let angle = Math.atan2(dy, dx);
      context.strokeStyle = "white";
      context.lineWidth = 3.5;
      context.beginPath();
      context.moveTo(fromx, fromy);
      context.lineTo(tox, toy);
      context.lineTo(tox - headlen * Math.cos(angle - Math.PI / arrowAngle), toy - headlen * Math.sin(angle - Math.PI / arrowAngle));
      context.moveTo(tox, toy);
      context.lineTo(tox - headlen * Math.cos(angle + Math.PI / arrowAngle), toy - headlen * Math.sin(angle + Math.PI / arrowAngle));
      context.stroke();
    }
  }
}

function clearCanvas(context: CanvasRenderingContext2D) {
  context.save();

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, width, height);

  context.restore();
}

function getRandomNumber(min:number, max:number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// -------------------------------------------------------------------------