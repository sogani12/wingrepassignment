import { useEffect, useState } from "react";
import { usePageStore } from "../store/pageStore";

export function useStoreHydration(): boolean {
  const [hydrated, setHydrated] = useState(() => usePageStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = usePageStore.persist.onFinishHydration(() => setHydrated(true));

    if (!usePageStore.persist.hasHydrated()) {
      void usePageStore.persist.rehydrate();
    } else {
      setHydrated(true);
    }

    return unsub;
  }, []);

  return hydrated;
}
