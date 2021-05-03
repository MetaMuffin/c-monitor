import { list_to_object, object_map_values } from "../helper";
import { SVar, s_var, u_class_if, u_div, u_li, u_meta, u_onclick, u_p, u_ul, u_with_cleanup } from "./base";




export interface NavTab {
    id: string,
    listing: HTMLElement
    content: HTMLElement
}


export function u_tab_navigator(selected: SVar<string>, ...tabs: NavTab[]): HTMLElement {
    const tabs_o = list_to_object(tabs, t => t.id)
    return u_meta({ class: "tab-navigator" },
        u_div(
            u_ul(...tabs.map(tab =>
                u_with_cleanup(ce =>
                    u_class_if(
                        selected.map(ce, false, a => a == tab.id),
                        "selected",
                        u_onclick(
                            () => selected.value = tab.id,
                            u_li(tab.listing)
                        )
                    )
                )
            )),
            u_tab(selected, object_map_values(tabs_o, e => e.content))
        )
    )
}

export function u_tab(selected: SVar<string>, tabs: { [key: string]: HTMLElement }): HTMLElement {
    var d = u_meta({ class: "tabs" }, u_div())
    d.appendChild(tabs[selected.value])
    selected.add_listener((new_v, old_v) => {
        d.removeChild(tabs[old_v])
        d.appendChild(tabs[new_v])
    })
    return d
}

