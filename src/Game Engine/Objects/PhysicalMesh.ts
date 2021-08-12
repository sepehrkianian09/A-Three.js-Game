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
    readonly defaultMaterial = new CANNON.Material('default')
    needsUpdate: boolean
    scene: Scene

    constructor(mesh: Object3D, body?: CANNON.Body, needsUpdate=false, scene=undefined) {
        this.mesh = mesh
        this.body = body
        this.needsUpdate = needsUpdate
        this.scene = scene
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
        const extents = boxModel.max.sub(boxModel.min).multiplyScalar(1)
        console.log('boxMod')
        console.log(boxModel)
        const shape = new CANNON.Box(new CANNON.Vec3(extents.x, extents.y, extents.z).scale(0.5))
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 0, 0),
            shape: shape,
            material: this.defaultMaterial
        })
        body.position.set(0, extents.y, 0)
        if (this.scene) {
            const boxGeom = new THREE.BoxGeometry(extents.x, extents.y, extents.z)
            const material = new THREE.MeshBasicMaterial({wireframe: true})
            const mesh = new Mesh(boxGeom, material)
            mesh.position.set(0, extents.y * 0.5, 0)
            this.scene.add(mesh)
        }
        return body
    }
}
