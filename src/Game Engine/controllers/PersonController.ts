import PhysicalMesh from "../Objects/PhysicalMesh";
import {AnimationAction, AnimationClip} from "three";
import * as THREE from 'three'
import {VectorType} from "../../utils/Vectors";
import TimeUpdater from "../interfaces/TimeUpdater";

interface State {
    animation: AnimationClip
    action?: AnimationAction
    keys?: string[]
}
interface Input {
    state: string
    move?: {
        direction: VectorType
        speed: number
    }
    // stable: boolean
}
export default class PersonController implements TimeUpdater {
    person: PhysicalMesh
    states: {[key: string]: State}
    inputs: {[key: string]: Input}
    selectedInput: Input
    animationMixer: THREE.AnimationMixer

    constructor(person: PhysicalMesh, states: { [p: string]: State }, inputs: {[key: string]: Input}) {
        this.person = person;
        this.states = states;
        this.inputs = inputs;
        this.selectedInput = undefined
        this.animationMixer = new THREE.AnimationMixer(this.person.mesh)
        // make animationAction for every animationClip from Start
        for (const statesKey in this.states) {
            const selectedState = this.states[statesKey]
            selectedState.action = this.animationMixer.clipAction(selectedState.animation)
            selectedState.keys = []
        }
    }

    update(deltaTime: number): void {
        this.animationMixer.update(deltaTime)
    }

    enable() {
        document.onkeydown = (keyEvent) => {
            console.log(keyEvent);
            if (keyEvent.key in this.inputs) {
                this.enableInput(keyEvent.key)
            }
        }
        document.onkeyup = (keyEvent) => {
            console.log(keyEvent);
            if (keyEvent.key in this.inputs) {
                this.disableInput(keyEvent.key)
            }
        }
    }

    enableInput(key: string): void {
        console.log('enable')
        this.selectedInput = this.inputs[key]
        if (this.selectedInput.state in this.states) {
            // play input animation
            const selectedState = this.states[this.selectedInput.state]
            if (!selectedState.keys.includes(key)) {
                selectedState.keys.push(key)
                console.log(selectedState.keys)
                if (selectedState.keys.length === 1) {
                    selectedState.action
                        .reset()
                        .setEffectiveTimeScale( 1 )
                        .setEffectiveWeight( 1 )
                        .fadeIn( 1 )
                        .play();
                }
            }
        }
        // make the input move from the start
        if (this.selectedInput.move) {
            // esma hamin bashe?
            this.person.move(this.selectedInput.move.direction, this.selectedInput.move.speed)
        }
    }

    disableInput(key: string): void {
        if (key in this.inputs) {
            const input = this.inputs[key]
            console.log('disable')
            if (input.state in this.states) {
                const selectedState = this.states[input.state]
                selectedState.keys = selectedState.keys.filter(value => value !== key)
                if (selectedState.keys.length === 0) {
                    selectedState.action.fadeOut(1)
                }
            }
            // make the input move from the start
            if (input.move) {
                // esma hamin bashe?
                this.person.stopMoving()
            }
            if (this.selectedInput === input) {
                this.selectedInput = undefined
            }
        }
    }
}
