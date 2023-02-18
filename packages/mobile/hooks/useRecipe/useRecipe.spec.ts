import { renderHook, waitFor } from '@testing-library/react-native';
import serverInstance from '../../utilities/serverInstance';
import useRecipe from './useRecipe';

jest.mock('../../utilities/serverInstance');

const mockRecipe = {
  id: '1',
  title: 'Mock Recipe',
  description: 'A mock recipe for testing purposes',
};

describe('useRecipe', () => {
  it('should fetch and set the recipe when given a valid recipe ID', async () => {
    jest.spyOn(serverInstance, 'get').mockResolvedValue({ data: mockRecipe });

    const { result } = renderHook(() => useRecipe('1'));

    expect(result.current.recipe).toBeNull();
    expect(result.current.error).toBeNull();
    await waitFor(() => expect(result.current.recipe).toEqual(mockRecipe));

    expect(result.current.error).toBeNull();
  });

  it('should set an error message when there is an error fetching the recipe', async () => {
    const errorMessage = 'Failed to fetch recipe';

    jest
      .spyOn(serverInstance, 'get')
      .mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useRecipe('1'));

    expect(result.current.recipe).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.error).toBeDefined());

    expect(result.current.recipe).toBeNull();
  });
});
