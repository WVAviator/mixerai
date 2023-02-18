import { act, renderHook } from '@testing-library/react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import serverInstance from '../../utilities/serverInstance';
import useAuthentication from './useAuthentication';

jest.mock('expo-web-browser');
jest.mock('expo-linking');
jest.mock('../../utilities/serverInstance');

describe('useAuthentication', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should open an auth session with the provided URL', async () => {
    const { result } = renderHook(() => useAuthentication('/auth/redirect'));
    const url = 'https://example.com/auth';

    await act(async () => {
      result.current.authenticate(url, jest.fn(), jest.fn());
    });

    expect(Linking.createURL).toHaveBeenCalledWith('/auth/redirect');
    expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalledWith(
      expect.stringContaining(url),
    );
  });

  it('should call onAuthenticated callback with user object upon successful completion', async () => {
    const user = { id: 1, name: 'John Doe' };
    const response = { data: { user } };
    jest.spyOn(serverInstance, 'post').mockResolvedValue(response);
    jest.spyOn(WebBrowser, 'openAuthSessionAsync').mockResolvedValue({
      type: 'success',
    } as WebBrowser.WebBrowserAuthSessionResult);

    const onAuthenticated = jest.fn();
    const onError = jest.fn();
    const { result } = renderHook(() => useAuthentication('/auth/redirect'));
    const url = 'https://example.com/auth';

    await act(async () => {
      result.current.authenticate(url, onAuthenticated, onError);
    });

    expect(onAuthenticated).toHaveBeenCalledWith(user);
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError callback with error message upon unsuccessful completion', async () => {
    const response = { error: 'Something went wrong' };
    jest.spyOn(serverInstance, 'post').mockRejectedValue(response);
    jest.spyOn(WebBrowser, 'openAuthSessionAsync').mockResolvedValue({
      type: 'cancel',
    } as WebBrowser.WebBrowserAuthSessionResult);

    const onAuthenticated = jest.fn();
    const onError = jest.fn();
    const { result } = renderHook(() => useAuthentication('/auth/redirect'));
    const url = 'https://example.com/auth';

    await act(async () => {
      result.current.authenticate(url, onAuthenticated, onError);
    });

    expect(onError).toHaveBeenCalledWith(
      'Unable to complete login. Please try again.',
    );
    expect(onAuthenticated).not.toHaveBeenCalled();
  });
});
