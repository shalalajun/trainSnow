import * as THREE from 'three' 
import TrainTown from "../TrainTown.js";

export default class cat{
    constructor()
    {
        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.time = this.trainTown.time
        this.resource = this.resources.items.cat

        this.debug = this.trainTown.debug
        
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('cat')
        }

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(10, 10, 10)
        //console.log(this.model)
        this.scene.add(this.model)

        this.model.traverse((child)=>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        this.animation.actions = {}
        // gltf 객체에 scene에는 모델링이 있고 animation에 animation 이 있기때문에 리소스에서 끄집어 내야한다.
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        //this.animation.actions.idle.play()

        //애니가 여러개 있을때 참고
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}