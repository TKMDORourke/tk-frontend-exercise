import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateRecipe } from "../api";
import type { RecipeUpdate } from "../../../types";
import snakify from "snakify-ts";

const useUpdateRecipeMutation = (): UseMutationResult<
  void,
  Error,
  RecipeUpdate
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recipe: RecipeUpdate) => {
      const { id, ...recipeDetails } = recipe;
      await updateRecipe(recipe.id, snakify(recipeDetails));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }),
  });
};

export default useUpdateRecipeMutation;
