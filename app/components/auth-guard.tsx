"use client";

import { FullPageSkeletonLoader } from "@/components/skeleton-loader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <FullPageSkeletonLoader />; // Show skeleton while loading

  return <>{children}</>;
};

export default AuthGuard;
