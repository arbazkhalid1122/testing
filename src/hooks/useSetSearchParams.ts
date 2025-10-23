"use client";

import { useSearchParams, useRouter, ReadonlyURLSearchParams } from "next/navigation";

type Updater =
  | Record<string, string>
  | ((prev: URLSearchParams) => URLSearchParams | Record<string, string>);

export function useSetSearchParams(): [
  ReadonlyURLSearchParams,
  (updater: Updater) => void
] {
  const searchParams = useSearchParams();
  const router = useRouter();

  const setSearchParams = (updater: Updater) => {
    const prevParams = new URLSearchParams(searchParams.toString());
    let newParams: URLSearchParams;

    if (typeof updater === "function") {
      const result = updater(prevParams);
      if (result instanceof URLSearchParams) {
        newParams = result;
      } else {
        // merge object into prevParams
        newParams = prevParams;
        Object.entries(result).forEach(([key, value]) =>
          newParams.set(key, value)
        );
      }
    } else {
      newParams = prevParams;
      Object.entries(updater).forEach(([key, value]) =>
        newParams.set(key, value)
      );
    }

    router.push(`?${newParams.toString()}`);
  };

  return [searchParams, setSearchParams];
}