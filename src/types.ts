import { ObservableStore } from "@corets/store"

export type StoreInitializer<TValue> = TValue | (() => TValue)
export type UseStore = <TValue extends object>(
  initialValue: StoreInitializer<TValue | ObservableStore<TValue>>
) => ObservableStore<TValue>
