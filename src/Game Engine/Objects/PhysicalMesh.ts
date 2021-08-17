import * as THREE from 'three'
import TimeUpdater from "../interfaces/TimeUpdater";
import * as CANNON from 'cannon-es'
import {Box3, Material, Mesh, Object3D, Vector3} from "three";
import {Body} from "objects/Body";
import Scene from "./Scene";

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
    needsUpdate: boolean
    scene: Scene

    // update options
    dontHaveBody: boolean
    centerPositionOffSet: Vector3
    meshEquivalentForBody: THREE.Mesh

    constructor(mesh: Object3D, body?: CANNON.Body, needsUpdate=false, scene=undefined) {
        this.mesh = mesh
        this.body = body
        this.needsUpdate = needsUpdate
        this.scene = scene
        if (!body) {
            this.dontHaveBody = true
            this.body = this.getDefaultBody()
        }
    }

    update(): void {
        if (this.body) {
            // get position from body, and convert it to Vector3
            let newPosition: CANNON.Vec3 | Vector3 = this.body.position
            newPosition = new Vector3(newPosition.x, newPosition.y, newPosition.z)
            // if it has a box, add newPosition to offset
            if (this.dontHaveBody) {
                newPosition = newPosition.add(this.centerPositionOffSet)
            }
            this.mesh.position.copy(newPosition)
            // we don't have rotation property in Body.
            // we just have quaternion
            const newQuaternion = this.body.quaternion
            this.mesh.quaternion.copy(new THREE.Quaternion(newQuaternion.x, newQuaternion.y, newQuaternion.z, newQuaternion.w))
        }
    }

    move(direction={x: 0, y: 0, z:0}, speed=0): void {
        // this.body.velocity = new CANNON.Vec3(speed * direction.x, speed * direction.y, speed * direction.z)
        direction = new CANNON.Vec3(speed * direction.x, speed * direction.y, speed * direction.z)
        this.body.applyImpulse(<CANNON.Vec3>direction)
        console.log(this.body);
        // todo set mesh's direction to that direction, and rotate it to there
        // const vecFrom = this.rotation
        // const vecTo =
        // this.rotateOnAxis()
    }

    stopMoving(): void {
        this.body.velocity = new CANNON.Vec3(0, 0, 0)
    }

    private getDefaultBody(): CANNON.Body {
        // create a box that contains cube of the object3d
        const box = new Box3().setFromObject(this.mesh)
        // box extents
        const extents = new Vector3().copy(box.max).sub(box.min).multiplyScalar(1)
        // box center position
        const boxPosition = box.getCenter(new Vector3())
        this.centerPositionOffSet = new Vector3().copy(this.mesh.position).sub(boxPosition)
        // Create Body Based on that box
        const shape = new CANNON.Box(new CANNON.Vec3(extents.x, extents.y, extents.z).scale(0.5))
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(boxPosition.x, boxPosition.y, boxPosition.z),
            shape: shape
        })
        // set the position of the body, to the center of the box
        body.position.set(boxPosition.x, boxPosition.y, boxPosition.z)
        // show the body wireframe in the scene, by creating a box geometry
        // this is handled by cannon-es-debugger ;)
        return body
    }
}
