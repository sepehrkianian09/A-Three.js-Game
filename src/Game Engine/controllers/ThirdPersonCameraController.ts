import {Camera, Mesh, Object3D} from "three";
import TimeUpdater from "../interfaces/TimeUpdater";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


export class ThirdPersonCameraController extends OrbitControls implements TimeUpdater {
    person: Object3D

    constructor(object: Camera, domElement: HTMLElement, person?: Mesh) {
        super(object, domElement);
        this.person = person
    }

    update(): boolean {
        const returnThing = super.update()
        if (this.person) {
            console.log('ffff')
            const nextTarget = this.person.position
            this.target.set(nextTarget.x, nextTarget.y, nextTarget.z)
        }
        return returnThing
    }
}
