import { createContext, useContext, useState, useEffect } from "react";
import { notifications as seedNotifications } from "../data/mockData";
import { clearSession, loadSession } from "../lib/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const session = loadSession();
  const [isAuthenticated, setIsAuthenticatedState] = useState(Boolean(session));
  const [role, setRole] = useState(session?.role || "admin");
  const [currentUser, setCurrentUser] = useState(session?.user || null);
  const [currentStudentId, setCurrentStudentId] = useState(session?.user?.student_id || null);
  const [notifs, setNotifs] = useState(seedNotifications);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const unreadCount = notifs.filter((n) => n.unread).length;

  const setIsAuthenticated = (value) => {
    setIsAuthenticatedState(value);
    if (!value) {
      clearSession();
      setCurrentUser(null);
      setCurrentStudentId(null);
    }
  };

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markRead = (id) => setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const currentMeal = (() => {
    const h = clock.getHours();
    if (h >= 7 && h < 10) return "Breakfast";
    if (h >= 12 && h < 15) return "Lunch";
    if (h >= 19 && h < 22) return "Dinner";
    return "Mess Closed";
  })();

  return (
    <AppContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        isAuthenticated,
        setIsAuthenticated,
        role,
        setRole,
        currentUser,
        setCurrentUser,
        currentStudentId,
        setCurrentStudentId,
        notifs,
        unreadCount,
        markAllRead,
        markRead,
        clock,
        currentMeal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components -- colocated public context hook
export const useApp = () => useContext(AppContext);
