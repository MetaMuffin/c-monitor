import { SEmitter, SVar } from "./event"


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

export function u_dynamic<T>(state: SVar<T>, transformer: (state: T) => HTMLElement): HTMLElement {
    var div = u_div()
    div.appendChild(transformer(state.value))
    state.add_listener_with_cleanup(div._cleanup, (value) => {
        div.removeChild(div.children[0])
        div.appendChild(transformer(value))
    })
    return div
}

export function u_text_input(text: SVar<string>, name: string): HTMLElement {
    var pair = document.createElement("div")
    pair.classList.add("input-pair")

    var label = document.createElement("span")
    label.textContent = name

    var inp = document.createElement("input")
    inp.type = "text"
    inp.placeholder = " " // make placeholder shown, so css works fine with it
    inp.value = text.value
    inp.onchange = () => {
        text.value = inp.value
    }
    pair.append(inp, label)
    return pair
}
