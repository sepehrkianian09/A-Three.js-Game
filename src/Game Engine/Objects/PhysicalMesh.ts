import * as THREE from 'three'
import TimeUpdater from "../interfaces/TimeUpdater";
import * as CANNON from 'cannon-es'
import {Box3, Object3D, Vector3} from "three";
import {Body} from "objects/Body";

class VectorType {
    x: number
    y: number
    z: number
}

// function toAnotherVecType<T,Q extends VectorType>(vector: T): Q {
//     return new Q(vector.x, vector.y, vector.z)
// }


export default class PhysicalMesh implements TimeUpdater {
    mesh: Object3D
    body: CANNON.Body
    readonly defaultMaterial = new CANNON.Material('default')
    needsUpdate: boolean

    constructor(mesh: Object3D, body?: CANNON.Body, needsUpdate=false) {
        this.mesh = mesh
        this.body = body
        this.needsUpdate = needsUpdate
        if (!body) {
            this.body = this.getDefaultBody()
        }
    }

    update(): void {
        if (this.body) {
            const newPosition = this.body.position
            this.mesh.position.copy(new Vector3(newPosition.x, newPosition.y, newPosition.z))
            // we don't have rotation property in Body.
            // we just have quaternion
            const newQuaternion = this.body.quaternion
            this.mesh.quaternion.copy(new THREE.Quaternion(newQuaternion.x, newQuaternion.y, newQuaternion.z, newQuaternion.w))
        }
    }

    move(direction={x: 0, y: 0, z:0}, speed=0): void {
        this.body.velocity = new CANNON.Vec3(speed * direction.x, speed * direction.y, speed * direction.z)
        // set mesh's direction to that direction, and rotate it to there
        // const vecFrom = this.rotation
        // const vecTo =
        // this.rotateOnAxis()
    }

    stopMoving(): void {
        this.body.velocity = new CANNON.Vec3(0, 0, 0)
    }

    // todo create body based on geometry and material
    private getDefaultBody(): CANNON.Body {
        //todo
        const boxModel = new Box3().setFromObject(this.mesh)
        console.log('boxMod')
        console.log(boxModel)
        const extents = boxModel.max.sub(boxModel.min).multiplyScalar(0.1)
        const shape = new CANNON.Box(new CANNON.Vec3(extents.x, extents.y, extents.z))
        return new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 0, 0),
            shape: shape,
            material: this.defaultMaterial
        })
    }
}
