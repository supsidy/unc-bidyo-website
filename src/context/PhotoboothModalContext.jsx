import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const PhotoboothModalContext = createContext(null);

export function PhotoboothModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPhotobooth = useCallback(() => setIsOpen(true), []);
  const closePhotobooth = useCallback(() => setIsOpen(false), []);

  // Auto-open when the app is loaded/navigated to at /photobooth
  useEffect(() => {
    const checkPath = () => {
      if (window.location.pathname === "/photobooth") setIsOpen(true);
    };

    checkPath();
    window.addEventListener("popstate", checkPath);
    return () => window.removeEventListener("popstate", checkPath);
  }, []);

  return (
    <PhotoboothModalContext.Provider
      value={{ isOpen, openPhotobooth, closePhotobooth }}
    >
      {children}
    </PhotoboothModalContext.Provider>
  );
}

export function usePhotoboothModal() {
  const ctx = useContext(PhotoboothModalContext);
  if (!ctx) {
    throw new Error(
      "usePhotoboothModal must be used within a PhotoboothModalProvider"
    );
  }
  return ctx;
}
