import { useState, useEffect } from 'react';
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
  const authenticationCode = code.join('-');

  const { loading, run, error } = useRequest(
    ({ code }) => repository.authenticateCode({ code }),
    {
      manual: true,
      throwOnError: true,
      onSuccess: () => {
        localStorage.setItem('code', authenticationCode);
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
    code,
    authenticationCode,
    loading,
    run,
    error,
    setCode,
  };
};
