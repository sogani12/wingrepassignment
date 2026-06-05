import { LibraryView } from "./components/LibraryView";
import { PageCanvas } from "./components/PageCanvas";
import { Sidebar } from "./components/Sidebar";
import { TrashView } from "./components/TrashView";
import { useStoreHydration } from "./hooks/useStoreHydration";
import { usePageStore } from "./store/pageStore";

export default function App() {
  const hydrated = useStoreHydration();
  const view = usePageStore((state) => state.view);

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {view === "library" && <LibraryView />}
      {view === "trash" && <TrashView />}
      {view === "editor" && <PageCanvas />}
    </div>
  );
}
