import * as THREE from 'three' 
import TrainTown from "../TrainTown.js";
import KeyControl from '../Utils/KeyControls.js';
import toonVert from '../../shaders/vert.glsl'
import toonFrag from '../../shaders/frag.glsl'


export default class Girl{
    constructor()
    {
        this.clock = new THREE.Clock()
        
        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.resource = this.resources.items.girl
        
        this.time = this.trainTown.time
      

        this.girlTex = this.resources.items.girlTexture
        this.girlTex.encoding = THREE.sRGBEncoding
        this.girlTex.wrapS = THREE.RepeatWrapping;
        this.girlTex.wrapT = THREE.RepeatWrapping;
        this.girlTex.repeat.set( 1, 1 );
        this.girlTex.flipY = false;
        this.girlTex.needsUpdate = true;
        

        this.player = new THREE.Object3D() 
        this.animation = {}
        this.debug = this.trainTown.debug

        this.params = {
            color: "#94b9ff",
            directionalLight: "#f8f1e6",
            ambientLight: "#ffffff",
            specular: 4,
            medSmooth: 0.24,
            medThresHold: 0.15
          };
       
        
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('girl')
        }

        this.keycontrol = new KeyControl(this.player, this.animation)
        this.setModel()
        this.setAnimation()
        //this.addControl()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(0.2, 0.2, 0.2)
        this.model.position.set(-4, 0.1, 0.1)
      
        this.girl = this.model.getObjectByName('Girl_mesh');

        // this.girlMaterial = new THREE.ShaderMaterial({
        //     lights: true,
        //     uniforms: {
        //         ...THREE.UniformsLib.lights,
        //       //  uColor: { value: new THREE.Color(this.params.color) },
        //         uGlossiness: { value: this.params.specular},
        //         uTexture: { value: this.girlTex},
        //         medSmooth: {value: this.params.medSmooth},
        //         medThresHold: {value: this.params.medThresHold}
        //       },
        //     vertexShader: toonVert,
        //     fragmentShader: toonFrag
        // })
        this.girlMaterial = new THREE.MeshStandardMaterial()
        
        
        console.log(this.model)

        this.model.traverse((child)=>
        {
            if(child instanceof THREE.Mesh && child.name =='Girl_mesh')
            {
                
                child.material = this.girlMaterial
             
                child.material.needsUpdate = true
                child.castShadow = true
                child.receiveShadow = true
            }

            if(child instanceof THREE.Mesh && child.name !=='Girl_mesh')
            {
                
                child.visible = false;
            }
        })

       // this.player.add(this.model)
        //this.player.userData.move = { forward: this.forward, turn: this.turn }; 
        this.scene.add(this.model)
    }

    setAnimation()
    {
        
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        this.animation.actions = {}
        // gltf 객체에 scene에는 모델링이 있고 animation에 animation 이 있기때문에 리소스에서 끄집어 내야한다.
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[7])
        this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[17])
        this.animation.actions.run = this.animation.mixer.clipAction(this.resource.animations[12])
      
        //this.animation.actions.idle.play()

        //애니가 여러개 있을때 참고

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

      
        
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 0.4)

            this.animation.actions.current = newAction
        }   
    
        
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle')},
                playWalking: () => { this.animation.play('walk')},
                playRunning: () => { this.animation.play('run')}
            }

            this.debugFolder.add(debugObject,'playIdle')
            this.debugFolder.add(debugObject,'playWalking')
            this.debugFolder.add(debugObject,'playRunning')
        }
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
        this.keycontrol.updateAction()
        
    }

    
   
}