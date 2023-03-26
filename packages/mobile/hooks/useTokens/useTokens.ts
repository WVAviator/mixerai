import React from 'react';
import serverInstance from '../../utilities/serverInstance';

const useTokens = () => {
  const [tokens, setTokens] = React.useState<number>(3);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTokens = async () => {
      try {
        const { data } = await serverInstance.get('/tokens');
        setTokens(data.tokens);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTokens();
  }, []);

  return { tokens, isLoading };
};

export default useTokens;
