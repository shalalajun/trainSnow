import * as THREE from 'three'
import TrainTown from "../TrainTown.js";

export default class Floor_RayCast
{
    constructor()
    {
        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.time = this.trainTown.time
        this.raycaster = new THREE.Raycaster();
        this.rayOrigin = new THREE.Vector3(0,100,0)
        this.rayDirection = new THREE.Vector3(0,-10,0)

        this.camera = this.trainTown.camera.instance
        this.currentIntersect = null;


        this.mouse = new THREE.Vector2()

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setMouse()
       
      
    }

    setGeometry()
    {
        this.geometry = new THREE.CircleGeometry(80,64)
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
        this.material = new THREE.MeshStandardMaterial(
            {
             map:this.textures.color, 
             normalMap:this.textures.normal
            })
    }
    
    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry,this.material) 
        this.mesh.rotation.x = -Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)


        /**
         * testPosition
         */

        this.box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial())
        this.box.position.set(0,8,0)
        this.scene.add(this.box)


        this.sphere = new THREE.Mesh(new THREE.SphereGeometry(2,13,26),new THREE.MeshBasicMaterial())
        this.sphere.position.set(0,5,0)
        this.scene.add(this.sphere)

     
    }

    update()
    {   
        this.sphere.position.y = Math.sin(this.time.elapsed * 0.1 * 0.01) * 8.5
       
       
        this.raycaster.setFromCamera(this.mouse, this.camera)
        
        const objectsToTest = [this.mesh, this.box, this.sphere]
        const intersects = this.raycaster.intersectObjects(objectsToTest)

        for(const object of objectsToTest)
        {
            object.material.color.set('#ff0000')
        }

        for(const intersect of intersects)
        {
            intersect.object.material.color.set('#0000ff')
        }

        if(intersects.length)
        {

            if(this.currentIntersect === null)
            {
                console.log("마우스 엔터")
            }

            this.currentIntersect = intersects[0]
        }
        else
        {
            if(this.currentIntersect)
            {
                console.log("마우스 리브")
            }
            this.currentIntersect = null
        }
       

    }

    setMouse()
    {
        window.addEventListener('mousemove',(event)=>
        {
            this.mouse.x = event.clientX / window.innerWidth * 2 - 1
            this.mouse.y = - (event.clientY / window.innerHeight ) * 2 + 1
        })
       
        window.addEventListener('click',()=>
        {
            if(this.currentIntersect)
            {
                if(this.currentIntersect.object === this.mesh)
                {
                    console.log("땅이야!")
                }
                if(this.currentIntersect.object === this.box)
                {
                    console.log("상자야!")
                }
                if(this.currentIntersect.object === this.sphere)
                {
                    console.log("공이야!")
                }
               
            }
        })
    }

}