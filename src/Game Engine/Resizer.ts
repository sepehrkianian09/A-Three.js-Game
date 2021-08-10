export interface Sizes {
    width: number
    height: number
}

export default interface Resizer {
    resize: (sizes: Sizes) => void
}
