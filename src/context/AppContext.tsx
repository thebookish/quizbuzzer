import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Team, Topic, Round, BuzzerEvent, AppUser } from "@/types";
import { supabase } from "@/lib/supabase";

interface AppState {
  user: AppUser | null;
  teams: Team[];
  topics: Topic[];
  currentRound: Round | null;
  buzzerEvents: BuzzerEvent[];
  roundHistory: { round: Round; events: BuzzerEvent[] }[];
  loading: boolean;
}

interface AppActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addTeam: (name: string, code: string, color: string, password: string) => Promise<void>;
  removeTeam: (id: string) => Promise<void>;
  toggleTeamLock: (id: string) => Promise<void>;
  addTopic: (title: string, category: string, description: string) => Promise<void>;
  updateTopic: (id: string, title: string, category: string, description: string) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  startRound: (teamIds: string[], enableTopicSelection: boolean) => Promise<void>;
  activateBuzzers: () => Promise<void>;
  resetRound: () => Promise<void>;
  endRound: () => Promise<void>;
  pressBuzzer: (teamId: string) => Promise<void>;
  selectTopic: (teamId: string, topicId: string) => Promise<void>;
  awardPoints: (teamId: string, points: number) => Promise<void>;
  nextQuestion: () => Promise<void>;
}

const AppContext = createContext<(AppState & AppActions) | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [buzzerEvents, setBuzzerEvents] = useState<BuzzerEvent[]>([]);
  const [roundHistory, setRoundHistory] = useState<
    { round: Round; events: BuzzerEvent[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const subscriptionsRef = useRef<(() => void)[]>([]);

  // ── Fetch helpers ──────────────────────────────────────────────
  const fetchTeams = useCallback(async () => {
    const { data } = await supabase
      .from("teams")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setTeams(data as Team[]);
  }, []);

  const fetchTopics = useCallback(async () => {
    const { data } = await supabase
      .from("topics")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setTopics(data as Topic[]);
  }, []);

  const fetchCurrentRound = useCallback(async () => {
    const { data } = await supabase
      .from("rounds")
      .select("*")
      .in("state", ["waiting", "topic_selection", "active"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      setCurrentRound(data as Round);
      // fetch buzzer events for this round
      const { data: events } = await supabase
        .from("buzzer_events")
        .select("*")
        .eq("round_id", data.id)
        .eq("question_number", data.question_number || 1)
        .order("position", { ascending: true });
      if (events) setBuzzerEvents(events as BuzzerEvent[]);
    } else {
      setCurrentRound(null);
      setBuzzerEvents([]);
    }
  }, []);

  const fetchRoundHistory = useCallback(async () => {
    const { data: rounds } = await supabase
      .from("rounds")
      .select("*")
      .eq("state", "ended")
      .order("ended_at", { ascending: false })
      .limit(50);
    if (rounds) {
      const history = await Promise.all(
        (rounds as Round[]).map(async (round) => {
          const { data: events } = await supabase
            .from("buzzer_events")
            .select("*")
            .eq("round_id", round.id)
            .order("question_number", { ascending: true })
            .order("position", { ascending: true });
          return { round, events: (events || []) as BuzzerEvent[] };
        })
      );
      setRoundHistory(history);
    }
  }, []);

  // ── Load all data on mount ──────────────────────────────────────
  const loadAllData = useCallback(async () => {
    await Promise.all([fetchTeams(), fetchTopics(), fetchCurrentRound(), fetchRoundHistory()]);
  }, [fetchTeams, fetchTopics, fetchCurrentRound, fetchRoundHistory]);

  // ── One-time admin setup ───────────────────────────────────────
  useEffect(() => {
    // Ensure admin account exists on first load
    const initialized = sessionStorage.getItem("buzzr_admin_init");
    if (!initialized) {
      sessionStorage.setItem("buzzr_admin_init", "1");
      supabase.functions.invoke("supabase-functions-setup-admin").catch(() => {});
    }
  }, []);

  // ── Realtime subscriptions ─────────────────────────────────────
  const setupRealtimeSubscriptions = useCallback(() => {
    // Clean up old subscriptions
    subscriptionsRef.current.forEach((unsub) => unsub());
    subscriptionsRef.current = [];

    // Teams changes
    const teamsSub = supabase
      .channel("teams-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        () => { fetchTeams(); }
      )
      .subscribe();

    // Topics changes
    const topicsSub = supabase
      .channel("topics-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "topics" },
        () => { fetchTopics(); }
      )
      .subscribe();

    // Rounds changes
    const roundsSub = supabase
      .channel("rounds-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rounds" },
        () => { fetchCurrentRound(); fetchRoundHistory(); }
      )
      .subscribe();

    // Buzzer events changes
    const buzzerSub = supabase
      .channel("buzzer-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buzzer_events" },
        () => { fetchCurrentRound(); }
      )
      .subscribe();

    subscriptionsRef.current = [
      () => supabase.removeChannel(teamsSub),
      () => supabase.removeChannel(topicsSub),
      () => supabase.removeChannel(roundsSub),
      () => supabase.removeChannel(buzzerSub),
    ];
  }, [fetchTeams, fetchTopics, fetchCurrentRound, fetchRoundHistory]);

  // When user logs in, load data and set up subscriptions
  useEffect(() => {
    if (user) {
      loadAllData();
      setupRealtimeSubscriptions();
    }
    return () => {
      subscriptionsRef.current.forEach((unsub) => unsub());
      subscriptionsRef.current = [];
    };
  }, [user, loadAllData, setupRealtimeSubscriptions]);

  // ── Auth ──────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // Check for admin login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Maybe it's a team code login - try finding team by code
        const teamCode = email.toUpperCase();
        const { data: teamData } = await supabase
          .from("teams")
          .select("*")
          .eq("code", teamCode)
          .maybeSingle();

        if (!teamData) {
          throw new Error("Invalid credentials. Use your email/password or team code.");
        }

        // For team logins, sign in with team code as email
        const teamEmail = `${teamCode.toLowerCase()}@team.buzzr.local`;
        const { data: teamAuth, error: teamAuthErr } = await supabase.auth.signInWithPassword({
          email: teamEmail,
          password,
        });

        if (teamAuthErr) {
          // Try to sign up
          const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
            email: teamEmail,
            password,
          });
          if (signUpErr) throw new Error("Invalid credentials");

          if (signUpData.user) {
            // Update the user profile
            await supabase
              .from("users")
              .upsert({
                id: signUpData.user.id,
                email: teamEmail,
                role: "team",
                team_name: teamData.name,
                team_code: teamData.code,
              });

            // Link team to user
            await supabase
              .from("teams")
              .update({ user_id: signUpData.user.id, is_online: true })
              .eq("id", teamData.id);

            setUser({
              id: signUpData.user.id,
              email: teamEmail,
              role: "team",
              team_name: teamData.name,
              team_code: teamData.code,
              team: { ...teamData, is_online: true, points: teamData.points || 0 } as Team,
            });
          }
        } else if (teamAuth.user) {
          // Link team to user
          await supabase
            .from("teams")
            .update({ user_id: teamAuth.user.id, is_online: true })
            .eq("id", teamData.id);

          setUser({
            id: teamAuth.user.id,
            email: teamEmail,
            role: "team",
            team_name: teamData.name,
            team_code: teamData.code,
            team: { ...teamData, is_online: true, points: teamData.points || 0 } as Team,
          });
        }
      } else if (authData.user) {
        // Successful email/password login - check role
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .maybeSingle();

        const role = profile?.role || "admin";

        if (role === "team" && profile?.team_code) {
          const { data: teamData } = await supabase
            .from("teams")
            .select("*")
            .eq("code", profile.team_code)
            .maybeSingle();

          if (teamData) {
            await supabase
              .from("teams")
              .update({ is_online: true })
              .eq("id", teamData.id);
          }

          setUser({
            id: authData.user.id,
            email: email,
            role: "team",
            team_name: profile.team_name,
            team_code: profile.team_code,
            team: teamData ? ({ ...teamData, is_online: true, points: teamData.points || 0 } as Team) : null,
          });
        } else {
          setUser({
            id: authData.user.id,
            email: email,
            role: "admin",
            team: null,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (user?.team) {
      await supabase
        .from("teams")
        .update({ is_online: false })
        .eq("id", user.team.id);
    }
    await supabase.auth.signOut();
    setUser(null);
    setTeams([]);
    setTopics([]);
    setCurrentRound(null);
    setBuzzerEvents([]);
    setRoundHistory([]);
  }, [user]);

  // ── Team actions ──────────────────────────────────────────────
  const addTeam = useCallback(async (name: string, code: string, color: string, password: string) => {
    // Insert team into DB
    const { data: teamData, error } = await supabase.from("teams").insert({
      name,
      code: code.toUpperCase(),
      color,
      is_active: true,
      is_locked: false,
      is_online: false,
      points: 0,
    }).select().single();

    if (error) throw error;

    // Create auth user for team via edge function
    const { error: fnError } = await supabase.functions.invoke("supabase-functions-create-team-user", {
      body: { teamCode: code.toUpperCase(), password },
    });

    if (fnError) {
      console.error("Failed to create auth user for team:", fnError);
      // Don't throw - team row was created, auth user creation failure is non-fatal
    }

    return teamData;
  }, []);

  const removeTeam = useCallback(async (id: string) => {
    await supabase.from("teams").delete().eq("id", id);
  }, []);

  const toggleTeamLock = useCallback(async (id: string) => {
    const team = teams.find((t) => t.id === id);
    if (team) {
      await supabase
        .from("teams")
        .update({ is_locked: !team.is_locked })
        .eq("id", id);
    }
  }, [teams]);

  // ── Topic actions ──────────────────────────────────────────────
  const addTopic = useCallback(async (title: string, category: string, description: string) => {
    await supabase.from("topics").insert({ title, category, description });
  }, []);

  const updateTopic = useCallback(
    async (id: string, title: string, category: string, description: string) => {
      await supabase
        .from("topics")
        .update({ title, category, description, updated_at: new Date().toISOString() })
        .eq("id", id);
    },
    []
  );

  const deleteTopic = useCallback(async (id: string) => {
    await supabase.from("topics").delete().eq("id", id);
  }, []);

  // ── Round actions ──────────────────────────────────────────────
  const startRound = useCallback(
    async (teamIds: string[], enableTopicSelection: boolean) => {
      const { data } = await supabase
        .from("rounds")
        .insert({
          state: enableTopicSelection ? "topic_selection" : "active",
          topic_selection_active: enableTopicSelection,
          buzzers_active: !enableTopicSelection,
          participating_team_ids: teamIds,
          question_number: 1,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      // Unlock all participating teams
      await supabase
        .from("teams")
        .update({ is_locked: false })
        .in("id", teamIds);

      if (data) {
        setCurrentRound(data as Round);
        setBuzzerEvents([]);
      }
    },
    []
  );

  const activateBuzzers = useCallback(async () => {
    if (!currentRound) return;
    await supabase
      .from("rounds")
      .update({
        state: "active",
        topic_selection_active: false,
        buzzers_active: true,
      })
      .eq("id", currentRound.id);
  }, [currentRound]);

  const resetRound = useCallback(async () => {
    if (!currentRound) return;

    // Delete buzzer events for current question
    await supabase
      .from("buzzer_events")
      .delete()
      .eq("round_id", currentRound.id)
      .eq("question_number", currentRound.question_number || 1);

    // Reset round state
    await supabase
      .from("rounds")
      .update({
        state: "active",
        buzzers_active: true,
        first_team_id: null,
      })
      .eq("id", currentRound.id);

    // Unlock all participating teams
    await supabase
      .from("teams")
      .update({ is_locked: false })
      .in("id", currentRound.participating_team_ids);
  }, [currentRound]);

  const nextQuestion = useCallback(async () => {
    if (!currentRound) return;
    const nextNum = (currentRound.question_number || 1) + 1;

    await supabase
      .from("rounds")
      .update({
        question_number: nextNum,
        buzzers_active: true,
        first_team_id: null,
      })
      .eq("id", currentRound.id);

    // Unlock all participating teams
    await supabase
      .from("teams")
      .update({ is_locked: false })
      .in("id", currentRound.participating_team_ids);
  }, [currentRound]);

  const endRound = useCallback(async () => {
    if (!currentRound) return;

    await supabase
      .from("rounds")
      .update({
        state: "ended",
        buzzers_active: false,
        ended_at: new Date().toISOString(),
      })
      .eq("id", currentRound.id);

    // Unlock all teams
    await supabase
      .from("teams")
      .update({ is_locked: false })
      .in("id", currentRound.participating_team_ids);
  }, [currentRound]);

  const pressBuzzer = useCallback(
    async (teamId: string) => {
      if (!currentRound?.buzzers_active) return;
      const team = teams.find((t) => t.id === teamId);
      if (!team || team.is_locked) return;

      // Count existing events for this question to determine position
      const { count } = await supabase
        .from("buzzer_events")
        .select("*", { count: "exact", head: true })
        .eq("round_id", currentRound.id)
        .eq("question_number", currentRound.question_number || 1);

      const position = (count || 0) + 1;

      await supabase.from("buzzer_events").insert({
        round_id: currentRound.id,
        team_id: teamId,
        position,
        question_number: currentRound.question_number || 1,
        pressed_at: new Date().toISOString(),
      });

      // Lock the team
      await supabase
        .from("teams")
        .update({ is_locked: true })
        .eq("id", teamId);

      // If first position, update round
      if (position === 1) {
        await supabase
          .from("rounds")
          .update({ first_team_id: teamId })
          .eq("id", currentRound.id);
      }
    },
    [currentRound, teams]
  );

  const selectTopic = useCallback(
    async (teamId: string, topicId: string) => {
      if (!currentRound) return;
      await supabase.from("topic_selections").upsert({
        round_id: currentRound.id,
        team_id: teamId,
        topic_id: topicId,
        selected_at: new Date().toISOString(),
      });
    },
    [currentRound]
  );

  const awardPoints = useCallback(
    async (teamId: string, points: number) => {
      const team = teams.find((t) => t.id === teamId);
      if (!team) return;
      await supabase
        .from("teams")
        .update({ points: (team.points || 0) + points })
        .eq("id", teamId);
    },
    [teams]
  );

  // Keep user's team data in sync
  useEffect(() => {
    if (user?.team) {
      const updatedTeam = teams.find((t) => t.id === user.team?.id);
      if (updatedTeam && JSON.stringify(updatedTeam) !== JSON.stringify(user.team)) {
        setUser((prev) => prev ? { ...prev, team: updatedTeam } : null);
      }
    }
  }, [teams, user?.team]);

  return (
    <AppContext.Provider
      value={{
        user,
        teams,
        topics,
        currentRound,
        buzzerEvents,
        roundHistory,
        loading,
        login,
        logout,
        addTeam,
        removeTeam,
        toggleTeamLock,
        addTopic,
        updateTopic,
        deleteTopic,
        startRound,
        activateBuzzers,
        resetRound,
        endRound,
        pressBuzzer,
        selectTopic,
        awardPoints,
        nextQuestion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
