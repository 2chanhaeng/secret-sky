import { useEffect, useImperativeHandle, useState } from "react";

export interface TextareaRef {
  clear: () => void;
}

export default function Textarea({
  onChange,
  "data-store-id": dataStoreId,
  ref,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  "data-store-id"?: string;
  ref?: React.Ref<TextareaRef>;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    // load value from local storage
    if (dataStoreId && localStorage) {
      const stored = localStorage.getItem(dataStoreId);
      if (stored !== null) {
        setValue(stored);
      }
    }
  }, [dataStoreId]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event);
    }
    const textarea = event.target;
    // auto resize
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    // save value
    const newValue = textarea.value;
    setValue(newValue);
    if (dataStoreId) {
      localStorage.setItem(dataStoreId, newValue);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      clear: () => {
        // clear value
        setValue("");
        if (dataStoreId) {
          localStorage.removeItem(dataStoreId);
        }
      },
    }),
    [dataStoreId]
  );

  return <textarea {...props} value={value} onChange={handleChange} />;
}
