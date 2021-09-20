import React from 'react';
import CodeInputDialog from '../../containers/CodeInputDialog';
import OfflineCodeInputDialog from '../../containers/OfflineCodeInputDialog';

const createLoginPage = (platform) => {
  if (platform === 'web') {
    return <CodeInputDialog open />;
  } else {
    return <OfflineCodeInputDialog open />;
  }
};

export const LoginPage = () => {
  return <div>{createLoginPage(process.env.REACT_APP_PLATFORM)}</div>;
};
