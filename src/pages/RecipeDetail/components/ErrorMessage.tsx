import { FC } from "react";
import { InvalidRequestError, NotFoundError } from "../exceptions";

const ErrorMessage: FC<{ error: unknown }> = ({ error }) => {
  const getErrorMessage = (error: unknown) => {
    if (error instanceof NotFoundError) {
      return "No recipe exists for this ID";
    }
    if (error instanceof InvalidRequestError) {
      return "This ID is in the wrong format";
    }
    return "Could not load recipe, please try again later";
  };

  return <span role="alert">{getErrorMessage(error)}</span>;
};

export default ErrorMessage;
