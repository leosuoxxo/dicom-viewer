import styled from 'styled-components';
import {
  // margin, padding
  space,
  // check theme objects
  color,
  // fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textAlign, and fontStyle.
  typography,
  // width, height, display, minWidth, minHeight, maxWidth, maxHeight, size, verticalAlign, overflow, overflowX, and overflowY.
  layout,
  // alignItems, alignContent, justifyItems, justifyContent, flexWrap, flexDirection, flex, flexGrow, flexShrink, flexBasis, justifySelf, alignSelf, and order.
  flexbox,
  // gridGap, gridRowGap, gridColumnGap, gridColumn, gridRow, gridArea, gridAutoFlow, gridAutoRows, gridAutoColumns, gridTemplateRows, gridTemplateColumns, gridTemplateAreas
  grid,
  // backgroundImage, backgroundSize, backgroundPosition, and backgroundRepeat.
  background,
  // border, borderWidth, borderStyle, borderColor, borderRadius, borderTop, borderTopWidth, borderTopStyle, borderTopColor, borderTopLeftRadius, borderTopRightRadius, borderRight, borderRightWidth, borderRightStyle, borderRightColor, borderBottom, borderBottomWidth, borderBottomStyle, borderBottomColor, borderBottomLeftRadius, borderBottomRightRadius, borderLeft, borderLeftWidth, borderLeftStyle, borderLeftColor, borderX, and borderY.
  border,
  // position, zIndex, top, right, bottom, and left.
  position,
  // textShadow and boxShadow
  shadow
} from 'styled-system';

/** Styled System API doc: https://styled-system.com/api */
export const Box = styled.div`
  box-sizing: border-box;

  ${space};
  ${color};
  ${typography};
  ${layout};
  ${flexbox};
  ${grid}
  ${background};
  ${border};
  ${position};
  ${shadow};
`;
Box.displayName = 'Box';
