import React, { forwardRef } from 'react';

import Box from '../Box';

const Flex = forwardRef((props, ref) => (
    <Box display="flex" ref={ref} {...props} />
  ));
Flex.displayName = 'Flex';

export default Flex;