import { async_websocket_request } from "..";
import { NetworkHostEntry, SCNetworkHost } from "../../types";
import { u_div, u_dynamic, u_h1, u_h2, u_li, u_p, u_text_input, u_ul } from "../ui/base";
import { SEmitter, SVar, s_var } from "../ui/event";
import { NavTab, u_tab_navigator } from "../ui/tabs";


export const a_network_tab: () => NavTab = () => ({
    id: "network",
    listing: u_p("Network"),
    content: u_tab_navigator(
        s_var("start"),
        start_tab(),
        host_tab()
    )
})

const start_tab: () => NavTab = () => ({
    id: "start",
    listing: u_p("Overview"),
    content: u_div(
        u_h2("Network analysis tools")
    )
})

function host_tab(): NavTab {
    var hostname = s_var("")
    var results: SVar<NetworkHostEntry[]> = hostname.async_map(
        new SEmitter(),
        [],
        async (hostname) => {
            var r = await async_websocket_request({ type: "network/host", hostname })
            return r.entries
        }
    )
    var input = u_text_input(hostname, "Hostname")
    //@ts-ignore
    window.a = () => input.focus()
 
    return {
        id: "host",
        listing: u_p("DNS query"),
        content: u_div(
            u_h1("DNS Query"),
            input,
            u_dynamic(results, r =>
                u_ul(...r.map(e =>
                    u_li(u_p(`Type: ${e.type}, IP: ${e.ip}`))
                ))
            )
        )
    }
}
