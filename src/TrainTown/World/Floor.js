import * as THREE from 'three'
import TrainTown from "../TrainTown.js";
import RayControl from '../Utils/RayControl.js';
import toonVert from '../../shaders/vert.glsl'
import toonFrag from '../../shaders/frag_floor.glsl'


let instance = null

export default class Floor
{
    constructor()
    {
        if(instance)
        {
            return instance
        }

        instance = this

        window.floor = this;

        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.time = this.trainTown.time

        this.debug = this.trainTown.debug

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('floor')
        }
        

        this.camera = this.trainTown.camera.instance
       

        this.raycontrol = new RayControl(this.camera)

        this.worldOctree = this.trainTown.worldOctree;
    

        this.setGeometry()
       // this.setTextures()
        this.setMaterial()
        this.setMesh()
    
     
      //  this.raycontrol.checkClick('ground','상자','ball') // update에 넣으면 너무 무거워지니 셋업에 넣는다.
       
    }


   


    setGeometry()
    {
        this.geometry = new THREE.CircleGeometry(20,64)//20
        this.geometry2 = new THREE.CircleGeometry(20,64) //원래크기 165
    }

    setTextures()
    {
        this.textures = {}
        this.textures.color = this.resources.items.grassColorTexture
        //console.log(this.textures.color)
        this.textures.color.encoding = THREE.sRGBEncoding
        this.textures.color.repeat.set(1.5, 1.5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping


        this.textures.normal = this.resources.items.grassNormalTexture
        this.textures.normal.repeat.set(1.5,1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping
    }
    
    setMaterial()
    {
        this.material = new THREE.ShadowMaterial({color:'#04024d'})     
        this.material.opacity = 0.2;

        this.material2 = new THREE.MeshBasicMaterial({color:'#419af5'})  
    }
    
    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material) 
        this.mesh.rotation.x = -Math.PI * 0.5
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true
        this.mesh.position.set(0,0.002,0)

        this.mesh2 = new THREE.Mesh(this.geometry2, this.material2) 
        this.mesh2.rotation.x = -Math.PI * 0.5
        this.mesh2.position.set(0,-0.001,0)
        this.mesh2.castShadow = true
        this.mesh2.receiveShadow = true

      
        this.mesh3 = new THREE.Mesh(this.geometry2, this.material2) 
       this.mesh3.visible = false
       
        this.scene.add(this.mesh)
        this.scene.add(this.mesh2, this.mesh3)

      

    }

    update()
    {   
        //this.sphere.position.y = Math.sin(this.time.elapsed * 0.1 * 0.01) * 8.5
       // this.raycontrol.update(this.box, this.sphere, this.mesh)
    }

}