import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { createRecipe } from "../api";
import type { RecipeCreation, RecipeListing } from "../../../types";
import snakify from "snakify-ts";
import camelize from "camelize-ts";

const useCreateRecipeMutation = (): UseMutationResult<
  RecipeListing,
  Error,
  RecipeCreation
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recipe: RecipeCreation) => {
      const response = await createRecipe(snakify(recipe));
      return camelize(response);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }),
  });
};

export default useCreateRecipeMutation;
