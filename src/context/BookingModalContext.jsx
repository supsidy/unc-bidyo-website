import { createContext, useContext, useState, useCallback } from "react";

const BookingModalContext = createContext(null);

export function BookingModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openBooking = useCallback(() => setIsOpen(true), []);
  const closeBooking = useCallback(() => setIsOpen(false), []);

  return (
    <BookingModalContext.Provider value={{ isOpen, openBooking, closeBooking }}>
      {children}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error(
      "useBookingModal must be used within a BookingModalProvider"
    );
  }
  return ctx;
}
