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
