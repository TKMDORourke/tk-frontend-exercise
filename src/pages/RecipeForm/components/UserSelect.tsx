import { FC } from "react";
import { User } from "../../../types";
import { StyledInputContainer } from "../RecipeForm";

type UserSelectProps = {
  users: User[];
  selectedUser?: string;
  onUserChange: (userId: string) => void;
};

const UserSelect: FC<UserSelectProps> = ({
  users,
  selectedUser = "",
  onUserChange,
}) => (
  <label>
    <span>Author</span>
    <StyledInputContainer>
      <select
        onChange={(event) => onUserChange(event.target.value)}
        value={selectedUser}
        required
      >
        <option disabled value="">
          Please select
        </option>
        {users.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </StyledInputContainer>
  </label>
);

export default UserSelect;
