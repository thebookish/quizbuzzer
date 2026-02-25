export type RoundState =
  | "waiting"
  | "topic_selection"
  | "active"
  | "ended";

export interface Team {
  id: string;
  name: string;
  code: string;
  color: string;
  is_active: boolean;
  is_locked: boolean;
  is_online: boolean;
  points: number;
  user_id?: string | null;
  created_at: string;
}

export interface Topic {
  id: string;
  title: string;
  category?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Round {
  id: string;
  state: RoundState;
  topic_id?: string | null;
  topic_selection_active: boolean;
  buzzers_active: boolean;
  first_team_id?: string | null;
  participating_team_ids: string[];
  question_number: number;
  started_at?: string | null;
  ended_at?: string | null;
  created_at: string;
}

export interface BuzzerEvent {
  id: string;
  round_id: string;
  team_id: string;
  position: number;
  question_number: number;
  pressed_at: string;
  created_at: string;
  team?: Team;
}

export interface TopicSelection {
  id: string;
  round_id: string;
  team_id: string;
  topic_id: string;
  selected_at: string;
  team?: Team;
  topic?: Topic;
}

export type UserRole = "admin" | "team";

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  team_name?: string | null;
  team_code?: string | null;
  team?: Team | null;
}
