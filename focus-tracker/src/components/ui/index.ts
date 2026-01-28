/**
 * UI Components Barrel Export
 * 
 * This file exports all UI-related components for easy importing.
 * 
 * @example
 * ```tsx
 * import { Button, Card, InputField, Modal, Badge, Spinner, ConfirmDialog } from "@/components/ui";
 * ```
 */

export { default as Button } from "./Button";
export { default as Card, StatCard } from "./Card";
export { default as InputField, TextArea } from "./InputField";
export { default as Modal } from "./Modal";
export { default as Badge } from "./Badge";

// Loader Components
export {
  Spinner,
  InlineLoader,
  FullPageLoader,
  ButtonLoader,
  ProgressBar,
  Skeleton,
  CardSkeleton,
  ListSkeleton,
  DotsLoader,
  PulseLoader,
} from "./Loader";

// Dialog Components
export { default as ConfirmDialog, useConfirmDialog } from "./ConfirmDialog";
