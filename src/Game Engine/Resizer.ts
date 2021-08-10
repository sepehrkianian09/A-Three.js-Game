export interface Sizes {
    width: number
    height: number
}

export default interface Resizer {
    resize: (sizes: Sizes) => void
}

export function windowSizes(): Sizes {
    return {width: window.innerWidth, height: window.innerHeight}
}
