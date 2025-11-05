import { render } from "@/test-utils";
import { AllStaff } from "../AllStaff";
import { screen } from "@testing-library/react";

test("renders response from query", async () => {
  render(<AllStaff />);
  const allStaffs = await screen.findAllByRole("heading", {
    name: /Mateo|Michael|Sandra|Divya/i,
  });
  expect(allStaffs).toHaveLength(4);
});
