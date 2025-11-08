import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Dashboard from "@/pages/Dashboard";
import Fields from "@/pages/Fields";
import Livestock from "@/pages/Livestock";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";
import { RoleSelectorDialog } from "@/components/ui/role-selector-dialog";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const updateRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      return await apiRequest("/api/auth/user/role", "PATCH", { role });
    },
    onSuccess: () => {
      setShowRoleSelector(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  useEffect(() => {
    if (isAuthenticated && user && !user.role) {
      setShowRoleSelector(true);
    }
  }, [isAuthenticated, user]);

  const handleSelectRole = (role: string) => {
    updateRoleMutation.mutate(role);
  };

  return (
    <>
      <RoleSelectorDialog
        open={showRoleSelector}
        onSelectRole={handleSelectRole}
      />
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/fields" component={Fields} />
            <Route path="/livestock" component={Livestock} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
