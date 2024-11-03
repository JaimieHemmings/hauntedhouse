import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/Addons.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
*/

const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlpha = textureLoader.load('./floor/alpha.jpg')
const floorColor = textureLoader.load('./floor/coast_sand_rocks/diff.jpg')
const floorARM = textureLoader.load('./floor/coast_sand_rocks/arm.jpg')
const floorNormal = textureLoader.load('./floor/coast_sand_rocks/nor.jpg')
const floorDisplacement = textureLoader.load('./floor/coast_sand_rocks/disp.jpg')

floorColor.colorSpace = THREE.SRGBColorSpace

floorColor.repeat.set(8, 8)
floorARM.repeat.set(8, 8)
floorNormal.repeat.set(8, 8)
floorDisplacement.repeat.set(8, 8)

floorColor.wrapS = THREE.RepeatWrapping
floorARM.wrapS = THREE.RepeatWrapping
floorNormal.wrapS = THREE.RepeatWrapping
floorDisplacement.wrapS = THREE.RepeatWrapping

floorColor.wrapT = THREE.RepeatWrapping
floorARM.wrapT = THREE.RepeatWrapping
floorNormal.wrapT = THREE.RepeatWrapping
floorDisplacement.wrapT = THREE.RepeatWrapping

// Wall
const wallColor = textureLoader.load('./wall/castle_walls_slate/diff.jpg')
const wallARM = textureLoader.load('./wall/castle_walls_slate/arm.jpg')
const wallNormal = textureLoader.load('./wall/castle_walls_slate/nor.jpg')

wallColor.repeat.set(2, 2)
wallARM.repeat.set(2, 2)
wallNormal.repeat.set(2, 2)

wallColor.wrapS = THREE.RepeatWrapping
wallARM.wrapS = THREE.RepeatWrapping
wallNormal.wrapS = THREE.RepeatWrapping

wallColor.wrapT = THREE.RepeatWrapping
wallARM.wrapT = THREE.RepeatWrapping
wallNormal.wrapT = THREE.RepeatWrapping

// Roof

const roofColor = textureLoader.load('./roof/diff.jpg')
const roofARM = textureLoader.load('./roof/arm.jpg')
const roofNormal = textureLoader.load('./roof/nor.jpg')

roofColor.colorSpace = THREE.SRGBColorSpace

roofColor.repeat.set(1, 3)
roofARM.repeat.set(1, 3)
roofNormal.repeat.set(1, 3)

roofColor.wrapS = THREE.RepeatWrapping
roofARM.wrapS = THREE.RepeatWrapping
roofNormal.wrapS = THREE.RepeatWrapping

roofColor.wrapT = THREE.RepeatWrapping
roofARM.wrapT = THREE.RepeatWrapping
roofNormal.wrapT = THREE.RepeatWrapping

roofColor.rotation = Math.PI / 2
roofARM.rotation = Math.PI / 2
roofNormal.rotation = Math.PI / 2

// Bush

const bushColor = textureLoader.load('./bush/diff.jpg')
const bushARM = textureLoader.load('./bush/arm.jpg')
const bushNormal = textureLoader.load('./bush/nor.jpg')

bushColor.colorSpace = THREE.SRGBColorSpace

bushColor.repeat.set(2, 1)
bushARM.repeat.set(2, 1)
bushNormal.repeat.set(2, 1)

bushColor.wrapS = THREE.RepeatWrapping
bushARM.wrapS = THREE.RepeatWrapping
bushNormal.wrapS = THREE.RepeatWrapping

// Grave

const graveColor = textureLoader.load('./grave/diff.jpg')
const graveARM = textureLoader.load('./grave/arm.jpg')
const graveNormal = textureLoader.load('./grave/nor.jpg')

graveColor.colorSpace = THREE.SRGBColorSpace

// Door

const doorColor = textureLoader.load('./door/color.jpg')
const doorAlpha = textureLoader.load('./door/alpha.jpg')
const doorAmbientOcclusion = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeight = textureLoader.load('./door/height.jpg')
const doorNormal = textureLoader.load('./door/normal.jpg')
const doorMetalness = textureLoader.load('./door/metalness.jpg')
const doorRoughness = textureLoader.load('./door/roughness.jpg')

doorColor.colorSpace = THREE.SRGBColorSpace

/**
 * House
 */

const houseDimensions = {
    width: 4,
    height: 2.5,
    depth: 4
}

const house = new THREE.Group()

// Walls

wallColor.colorSpace = THREE.SRGBColorSpace
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(houseDimensions.width,
                          houseDimensions.height,
                          houseDimensions.depth),
    new THREE.MeshStandardMaterial({
        map: wallColor,
        aoMap: wallARM,
        roughnessMap: wallARM,
        metalnessMap: wallARM,
        normalMap: wallNormal
    })
)
walls.position.y = houseDimensions.height * 0.5
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(houseDimensions.width * 0.8,
                           houseDimensions.height * 0.5,
                           4),
    new THREE.MeshStandardMaterial({ 
        map: roofColor,
        aoMap: roofARM,
        roughnessMap: roofARM,
        metalnessMap: roofARM,
        normalMap: roofNormal
     })
)
roof.position.y = houseDimensions.height * 1.25
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColor,
        alphaMap: doorAlpha,
        transparent: true,
        aoMap: doorAmbientOcclusion,
        displacementMap: doorHeight,
        displacementScale: 0.15,
        displacementBias: -0.04,
        normalMap: doorNormal,
        metalnessMap: doorMetalness,
        roughnessMap: doorRoughness
    })
)
door.position.z = houseDimensions.depth * 0.5 + 0.01
door.position.y = 1
house.add(door)

// Bush Geometry
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#89c854',
    map: bushColor,
    aoMap: bushARM,
    roughnessMap: bushARM,
    metalnessMap: bushARM,
    normalMap: bushNormal
})

// Bushes
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1.4, 0.1, 2.5)
bush1.rotation.x = -0.75
house.add(bush1)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(2.1, 0.1, 2.1)
bush2.rotation.x = -0.75
house.add(bush2)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-1, 0.1, 2.5)
bush3.rotation.x = -0.75
house.add(bush3)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-2, 0.1, 2.5)
bush4.rotation.x = -0.75
house.add(bush4)


house.rotation.y = Math.PI * 0.05
scene.add(house)

/**
 * Graves
 */
// Graves

const gravegeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const gravematerial = new THREE.MeshStandardMaterial({ 
    color: '#5A5A5A',
    map: graveColor,
    aoMap: graveARM,
    roughnessMap: graveARM,
    metalnessMap: graveARM,
    normalMap: graveNormal
 })

const graves = new THREE.Group()

for(let i = 0; i < 30; i++)
{
    // Create variables
    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 6
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    // Create grave
    const grave = new THREE.Mesh(gravegeometry, gravematerial)
    grave.position.set(x, 0.3, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.x = (Math.random() - 0.5) * 0.2
    grave.castShadow = true
    graves.add(grave)
}
scene.add(graves)


/**
 * Floor
 */

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 50, 50),
    new THREE.MeshStandardMaterial({ 
        alphaMap: floorAlpha,
        transparent: true,
        map: floorColor,
        aoMap: floorARM,
        roughnessMap: floorARM,
        metalnessMap: floorARM,
        normalMap: floorNormal,
        displacementMap: floorDisplacement,
        displacementScale: 0.3,
        displacementBias: - 0.2
     })
)


floor.rotation.x = - Math.PI * 0.5

scene.add(floor)

gui.add(floor.material, 'displacementScale').min(0.1).max(1).step(0.01).name('Floor Displacement')
gui.add(floor.material, 'displacementBias').min(-2).max(1).step(0.01).name('Floor Displacement Bias')

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.3)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 0.4)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 6
camera.position.y = 4
camera.position.z = 12
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Shadows
 */

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

directionalLight.castShadow = true

walls.castShadow = true
roof.castShadow = true
door.castShadow = true
bush1.receiveShadow = true
bush2.receiveShadow = true
bush3.receiveShadow = true
bush4.receiveShadow = true
graves.children.forEach(grave => {
    grave.castShadow = true
    grave.receiveShadow = true
})
floor.receiveShadow = true

// Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256

directionalLight.shadow.camera.left = -10
directionalLight.shadow.camera.right = 10
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.far = 20
directionalLight.shadow.camera.near = 1

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()