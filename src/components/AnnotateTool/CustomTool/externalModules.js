import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import Hammer from 'hammerjs';

export default {
  get cornerstone() {
    return cornerstone;
  },

  get cornerstoneMath() {
    return cornerstoneMath;
  },

  get Hammer() {
    return Hammer;
  },
};
