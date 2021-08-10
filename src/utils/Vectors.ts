import { Vec3 } from "cannon-es";
import {Vector3} from "three";

/**
 * types
 */
export interface VectorType {
    x: number
    y: number
    z: number
}

/**
 * Convertor
 */
export function toVec3(vector: VectorType): Vec3 {
    return new Vec3(vector.x, vector.y, vector.z)
}

export function toVector3(vector: VectorType): Vector3 {
    return new Vector3(vector.x, vector.y, vector.z)
}
