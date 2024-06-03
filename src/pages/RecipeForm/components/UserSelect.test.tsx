import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserSelect from "./UserSelect";

describe("UserSelect", () => {
  it("shows all given users as options", () => {
    render(
      <UserSelect
        users={[
          {
            id: "abc",
            name: "Test User 1",
            email: "",
          },
        ]}
        onUserChange={jest.fn()}
      />
    );

    expect(
      screen.getByRole("option", { name: "Test User 1" })
    ).toBeInTheDocument();
  });

  it("defaults to the placeholder option when a user is not selected", () => {
    render(<UserSelect users={[]} onUserChange={jest.fn()} />);

    expect(
      screen.getByRole<HTMLOptionElement>("option", { name: "Please select" })
        .selected
    ).toBeTruthy();
  });

  it("calls the onUserChange function if a user is changed", async () => {
    const user = userEvent.setup();
    const setUserId = jest.fn();

    render(
      <UserSelect
        users={[{ id: "abc", name: "Test User 1", email: "" }]}
        onUserChange={setUserId}
      ></UserSelect>
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Author" }),
      screen.getByRole("option", { name: "Test User 1" })
    );

    expect(setUserId).toHaveBeenCalledWith("abc");
  });
});
