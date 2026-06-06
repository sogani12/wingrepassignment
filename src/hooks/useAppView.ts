import { useLocation } from "react-router-dom";
import { viewFromPath, type RouteView } from "../lib/routes";

export function useAppView(): RouteView {
  const { pathname } = useLocation();
  return viewFromPath(pathname);
}
