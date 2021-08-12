import Scene from "./Objects/Scene";
import Renderer from "./Renderer";
import TimeUpdater from "./interfaces/TimeUpdater";
import Resizer, {Sizes, windowSizes} from "./interfaces/Resizer";
import * as THREE from 'three'
import {CameraType} from "./Objects/Camera";
import {ThirdPersonCameraController} from "./controllers/ThirdPersonCameraController";
import PersonController from "./controllers/PersonController";

export default class GameEngine implements Resizer, TimeUpdater{
    scene: Scene
    renderer: Renderer
    camera: CameraType
    cameraController: ThirdPersonCameraController
    personController: PersonController
    clock: THREE.Clock
    sizes: Sizes


    constructor(scene: Scene, renderer: Renderer, camera: CameraType, cameraController: ThirdPersonCameraController, personController: PersonController, clock: THREE.Clock, sizesFunc:(()=>Sizes)=windowSizes) {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.cameraController = cameraController;
        this.personController = personController
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
        // console.log('update in game engine:')
        // console.log('camera controller')
        // console.log(this.cameraController)
        // if ("update" in this.cameraController) {
            this.cameraController.update()
        // }
        if (this.personController) {
            this.personController.update(deltaTime)
        }

        this.renderer.render(this.scene, this.camera)
    }
}
