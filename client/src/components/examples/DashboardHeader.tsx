import DashboardHeader from "../DashboardHeader";

export default function DashboardHeaderExample() {
  return (
    <DashboardHeader
      userName="Ivan Petrov"
      userRole="Farmer"
      notificationCount={3}
      onToggleSidebar={() => console.log("Sidebar toggled")}
    />
  );
}
