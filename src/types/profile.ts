// Profile types based on database schema

import { ContactInfoEntry } from "@/apps/profile/src/types/contacts";

export interface Profile {
  id: string;
  created_at: string;
  telegram_id: string | null;
  user_id: string | null;
  telegram_username: string | null;
  name: string | null;
  username: string | null;
  about: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  profile_type: string | null;
  badge: string[] | null;
  contact_info: ContactInfoEntry[] | null;
  birthday: string | null;
  birthday_visibility: 'full' | 'month_day' | 'year' | null;
  additional_info: string | null;
}