

export type SCPacket = SCNetworkHost
export type CSPacket = CSNetworkHost



export interface SCPacketBase {
    handle?: string
    last?: boolean
}
export interface CSPacketBase {
    handle?: string
}


export interface SCNetworkHost extends SCPacketBase {
    type: "network/host"
    entries: NetworkHostEntry[]
}
export interface CSNetworkHost extends CSPacketBase {
    type: "network/host"
    hostname: string
}

export type NetworkHostEntry = NetworkHostEntryIPV4 | NetworkHostEntryIPV6 | NetworkHostEntryMail
export interface NetworkHostEntryIPV4 {type: "ipv4", ip: string}
export interface NetworkHostEntryIPV6 {type: "ipv6", ip: string}
export interface NetworkHostEntryMail {type: "mail", priority: number, ip: string}

