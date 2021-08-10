
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import TimeUpdater from "./TimeUpdater";
import PhysicalMesh from "./PhysicalMesh";

export default class Scene extends THREE.Scene implements TimeUpdater {
    equivalentWorld: CANNON.World
    readonly dt:number = 1/60
    readonly maxSteps:number = 3

    physicalMeshes: PhysicalMesh[]

    constructor(equivalentWorld: CANNON.World) {
        super();
        this.equivalentWorld = equivalentWorld
    }

    add(...object): this {
        const out = super.add(...object);
        for (const object3D of object) {
            if (object3D instanceof PhysicalMesh) {
                this.physicalMeshes.push(object3D)
                this.equivalentWorld.addBody(object3D.equivalentBody)
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
