import { s_var, u_div, u_h2, u_p } from "../ui/base";
import { NavTab, u_tab_navigator } from "../ui/tabs";


export const a_network_tab: () => NavTab = () => ({
    id: "network",
    listing: u_p("Network"),
    content: u_tab_navigator(
        s_var("start"),
        start_tab(),
        port_scan_tab()
    )
})

const start_tab: () => NavTab = () => ({
    id: "start",
    listing: u_p("Overview"),
    content: u_div(
        u_h2("Network analysis tools")
    )
})

const port_scan_tab: () => NavTab = () => ({
    id: "port-scan",
    listing: u_p("Port scan"),
    content: u_div(
        document.createElement("input")
    )
})
