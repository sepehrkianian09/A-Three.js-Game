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
    box: Box3
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
            let newPosition: CANNON.Vec3 | Vector3 = this.body.position
            newPosition = new Vector3(newPosition.x, newPosition.y, newPosition.z)
            if (this.box) {
                this.box = new Box3().setFromObject(this.mesh)
                const meshOffset = this.mesh.position.sub(this.box.getCenter(new Vector3()))
                // console.log(this.box.getCenter(new Vector3()))
                // console.log(this.mesh.position)
                newPosition = newPosition.add(meshOffset)
            }
            this.mesh.position.copy(newPosition)
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

    private getDefaultBody(): CANNON.Body {
        const box = new Box3().setFromObject(this.mesh)
        this.box = box
        const extents = box.max.sub(box.min).multiplyScalar(1)
        const shape = new CANNON.Box(new CANNON.Vec3(extents.x, extents.y, extents.z).scale(0.5))
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 0, 0),
            shape: shape,
            material: this.defaultMaterial
        })
        const newPosition = box.getCenter(new Vector3())
        body.position.set(newPosition.x, newPosition.y, newPosition.z)
        if (this.scene) {
            const boxGeom = new THREE.BoxGeometry(extents.x, extents.y, extents.z)
            const material = new THREE.MeshBasicMaterial({wireframe: true})
            const mesh = new Mesh(boxGeom, material)
            mesh.position.set(0, extents.y * 0.5, 0)
            console.log(mesh)
            // this.mesh = mesh
            this.scene.add(mesh)
        }
        return body
        // return undefined
    }
}
