import {Camera, Mesh} from "three";
import TimeUpdater from "./TimeUpdater";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


export class ThirdPersonCameraController extends OrbitControls implements TimeUpdater {
    person: Mesh

    constructor(object: Camera, domElement: HTMLElement, person: Mesh) {
        super(object, domElement);
        this.person = person
    }

    update(): boolean {
        const returnThing = super.update()
        const nextTarget = this.person.position
        this.target.set(nextTarget.x, nextTarget.y, nextTarget.z)
        return returnThing
    }
}
