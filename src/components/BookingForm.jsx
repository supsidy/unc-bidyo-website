import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useBookingModal } from "../context/BookingModalContext";

// Pulled from .env — see README instructions for setup.
// NEVER put a private/secret EmailJS key here — only the Public Key belongs client-side.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const INITIAL_FORM = {
  fullName: "",
  email: "",
  contactNumber: "",
  eventTitle: "",
  date: "",
  time: "",
  personnel: "",
  requests: "",
};

// Simple honeypot field name — bots tend to fill every input they see.
const HONEYPOT_FIELD = "company_website";

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = "Please enter a valid name.";
  }

  if (!form.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  const digitsOnly = form.contactNumber.replace(/\D/g, "");
  if (!form.contactNumber.trim()) {
    errors.contactNumber = "Contact number is required.";
  } else if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    errors.contactNumber = "Please enter a valid contact number.";
  }

  if (!form.eventTitle.trim()) {
    errors.eventTitle = "Event title is required.";
  }

  if (!form.date) {
    errors.date = "Please select a date.";
  } else {
    const selected = new Date(form.date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      errors.date = "Date can't be in the past.";
    }
  }

  if (!form.time) {
    errors.time = "Please select a time.";
  }

  if (!form.personnel) {
    errors.personnel = "Number of personnel is required.";
  } else if (!Number.isInteger(Number(form.personnel)) || Number(form.personnel) < 1) {
    errors.personnel = "Enter a whole number of 1 or more.";
  } else if (Number(form.personnel) > 100) {
    errors.personnel = "For 100+ personnel, mention it in additional requests.";
  }

  if (form.requests.length > 800) {
    errors.requests = "Please keep additional requests under 800 characters.";
  }

  return errors;
}

export default function BookingForm() {
  const { isOpen, closeBooking } = useBookingModal();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [statusMessage, setStatusMessage] = useState("");
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  // Reset form state whenever the modal closes, so it's fresh next time.
  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setForm(INITIAL_FORM);
        setErrors({});
        setTouched({});
        setStatus("idle");
        setStatusMessage("");
      }, 300); // wait for close transition
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Basic focus management + lock background scroll while modal is open.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      firstFieldRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeBooking();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeBooking]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate({ ...form }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeBooking();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot check — if this hidden field has anything in it, silently bail.
    if (e.target[HONEYPOT_FIELD]?.value) {
      setStatus("success");
      setStatusMessage("Thanks! We'll be in touch shortly.");
      return;
    }

    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({
      fullName: true,
      email: true,
      contactNumber: true,
      eventTitle: true,
      date: true,
      time: true,
      personnel: true,
      requests: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      setStatus("error");
      setStatusMessage("Please fix the highlighted fields before submitting.");
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus("error");
      setStatusMessage(
        "Email service isn't configured yet. Add your EmailJS keys to .env (see setup instructions)."
      );
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          full_name: form.fullName.trim(),
          email: form.email.trim(),
          contact_number: form.contactNumber.trim(),
          event_title: form.eventTitle.trim(),
          event_date: form.date,
          event_time: form.time,
          personnel: form.personnel,
          requests: form.requests.trim() || "None",
        },
        { publicKey: PUBLIC_KEY }
      );

      setStatus("success");
      setStatusMessage(
        "Your inquiry has been sent! Check your inbox for a confirmation summary."
      );
      setForm(INITIAL_FORM);
      setTouched({});
    } catch (err) {
      console.error("EmailJS send failed:", err);
      setStatus("error");
      setStatusMessage(
        "Something went wrong sending your inquiry. Please try again or contact us directly."
      );
    }
  };

  const fieldError = (name) => (touched[name] && errors[name] ? errors[name] : null);

  const inputBaseClass =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-bidyo-crimsonBlack placeholder:text-neutral-400 outline-none transition focus:border-bidyo-crimson focus:ring-2 focus:ring-bidyo-crimson/20";

  const errorInputClass = "border-red-400 focus:border-red-500 focus:ring-red-200";
  const normalInputClass = "border-neutral-200";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm"
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-form-title"
        className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="relative bg-bidyo-charcoal px-8 py-7 sm:px-10">
          <button
            type="button"
            onClick={closeBooking}
            aria-label="Close booking form"
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-bidyo-crimson">
            UNC BIDYO
          </p>
          <h2
            id="booking-form-title"
            className="mt-3 font-display text-2xl text-white sm:text-3xl"
          >
            Book Your Coverage
          </h2>
          <p className="mt-2 max-w-md text-sm text-neutral-400">
            Tell us about your event and we'll send a confirmation summary straight to your inbox.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="max-h-[70vh] overflow-y-auto px-8 py-7 sm:px-10">
          {/* Honeypot — visually hidden, kept out of the tab order */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor={HONEYPOT_FIELD}>Company website</label>
            <input
              type="text"
              id={HONEYPOT_FIELD}
              name={HONEYPOT_FIELD}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack">
                Full Name
              </label>
              <input
                ref={firstFieldRef}
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Juan Dela Cruz"
                className={`${inputBaseClass} ${fieldError("fullName") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("fullName")}
                aria-describedby={fieldError("fullName") ? "fullName-error" : undefined}
              />
              {fieldError("fullName") && (
                <p id="fullName-error" className="mt-1.5 text-xs font-medium text-red-500">
                  {fieldError("fullName")}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={`${inputBaseClass} ${fieldError("email") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("email")}
                aria-describedby={fieldError("email") ? "email-error" : undefined}
              />
              {fieldError("email") && (
                <p id="email-error" className="mt-1.5 text-xs font-medium text-red-500">
                  {fieldError("email")}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack">
                Contact Number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={form.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="09XX XXX XXXX"
                className={`${inputBaseClass} ${fieldError("contactNumber") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("contactNumber")}
                aria-describedby={fieldError("contactNumber") ? "contactNumber-error" : undefined}
              />
              {fieldError("contactNumber") && (
                <p id="contactNumber-error" className="mt-1.5 text-xs font-medium text-red-500">
                  {fieldError("contactNumber")}
                </p>
              )}
            </div>

            {/* Event Title */}
            <div className="sm:col-span-2">
              <label htmlFor="eventTitle" className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack">
                Event Title
              </label>
              <input
                id="eventTitle"
                name="eventTitle"
                type="text"
                value={form.eventTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. UNC Founders' Day Program"
                className={`${inputBaseClass} ${fieldError("eventTitle") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("eventTitle")}
                aria-describedby={fieldError("eventTitle") ? "eventTitle-error" : undefined}
              />
              {fieldError("eventTitle") && (
                <p id="eventTitle-error" className="mt-1.5 text-xs font-medium text-red-500">
                  {fieldError("eventTitle")}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                onBlur={handleBlur}
                min={new Date().toISOString().split("T")[0]}
                className={`${inputBaseClass} ${fieldError("date") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("date")}
                aria-describedby={fieldError("date") ? "date-error" : undefined}
              />
              {fieldError("date") && (
                <p id="date-error" className="mt-1.5 text-xs font-medium text-red-500">
                  {fieldError("date")}
                </p>
              )}
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack">
                Time
              </label>
              <input
                id="time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${inputBaseClass} ${fieldError("time") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("time")}
                aria-describedby={fieldError("time") ? "time-error" : undefined}
              />
              {fieldError("time") && (
                <p id="time-error" className="mt-1.5 text-xs font-medium text-red-500">
                  {fieldError("time")}
                </p>
              )}
            </div>

            {/* Number of Personnel */}
            <div className="sm:col-span-2">
              <label htmlFor="personnel" className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack">
                Number of Personnel Needed
              </label>
              <input
                id="personnel"
                name="personnel"
                type="number"
                min="1"
                max="100"
                value={form.personnel}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. 3"
                className={`${inputBaseClass} ${fieldError("personnel") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("personnel")}
                aria-describedby={fieldError("personnel") ? "personnel-error" : undefined}
              />
              {fieldError("personnel") && (
                <p id="personnel-error" className="mt-1.5 text-xs font-medium text-red-500">
                  {fieldError("personnel")}
                </p>
              )}
            </div>

            {/* Additional Requests */}
            <div className="sm:col-span-2">
              <label htmlFor="requests" className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack">
                Additional Requests
              </label>
              <textarea
                id="requests"
                name="requests"
                rows={4}
                value={form.requests}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Drone coverage, livestream setup, specific shot list, etc."
                className={`${inputBaseClass} resize-none ${fieldError("requests") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("requests")}
                aria-describedby={fieldError("requests") ? "requests-error" : undefined}
              />
              <div className="mt-1.5 flex items-center justify-between">
                {fieldError("requests") ? (
                  <p id="requests-error" className="text-xs font-medium text-red-500">
                    {fieldError("requests")}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-neutral-400">{form.requests.length}/800</span>
              </div>
            </div>
          </div>

          {/* Status message */}
          {status === "success" && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {statusMessage}
            </div>
          )}
          {status === "error" && statusMessage && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {statusMessage}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeBooking}
              className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center justify-center rounded-full bg-bidyo-crimsonBlack px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-bidyo-crimson disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Submit Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
