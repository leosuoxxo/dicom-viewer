// Modules
import segmentation from './module/segmentationModule';
import manipulatorState from './module/manipulatorStateModule';
import cursor from './module/cursorModule';
import globalConfiguration from './module/globalConfigurationModule';
import external from '../externalModules.js';

export const state = {
  // Global
  globalTools: {},
  globalToolChangeHistory: [],
  // Tracking
  enabledElements: [],
  tools: [],
  isToolLocked: false,
  activeMultiPartTool: null,
  mousePositionImage: {},
  // Settings
  clickProximity: 6,
  touchProximity: 10,
  handleRadius: 6,
  deleteIfHandleOutsideImage: true,
  preventHandleOutsideImage: false,
  // Cursor
  svgCursorUrl: null,
  //
};

export const getters = {
  mouseTools: () =>
    state.tools.filter((tool) =>
      tool.supportedInteractionTypes.includes('Mouse')
    ),
  touchTools: () =>
    state.tools.filter((tool) =>
      tool.supportedInteractionTypes.includes('Touch')
    ),
  enabledElementByUID: (enabledElementUID) =>
    state.enabledElements.find(
      (element) =>
        external.cornerstone.getEnabledElement(element).uuid ===
        enabledElementUID
    ),
};

export const modules = {
  segmentation,
  cursor,
  globalConfiguration,
  manipulatorState,
};

export function getModule(moduleName) {
  return modules[moduleName];
}

export default {
  modules,
  state,
  getters,
};
