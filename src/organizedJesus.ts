import {Vector3} from "three";
import './style.css'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'
import {Body} from "objects/Body";
import {Shape} from "shapes/Shape";
import {Material} from "material/Material";
import {ContactEquation} from "cannon-es/src/equations/ContactEquation";
import { Vec3 } from "cannon-es";
// import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {VectorType} from "./utils/Vectors";
// import {toQuaternion} from "./utils/Quaternions";
import Renderer from "./Game Engine/Renderer";
import Scene from "./Game Engine/Scene";
import PhysicalMesh from "./Game Engine/PhysicalMesh";
import {PerspectiveCamera} from "./Game Engine/Camera";
import GameEngine from "./Game Engine/GameEngine";


/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject: {[key: string]: () => void} = {}

debugObject.createSphere = () =>
{
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}

gui.add(debugObject, 'createSphere')

debugObject.createBox = () =>
{
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
gui.add(debugObject, 'createBox')

// Reset
debugObject.reset = () =>
{
    for(const physicalMesh of scene.physicalMeshes)
    {
        // Remove body
        physicalMesh.equivalentBody.removeEventListener('collide', playHitSound)
        scene.remove(physicalMesh)
    }
}
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
// const canvas: HTMLCanvasElement|undefined = document.getElementsByTagName('canvas')
const canvas: HTMLCanvasElement|undefined = document.getElementsByTagName('canvas').item(0) || undefined

// Physical Scene
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
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')
type Collision = {
    type: typeof Body.COLLIDE_EVENT_NAME
    body: Body
    contact: ContactEquation
}
const playHitSound = (collision: Collision) =>
{
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 1.5)
    {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

// Create sphere
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

const createBody = (shape: Shape, material: Material, position: VectorType): Body => {
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: material
    })
    body.position.copy(new Vec3(position.x, position.y, position.z))
    body.addEventListener('collide', playHitSound)
    return body
}

const createSphere = (radius: number, position: {x: number, y: number, z: number}) =>
{
    // Cannon.js body
    const shape = new CANNON.Sphere(radius)
    const body: Body = createBody(shape, defaultMaterial, position)
    // Three.js mesh
    const mesh = new PhysicalMesh(sphereGeometry, sphereMaterial, body)
    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(new Vector3(position.x, position.y, position.z))
    scene.add(mesh)
}

// Create box
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})
const createBox = (width: number, height: number, depth: number, position: VectorType) =>
{
    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body: Body = createBody(shape, defaultMaterial, position)

    // Three.js mesh
    const mesh = new PhysicalMesh(boxGeometry, boxMaterial, body)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(new Vector3(position.x, position.y, position.z))
    scene.add(mesh)
}

createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 })

/**
 * Floor
 */
// Body
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)

// Mesh
const floor = new PhysicalMesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    }), floorBody
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
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
 * Camera
 */
// Base camera
const camera = new PerspectiveCamera(75, 10/6, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// const pointerLockControls = new PointerLockControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new Renderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock()
const gameEngine = new GameEngine(scene, renderer, camera, controls, clock)