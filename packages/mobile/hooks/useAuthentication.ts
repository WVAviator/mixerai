import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { User } from '../types';

/**
 * A hook that handles communication with the server to complete the OAuth flow.
 * @param authRoute The route that the server will redirect to after authentication.
 * @returns An object with a function 'authenticate' that takes a server URL to open, a callback to call on success that is invoked with the user object, and an optional callback to call on error with an error message., as arguments. Upon successful completion a JWT will be assigned to the user's cookies for subsequent authentication.
 */
const useAuthentication = (authRoute: string) => {
  const authenticate = async (
    url: string,
    onAuthenticated: (user: User) => void,
    onError?: (error: string) => void
  ) => {
    const auid = Math.random().toString(36).slice(2, 11);
    const authUrl = new URL(url);
    authUrl.searchParams.append('auid', auid);
    authUrl.searchParams.append('cb', Linking.createURL(authRoute));

    const result = await WebBrowser.openAuthSessionAsync(authUrl.toString());

    if (result.type !== 'success' && result.type !== 'dismiss') {
      console.log('Auth session failed', result);
      onError && onError('Unable to complete login. Please try again.');
      return;
    }

    try {
      const authResponse = await fetch('https://api.mixerai.app/auth/login', {
        method: 'POST',
        body: JSON.stringify({ auid }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { user } = await authResponse.json();

      onAuthenticated(user);
    } catch (error) {
      onError && onError('Unable to complete login. Please try again.');
    }
  };

  return { authenticate };
};

export default useAuthentication;
