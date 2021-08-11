import Scene from "./Objects/Scene";
import Renderer from "./Renderer";
import TimeUpdater from "./interfaces/TimeUpdater";
import Resizer, {Sizes, windowSizes} from "./interfaces/Resizer";
import * as THREE from 'three'
import {CameraType} from "./Objects/Camera";

export default class GameEngine implements Resizer, TimeUpdater{
    scene: Scene
    renderer: Renderer
    camera: CameraType
    cameraController: TimeUpdater
    clock: THREE.Clock
    sizes: Sizes


    constructor(scene: Scene, renderer: Renderer, camera: CameraType, cameraController: TimeUpdater, clock: THREE.Clock, sizesFunc:(()=>Sizes)=windowSizes) {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.cameraController = cameraController;
        this.clock = clock
        this.sizes = sizesFunc();

        this.resize(sizesFunc())
        window.addEventListener('resize', () => {
            this.resize(sizesFunc())
        })

        const startUpdate = () => {
            this.update(this.clock.getDelta())
            window.requestAnimationFrame(startUpdate)
        }

        startUpdate()
    }

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
