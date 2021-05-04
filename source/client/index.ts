import { CSPacket, SCPacket } from "../types"
import { a_app } from "./app"
import { SEmitter } from "./ui/event";

var ws: WebSocket

var websocket_callbacks: { [key: string]: (value: SCPacket) => void } = {}

export function websocket_request(request: CSPacket, callback: (response: SCPacket) => void) {
    console.log("websocket send", request);
    var handle = Math.random().toString()
    websocket_callbacks[handle] = callback
    request.handle = handle
    ws.send(JSON.stringify(request))
}

export function async_websocket_request(request: CSPacket): Promise<SCPacket> {
    return new Promise((res, rej) => {
        websocket_request(request, (response) => {
            res(response)
        })
    })
}


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
        console.log("websocket response", j);
        //@ts-ignore we trust™ the server
        var j2: SCPacket = j
        if (!j2.handle) throw new Error("Server ist stupid");
        if (!websocket_callbacks[j2.handle]) throw new Error("Server responed to something we have not issued");
        const handler = websocket_callbacks[j2.handle]
        handler(j2)
        if (j2.last) delete websocket_callbacks[j2.handle]
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

