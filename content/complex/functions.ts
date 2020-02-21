import {isPalindrome, words, flatten} from '@mathigon/core';
import {Line, Point} from '@mathigon/fermat';
import {Draggable, $N, InputView, ElementView} from '@mathigon/boost';
import {Geopad, GeoPoint, PlayBtn, Slider, Step} from '../shared/types';
import {Complexarithmetic} from './components/complexarithmetic';

import './components/complexarithmetic';

export function drawing($step: Step) {
    const $complexarithmetic = $step.$('x-complex-arithmetic') as Complexarithmetic;
    let switched = false;
  
    $complexarithmetic.on('draw', () => {
      setTimeout(() => $step.score('draw-' + (switched ? 2 : 1)), 500);
    });
  
    $complexarithmetic.on('switch', () => {
      switched = true;
      setTimeout(() => $step.score('switch'), 500);
    });
  }