import React from "react"
import { mount } from "enzyme"
import { useStore } from "./index"
import { createStore, ObservableStore } from "@corets/store"
import { act } from "react-dom/test-utils"

describe("useStore", () => {
  it("uses store", async () => {
    const sharedStore = createStore({ foo: "bar" })

    const Test = () => {
      const store = useStore(sharedStore)

      return <h1>{store.get().foo}</h1>
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(target().text()).toBe("bar")
  })

  it("uses store with initializer", () => {
    const initializer = () => createStore({ foo: "bar" })

    const Test = () => {
      const store = useStore(initializer)

      return <h1>{store.get().foo}</h1>
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(target().text()).toBe("bar")
  })

  it("uses new store", () => {
    const initializer = { foo: "bar" }

    const Test = () => {
      const store = useStore(initializer)

      return <h1>{store.get().foo}</h1>
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(target().text()).toBe("bar")
  })

  it("uses new store with initializer", () => {
    const initializer = () => ({ foo: "bar" })

    const Test = () => {
      const store = useStore(initializer)

      return <h1>{store.get().foo}</h1>
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(target().text()).toBe("bar")
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

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(target().text()).toBe("bar")
    expect(sharedStore.get()).toEqual({ foo: "bar" })
    expect(renders).toBe(1)

    act(() => receivedStore.set({ foo: "baz" }))

    expect(target().text()).toBe("baz")
    expect(sharedStore.get()).toEqual({ foo: "baz" })
    expect(renders).toBe(2)

    act(() => receivedStore.put({ foo: "bar", ding: "dong" }))

    expect(target().text()).toBe("bar")
    expect(sharedStore.get()).toEqual({ foo: "bar", ding: "dong" })
    expect(renders).toBe(3)

    act(() => sharedStore.set({ foo: "bar" }))

    expect(target().text()).toBe("bar")
    expect(sharedStore.get()).toEqual({ foo: "bar" })
    expect(renders).toBe(4)

    act(() => sharedStore.set({ foo: "baz", yolo: "swag" } as any))

    expect(target().text()).toBe("baz")
    expect(sharedStore.get()).toEqual({ foo: "baz", yolo: "swag" })
    expect(renders).toBe(5)

    act(() => sharedStore.put({ foo: "bar", ding: "dong" } as any))

    expect(target().text()).toBe("bar")
    expect(sharedStore.get()).toEqual({
      foo: "bar",
      yolo: "swag",
      ding: "dong",
    })
    expect(renders).toBe(6)
  })
})
