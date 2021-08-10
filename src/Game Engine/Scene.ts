
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import TimeUpdater from "./Updater";
import PhysicalMesh from "./PhysicalMesh";

class Scene extends THREE.Scene implements TimeUpdater {
    equivalentWorld: CANNON.World
    readonly dt:number = 1/60
    readonly maxSteps:number = 3

    physicalMeshes: PhysicalMesh[]

    constructor() {
        super();
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
