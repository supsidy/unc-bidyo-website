import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useBookingModal } from "../context/BookingModalContext";
import { supabase } from "../supabaseClient";

// Pulled from .env — see README instructions for setup.
// NEVER put a private/secret EmailJS key here — only the Public Key belongs client-side.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const INITIAL_FORM = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  eventTitle: "",
  isMultiDay: false,
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  personnel: "",
  additionalRequest: "",
};

// Simple honeypot field name — bots tend to fill every input they see.
const HONEYPOT_FIELD = "company_website";

function validate(form) {
  const errors = {};

  if (!form.firstName.trim()) {
    errors.firstName = "First name is required.";
  } else if (form.firstName.trim().length < 2) {
    errors.firstName = "Please enter a valid first name.";
  }

  if (!form.lastName.trim()) {
    errors.lastName = "Last name is required.";
  } else if (form.lastName.trim().length < 2) {
    errors.lastName = "Please enter a valid last name.";
  }

  if (!form.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  const digitsOnly = form.phoneNumber.replace(/\D/g, "");
  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = "Contact number is required.";
  } else if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    errors.phoneNumber = "Please enter a valid contact number.";
  }

  if (!form.eventTitle.trim()) {
    errors.eventTitle = "Event title is required.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!form.startDate) {
    errors.startDate = form.isMultiDay
      ? "Please select a start date."
      : "Please select a date.";
  } else {
    const start = new Date(form.startDate + "T00:00:00");
    if (start < today) {
      errors.startDate = "Date can't be in the past.";
    }
  }

  if (form.isMultiDay) {
    if (!form.endDate) {
      errors.endDate = "Please select an end date.";
    } else if (form.startDate) {
      const start = new Date(form.startDate + "T00:00:00");
      const end = new Date(form.endDate + "T00:00:00");
      if (end < start) {
        errors.endDate = "End date can't be before the start date.";
      }
    }
  }

  if (!form.startTime) {
    errors.startTime = form.isMultiDay
      ? "Please select a start time."
      : "Please select a time.";
  }

  if (!form.endTime) {
    errors.endTime = "Please select an end time.";
  } else if (
    !form.isMultiDay &&
    form.startTime &&
    form.endTime <= form.startTime
  ) {
    errors.endTime = "End time must be after the start time.";
  }

  if (!form.personnel) {
    errors.personnel = "Number of personnel is required.";
  } else if (
    !Number.isInteger(Number(form.personnel)) ||
    Number(form.personnel) < 1
  ) {
    errors.personnel = "Enter a whole number of 1 or more.";
  } else if (Number(form.personnel) > 100) {
    errors.personnel = "For 100+ personnel, mention it in additional requests.";
  }

  if (form.additionalRequest.length > 800) {
    errors.additionalRequest =
      "Please keep additional requests under 800 characters.";
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
  const [visible, setVisible] = useState(false); // drives the enter/exit animation
  const [shouldRender, setShouldRender] = useState(false); // keeps the modal mounted while it animates out
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  // Mount immediately on open (then fade/scale in a frame later so the
  // transition actually runs), and stay mounted just long enough to
  // animate out before unmounting on close.
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Double rAF: the first one just gets us to "after the DOM update,
      // before paint". We need a second one so the browser actually paints
      // the invisible/scaled-down state first — otherwise React can apply
      // both class changes before a single paint happens, and the
      // transition has no "from" frame to animate from (it just snaps).
      let raf2;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
      };
    } else {
      setVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

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
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus the first field once the dialog has actually mounted.
  useEffect(() => {
    if (isOpen && shouldRender) {
      firstFieldRef.current?.focus();
    }
  }, [isOpen, shouldRender]);

  // Close on Escape key.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeBooking();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeBooking]);

  if (!shouldRender) return null;

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
      firstName: true,
      middleName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      eventTitle: true,
      startDate: true,
      endDate: true,
      startTime: true,
      endTime: true,
      personnel: true,
      additionalRequest: true,
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

    // Multi-day mapping: single-day events store the same value in
    // startDate/endDate so the "date range" is always well-formed in the DB.
    const resolvedStartDate = form.startDate;
    const resolvedEndDate = form.isMultiDay ? form.endDate : form.startDate;

    const payload = {
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim() || null,
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      eventTitle: form.eventTitle.trim(),
      startDate: resolvedStartDate,
      endDate: resolvedEndDate,
      startTime: form.startTime,
      endTime: form.endTime,
      personnel: form.personnel ? Number(form.personnel) : null,
      additionalRequest: form.additionalRequest.trim() || null,
      status: "pending",
    };

    try {
      // Step 1: persist the booking in Supabase first — this is the
      // source of truth. bookID/createdAt are generated by Postgres.
      const { error: supabaseError } = await supabase
        .from("booking_form")
        .insert([payload]);

      if (supabaseError) throw supabaseError;

      // Step 2: only notify by email once the record is safely saved.
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          first_name: payload.firstName,
          middle_name: payload.middleName || "",
          last_name: payload.lastName,
          full_name: [payload.firstName, payload.middleName, payload.lastName]
            .filter(Boolean)
            .join(" "),
          email: payload.email,
          contact_number: payload.phoneNumber,
          event_title: payload.eventTitle,
          is_multi_day: form.isMultiDay ? "Yes" : "No",
          event_start_date: payload.startDate,
          event_end_date: payload.endDate,
          event_start_time: payload.startTime,
          event_end_time: payload.endTime,
          personnel: payload.personnel,
          requests: payload.additionalRequest || "None",
        },
        { publicKey: PUBLIC_KEY }
      );

      setStatus("success");
      setStatusMessage(
        "Your inquiry has been sent! Check your inbox or spam for a confirmation summary."
      );
      setForm(INITIAL_FORM);
      setTouched({});
    } catch (err) {
      console.error("Booking submission failed:", err);
      setStatus("error");
      setStatusMessage(
        "Something went wrong sending your inquiry. Please try again or contact us directly at uncbidyo@unc.edu.ph"
      );
    }
  };

  const fieldError = (name) =>
    touched[name] && errors[name] ? errors[name] : null;

  const inputBaseClass =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-bidyo-crimsonBlack placeholder:text-neutral-400 outline-none transition focus:border-bidyo-crimson focus:ring-2 focus:ring-bidyo-crimson/20";

  const errorInputClass =
    "border-red-400 focus:border-red-500 focus:ring-red-200";
  const normalInputClass = "border-neutral-200";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-8 transition-opacity duration-300 ease-out ${
        visible
          ? "bg-black/70 opacity-100 backdrop-blur-sm"
          : "bg-black/70 opacity-0"
      }`}
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-form-title"
        className={`relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-[transform,opacity] duration-300 ease-out will-change-transform ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
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
            Tell us about your event and we'll send a confirmation summary
            straight to your inbox.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-h-[70vh] overflow-y-auto px-8 py-7 sm:px-10"
        >
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
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
              >
                First Name
              </label>
              <input
                ref={firstFieldRef}
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Juan"
                className={`${inputBaseClass} ${fieldError("firstName") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("firstName")}
                aria-describedby={
                  fieldError("firstName") ? "firstName-error" : undefined
                }
              />
              {fieldError("firstName") && (
                <p
                  id="firstName-error"
                  className="mt-1.5 text-xs font-medium text-red-500"
                >
                  {fieldError("firstName")}
                </p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label
                htmlFor="middleName"
                className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
              >
                Middle Name{" "}
                <span className="font-normal text-neutral-400">(optional)</span>
              </label>
              <input
                id="middleName"
                name="middleName"
                type="text"
                value={form.middleName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Santos"
                className={`${inputBaseClass} ${fieldError("middleName") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("middleName")}
                aria-describedby={
                  fieldError("middleName") ? "middleName-error" : undefined
                }
              />
              {fieldError("middleName") && (
                <p
                  id="middleName-error"
                  className="mt-1.5 text-xs font-medium text-red-500"
                >
                  {fieldError("middleName")}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="lastName"
                className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Dela Cruz"
                className={`${inputBaseClass} ${fieldError("lastName") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("lastName")}
                aria-describedby={
                  fieldError("lastName") ? "lastName-error" : undefined
                }
              />
              {fieldError("lastName") && (
                <p
                  id="lastName-error"
                  className="mt-1.5 text-xs font-medium text-red-500"
                >
                  {fieldError("lastName")}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
              >
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
                aria-describedby={
                  fieldError("email") ? "email-error" : undefined
                }
              />
              {fieldError("email") && (
                <p
                  id="email-error"
                  className="mt-1.5 text-xs font-medium text-red-500"
                >
                  {fieldError("email")}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
              >
                Contact Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="09XX XXX XXXX"
                className={`${inputBaseClass} ${fieldError("phoneNumber") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("phoneNumber")}
                aria-describedby={
                  fieldError("phoneNumber") ? "phoneNumber-error" : undefined
                }
              />
              {fieldError("phoneNumber") && (
                <p
                  id="phoneNumber-error"
                  className="mt-1.5 text-xs font-medium text-red-500"
                >
                  {fieldError("phoneNumber")}
                </p>
              )}
            </div>

            {/* Event Title */}
            <div className="sm:col-span-2">
              <label
                htmlFor="eventTitle"
                className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
              >
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
                aria-describedby={
                  fieldError("eventTitle") ? "eventTitle-error" : undefined
                }
              />
              {fieldError("eventTitle") && (
                <p
                  id="eventTitle-error"
                  className="mt-1.5 text-xs font-medium text-red-500"
                >
                  {fieldError("eventTitle")}
                </p>
              )}
            </div>

            {/* Multi-day toggle */}
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2.5 select-none">
                <input
                  type="checkbox"
                  name="isMultiDay"
                  checked={form.isMultiDay}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((prev) => ({
                      ...prev,
                      isMultiDay: checked,
                      // Drop a stale end date if the person unchecks multi-day.
                      endDate: checked ? prev.endDate : "",
                    }));
                  }}
                  className="h-4 w-4 rounded border-neutral-300 text-bidyo-crimson focus:ring-bidyo-crimson/30"
                />
                <span className="text-sm font-semibold text-bidyo-crimsonBlack">
                  This is a multi-day event
                </span>
              </label>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
              >
                {form.isMultiDay ? "Start Date" : "Date"}
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
                min={new Date().toISOString().split("T")[0]}
                className={`${inputBaseClass} ${fieldError("startDate") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("startDate")}
                aria-describedby={
                  fieldError("startDate") ? "startDate-error" : undefined
                }
              />
              {fieldError("startDate") && (
                <p
                  id="startDate-error"
                  className="mt-1.5 text-xs font-medium text-red-500"
                >
                  {fieldError("startDate")}
                </p>
              )}
            </div>

            {/* End Date — only shown for multi-day events, sits beside Start Date */}
            {form.isMultiDay && (
              <div>
                <label
                  htmlFor="endDate"
                  className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
                >
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={form.startDate || new Date().toISOString().split("T")[0]}
                  className={`${inputBaseClass} ${fieldError("endDate") ? errorInputClass : normalInputClass}`}
                  aria-invalid={!!fieldError("endDate")}
                  aria-describedby={
                    fieldError("endDate") ? "endDate-error" : undefined
                  }
                />
                {fieldError("endDate") && (
                  <p
                    id="endDate-error"
                    className="mt-1.5 text-xs font-medium text-red-500"
                  >
                    {fieldError("endDate")}
                  </p>
                )}
              </div>
            )}

            {/* Start Time */}
            <div>
              <label
                htmlFor="startTime"
                className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
              >
                Start Time
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${inputBaseClass} ${fieldError("startTime") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("startTime")}
                aria-describedby={
                  fieldError("startTime") ? "startTime-error" : undefined
                }
              />
              {fieldError("startTime") && (
                <p
                  id="startTime-error"
                  className="mt-1.5 text-xs font-medium text-red-500"
                >
                  {fieldError("startTime")}
                </p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label
                htmlFor="endTime"
                className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
              >
                End Time
              </label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${inputBaseClass} ${fieldError("endTime") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("endTime")}
                aria-describedby={
                  fieldError("endTime") ? "endTime-error" : undefined
                }
              />
              {fieldError("endTime") && (
                <p
                  id="endTime-error"
                  className="mt-1.5 text-xs font-medium text-red-500"
                >
                  {fieldError("endTime")}
                </p>
              )}
            </div>

            {/* Number of Personnel */}
            <div className="sm:col-span-2">
              <label
                htmlFor="personnel"
                className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
              >
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
                aria-describedby={
                  fieldError("personnel") ? "personnel-error" : undefined
                }
              />
              {fieldError("personnel") && (
                <p
                  id="personnel-error"
                  className="mt-1.5 text-xs font-medium text-red-500"
                >
                  {fieldError("personnel")}
                </p>
              )}
            </div>

            {/* Additional Requests */}
            <div className="sm:col-span-2">
              <label
                htmlFor="additionalRequest"
                className="mb-1.5 block text-sm font-semibold text-bidyo-crimsonBlack"
              >
                Additional Requests
              </label>
              <textarea
                id="additionalRequest"
                name="additionalRequest"
                rows={4}
                value={form.additionalRequest}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Drone coverage, livestream setup, specific shot list, etc."
                className={`${inputBaseClass} resize-none ${fieldError("additionalRequest") ? errorInputClass : normalInputClass}`}
                aria-invalid={!!fieldError("additionalRequest")}
                aria-describedby={
                  fieldError("additionalRequest")
                    ? "additionalRequest-error"
                    : undefined
                }
              />
              <div className="mt-1.5 flex items-center justify-between">
                {fieldError("additionalRequest") ? (
                  <p
                    id="additionalRequest-error"
                    className="text-xs font-medium text-red-500"
                  >
                    {fieldError("additionalRequest")}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-neutral-400">
                  {form.additionalRequest.length}/800
                </span>
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
