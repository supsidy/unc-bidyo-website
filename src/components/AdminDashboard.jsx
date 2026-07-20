import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

/**
 * AdminDashboard
 *
 * Admin dashboard for UNC BIDYO. Displays pending booking inquiries
 * pulled from the `booking_form` table and lets an admin approve or
 * reject each one. Matches the design language of the landing page
 * and admin login portal.
 *
 * Props:
 *  - session: the Supabase session object (used to display the
 *    signed-in admin's email in the header).
 *  - onLogout: optional callback invoked after a successful sign-out
 *    (e.g. to redirect back to the login screen).
 */
export default function AdminDashboard({ session, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  // Tracks which bookID currently has an update in-flight, so we can
  // disable that card's buttons without freezing the entire list.
  const [pendingActionId, setPendingActionId] = useState(null);

  // ---------------------------------------------------------------
  // Formatting helpers
  // ---------------------------------------------------------------

  /** Converts a SQL "HH:MM:SS" 24-hour time string into "h:MM AM/PM". */
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hoursStr, minutesStr] = timeString.split(":");
    const hours24 = parseInt(hoursStr, 10);
    const minutes = minutesStr ?? "00";
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    return `${hours12}:${minutes} ${period}`;
  };

  /** Converts a SQL date string into a clean localized date, e.g. "Aug 14, 2026". */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /** Builds a "Aug 14 - Aug 16, 2026" style range when an end date exists. */
  const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    if (!endDate || endDate === startDate) return start;
    const end = formatDate(endDate);
    return `${start} – ${end}`;
  };

  const getInitials = (firstName, lastName) => {
    const a = firstName?.charAt(0) ?? "";
    const b = lastName?.charAt(0) ?? "";
    return (a + b).toUpperCase() || "?";
  };

  // ---------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------

  const fetchPendingBookings = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase
      .from("booking_form")
      .select("*")
      .eq("status", "pending")
      .order("createdAt", { ascending: true });

    if (error) {
      setErrorMsg(error.message || "Failed to load booking inquiries.");
      setBookings([]);
    } else {
      setBookings(data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPendingBookings();
  }, [fetchPendingBookings]);

  // ---------------------------------------------------------------
  // Approve / Reject handler
  // ---------------------------------------------------------------

  const handleUpdateStatus = async (bookID, newStatus) => {
    setPendingActionId(bookID);
    setErrorMsg("");

    const { error } = await supabase
      .from("booking_form")
      .update({ status: newStatus })
      .eq("bookID", bookID);

    if (error) {
      setErrorMsg(error.message || "Something went wrong updating that booking.");
      setPendingActionId(null);
      return;
    }

    // Optimistic UI update: drop it from local state since it's no
    // longer "pending".
    setBookings((prev) => prev.filter((booking) => booking.bookID !== bookID));
    setPendingActionId(null);
  };

  // ---------------------------------------------------------------
  // Auth
  // ---------------------------------------------------------------

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout?.();
  };

  // ---------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-bidyo-crimson">
              UNC BIDYO
            </p>
            <h1 className="mt-1 text-lg font-bold text-bidyo-crimsonBlack">
              Booking Inquiries
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {session?.user?.email && (
              <span className="hidden text-sm text-neutral-500 sm:inline">
                {session.user.email}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-neutral-200 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-600 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Global error banner */}
        {errorMsg && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {errorMsg}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="h-3 w-24 rounded-full bg-neutral-200" />
                    <div className="h-5 w-56 rounded-full bg-neutral-200" />
                    <div className="h-3 w-40 rounded-full bg-neutral-200" />
                  </div>
                  <div className="h-6 w-20 rounded-full bg-neutral-200" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[0, 1, 2, 3].map((j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-2 w-16 rounded-full bg-neutral-200" />
                      <div className="h-4 w-20 rounded-full bg-neutral-200" />
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-3">
                  <div className="h-11 w-28 rounded-full bg-neutral-200" />
                  <div className="h-11 w-28 rounded-full bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-neutral-200 bg-white px-8 py-16 text-center">
            <span className="text-4xl">🎉</span>
            <h2 className="mt-4 text-lg font-bold text-bidyo-crimsonBlack">
              All caught up!
            </h2>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">
              There are no pending booking inquiries right now. New requests
              will show up here automatically.
            </p>
            <button
              type="button"
              onClick={fetchPendingBookings}
              className="mt-6 rounded-full bg-bidyo-crimsonBlack px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-bidyo-crimson"
            >
              Refresh List
            </button>
          </div>
        )}

        {/* Booking cards */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const isBusy = pendingActionId === booking.bookID;
              const fullName = [
                booking.firstName,
                booking.middleName,
                booking.lastName,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={booking.bookID}
                  className="rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-sm transition hover:shadow-md"
                >
                  {/* Card header */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bidyo-crimson/10 text-sm font-bold text-bidyo-crimson">
                        {getInitials(booking.firstName, booking.lastName)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-bidyo-crimsonBlack">
                          {booking.eventTitle}
                        </h3>
                        <p className="mt-0.5 text-sm text-neutral-500">
                          {fullName}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-600">
                      Pending
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-neutral-100 pt-6 sm:grid-cols-4">
                    <DetailField
                      label="Date"
                      value={formatDateRange(booking.startDate, booking.endDate)}
                    />
                    <DetailField
                      label="Time"
                      value={`${formatTime(booking.startTime)} – ${formatTime(
                        booking.endTime
                      )}`}
                    />
                    <DetailField
                      label="Personnel"
                      value={
                        booking.personnel != null
                          ? String(booking.personnel)
                          : "—"
                      }
                    />
                    <DetailField label="Email" value={booking.email} />
                    <DetailField
                      label="Phone"
                      value={booking.phoneNumber || "—"}
                    />
                    {booking.additionalRequest && (
                      <div className="col-span-2 space-y-1 sm:col-span-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                          Additional Request
                        </p>
                        <p className="text-sm text-neutral-700">
                          {booking.additionalRequest}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleUpdateStatus(booking.bookID, "approved")}
                      className="rounded-full bg-bidyo-crimsonBlack px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isBusy ? "Working..." : "Approve"}
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleUpdateStatus(booking.bookID, "rejected")}
                      className="rounded-full border border-neutral-200 px-6 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isBusy ? "Working..." : "Reject"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

/** Small labeled value used inside the details grid of each booking card. */
function DetailField({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <p className="text-sm font-medium text-bidyo-crimsonBlack">{value}</p>
    </div>
  );
}
