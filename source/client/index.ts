import { a_app } from "./app"
import { SEmitter } from "./ui/base"

var ws: WebSocket


window.onload = () => {
    ws = new WebSocket(`ws://${window.location.host}/api/ws`)
    ws.onopen = () => {
        console.log("websocket opened!")
    }
    ws.onclose = () => {
        console.log("websocket closed!")
    }
    ws.onmessage = (ev) => {
        var j = {}
        try {
            j = JSON.parse(ev.data.toString())
        } catch (e) { console.log("server sent invalid json") }


    }

    document.body.appendChild(a_app())
}



declare global {
    interface HTMLElement {
        _cleanup: SEmitter<void>
    }
}

const orig_remove_child = HTMLElement.prototype.removeChild
HTMLElement.prototype.removeChild = function customRemoveChild<T extends Node>(child: T): T {
    if (child instanceof HTMLElement) {
        if (child._cleanup) child._cleanup.emit()
    }
    orig_remove_child.apply(this, [child])
    return child
}

const orig_create_element = document.createElement
document.createElement = function customCreateElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K] {
    var r = orig_create_element.apply(document, [tagName, options])
    r._cleanup = new SEmitter()
    //@ts-ignore why does the f*cking tsc not understand????????
    return r
}

