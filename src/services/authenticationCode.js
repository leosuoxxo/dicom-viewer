import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { validateMachineId } from '../utils/crypto';
import {
  RepositoryName,
  RepositoryFactory,
} from '../repository/RepositoryFactory';
const repository = RepositoryFactory[RepositoryName.Organization];

export const useOnlineAuthenticationCode = () => {
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

export const useOfflineAuthenticationCode = () => {
  const history = useHistory();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setError(false);
  }, [code]);

  const authenticationCode = useCallback(
    async (code) => {
      const isValidated = await validateMachineId(code);
      if (!isValidated) {
        setError(true);
        history.push('/login');
        return;
      } else {
        localStorage.setItem('code', code);
        setIsSuccess(true);
        setError(false);
        history.push('/');
      }
    },
    [history]
  );

  useEffect(() => {
    const code = localStorage.getItem('code');
    if (!code) {
      history.push('/login');
      return;
    }

    authenticationCode(code);
  }, [history, authenticationCode]);

  return {
    isSuccess,
    error,
    code,
    setCode,
    authenticationCode,
  };
};

export const useAuthenticationCode =
  process.env.REACT_APP_PLATFORM === 'web'
    ? useOnlineAuthenticationCode
    : useOfflineAuthenticationCode;
