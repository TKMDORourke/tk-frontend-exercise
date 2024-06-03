import { FC } from "react";
import { InvalidRequestError, NotFoundError } from "../../../shared/exceptions";
import { ErrorPanel } from "../../../shared/components/ErrorPanel";

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

  return <ErrorPanel role="alert">{getErrorMessage(error)}</ErrorPanel>;
};

export default ErrorMessage;
