import {Camera, Mesh, Object3D, Vector3} from "three";
import TimeUpdater from "../interfaces/TimeUpdater";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


export class ThirdPersonCameraController implements TimeUpdater {
    person: Object3D
    camera: Camera
    cameraController: OrbitControls
    cameraPersonOffSetVector: Vector3 = new Vector3(0, 0, 0)

    constructor(camera: Camera, domElement: HTMLElement, person?: Mesh) {
        this.camera = camera
        this.cameraController = new OrbitControls(camera, domElement);
        this.person = person

        this.updateCameraPosition()
        this.cameraController.addEventListener('change', event => {
            console.log('camera controller changed')
            console.log(event)
            this.updateCameraPosition()
        })
    }


    update(): void {
        // return returnThing
        this.cameraController.update();
        // this.updateOnMovement()
    }

    updateCameraPosition(): void {
        if (this.person) {
            this.cameraPersonOffSetVector.copy(this.person.position).sub(this.camera.position)
        }
    }

    updateOnMovement(): void {
        if (this.person) {
            // set next target to Person Position
            const nextTarget = this.person.position
            this.cameraController.target.set(nextTarget.x, nextTarget.y, nextTarget.z)

            // update Camera Position
            const newCameraPosition = new Vector3().copy(nextTarget).sub(this.cameraPersonOffSetVector)
            this.camera.position.copy(newCameraPosition)
            // this.updateCameraPosition()
        }
    }

// update(): boolean {

    // }
}
