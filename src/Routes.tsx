import { Redirect, Route, Switch } from "react-router-dom";
import Recipes from "./pages/Recipes/Recipes";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import RecipeForm from "./pages/RecipeForm/RecipeForm";

const Routes = () => {
  return (
    <Switch>
      <Route path="/recipes/create">
        <RecipeForm mode="CREATE" />
      </Route>
      <Route path="/recipes/:recipeId/edit">
        <RecipeForm mode="UPDATE" />
      </Route>
      <Route path="/recipes/:recipeId">
        <RecipeDetail />
      </Route>
      <Route path="/recipes">
        <Recipes />
      </Route>
      <Route>
        <Redirect to="/recipes" />
      </Route>
    </Switch>
  );
};

export default Routes;
