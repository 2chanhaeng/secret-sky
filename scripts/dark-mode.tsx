import Script from "next/script";

export default function DarkMode() {
  return (
    <Script lang="ts" id="dark-mode">
      {`
    const darkListener = window.matchMedia("(prefers-color-scheme: dark)");

    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          darkListener.matches),
    );

    darkListener.addEventListener("change", (event) => {
      if ("theme" in localStorage) return;
      console.log(event);
      if (event.matches) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    });
    `}
    </Script>
  );
}
