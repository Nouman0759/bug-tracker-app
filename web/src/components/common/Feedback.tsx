"use client";

import { Button } from "./Button";

export function Loader() {
  return (
    <div className="flex flex-1 items-center justify-center py-xl">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-xl text-center">
      <p className="text-body text-danger">{message}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry} className="mt-md">
          Retry
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-xxl text-center">
      <p className="text-h3 text-text">{title}</p>
      {subtitle ? <p className="mt-sm text-body text-text-muted">{subtitle}</p> : null}
    </div>
  );
}
