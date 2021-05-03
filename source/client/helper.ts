

export function list_to_object<T>(list: T[], key_fn: (a: T) => string): { [key: string]: T } {
    var o: { [key: string]: T } = {}
    for (const e of list) {
        o[key_fn(e)] = e
    }
    return o
}
export function object_map_values<T, U>(o: { [key: string]: T }, fn: (a: T) => U): { [key: string]: U } {
    var om: { [key: string]: U } = {}
    for (const key in o) {
        if (Object.prototype.hasOwnProperty.call(o, key)) {
            om[key] = fn(o[key])
        }
    }
    return om
}

