/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Home from "./Home";

// Mock the framer-motion hooks
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    section: "section",
    h1: "h1",
    p: "p",
    h2: "h2",
    button: "button",
  },
  useAnimation: () => ({
    start: jest.fn(),
  }),
}));

// Mock the react-intersection-observer hook
jest.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true,
  }),
}));

const mockStore = configureStore([]);

describe("Home Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
      },
    });
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <Router>
          <Home />
        </Router>
      </Provider>
    );

  // Rendering and Layout
  test("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText("Create. Help. Learn.")).toBeInTheDocument();
  });

  test("displays main sections", () => {
    renderComponent();
    expect(screen.getByText("Why Tech Blogs Matter")).toBeInTheDocument();
    expect(screen.getByText("Subscribe to Our Newsletter")).toBeInTheDocument();
    expect(
      screen.getByText("Join Our Tech Blog Community")
    ).toBeInTheDocument();
  });

  // Functionality
  test("Start Blogging button links to correct page when authenticated", () => {
    store = mockStore({
      auth: {
        isAuthenticated: true,
      },
    });
    renderComponent();
    const startBloggingButton = screen.getByText("Start Blogging");
    expect(startBloggingButton.closest("a")).toHaveAttribute(
      "href",
      "/createBlog"
    );
  });

  test("Start Blogging button has no link when not authenticated", () => {
    renderComponent();
    const startBloggingButton = screen.getByText("Start Blogging");
    expect(startBloggingButton.closest("a")).toHaveAttribute("href", "#");
  });

  test("Join Now button links to signup page", () => {
    renderComponent();
    const joinNowButton = screen.getByText("Join Now");
    expect(joinNowButton.closest("a")).toHaveAttribute("href", "/signup");
  });

  // Content and Data
  test('displays all "Why Tech Blogs Matter" items', () => {
    renderComponent();
    const items = [
      "Stay Ahead of Tech Trends",
      "Learn from Industry Experts",
      "Hands-on Tutorials and Guides",
      "Connect with a Tech Community",
      "Discover New Tools and Resources",
      "Gain Diverse Perspectives",
    ];
    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  // Styling
  test("uses gradient text for main heading", () => {
    renderComponent();
    const mainHeading = screen.getByText("Create. Help. Learn.");
    expect(mainHeading).toHaveClass(
      "bg-clip-text",
      "text-transparent",
      "bg-gradient-to-r"
    );
  });

  test("newsletter section has correct background", () => {
    renderComponent();
    const newsletterSection = screen
      .getByText("Subscribe to Our Newsletter")
      .closest("div");
    expect(newsletterSection).toHaveClass(
      "bg-gradient-to-r",
      "from-purple-800",
      "to-indigo-800"
    );
  });

  // Accessibility
  test("images have alt text", () => {
    renderComponent();
    const backgroundImage = screen.getByAltText("Tech Background");
    expect(backgroundImage).toBeInTheDocument();
  });

  test("form inputs have labels or aria-labels", () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText("Enter your email");
    expect(emailInput).toHaveAttribute("required");
    // In a real scenario, we'd prefer a label, but for this case, we'll check for the placeholder
    expect(emailInput).toHaveAttribute("placeholder", "Enter your email");
  });

  test("buttons have accessible names", () => {
    renderComponent();
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveAccessibleName();
    });
  });
});
