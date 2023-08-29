import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */



// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()


// Load Image
const loader = new THREE.ImageLoader();
loader.load("/img.jpg", (image) => {
        const canvas = document.createElement( 'canvas' );
        canvas.width = 500
        canvas.height = 281
		const context = canvas.getContext( '2d' );
		context.drawImage(image, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const particlesGeometry = new THREE.BufferGeometry()
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
        })

        const positions = new Float32Array((canvas.width * canvas.height) * 3)
        const colors = new Float32Array((canvas.width * canvas.height) * 3)

        for(let y = 0; y < canvas.height; y += 1){
            for(let x = 0; x < canvas.width; x+= 1){
              const index = (y * canvas.width + x) * 4;
              const index1 = (y * canvas.width + x) * 3;
              const red = imageData.data[index]
              const green = imageData.data[index + 1]
              const blue = imageData.data[index + 2]
              const alpha = imageData.data[index + 3]
              if(alpha > 0){
                positions[index1] = x * 0.01
                positions[index1+1] = -(y * 0.01)
                positions[index1+2] = 0
                colors[index1] = red * (1 / 256)
                colors[index1+1] = green * (1 / 256)
                colors[index1+2] = blue * (1 / 256)
              }
            }
           }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        particlesMaterial.vertexColors = true
        const particles = new THREE.Points(particlesGeometry, particlesMaterial)
        console.log(particles);
        scene.add(particles)
})

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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()