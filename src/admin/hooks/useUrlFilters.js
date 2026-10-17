import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

// List filters kept in the URL (?status=new&page=2...), so Back, reloads and
// shared links keep them. `get(key)` reads one ("" when unset);
// `update({ key: value })` sets or clears them, and any change other than
// the page itself goes back to page 1.
export default function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const get = (key) => searchParams.get(key) ?? "";

  const update = useCallback(
    (changes) =>
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          Object.entries(changes).forEach(([key, value]) =>
            value ? next.set(key, value) : next.delete(key)
          );
          if (!("page" in changes)) next.delete("page");
          return next;
        },
        { replace: true }
      ),
    [setSearchParams]
  );

  return { get, update };
}

// A search box that reports its text 300ms after typing stops.
export function useSearchBox(initialValue, onSearch) {
  const [value, setValue] = useState(initialValue);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const onChange = (event) => {
    const text = event.target.value;
    setValue(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(text.trim()), 300);
  };

  // Empty the box without reporting (the caller clears its own filter).
  const clear = () => {
    clearTimeout(timer.current);
    setValue("");
  };

  return { value, onChange, clear };
}
