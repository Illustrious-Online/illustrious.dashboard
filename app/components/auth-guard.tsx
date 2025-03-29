import { useAuth } from "@/context/auth-context";
import { FullPageSkeletonLoader } from "@/loader";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) return <FullPageSkeletonLoader />; // Show skeleton while loading

  return <>{children}</>;
};

export default AuthGuard;
