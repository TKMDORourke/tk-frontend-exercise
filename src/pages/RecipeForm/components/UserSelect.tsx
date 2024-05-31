import { FC } from "react";
import { User } from "../../../types";

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
    <span>Author: </span>
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
  </label>
);

export default UserSelect;
