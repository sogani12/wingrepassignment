import { PageCanvas } from "./components/PageCanvas";
import { Sidebar } from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <PageCanvas />
    </div>
  );
}
