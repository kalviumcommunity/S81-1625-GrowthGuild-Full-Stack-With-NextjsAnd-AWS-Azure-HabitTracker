/**
 * Components Barrel Export
 * 
 * Central export file for all components in the application.
 * Import components from this file for clean, organized imports.
 * 
 * @example
 * ```tsx
 * // Import multiple components
 * import { Header, Sidebar, Button, Card, InputField } from "@/components";
 * 
 * // Or import from specific category
 * import { Header, Sidebar } from "@/components/layout";
 * import { Button, Card } from "@/components/ui";
 * ```
 */

// Layout Components
export { Header, Sidebar, Footer, LayoutWrapper, PageContainer, PageHeader } from "./layout";

// UI Components
export { Button, Card, StatCard, InputField, TextArea, Modal, Badge } from "./ui";

// Existing Components
export { default as Navbar } from "./Navbar";
export { default as Breadcrumbs } from "./Breadcrumbs";
export { default as FileUpload } from "./FileUpload";
export { default as ProtectedRoute } from "./ProtectedRoute";
