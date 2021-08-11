import * as THREE from 'three'
import TimeUpdater from "../interfaces/TimeUpdater";
import * as CANNON from 'cannon-es'
import {Vector3} from "three";
import {Vec3} from "math/Vec3";

class VectorType {
    x: number
    y: number
    z: number
}

// function toAnotherVecType<T,Q extends VectorType>(vector: T): Q {
//     return new Q(vector.x, vector.y, vector.z)
// }


export default class PhysicalMesh extends THREE.Mesh implements TimeUpdater {
    equivalentBody: CANNON.Body
    readonly needsUpdate: boolean

    constructor(geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[], body: CANNON.Body, needsUpdate=false) {
        super(geometry, material);
        this.equivalentBody = body
        this.needsUpdate = needsUpdate
    }

    update(): void {
        if (this.equivalentBody) {
            const newPosition = this.equivalentBody.position
            this.position.copy(new Vector3(newPosition.x, newPosition.y, newPosition.z))
            // we don't have rotation property in Body.
            // we just have quaternion
            const newQuaternion = this.equivalentBody.quaternion
            this.quaternion.copy(new THREE.Quaternion(newQuaternion.x, newQuaternion.y, newQuaternion.z, newQuaternion.w))
        }
    }

    move(direction={x: 0, y: 0, z:0}, speed=0): void {
        this.equivalentBody.velocity = new Vec3(speed * direction.x, speed * direction.y, speed * direction.z)
        // set mesh's direction to that direction, and rotate it to there
        // const vecFrom = this.rotation
        // const vecTo =
        // this.rotateOnAxis()
    }

    stopMoving(): void {
        this.equivalentBody.velocity = new Vec3(0, 0, 0)
    }
}
