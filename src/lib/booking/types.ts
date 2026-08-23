export type Profile = {
  id: string;
  email: string;
  display_name: string;
  color: string;
  is_admin: boolean;
  created_at: string;
};

export type BookingStatus = "confirmed" | "cancelled";

export type Booking = {
  id: string;
  user_id: string;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, "display_name" | "color" | "email">;
};

export type BookingEvent = {
  id: string;
  booking_id: string | null;
  user_id: string;
  actor_id: string;
  event_type: "created" | "updated" | "cancelled";
  start_at: string;
  end_at: string;
  notes: string | null;
  payload: Record<string, unknown>;
  created_at: string;
  actor?: Pick<Profile, "display_name">;
};

export type BillingMonth = {
  id: string;
  year: number;
  month: number;
  total_amount: number;
  invoice_path: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type UserMonthlyPayment = {
  id: string;
  user_id: string;
  year: number;
  month: number;
  amount_due: number;
  user_marked_paid: boolean;
  admin_marked_paid: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, "display_name" | "color" | "email">;
};

export type PaymentEvent = {
  id: string;
  payment_id: string;
  actor_id: string;
  event_type: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  note: string | null;
  created_at: string;
  actor?: Pick<Profile, "display_name">;
};

export type UserDashboardStats = {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalHours: number;
  hoursThisMonth: number;
  upcomingBookings: number;
};

export type BookingInput = {
  start_at: string;
  end_at: string;
  notes?: string;
};

export type BookingUpdateInput = {
  start_at?: string;
  end_at?: string;
  notes?: string;
  status?: BookingStatus;
};

export type AdminBillingOverview = {
  billingMonth: BillingMonth | null;
  invoiceUrl: string | null;
  suggestedAmountPerUser: number;
  activeUsersCount: number;
  usersWithBookingsCount: number;
  payments: UserMonthlyPayment[];
  paymentHistory: PaymentEvent[];
};
