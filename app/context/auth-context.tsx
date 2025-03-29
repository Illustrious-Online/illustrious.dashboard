import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/client";
import { UserService } from "@/services/user-service";
import type { UserDetails } from "@/types/auth";
import type { Session } from "@supabase/supabase-js";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
  user: UserDetails | null;
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findSession = async () => {
      const data = await getSession();
      if (data) {
        setSession(data.session);
        setUser(data.user);
        Cookies.set("ill-session", JSON.stringify({ session, user }));
      } else {
        Cookies.remove("ill-session");
        setUser(null);
        setSession(null);
        router.push("/auth/login");
      }
    };

    const sessionCookie = Cookies.get("ill-session");
    if (sessionCookie) {
      const parsedSession = JSON.parse(sessionCookie);
      if (parsedSession.session) {
        setSession(parsedSession.session);
        setUser(parsedSession.user);
      }
    } else findSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          setSession(session);
          setUser(await new UserService().getUser(session.user.id));
          Cookies.set("ill-session", JSON.stringify({ session, user }));
        } else {
          Cookies.remove("ill-session");
          setUser(null);
          setSession(null);
          router.push("/auth/login");
        }

        setLoading(false);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, [router, supabase, session, user]);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
