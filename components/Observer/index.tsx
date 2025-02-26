import { useIntersectionObserver } from "./hooks";

export default function Observer({
  callback,
}: {
  callback: () => unknown | Promise<unknown>;
}) {
  const ref = useIntersectionObserver(callback);
  return <div ref={ref} style={{ opacity: 0, height: 1 }} />;
}
