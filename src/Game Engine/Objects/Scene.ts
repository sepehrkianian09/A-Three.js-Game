
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import TimeUpdater from "../interfaces/TimeUpdater";
import PhysicalMesh from "./PhysicalMesh";
import {Object3D} from "three";

export default class Scene extends THREE.Scene implements TimeUpdater {
    equivalentWorld: CANNON.World
    readonly dt:number = 1/60
    readonly maxSteps:number = 3

    physicalMeshes: PhysicalMesh[] = []
    needUpdatePhysicalMeshes: PhysicalMesh[] = []

    constructor(equivalentWorld: CANNON.World) {
        super();
        this.equivalentWorld = equivalentWorld
    }

    add(...object: Object3D[]): this {
        const out = super.add(...object);
        for (const object3D of object) {
            if (object3D instanceof PhysicalMesh) {
                this.physicalMeshes.push(object3D)
                this.equivalentWorld.addBody(object3D.equivalentBody)
                if (object3D.needsUpdate) {
                    this.needUpdatePhysicalMeshes.push(object3D)
                }
            }
        }
        return out
    }

    remove(...object: Object3D[]): this {
        const out = super.remove(...object);
        for (const object3D of object) {
            if (object3D instanceof PhysicalMesh) {
                this.physicalMeshes = this.physicalMeshes.filter(physicalMesh => physicalMesh !== object3D)
                this.equivalentWorld.removeBody(object3D.equivalentBody)
                if (object3D.needsUpdate) {
                    this.needUpdatePhysicalMeshes = this.needUpdatePhysicalMeshes.filter(physicalMesh => physicalMesh !== object3D)
                }
            }
        }
        return out
    }

    update(deltaTime: number): void {
        this.equivalentWorld.step(this.dt, deltaTime, this.maxSteps)
        for (const mesh of this.physicalMeshes) {
            mesh.update()
        }
    }

}
