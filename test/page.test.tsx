import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Home from "../src/app/page";

test("renders Home component", async () => {
  render(<Home />);

  await waitFor(() => {
    expect(screen.getByText("To do")).toBeInTheDocument();
  });
});
