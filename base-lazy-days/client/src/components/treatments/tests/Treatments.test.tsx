import { screen } from "@testing-library/react";
import { render } from "@/test-utils";

import { Treatments } from "../Treatments";

test("renders response from query", () => {
  render(<Treatments />)
});
