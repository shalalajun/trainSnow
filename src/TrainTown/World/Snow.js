import * as THREE from 'three' 
import TrainTown from "../TrainTown.js";

export default class Snow
{
    constructor()
    {
        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.time = this.trainTown.time
        this.resource = this.resources.items.snowTex

        this.particles
        this.positions = []
        this.velocities = []
      

       // console.log(this.resource)

        this.setSnow()
        
    }

    setSnow()
    {
        this.numSnowflakes = 120
        this.maxRange = 12
        this.minRange = this.maxRange * 0.5 // z축으로 보여지는 값
        this.snowTop = 8
        this.treePosition = 5
        this.frontPosition = 3
        this.minHeight = 7; // 10 에서 500사이 y값
        this.geometry = new THREE.BufferGeometry()

        for(let i=0; i < this.numSnowflakes; i++)
        {
            this.positions.push(
                Math.floor(Math.random() * this.maxRange - this.minRange) + this.treePosition,
                Math.floor(Math.random() * (this.maxRange + this.minHeight)) + this.snowTop,
                Math.floor(Math.random() * this.maxRange - this.minRange)
            )

            this.velocities.push(
                Math.floor(Math.random() * 2 - 1) * 0.008,
                Math.floor(Math.random() * 0.3) + 0.04,
                0.0
            )
        }

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions,3))
        this.geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(this.velocities,3))

        this.snowMaterial = new THREE.PointsMaterial({
            size: 0.4,
            map: this.resource,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            opacity: 1.0
        })

        this.particles = new THREE.Points(this.geometry, this.snowMaterial)
        this.scene.add(this.particles)
    }

    update()
    {
        for(let i=0; i < this.numSnowflakes*3; i += 3)
        {
            this.particles.geometry.attributes.position.array[i] += this.particles.geometry.attributes.velocity.array[i]

            this.particles.geometry.attributes.position.array[i+1] -= this.particles.geometry.attributes.velocity.array[i+1]

            this.particles.geometry.attributes.position.array[i+2] -= this.particles.geometry.attributes.velocity.array[i+2]

        

        if(this.particles.geometry.attributes.position.array[i+1] < 0 )
        {
            this.particles.geometry.attributes.position.array[i] =  Math.floor(Math.random() * this.maxRange - this.minRange) + this.treePosition

            this.particles.geometry.attributes.position.array[i+1] =  Math.floor(Math.random() * (this.maxRange + this.snowTop) + this.minHeight)

            this.particles.geometry.attributes.position.array[i+2] =  Math.floor(Math.random() * this.maxRange - this.minRange)
        }
    }

        this.particles.geometry.attributes.position.needsUpdate = true
    }
}