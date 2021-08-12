import {Camera, Mesh, Object3D} from "three";
import TimeUpdater from "../interfaces/TimeUpdater";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


export class ThirdPersonCameraController implements TimeUpdater {
    person: Object3D
    cameraController: OrbitControls

    constructor(object: Camera, domElement: HTMLElement, person?: Mesh) {
        this.cameraController = new OrbitControls(object, domElement);
        this.person = person
        this.cameraController.addEventListener('change', event => {
            // console.log('camera controller changed')
            // console.log(event)
        })
    }


    update(): void {
        if (this.person) {
            const nextTarget = this.person.position
            // this.cameraController.object.
            // console.log('next target')
            // console.log(nextTarget)
            this.cameraController.target.set(nextTarget.x, nextTarget.y, nextTarget.z)
        }
        // return returnThing
        this.cameraController.update();
    }

// update(): boolean {

    // }
}
