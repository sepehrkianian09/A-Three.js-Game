import {WebGLRenderer} from "three";
import Resizer, {Sizes} from "./interfaces/Resizer";

export default class Renderer extends WebGLRenderer implements Resizer {
    resize(sizes: Sizes): void {
        this.setSize(sizes.width, sizes.height)
        this.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
}
