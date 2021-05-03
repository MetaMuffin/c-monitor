import { NavTab, u_tab_navigator } from "../ui/tabs";
import { s_var, u_div, u_h2, u_p, u_span } from "../ui/base";
import { a_network_tab } from "./network";

export function a_app(): HTMLElement {
    return u_tab_navigator(
        s_var("start"),
        a_start_tab(),
        a_network_tab(),
    )
}

const a_start_tab: () => NavTab = () => ({
    id: "start",
    listing: u_p("Start"),
    content: u_div(
        u_h2("C-Monitor"),
        u_span("A stupid pentesting tool for hackers™")
    )
})

