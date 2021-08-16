import { createContext, useState } from 'react';
import { VIEWER_LAYOUT } from './constants';

const ConfigContext = createContext({});

export const useConfigContext = () => {
  const [currentLayout, setCurrentLayout] = useState(VIEWER_LAYOUT[0]);
  return {
    currentLayout,
    setCurrentLayout,
  };
};

export default ConfigContext;
