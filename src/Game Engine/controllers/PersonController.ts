import PhysicalMesh from "../Objects/PhysicalMesh";
import {AnimationAction, AnimationClip, Vector3} from "three";
import * as THREE from 'three'
import {VectorType} from "../../utils/Vectors";
import TimeUpdater from "../interfaces/TimeUpdater";
import {ThirdPersonCameraController} from "./ThirdPersonCameraController";

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
    cameraController: ThirdPersonCameraController
    states: { [key: string]: State }
    inputs: { [key: string]: Input }
    selectedKeys: string[] = []
    animationMixer: THREE.AnimationMixer

    constructor(person: PhysicalMesh, cameraController: ThirdPersonCameraController, states: { [p: string]: State }, inputs: { [key: string]: Input }) {
        this.person = person;
        this.cameraController = cameraController
        this.states = states;
        this.inputs = inputs;
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
            const keyPressed = keyEvent.key
            if (keyPressed in this.inputs && !this.selectedKeys.includes(keyPressed)) {
                this.enableInput(keyPressed)
                this.selectedKeys.push(keyPressed)
            }
        }
        document.onkeyup = (keyEvent) => {
            console.log(keyEvent);
            const keyPressed = keyEvent.key
            if (keyPressed in this.inputs && this.selectedKeys.includes(keyPressed)) {
                this.disableInput(keyPressed)
                this.selectedKeys = this.selectedKeys.filter(value => value !== keyPressed)
                if (this.selectedKeys.map(value => this.inputs[value]).filter(value => !!value.move).length === 0) {
                    this.person.stopMoving()
                }
            }
        }
    }

    enableInput(key: string): void {
        console.log('enable')
        const selectedInput = this.inputs[key]
        if (selectedInput.state in this.states) {
            // play input animation
            const selectedState = this.states[selectedInput.state]
            if (!selectedState.keys.includes(key)) {
                selectedState.keys.push(key)
                console.log(selectedState.keys)
                if (selectedState.keys.length === 1) {
                    selectedState.action
                        .reset()
                        .setEffectiveTimeScale(1)
                        .setEffectiveWeight(1)
                        .fadeIn(1)
                        .play();
                }
            }
        }
        // make the input move from the start
        if (selectedInput.move) {
            // esma hamin bashe?
            const moveDirection = this.getMoveDirection(selectedInput.move.direction)
            // this.cameraController.updateCameraPosition()
            this.person.move(moveDirection, selectedInput.move.speed)
            // this.cameraController.updateOnMovement()
        }
    }

    getMoveDirection(direction: VectorType): Vector3 {
        let moveDirection = new THREE.Vector3().copy(this.cameraController.cameraPersonOffSetVector).normalize()
        moveDirection.y = 0
        const euler = new THREE.Euler(direction.x, direction.y, direction.z)
        moveDirection = moveDirection.applyEuler(euler)
        return moveDirection
    }

    disableInput(key: string): void {
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
            const moveDirection = this.getMoveDirection(input.move.direction).negate()
            this.person.move(moveDirection, input.move.speed)
        }
    }
}
