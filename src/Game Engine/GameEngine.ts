import Scene from "./Scene";
import Renderer from "./Renderer";
import TimeUpdater from "./TimeUpdater";
import Resizer, {Sizes} from "./Resizer";
import {Camera} from "three";
import {ResizerCamera} from "./Camera";

export default class GameEngine implements Resizer, TimeUpdater{
    scene: Scene
    renderer: Renderer
    camera: Camera | ResizerCamera
    cameraController: TimeUpdater
    sizes: Sizes

    resize(sizes: Sizes): void {
        this.sizes = sizes
        if ("resize" in this.camera) {
            this.camera.resize(sizes)
        }
        this.renderer.resize(sizes)
    }

    update(deltaTime: number): void {
        this.scene.update(deltaTime)

        if ("update" in this.cameraController) {
            this.cameraController.update()
        }

        this.renderer.render(this.scene, this.camera)
    }
}
