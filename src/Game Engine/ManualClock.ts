import * as THREE from 'three';

export default class ManualClock extends THREE.Clock {
    oldElapsedTime: number
    deltaTime: number


    constructor(oldElapsedTime = 0, autoStart: boolean) {
        super(autoStart);
        this.oldElapsedTime = oldElapsedTime
    }

    getDelta(): number {
        const elapsedTime = this.getElapsedTime()
        const deltaTime = elapsedTime - this.oldElapsedTime
        this.oldElapsedTime = elapsedTime
        return deltaTime
    }
}
