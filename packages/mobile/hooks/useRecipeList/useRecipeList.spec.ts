import { act, renderHook, waitFor } from '@testing-library/react-native';
import serverInstance from '../../utilities/serverInstance';
import useRecipeList from './useRecipeList';

// mock serverInstance.get
jest.mock('../../utilities/serverInstance');

const mockRecipes = [
  { id: '1', name: 'Recipe 1', description: 'Recipe 1 description' },
  { id: '2', name: 'Recipe 2', description: 'Recipe 2 description' },
];

describe('useRecipeList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set recipes on mount', async () => {
    jest.spyOn(serverInstance, 'get').mockResolvedValue({ data: mockRecipes });

    const { result } = renderHook(() => useRecipeList());

    await waitFor(() => expect(result.current.recipes).toEqual(mockRecipes));

    expect(serverInstance.get).toHaveBeenCalledWith('/feed');
  });

  it('should refresh recipes', async () => {
    // serverInstance.get.mockResolvedValueOnce({ data: mockRecipes });
    jest.spyOn(serverInstance, 'get').mockResolvedValue({ data: mockRecipes });

    const { result } = renderHook(() => useRecipeList());

    await waitFor(() => expect(result.current.recipes).toEqual(mockRecipes));

    // Mock server response with updated recipes
    const updatedRecipes = [
      { id: '3', name: 'Recipe 3', description: 'Recipe 3 description' },
      { id: '4', name: 'Recipe 4', description: 'Recipe 4 description' },
    ];
    // serverInstance.get.mockResolvedValueOnce({ data: updatedRecipes });
    jest
      .spyOn(serverInstance, 'get')
      .mockResolvedValue({ data: updatedRecipes });

    await act(async () => {
      await result.current.onRefresh();
    });

    await waitFor(() => expect(result.current.recipes).toEqual(updatedRecipes));

    expect(serverInstance.get).toHaveBeenCalledWith('/feed');
  });
});
