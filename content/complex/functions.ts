import {isPalindrome, words, flatten} from '@mathigon/core';
import {Line, Point} from '@mathigon/fermat';
import {Draggable, $N, InputView, ElementView} from '@mathigon/boost';
import {Geopad, GeoPoint, PlayBtn, Slider, Step} from '../shared/types';
import {ComplexTransform} from './components/complextransform';

import './components/complextransform';

export function drawing($step: Step) {
    const $complextransform = $step.$('x-complex-transform') as ComplexTransform;
    let switched = false;
  
    $complextransform.on('draw', () => {
      setTimeout(() => $step.score('draw-' + (switched ? 2 : 1)), 500);
    });
  
    $complextransform.on('switch', () => {
      switched = true;
      setTimeout(() => $step.score('switch'), 500);
    });
  }