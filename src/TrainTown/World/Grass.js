import * as THREE from 'three' 
import TrainTown from "../TrainTown.js";
import grassVert from '../../shaders/grassVert.glsl'
import grassFrag from '../../shaders/grassFrag.glsl'
import Frag from '../../shaders/frag.glsl'

export default class Grass
{
    constructor()
    {
        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.time = this.trainTown.time

        this.instanceNumber = 800

        this.uniforms = {
            time: {
              value: 0
          }
        }

        this.resource = this.resources.items.grass
        this.setModel()
    }


    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(24, 24, 24)
        // this.model.position.set(-4, 0.1, 0.1)
    
        this.dummy = new THREE.Object3D();

       // this.grassMaterial = new THREE.MeshStandardMaterial({color:'#ffffff'})
        this.grassMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: grassVert,
            fragmentShader: grassFrag
        })
        
        this.grassMesh = this.resource.scene.getObjectByName( 'Cube' )
        this.grassGeometry = this.grassMesh.geometry.clone()
        //this.grassGeometry.scale.set(25,25,25);

        this.model.traverse((child)=>
        {
            if(child instanceof THREE.Mesh )
            {
                child.material = this.grassMaterial
                child.castShadow = true
                child.receiveShadow = true
            }
        })

       this.instancedGrass = new THREE.InstancedMesh( this.grassGeometry , this.grassMaterial, this.instanceNumber );

        this.scene.add(this.instancedGrass)
        //this.scene.add(this.model)

        for ( let i=0 ; i < this.instanceNumber ; i++ ) {

            this.dummy.position.set(
              ( Math.random() - 0.5 ) * 10,
            0,
            ( Math.random() - 0.5 ) * 10
          );

          if(this.dummy.position.x < 0.8 && this.dummy.position.x > -0.8 && this.dummy.position.z < 0.8 && this.dummy.position.z > -0.8)
          {
            this.dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );
          }else{
            this.dummy.scale.setScalar( 12.8 + Math.random() * 9 );
          }
          
        
          
          //this. dummy.rotation.y = Math.random() * Math.PI;
          
          this.dummy.updateMatrix();
          this.instancedGrass.setMatrixAt( i, this.dummy.matrix );
        
        }

        
    }

    update()
    {
        this.grassMaterial.uniforms.time.value = this.time.elapsed * 0.001;
        this.grassMaterial.uniformsNeedUpdate = true;
    }

    
}