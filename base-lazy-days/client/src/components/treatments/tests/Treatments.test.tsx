import { screen } from "@testing-library/react";
import { render } from "@/test-utils";

import { Treatments } from "../Treatments";

test("renders response from query", async () => {
  render(<Treatments />);
  const treatments = await screen.findAllByRole("heading", {
    name: /massage|facial|scrub/i,
  });
  expect(treatments).toHaveLength(3);
});
