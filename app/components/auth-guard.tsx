"use client";

import { FullPageSkeletonLoader } from "@/loader";
import { useAuth } from "@/context/AuthContext";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) return <FullPageSkeletonLoader />; // Show skeleton while loading

  return <>{children}</>;
};

export default AuthGuard;
