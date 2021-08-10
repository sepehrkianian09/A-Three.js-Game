/**
 * types
 */
import {Quaternion} from "three";
import * as CANNON from 'cannon-es'

export interface QuaternionType {
    x: number
    y: number
    z: number
    w: number
}

/**
 * Convertor
 */
export function toQuaternion(quaternion: QuaternionType): Quaternion {
    return new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
}

export function toCannonQuaternion(quaternion: QuaternionType): CANNON.Quaternion {
    return new CANNON.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
}
