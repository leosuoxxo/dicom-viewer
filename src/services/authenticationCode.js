import React, { useState, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useRequest } from 'ahooks';
import {
  RepositoryName,
  RepositoryFactory,
} from '../repository/RepositoryFactory';
const repository = RepositoryFactory[RepositoryName.Organization];

export const useAuthenticationCode = () => {
  const history = useHistory();
  const [code, setCode] = useState(['', '', '', '']);
  const [isSuccess, setSuccess] = useState(false);
  const authenticationCode = code.join('-');

  const { loading, run, error } = useRequest(
    ({ code }) => repository.authenticateCode({ code }),
    {
      manual: true,
      throwOnError: true,
      onSuccess: (_, [{ code }]) => {
        localStorage.setItem('code', code);
        setSuccess(true);
        history.push('/');
      },
      onError: () => {
        localStorage.removeItem('code');
      },
    }
  );

  useEffect(() => {
    const code = localStorage.getItem('code');
    if (!code) {
      history.push('/login');
      return;
    }
    run({ code });
  }, [history, run]);

  return {
    isSuccess,
    code,
    authenticationCode,
    loading,
    run,
    error,
    setCode,
  };
};

export const Context = createContext({});
export const useAuthenticationCodeService = () => useContext(Context);
export const AuthenticationCodeProvider = ({ children }) => {
  return (
    <Context.Provider value={useAuthenticationCode()}>
      {children}
    </Context.Provider>
  );
};

AuthenticationCodeProvider.propTypes = {
  children: PropTypes.node,
};
