
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

    addPhysicalMesh(...physicalMeshes: PhysicalMesh[]): this {
        const out = super.add(...physicalMeshes.map(value => value.mesh));
        for (const physicalMesh of physicalMeshes) {
                this.physicalMeshes.push(physicalMesh)
                this.equivalentWorld.addBody(physicalMesh.body)
                if (physicalMesh.needsUpdate) {
                    this.needUpdatePhysicalMeshes.push(physicalMesh)
                }
        }
        return out
    }

    removePhysicalMesh(...physicalMeshes: PhysicalMesh[]): this {
        const out = super.remove(...physicalMeshes.map(value => value.mesh));
        this.physicalMeshes = this.physicalMeshes.filter(value => !physicalMeshes.includes(value))
        this.needUpdatePhysicalMeshes = this.needUpdatePhysicalMeshes.filter(value => !physicalMeshes.includes(value))
        for (const object3D of physicalMeshes) {
                this.equivalentWorld.removeBody(object3D.body)
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
