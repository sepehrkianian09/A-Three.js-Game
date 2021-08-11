import PhysicalMesh from "../Objects/PhysicalMesh";
import {AnimationAction, AnimationClip, Vector3} from "three";
import * as THREE from 'three'

interface State {
    animation: AnimationClip
    action?: AnimationAction
}
interface Input {
    state: string
    action?: AnimationAction
    move?: {
        direction: Vector3
        speed: number
    }
    // stable: boolean
}
export default class PersonController {
    person: PhysicalMesh
    states: {[key: string]: State}
    inputs: {[key: string]: Input}
    selectedInput: Input
    animationMixer: THREE.AnimationMixer

    constructor(person: PhysicalMesh, states: { [p: string]: State }, inputs: {[key: string]: Input}) {
        this.person = person;
        this.states = states;
        this.inputs = inputs;
        this.selectedInput = null
        this.animationMixer = new THREE.AnimationMixer(this.person)
        // make animationAction for every animationClip from Start
        for (const statesKey in this.states) {
            const selectedState = this.states[statesKey]
            selectedState.action = this.animationMixer.clipAction(selectedState.animation)
        }
    }

    enable() {
        document.onkeyup = (keyEvent) => {
            if (keyEvent.key in this.inputs) {
                this.enableInput(this.inputs[keyEvent.key])
            }
        }
    }

    enableInput(input: Input) {
        this.selectedInput = input
        // play input animation
        if (this.selectedInput.state in this.states) {
            this.states[this.selectedInput.state].action.play()
        }
        // make the input move from the start
        if (this.selectedInput.move) {
            // esma hamin bashe?
            this.person.move(this.selectedInput.move.direction, this.selectedInput.move.speed)
        }
    }

    disableInput(input=this.selectedInput) {
        if (input) {
            if (this.selectedInput.state in this.states) {
                this.states[this.selectedInput.state].action.stop()
            }
            // make the input move from the start
            if (this.selectedInput.move) {
                // esma hamin bashe?
                this.person.stopMoving()
            }
            if (this.selectedInput === input) {
                this.selectedInput = null
            }
        }
    }
}
