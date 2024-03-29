import React from "react"
import { useStore } from "./index"
import { createStore, ObservableStore } from "@corets/store"
import { act } from "react-dom/test-utils"
import { render, screen } from "@testing-library/react"

describe("useStore", () => {
  it("uses store", async () => {
    const sharedStore = createStore({ foo: "bar" })

    const Test = () => {
      const store = useStore(sharedStore)

      return <h1>{store.get().foo}</h1>
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(target).toHaveTextContent("bar")
  })

  it("uses store with initializer", () => {
    const initializer = () => createStore({ foo: "bar" })

    const Test = () => {
      const store = useStore(initializer)

      return <h1>{store.get().foo}</h1>
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(target).toHaveTextContent("bar")
  })

  it("uses new store", () => {
    const initializer = { foo: "bar" }

    const Test = () => {
      const store = useStore(initializer)

      return <h1>{store.get().foo}</h1>
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(target).toHaveTextContent("bar")
  })

  it("uses new store with initializer", () => {
    const initializer = () => ({ foo: "bar" })

    const Test = () => {
      const store = useStore(initializer)

      return <h1>{store.get().foo}</h1>
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(target).toHaveTextContent("bar")
  })

  it("updates and resets state", () => {
    const sharedStore = createStore({ foo: "bar" })
    let renders = 0
    let receivedStore: ObservableStore<any>

    const Test = () => {
      renders++
      const store = useStore(sharedStore)
      receivedStore = store

      return <h1>{store.get().foo}</h1>
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(target).toHaveTextContent("bar")
    expect(sharedStore.get()).toEqual({ foo: "bar" })
    expect(renders).toBe(1)

    act(() => receivedStore.set({ foo: "baz" }))

    expect(target).toHaveTextContent("baz")
    expect(sharedStore.get()).toEqual({ foo: "baz" })
    expect(renders).toBe(2)

    act(() => receivedStore.put({ foo: "bar", ding: "dong" }))

    expect(target).toHaveTextContent("bar")
    expect(sharedStore.get()).toEqual({ foo: "bar", ding: "dong" })
    expect(renders).toBe(3)

    act(() => sharedStore.set({ foo: "bar" }))

    expect(target).toHaveTextContent("bar")
    expect(sharedStore.get()).toEqual({ foo: "bar" })
    expect(renders).toBe(4)

    act(() => sharedStore.set({ foo: "baz", yolo: "swag" } as any))

    expect(target).toHaveTextContent("baz")
    expect(sharedStore.get()).toEqual({ foo: "baz", yolo: "swag" })
    expect(renders).toBe(5)

    act(() => sharedStore.put({ foo: "bar", ding: "dong" } as any))

    expect(target).toHaveTextContent("bar")
    expect(sharedStore.get()).toEqual({
      foo: "bar",
      yolo: "swag",
      ding: "dong",
    })
    expect(renders).toBe(6)
  })
})
