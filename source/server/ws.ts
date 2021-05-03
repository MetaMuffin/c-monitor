import expressWs from "express-ws";
import { CSPacket, SCPacket } from "../types";
import { smod_server_host } from "./modules/network";


export function bind_ws(app_ws: expressWs.Application) {

    app_ws.ws("/api/ws", (ws, req) => {
        console.log("websocket connected");

        ws.onmessage = (ev) => {
            var j = {}
            try {
                j = JSON.parse(ev.data.toString())
            } catch (e) { return console.log("client sent invalid json"); }
            //@ts-ignore
            var j2: CSPacket = j;
            
            if (ws_routes[j2.type]) {
                const respond = (data: any) => ws.send(JSON.stringify(data))
                ws_routes[j2.type](j2, respond)
            } else {
                ws.send(JSON.stringify({error: "du bist ein kek!"}))
            }
        }

    })

}

const ws_routes: { [key: string]: (input: CSPacket, respond: (message: SCPacket) => void) => void } = {
    "network/host": smod_server_host
}

