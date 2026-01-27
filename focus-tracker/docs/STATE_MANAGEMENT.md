# State Management Documentation

## Overview

HabitFlow uses **React Context API** with **custom hooks** for global state management. This approach provides:

- ✅ **Simple Setup** - No additional libraries required
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Predictable Updates** - Centralized state logic
- ✅ **Easy Testing** - Context can be mocked easily
- ✅ **Performance** - useReducer for complex state, memoized callbacks

## Architecture

```
src/
├── context/               # Context providers
│   ├── AuthContext.tsx    # Authentication state
│   ├── UIContext.tsx      # UI/Theme state
│   ├── NotificationContext.tsx # Toast notifications
│   └── index.ts           # Barrel exports
├── hooks/                 # Custom hooks
│   ├── useUI.ts           # UI state hooks
│   └── index.ts           # Barrel exports
└── components/
    └── ToastContainer.tsx # Notification display
```

## Contexts

### 1. AuthContext

Manages authentication state including user info, JWT token, and route protection.

```tsx
// Types
interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}
```

**Usage:**
```tsx
import { useAuth } from '@/hooks';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <div>Welcome, {user?.email}!</div>;
}
```

### 2. UIContext

Manages UI state including theme, sidebar, mobile menu, and loading states.

```tsx
// Types
type Theme = "light" | "dark" | "system";

interface UIContextType {
  // Theme
  theme: Theme;
  effectiveTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  
  // Mobile Menu
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  
  // Global Loading
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Page Title
  pageTitle: string;
  setPageTitle: (title: string) => void;
}
```

**Usage:**
```tsx
import { useUI, useTheme, useSidebar } from '@/hooks';

// Full UI hook
function Dashboard() {
  const { theme, toggleTheme, sidebarOpen, setPageTitle } = useUI();
  
  useEffect(() => {
    setPageTitle('Dashboard');
  }, [setPageTitle]);
  
  return <div>Dashboard content</div>;
}

// Focused theme hook
function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{isDarkMode ? '🌙' : '☀️'}</button>;
}

// Focused sidebar hook
function SidebarToggle() {
  const { isOpen, toggle } = useSidebar();
  return <button onClick={toggle}>{isOpen ? '◀' : '▶'}</button>;
}
```

### 3. NotificationContext

Manages toast notifications with support for success, error, warning, and info types.

```tsx
// Types
type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // ms, 0 for persistent
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Convenience methods
  success: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  warning: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
}
```

**Usage:**
```tsx
import { useNotification } from '@/hooks';

function CreateHabitForm() {
  const { success, error } = useNotification();
  
  const handleSubmit = async (data: HabitData) => {
    try {
      await createHabit(data);
      success('Habit Created!', 'Your new habit is ready to track.');
    } catch (e) {
      error('Creation Failed', 'Please try again later.');
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Custom Hooks

### useAuth()
Full authentication state and actions.

### useUI()
Full UI state including theme, sidebar, loading, and page title.

### useTheme()
Focused hook for theme only: `{ theme, isDarkMode, toggleTheme, setTheme }`

### useSidebar()
Focused hook for sidebar: `{ isOpen, isCollapsed, toggle, toggleCollapse }`

### useMobileMenu()
Focused hook for mobile menu: `{ isOpen, toggle, setOpen }`

### useNotification()
Full notification system with convenience methods.

## Provider Setup

Providers are composed in `layout.tsx` in this order:

```tsx
// layout.tsx
<UIProvider>           {/* 1. Theme & layout state */}
  <NotificationProvider> {/* 2. Toast notifications */}
    <AuthProvider>       {/* 3. Authentication state */}
      <ToastContainer />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </AuthProvider>
  </NotificationProvider>
</UIProvider>
```

**Provider Order Matters:**
- UIProvider is outermost because auth/notifications might need loading states
- NotificationProvider comes next so auth errors can show toasts
- AuthProvider is innermost and can use both UI and notifications

## State Persistence

| State | Storage | Notes |
|-------|---------|-------|
| Theme | localStorage | Persists between sessions |
| Sidebar collapsed | localStorage | User preference |
| Auth token | localStorage | JWT for API calls |
| Notifications | Memory only | Cleared on page refresh |

## Best Practices

### 1. Use Focused Hooks When Possible
```tsx
// ❌ Importing more than needed
const { theme, toggleTheme, sidebarOpen, ... } = useUI();

// ✅ Use focused hook
const { theme, toggleTheme } = useTheme();
```

### 2. Memoize Callbacks in Providers
All action functions in providers use `useCallback` to prevent unnecessary re-renders.

### 3. Handle Loading States
```tsx
const { isLoading, isAuthenticated } = useAuth();

if (isLoading) {
  return <Skeleton />;
}

if (!isAuthenticated) {
  return <LoginPrompt />;
}
```

### 4. Use TypeScript
All contexts are fully typed. Import types when needed:
```tsx
import type { User, Notification, NotificationType } from '@/context';
```

## Demo Page

Visit `/state-demo` to see an interactive demonstration of all state management features.

---

*State management implemented following React best practices and the lesson plan for HabitFlow capstone project.*
