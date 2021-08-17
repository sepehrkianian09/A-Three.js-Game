import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import CANNON from "cannon-es";
import Scene from "./Game Engine/Objects/Scene";
import cannonDebugger from "cannon-es-debugger";


/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject: {[key: string]: () => void} = {}

const canvas: HTMLCanvasElement|undefined = document.getElementsByTagName('canvas').item(0) || undefined


/**
 * Scene
 */
// World
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, - 9.82, 0)

// Default material
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.defaultContactMaterial = defaultContactMaterial
const scene = new Scene(world)

/**
 * Meshes
 */
const floor = new THREE.PlaneGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    color: 'white'
})
const body = new CANNON.Body({
    mass: 1,
    // shape:
})
const floorMesh = new THREE.Mesh(floor, material)
scene.add(floorMesh)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(65, 1)
camera.position.set(- 3, 3, 3)
scene.add(camera)
/**
 * Camera Controls
 */
const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true
gui.add(orbitControls.target, 'x')
gui.add(orbitControls.target, 'y')
gui.add(orbitControls.target, 'z')
// orbitControls.update()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('white')
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas
})

/**
 * Sizes
 */
const sizes = {width: window.innerWidth, height: window.innerHeight}
renderer.setSize(sizes.width, sizes.height)
camera.aspect = sizes.width / sizes.height
camera.updateProjectionMatrix()

/**
 * rendering engine
 */
const clock = new THREE.Clock()
const tick = () => {
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
cannonDebugger(scene, world.bodies)
