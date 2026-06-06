export const routes = {
  home: "/",
  page: (pageId: string) => `/p/${pageId}`,
  library: "/library",
  trash: "/trash",
} as const;

export function parsePageId(pathname: string): string | null {
  const match = pathname.match(/^\/p\/([^/]+)$/);
  return match?.[1] ?? null;
}

export type RouteView = "editor" | "library" | "trash";

export function viewFromPath(pathname: string): RouteView {
  if (pathname === routes.library) return "library";
  if (pathname === routes.trash) return "trash";
  return "editor";
}
