import Script from "next/script";

export default function AutoResizeTextarea() {
  return (
    <Script id="auto-resize-textarea">
      {`
document.querySelectorAll("textarea").forEach(function(textarea) {
textarea.style.height = textarea.scrollHeight + "px";
textarea.style.overflowY = "hidden";

textarea.addEventListener("input", function() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});
});
      `}
    </Script>
  );
}
