import { Redirect, Route, Switch } from 'react-router-dom';
import Recipes from "./pages/Recipes/Recipes";

const Routes = () => {
    return (
        <Switch>
            <Route path="/recipes">
                <Recipes />
            </Route>
            <Route>
                <Redirect to="/recipes" />
            </Route>
        </Switch>
    )
}

export default Routes;