

export function u_any_container<K extends keyof HTMLElementTagNameMap>(tag: K, ...children: HTMLElement[]): HTMLElementTagNameMap[K] {
    var div = document.createElement(tag)
    for (const c of children) {
        div.appendChild(c)
    }
    return div
}
export function u_any_text<K extends keyof HTMLElementTagNameMap>(tag: K, text: string): HTMLElementTagNameMap[K] {
    var p = document.createElement(tag)
    p.textContent = text
    return p
}


export const u_div = u_any_container.bind(null, "div")
export const u_ul = u_any_container.bind(null, "ul")
export const u_ol = u_any_container.bind(null, "ol")
export const u_li = u_any_container.bind(null, "li")
export const u_nav = u_any_container.bind(null, "nav")
export const u_footer = u_any_container.bind(null, "footer")
export const u_header = u_any_container.bind(null, "header")

export const u_p = u_any_text.bind(null, "p")
export const u_span = u_any_text.bind(null, "span")
export const u_h1 = u_any_text.bind(null, "h1")
export const u_h2 = u_any_text.bind(null, "h2")
export const u_h3 = u_any_text.bind(null, "h3")
export const u_h4 = u_any_text.bind(null, "h4")


export interface Meta {
    id?: string,
    class?: string[] | string,
}
export function u_meta(meta: Meta, child: HTMLElement): HTMLElement {
    if (meta.id) child.id = meta.id
    if (typeof meta.class == "string") child.classList.add(meta.class)
    if (typeof meta.class == "object") child.classList.add(...meta.class)
    return child
}

export function u_onclick(callback: () => void, child: HTMLElement): HTMLElement {
    child.onclick = callback
    return child
}

export function u_class_if(condition: SVar<boolean>, class_name: string, child: HTMLElement): HTMLElement {
    condition.add_listener_with_cleanup(child._cleanup, (value) => {
        if (value) child.classList.add(class_name)
        else child.classList.remove(class_name)
    })
    return child
}

export function u_with_cleanup<T extends HTMLElement>(gen: (cleanup_emitter: SEmitter<void>) => T): T {
    var c = new SEmitter<void>()
    var child = gen(c)
    child._cleanup.add_listener_once(c.emit)
    return child
}

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

}
