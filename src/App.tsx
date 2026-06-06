import { Navigate, Route, Routes } from "react-router-dom";
import { LibraryView } from "./components/LibraryView";
import { PageCanvas } from "./components/PageCanvas";
import { RouteSync } from "./components/RouteSync";
import { Sidebar } from "./components/Sidebar";
import { TrashView } from "./components/TrashView";
import { useAppView } from "./hooks/useAppView";
import { QuickSearchModal } from "./components/QuickSearchModal";
import { TrashToast } from "./components/TrashToast";
import { useQuickSearch } from "./hooks/useQuickSearch";
import { useStoreHydration } from "./hooks/useStoreHydration";

function AppLayout() {
  const view = useAppView();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {view === "library" && <LibraryView />}
      {view === "trash" && <TrashView />}
      {view === "editor" && <PageCanvas />}
    </div>
  );
}

export default function App() {
  const hydrated = useStoreHydration();
  const { open, closeSearch } = useQuickSearch();

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  return (
    <>
      <RouteSync />
      <QuickSearchModal open={open} onClose={closeSearch} />
      <TrashToast />
      <Routes>
        <Route path="/" element={<AppLayout />} />
        <Route path="/p/:pageId" element={<AppLayout />} />
        <Route path="/library" element={<AppLayout />} />
        <Route path="/trash" element={<AppLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
