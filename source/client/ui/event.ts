
export type ListenerHandle = number
export class SEmitter<T> {
    protected listeners: [ListenerHandle, (value: T) => void][] = []
    constructor() { }

    emit(value: T) {
        for (const [h, l] of this.listeners) {
            l(value)
        }
    }

    add_listener(listener: (value: T) => void): ListenerHandle {
        var random = Math.random()
        this.listeners.push([random, listener])
        return random
    }
    add_listener_once(listener: (value: T) => void): ListenerHandle {
        var handle = this.add_listener((value) => {
            listener(value)
            this.remove_listener(handle)
        })
        return handle
    }

    remove_listener(handle: ListenerHandle) {
        var i = this.listeners.findIndex(e => e[0] == handle)
        if (i == -1) throw new Error("stupid dev");
        this.listeners.splice(i)
    }
}


export function s_var<T>(initial: T): SVar<T> { return new SVar(initial) }
export class SVar<T> {
    protected _value: T
    protected listeners: [ListenerHandle, (new_value: T, old_value: T) => void][] = []

    constructor(initial: T) {
        this._value = initial
    }

    get value() { return this._value }
    set value(value: T) {
        var old = this._value
        this._value = value
        for (const [h, l] of this.listeners) {
            l(value, old)
        }
    }

    add_listener(listener: (new_value: T, old_value: T) => void): ListenerHandle {
        var random = Math.random()
        this.listeners.push([random, listener])
        return random
    }

    add_listener_with_cleanup(cleanup_emitter: SEmitter<void>, listener: (new_value: T, old_value: T) => void): ListenerHandle {
        var handle = this.add_listener(listener)
        if (this.listeners.find(l => l[0] == handle)) cleanup_emitter.add_listener_once(() => this.remove_listener(handle))
        return handle
    }

    remove_listener(handle: ListenerHandle) {
        var i = this.listeners.findIndex(e => e[0] == handle)
        if (i == -1) throw new Error("łſ ̣æł€→łø ̇€ΩØŁı ̇€Ð‹‘‚’º‹‘ẞºẞŁª ̇ÆŁ€ıkdjafhdkhlfj you are a stupid developer!!! why did you call this function with invalid args!! arrrrg!");
        this.listeners.splice(i)
    }

    map<U>(cleanup_emitter: SEmitter<void>, initial: U, map_fn: (value: T) => U): SVar<U> {
        var m = new SVar<U>(initial)
        this.add_listener_with_cleanup(cleanup_emitter, (value) => {
            var mapped = map_fn(value)
            m.value = mapped
        })
        return m
    }

    async_map<U>(cleanup_emitter: SEmitter<void>, initial: U, map_fn: (value: T) => Promise<U>): SVar<U> {
        var m = new SVar<U>(initial)
        this.add_listener_with_cleanup(cleanup_emitter, (value) => {
            map_fn(value).then(mapped => {
                m.value = mapped
            })
        })
        return m
    }



}
