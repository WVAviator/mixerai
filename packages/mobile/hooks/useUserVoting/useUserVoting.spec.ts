import { act, renderHook, waitFor } from '@testing-library/react-native';
import serverInstance from '../../utilities/serverInstance';
import useUserVoting from './useUserVoting';

jest.mock('../../utilities/serverInstance');

describe('useUserVoting', () => {
  it('should correctly indicate if the vote is a like', async () => {
    jest
      .spyOn(serverInstance, 'get')
      .mockResolvedValue({ data: { vote: 'like' } });

    const { result } = renderHook(() => useUserVoting('1'));

    expect(result.current.isLiked).toBe(false);
    expect(result.current.isDisliked).toBe(false);

    await waitFor(() => expect(result.current.isLiked).toBe(true));
    expect(result.current.isDisliked).toBe(false);
  });

  it('should correctly indicate if the vote is a dislike', async () => {
    jest
      .spyOn(serverInstance, 'get')
      .mockResolvedValue({ data: { vote: 'dislike' } });

    const { result } = renderHook(() => useUserVoting('1'));

    expect(result.current.isLiked).toBe(false);
    expect(result.current.isDisliked).toBe(false);

    await waitFor(() => expect(result.current.isDisliked).toBe(true));
    expect(result.current.isLiked).toBe(false);
  });

  it('should correctly indicate if the user has not voted', async () => {
    jest
      .spyOn(serverInstance, 'get')
      .mockResolvedValue({ data: { vote: null } });

    const { result } = renderHook(() => useUserVoting('1'));

    expect(result.current.isLiked).toBe(false);
    expect(result.current.isDisliked).toBe(false);

    await waitFor(() => {
      expect(result.current.isLiked).toBe(false);
      expect(result.current.isDisliked).toBe(false);
    });
  });

  it('should post a new vote if one does not already exist', async () => {
    jest
      .spyOn(serverInstance, 'get')
      .mockResolvedValue({ data: { vote: null } });

    jest.spyOn(serverInstance, 'post');

    const { result } = renderHook(() => useUserVoting('1'));

    await waitFor(() => {
      expect(result.current.isLiked).toBe(false);
      expect(result.current.isDisliked).toBe(false);
    });

    await act(async () => {
      result.current.like();
    });

    expect(serverInstance.post).toHaveBeenCalledWith('/vote/1', {
      vote: 'like',
    });

    await waitFor(() => {
      expect(result.current.isLiked).toBe(true);
      expect(result.current.isDisliked).toBe(false);
    });
  });

  it('should update an existing vote if one already exists', async () => {
    jest
      .spyOn(serverInstance, 'get')
      .mockResolvedValue({ data: { vote: 'like' } });

    jest.spyOn(serverInstance, 'patch');

    const { result } = renderHook(() => useUserVoting('1'));

    await waitFor(() => {
      expect(result.current.isLiked).toBe(true);
      expect(result.current.isDisliked).toBe(false);
    });

    await act(async () => {
      result.current.dislike();
    });

    expect(serverInstance.patch).toHaveBeenCalledWith('/vote/1', {
      vote: 'dislike',
    });

    await waitFor(() => {
      expect(result.current.isLiked).toBe(false);
      expect(result.current.isDisliked).toBe(true);
    });
  });

  it('should delete an existing vote if the same on already exists', async () => {
    jest
      .spyOn(serverInstance, 'get')
      .mockResolvedValue({ data: { vote: 'dislike' } });

    jest.spyOn(serverInstance, 'delete');

    const { result } = renderHook(() => useUserVoting('1'));

    await waitFor(() => {
      expect(result.current.isLiked).toBe(false);
      expect(result.current.isDisliked).toBe(true);
    });

    await act(async () => {
      result.current.dislike();
    });

    expect(serverInstance.delete).toHaveBeenCalledWith('/vote/1');

    await waitFor(() => {
      expect(result.current.isLiked).toBe(false);
      expect(result.current.isDisliked).toBe(false);
    });
  });
});
