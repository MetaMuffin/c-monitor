import { spawn } from "child_process";
import { CSPacket, SCNetworkHost, SCPacket } from "../../types";

const HOST_IPV4_REGEXP = /\w+ has address (\d+\.\d+\.\d+\.\d+)/i
const HOST_IPV6_REGEXP = /\w+ has IPV6 address (.+)/i
const HOST_MAIL_REGEXP = /\w+ mail is handled by (\d+) (\w+)/i

export interface CommandResult {
    code: number | null,
    stdout: string,
    stderr: string,
}

export function run_command_full(bin: string, ...args: string[]): Promise<CommandResult> {
    return new Promise((res, rej) => {
        var proc = spawn(bin, args)
        var stdout = ""
        var stderr = ""
        proc.stdout.on("data", d => stdout += d.toString())
        proc.stderr.on("data", d => stderr += d.toString())
        proc.on("close", (code) => {
            res({ code, stderr, stdout })
        })
    })
}

export async function smod_server_host(input: CSPacket, respond: (message: SCPacket) => void) {
    var r = await run_command_full("host", input.hostname)
    if (r.stderr.length != 0) return { handle: input.handle, error: r.stderr }
    var out: SCNetworkHost = { last: true, type: "network/host", handle: input.handle, entries: [] }

    var lines = r.stdout.split("\n")
    for (const line of lines) {
        var ipv4_reg = HOST_IPV4_REGEXP.exec(line)
        if (ipv4_reg) out.entries.push({ type: "ipv4", ip: ipv4_reg[1] })

        var ipv6_reg = HOST_IPV6_REGEXP.exec(line)
        if (ipv6_reg) out.entries.push({ type: "ipv6", ip: ipv6_reg[1] })

        var mail_reg = HOST_MAIL_REGEXP.exec(line)
        if (mail_reg) out.entries.push({ type: "mail", priority: parseInt(mail_reg[1]), ip: mail_reg[1] })
    }
    respond(out)
}
