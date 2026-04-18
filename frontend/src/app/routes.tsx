import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getSession } from "./auth";
import { RequireAuth, RequireRole } from "../lib/routeGuards";
import AppShell from "../components/layout/AppShell";
import LoginPage from "../pages/LoginPage";
import PassengerPage from "../pages/PassengerPage";
import RouteOptimizerPage from "../pages/RouteOptimizerPage";
import TrainDelayPredictionPage from "../pages/TrainDelayPredictionPage";
import ComplaintPage from "../pages/ComplaintPage";
import ControllerPage from "../pages/ControllerPage";
import ControllerMapPage from "../pages/ControllerMapPage";
import ControllerTrainsPage from "../pages/ControllerTrainsPage";
import ControllerAlertsPage from "../pages/ControllerAlertsPage";
import ControllerComplaintsPage from "../pages/ControllerComplaintsPage";
import ChatPage from "../pages/ChatPage";
import NotFoundPage from "../pages/NotFoundPage";

function RootRedirect() {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  return <Navigate to={session.role === "controller" ? "/controller" : "/passenger"} replace />;
}

function ChatLayoutPage() {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  return (
    <AppShell role={session.role}>
      <ChatPage />
    </AppShell>
  );
}

function AnimatedView({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/login"
          element={
            <AnimatedView>
              <LoginPage />
            </AnimatedView>
          }
        />

        <Route element={<RequireAuth />}>
          <Route
            path="/chat"
            element={
              <AnimatedView>
                <ChatLayoutPage />
              </AnimatedView>
            }
          />
        </Route>

        <Route element={<RequireRole role="passenger" />}>
          <Route
            path="/passenger"
            element={
              <AnimatedView>
                <AppShell role="passenger">
                  <PassengerPage />
                </AppShell>
              </AnimatedView>
            }
          />
          <Route
            path="/predict-delay"
            element={
              <AnimatedView>
                <AppShell role="passenger">
                  <TrainDelayPredictionPage />
                </AppShell>
              </AnimatedView>
            }
          />
          <Route
            path="/routes"
            element={
              <AnimatedView>
                <AppShell role="passenger">
                  <RouteOptimizerPage />
                </AppShell>
              </AnimatedView>
            }
          />
          <Route
            path="/complaint"
            element={
              <AnimatedView>
                <AppShell role="passenger">
                  <ComplaintPage />
                </AppShell>
              </AnimatedView>
            }
          />
        </Route>

        <Route element={<RequireRole role="controller" />}>
          <Route
            path="/controller"
            element={
              <AnimatedView>
                <AppShell role="controller">
                  <ControllerPage />
                </AppShell>
              </AnimatedView>
            }
          />
          <Route
            path="/controller/map"
            element={
              <AnimatedView>
                <AppShell role="controller">
                  <ControllerMapPage />
                </AppShell>
              </AnimatedView>
            }
          />
          <Route
            path="/controller/trains"
            element={
              <AnimatedView>
                <AppShell role="controller">
                  <ControllerTrainsPage />
                </AppShell>
              </AnimatedView>
            }
          />
          <Route
            path="/controller/alerts"
            element={
              <AnimatedView>
                <AppShell role="controller">
                  <ControllerAlertsPage />
                </AppShell>
              </AnimatedView>
            }
          />
          <Route
            path="/controller/complaints"
            element={
              <AnimatedView>
                <AppShell role="controller">
                  <ControllerComplaintsPage />
                </AppShell>
              </AnimatedView>
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <AnimatedView>
              <NotFoundPage />
            </AnimatedView>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
