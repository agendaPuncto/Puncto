/**
 * Puncto Cloud Functions
 *
 * Multi-tenant scheduling platform with authentication and role-based access control.
 */

import { setGlobalOptions } from "firebase-functions/v2";

// Set global options for all functions
setGlobalOptions({
  maxInstances: 10,
  region: "southamerica-east1", // São Paulo region for better latency in Brazil
});

// ===== Authentication Functions =====
// Note: User document creation is handled client-side in AuthContext
// export { onUserCreate } from "./auth/onUserCreate";  // Disabled - will implement with v1 API later
export { setCustomClaims } from "./auth/setCustomClaims";

// ===== Staff Management Functions =====
export { inviteStaff } from "./staff/inviteStaff";
export { acceptInvite } from "./staff/acceptInvite";

// ===== Scheduled Functions =====
export { sendBookingReminders } from "./scheduled/reminders";

// ===== Firestore Triggers =====
export { onBookingCreate } from "./triggers/onBookingCreate";
export { onBookingCancel } from "./triggers/onBookingCancel";

// ===== Payment Functions =====
export { processCommission } from "./payments/processCommission";

// ===== Scheduled Reports =====
export { generateDailyFinancialSummary } from "./reports/dailySummary";