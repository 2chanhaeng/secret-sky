import { usePathname, useSearchParams } from "next/navigation";

const useRedirectTo = (defaultPath: string = "/") => {
  const path = usePathname();
  const params = useSearchParams();

  if (!path.includes("/auth")) return path;

  const redirectToParam = params.get("redirectTo");
  if (redirectToParam) return redirectToParam;

  return defaultPath;
};

export default useRedirectTo;
