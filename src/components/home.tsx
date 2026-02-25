import { useApp } from "@/context/AppContext";
import LoginScreen from "@/components/auth/LoginScreen";
import TeamPortal from "@/components/team/TeamPortal";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function Home() {
  const { user } = useApp();

  if (!user) {
    return <LoginScreen />;
  }

  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  return <TeamPortal />;
}
