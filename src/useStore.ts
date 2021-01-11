import { UseStore } from "./types"
import { useEffect, useMemo, useState } from "react"
import { unwrapStore } from "./unwrapStore"

export const useStore: UseStore = <TValue extends object>(initialValue) => {
  const store = useMemo(() => unwrapStore<TValue>(initialValue), [])

  const [reference, setReference] = useState(0)

  useEffect(() => {
    return store.listen(() => setReference((previous) => previous + 1), false)
  }, [])

  return store
}
