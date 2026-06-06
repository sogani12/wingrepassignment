import { useEffect } from "react";
import { useTransformContext } from "./TransformContext";

export function TransformStatusToast() {
  const {
    isTransforming,
    transformError,
    clearTransformError,
  } = useTransformContext();

  useEffect(() => {
    if (!transformError) return;

    const timer = window.setTimeout(() => {
      clearTransformError();
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [transformError, clearTransformError]);

  if (!isTransforming && !transformError) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div
        className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${
          transformError
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-neutral-200 bg-neutral-900 text-white"
        }`}
      >
        {transformError ?? "Transforming…"}
      </div>
    </div>
  );
}
