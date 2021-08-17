import {Camera, Mesh, Object3D, Vector3} from "three";
import TimeUpdater from "../interfaces/TimeUpdater";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


export class ThirdPersonCameraController implements TimeUpdater {
    person: Object3D
    camera: Camera
    cameraController: OrbitControls
    cameraPersonOffSetVector: Vector3 = new Vector3(0, 0, 0)
    toUpdateCameraPosition = true

    constructor(camera: Camera, domElement: HTMLElement, person?: Mesh) {
        this.camera = camera
        this.cameraController = new OrbitControls(camera, domElement);
        this.person = person

        this.updateCameraPosition()
        this.cameraController.addEventListener('change', event => {
            console.log('camera controller changed')
            // console.log(event.target)
            this.updateCameraPosition()
        })
    }

    setPerson(person: Object3D): void {
        this.person = person
        this.updateCameraPosition()
    }


    update(): void {
        // return returnThing
        // this.cameraController.update();
        this.updateOnMovement()
    }

    updateCameraPosition(): void {
        if (this.person && this.toUpdateCameraPosition) {
            this.cameraPersonOffSetVector.copy(this.person.position).sub(this.camera.position)
            // console.log('cameraPerson')
            // console.log(this.cameraPersonOffSetVector)
        }
    }

    updateOnMovement(): void {
        if (this.person) {
            // set next target to Person Position
            const nextTarget = this.person.position
            const newCameraPosition = new Vector3().copy(nextTarget).sub(this.cameraPersonOffSetVector)
            // update camera target
            this.cameraController.target.set(nextTarget.x, nextTarget.y, nextTarget.z)
            // update Camera Position
            this.camera.position.copy(newCameraPosition)
            this.cameraController.update()
        }
    }

// update(): boolean {

    // }
}
