import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookingModalProvider } from "../context/BookingModalContext";
import Footer from "./Footer";

function renderFooter() {
  return render(
    <BookingModalProvider>
      <Footer />
    </BookingModalProvider>
  );
}

describe("Footer", () => {
  it("renders the brand name", () => {
    renderFooter();
    expect(screen.getByText("UNC BIDYO")).toBeInTheDocument();
  });

  it("renders all quick links as navigable anchors", () => {
    renderFooter();
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "#about"
    );
    expect(screen.getByRole("link", { name: "What We Offer" })).toHaveAttribute(
      "href",
      "#offer"
    );
  });

  it("shows the current year in the copyright line", () => {
    renderFooter();
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
