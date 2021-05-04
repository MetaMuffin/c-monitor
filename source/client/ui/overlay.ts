import { u_div } from "./base";


export function u_overlay_container(child: HTMLElement): HTMLElement {
    var d = u_div()
    d.appendChild(child)

    

    return d
}

