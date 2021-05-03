

export type SCPacket = SCNetworkHost
export type CSPacket = CSNetworkHost



export interface SCPacketBase {
    handle: string
}
export interface CSPacketBase {
    handle: string
}


export interface SCNetworkHost extends SCPacketBase {
    type: "network/host"
    hostname: string
}
export interface CSNetworkHost extends CSPacketBase {
    type: "network/host"
    output: string
}


