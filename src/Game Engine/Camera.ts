import {Camera} from "three";
import Resizer, {Sizes} from "./Resizer";
import * as THREE from 'three'

export interface ResizerCamera extends Camera, Resizer {}

export class PerspectiveCamera extends THREE.PerspectiveCamera implements ResizerCamera {
    resize(sizes: Sizes): void {
        this.aspect = sizes.width / sizes.height
        this.updateProjectionMatrix()
    }
}

export type CameraType = Camera | ResizerCamera
