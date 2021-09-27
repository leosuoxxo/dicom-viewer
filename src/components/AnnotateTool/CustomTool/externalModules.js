import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import Hammer from 'hammerjs';

export default {
  set cornerstone(cs) {
    cornerstone = cs;
  },
  get cornerstone() {
    return cornerstone;
  },
  set cornerstoneMath(cm) {
    cornerstoneMath = cm;
  },
  get cornerstoneMath() {
    return cornerstoneMath;
  },
  set Hammer(module) {
    Hammer = module;
  },
  get Hammer() {
    return Hammer;
  },
};
