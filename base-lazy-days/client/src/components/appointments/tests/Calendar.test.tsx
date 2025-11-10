import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../../mocks/server";
// import { defaultQueryClientOptions } from '../../../react-query/queryClient';
import { render } from "../../../test-utils";
import { Calendar } from "../Calendar";

// mocking useUser to mimic a logged-in user
// jest.mock('../../user/hooks/useUser', () => ({
//   __esModule: true,
//   useUser: () => ({ user: mockUser }),
// }));

test("Reserve appointment error", async () => {
  server.use(
    http.get("http://localhost:3030/appointments/:year/:month", () => {
      return HttpResponse.json(
        null,
        { status: 500 }
      );
    })
  );
  render(<Calendar />);
  const alertToast = screen.getByRole("alert");
  expect(alertToast).toHaveTextContent("Request failed with status code 500");
});
