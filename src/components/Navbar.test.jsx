import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookingModalProvider } from "../context/BookingModalContext";
import { PhotoboothModalProvider } from "../context/PhotoboothModalContext";
import Navbar from "./Navbar";

function renderNavbar() {
  return render(
    <BookingModalProvider>
      <PhotoboothModalProvider>
        <Navbar />
      </PhotoboothModalProvider>
    </BookingModalProvider>
  );
}

describe("Navbar", () => {
  it("renders the brand name", () => {
    renderNavbar();
    expect(screen.getByText("UNC BIDYO")).toBeInTheDocument();
  });

  it("renders the booking call-to-action button (desktop and mobile)", () => {
    renderNavbar();
    const ctaButtons = screen.getAllByRole("button", { name: "Inquire Now" });
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it("toggles the mobile menu open/closed state", () => {
    renderNavbar();
    const toggle = screen.getByRole("button", { name: "Open menu" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });
});
