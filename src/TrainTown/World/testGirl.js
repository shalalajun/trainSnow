import * as THREE from 'three' 
import TrainTown from "../TrainTown.js";
import{ Octree } from 'three/examples/jsm/math/Octree.js'
import{ Capsule } from 'three/examples/jsm/math/Capsule.js'

export default class TestGirl
{
    constructor()
    {
        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.resource = this.resources.items.girl
        this.time = this.trainTown.time
        this.camera = this.trainTown.camera.instance
        this.controls = this.trainTown.camera.controls
       
        this.stone = this.resources.items.stone

        this.worldOctree
      
        this.previousDirectionOffset = 0

        this.speed = 0
        this.maxSpeed = 0
        this.acceleration = 0
        this.bOntheGround = false
        this.fallingAcceleration = 0
        this.fallingSpeed = 0

        this.bOntheGround = true

        
        this.setMesh()
        this.setControls()
        this.setOctree()
      
    }

    setOctree()
    {
        this.worldOctree = new Octree()
        this.worldOctree.fromGraphNode(this.stoneModel)
        this.worldOctree.fromGraphNode(this.floor)
        
    }

   
    setMesh()
    {
        this.model = this.resource.scene;
        this.model.scale.set(0.1,0.1,0.1)
     
        this.scene.add(this.model) 
    

        this.box = new THREE.Box3().setFromObject(this.model)
        //console.log(this.model)
        // this.boxHelper = new THREE.BoxHelper(this.model)
        // this.scene.add(this.boxHelper)

        this.floor = new THREE.Mesh(new THREE.CircleGeometry(64,64), new THREE.MeshBasicMaterial({color:'#419af5'}))
        this.floor.rotation.x = -Math.PI * 0.5
        this.scene.add(this.floor)

        this.stoneModel = this.stone.scene
        this.stoneModel.scale.set(5.0,5.0,5.0)
        this.stoneModel.position.set(6,-0.5,5)
        this.scene.add(this.stoneModel)

        this.stoneModel.traverse((child)=>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        }
        )
        //캡슐
        const height = this.box.max.y - this.box.min.y
        const diameter = this.box.max.z - this.box.min.z

        this.model.capsule = new Capsule
        (
            new THREE.Vector3(0, diameter/2, 0),//
            new THREE.Vector3(0, height - diameter/2, 0),
            diameter/2
        )
        //

        // this.axisHelper = new THREE.AxesHelper(1000)
        // this.scene.add(this.axisHelper)

        this._boxHelper = this.boxHelper
        this._model = this.model

        this.animationClips = this.resource.animations
        this.mixer = new THREE.AnimationMixer(this.model)
        this.animationsMap = {}
        this.animationClips.forEach(clip => {
            const name = clip.name 
           // console.log(name)
            this.animationsMap[name] = this.mixer.clipAction(clip)
        });

        this.currentAnimationAction = this.animationsMap["idle"]
        this.currentAnimationAction.play()


      //  console.log(this.animationClips)
    }

    setControls()
    {
        this.controls.enablePan = false

        this.pressedKeys = {}

        window.addEventListener("keydown",(event)=>
        {
            this.pressedKeys[event.key.toLowerCase()] = true
            this.processAnimation()
        })

        window.addEventListener("keyup",(event)=>
        {
            this.pressedKeys[event.key.toLowerCase()] = false
            this.processAnimation()
        })
    }

    processAnimation()
    {
        this.previousAnimationAction = this.currentAnimationAction
        if(this.pressedKeys["w"] || this.pressedKeys["a"] || this.pressedKeys["s"] || this.pressedKeys["d"] )
        {
            if(this.pressedKeys["shift"])
            {
                this.currentAnimationAction = this.animationsMap["run"]
                //this.speed = 8
                this.maxSpeed = 8
                this.acceleration = 0.5
                console.log(this.currentAnimationAction)
            }else{
                this.currentAnimationAction = this.animationsMap["walk"]
                //this.speed = 5
                this.maxSpeed = 5
                this.acceleration = 0.5

            }
            
        }else{
            this.currentAnimationAction = this.animationsMap["idle"]
            this.speed = 0
            this.maxSpeed = 0
            this.acceleration = 0
        }

        if(this.previousAnimationAction !== this.currentAnimationAction)
        {
            this.previousAnimationAction.fadeOut(0.5)
            this.currentAnimationAction.reset().fadeIn(0.5).play()
        }
    }

    

    directionOffset() {
        const pressedKeys = this.pressedKeys;
        let directionOffset = 0 // w

        if (pressedKeys['w']) {
            if (pressedKeys['a']) {
                directionOffset = Math.PI / 4 // w+a (45도)
            } else if (pressedKeys['d']) {
                directionOffset = - Math.PI / 4 // w+d (-45도)
            }
        } else if (pressedKeys['s']) {
            if (pressedKeys['a']) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a (135도)
            } else if (pressedKeys['d']) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d (-135도)
            } else {
                directionOffset = Math.PI // s (180도)
            }
        } else if (pressedKeys['a']) {
            directionOffset = Math.PI / 2 // a (90도)
        } else if (pressedKeys['d']) {
            directionOffset = - Math.PI / 2 // d (-90도)
        }else{
            directionOffset = this.previousDirectionOffset
        }

        this.previousDirectionOffset = directionOffset

        return directionOffset;        
    }

    update()
    {
        if(this._boxHelper)
        {
            this._boxHelper.update()
        }
       
        if(this.mixer)
        {
            this.mixer.update(this.time.delta * 0.001)

            this.angleCameraDirectionAxisY = Math.atan2(
                (this.camera.position.x - this.model.position.x),
                (this.camera.position.z - this.model.position.z)
            ) + Math.PI

            this.rotateQuaternion = new THREE.Quaternion()
            this.rotateQuaternion.setFromAxisAngle
            (
                new THREE.Vector3(0,1,0),
                this.angleCameraDirectionAxisY + this.directionOffset()
            )

            this.model.quaternion.rotateTowards(this.rotateQuaternion, THREE.MathUtils.degToRad(5))

            const walkDirection = new THREE.Vector3()
            this.camera.getWorldDirection(walkDirection)

           //walkDirection.y = 0
            walkDirection.y = this.bOntheGround ? 0 : -1
            walkDirection.normalize()

            walkDirection.applyAxisAngle(new THREE.Vector3(0,1,0), this.directionOffset())

            if(this.speed < this.maxSpeed) this.speed += this.acceleration
            else this.speed -= this.acceleration * 2

            if(!this.bOntheGround)
            {
                this.fallingAcceleration += 0.1
                this.fallingSpeed += Math.pow(this.fallingAcceleration,2)
            }else
            {
                this.fallingAcceleration = 0
                this.fallingSpeed = 0
            }

            const velocity = new THREE.Vector3(
                walkDirection.x * this.speed,
                walkDirection.y * this.fallingSpeed,
                walkDirection.z * this.speed
            )

            const deltaPosition = velocity.clone().multiplyScalar(this.time.delta*0.001)
        
            // const moveX = walkDirection.x * (this.speed * this.time.delta * 0.001)
            // const moveZ = walkDirection.z * (this.speed * this.time.delta * 0.001)

            // this.model.position.x += moveX
            // this.model.position.z += moveZ

            this.model.capsule.translate(deltaPosition)
            
            const result = this.worldOctree.capsuleIntersect(this.model.capsule)

             //     console.log(result)

            if(result)
            {
                this.model.capsule.translate(result.normal.multiplyScalar(result.depth))
                this.bOntheGround = true
            }else
            {
                this.bOntheGround = false
            }

            const previousPosition = this.model.position.clone()
            const capsuleHeight = this.model.capsule.end.y - this.model.capsule.start.y + this.model.capsule.radius * 2

            this.model.position.set
            (
                this.model.capsule.start.x,
                this.model.capsule.start.y- this.model.capsule.radius,
                this.model.capsule.start.z,

            )

            // // // this.camera.position.x += moveX
            // // // this.camera.position.z += moveZ

            this.camera.position.x -= previousPosition.x - this.model.position.x
            this.camera.position.z -= previousPosition.z - this.model.position.z
            this.camera.lookAt(this.model.position.x,this.model.position.y + 10,this.model.position.z)

            this.controls.target.set
            (
                this.model.position.x,
                this.model.position.y,
                this.model.position.z,
            )
        }

    }
}