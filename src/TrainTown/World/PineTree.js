import * as THREE from 'three' 
import TrainTown from "../TrainTown.js";

var instancedMesh

export default class PineTree
{
    constructor()
    {
        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.time = this.trainTown.time.elapsed
        this.timeSin = 0.0;
        this.resource = this.resources.items.pineTree
        this.debug = this.trainTown.debug

        this.pineTreeTex = this.resources.items.pineTreeTex
        this.pineTreeTex.encoding = THREE.sRGBEncoding
        this.pineTreeTex.flipY = false;
        this.pineTreeTex.needsUpdate = true;
        this.instanceNumber = 5;
      
        this.params=
        {
            u_time : { value: 0.0 },
            u_texture: { value: this.pineTreeTex}
        }



      

       
       
        this.setMesh()

        this.xMax = 10
        this.xMin = 2

        this.zMax = 10
        this.zMin = 2
    }
    
    setMesh()
    {
        this.model = this.resource.scene
        //console.log(this.model)
        this.model.scale.set(8, 8, 8)
        this.model.position.set(3.0,0.0,-2.0)

        this.model.traverse((child)=>
        {
            if(child instanceof THREE.Mesh)
            {
                child.material = this.treeMaterial
                child.customDepthMaterial = this.customDepth
                child.castShadow = true
                child.receiveShadow = true
            }

          //  
        })

        
        //console.log(this.treeMesh)
       
       
       
        this.treeMaterial = new THREE.MeshStandardMaterial({
            vertexColors: true,
            map:this.pineTreeTex,
            roughness:1.0,
            side:THREE.DoubleSide})

      

       this.customDepth = new THREE.MeshDepthMaterial(
        {
            depthPacking : THREE.RGBADepthPacking
        }
       )

       /**
        * instance
        */


       this.dummy = new THREE.Object3D();
       this.treeMesh = this.resource.scene.getObjectByName( 'PineTree' )

      // console.log( this.treeMesh)
       this.treeGeometry = this.treeMesh.geometry.clone()
       this.instancedGrass = new THREE.InstancedMesh( this.treeGeometry , this.treeMaterial, this.instanceNumber );
       //this.scene.add(this.instancedGrass)

       this.instancedGrass.traverse((child)=>{
        child.castShadow = true
        child.receiveShadow = true
        child.customDepthMaterial = this.customDepth
       })

       for ( let i=0 ; i < this.instanceNumber ; i++ ) {

        this.dummy.position.set(( Math.random() - 0.5 ) * 30, 0, ( Math.random() - 0.5 ) * 30);
        this.dummy.scale.setScalar( 0.1 + Math.random() * 0.03 );
        //this.dummy.scale.setScalar(0.1)
        this.dummy.rotation.x = Math.PI * 0.5
        this.dummy.rotation.z = Math.PI * Math.random()

    //   if(this.dummy.position.x < 0.8 && this.dummy.position.x > -0.8 && this.dummy.position.z < 0.8 && this.dummy.position.z > -0.8)
    //   {
    //     this.dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );
    //   }else{
    //     this.dummy.scale.setScalar( 12.8 + Math.random() * 9 );
    //   }
      this.dummy.updateMatrix();
      this.instancedGrass.setMatrixAt( i, this.dummy.matrix );
    
    }

    /**
     * material
     */

       this.treeMaterial.onBeforeCompile = (shader) => {

        shader.uniforms.u_time = this.params.u_time;
        shader.uniforms.u_texture = this.params.u_texture;

        shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            `#include <common>
           
             uniform float u_time;
            `
        )

        shader.vertexShader = shader.vertexShader.replace(
            "#include <beginnormal_vertex>",
            `
            #include <beginnormal_vertex>

            vec3 windDirection = vec3(1.0, 0.0, 0.0); // 바람의 방향
            vec3 windSpeed = vec3(1.0, 1.0, 1.0); // 바람의 속도

            //objectNormal.y += (sin(objectNormal.x + objectNormal.z + u_time) * 3.5) * color.r;
           //objectNormal += windDirection * windSpeed * sin(u_time) * color.r;
            `
        )


        shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            `
            #include <begin_vertex>

            transformed.z += (sin(transformed.x + transformed.y + u_time) * 2.5) * color.r;
            transformed += windDirection * windSpeed * sin(u_time) * color.r;
          
            `
        )

        shader.vertexShader = shader.vertexShader.replace(
            "#include <clipping_planes_vertex>",
            `#include <clipping_planes_vertex>
             
            
            `
          )

        shader.fragmentShader = shader.fragmentShader.replace(
            "#define STANDARD",
            `
            #define STANDARD
           
            uniform sampler2D u_texture;
         

            `
        )


        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <color_fragment>",
            ` 
            #if defined( USE_COLOR_ALPHA )
                diffuseColor *= vec4(1.0,1.0,1.0,1.0);
            #elif defined( USE_COLOR )
                diffuseColor.rgb *= vec4(1.0,1.0,1.0,1.0);
            #endif
            `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <output_fragment>",
            `   #ifdef OPAQUE
            diffuseColor.a = 1.0;
            #endif
            // https://github.com/mrdoob/three.js/pull/22425
            #ifdef USE_TRANSMISSION
          
            diffuseColor.a *= material.transmissionAlpha + 0.1;
            #endif


            //-------Base
            vec3 N = geometry.normal;
            vec3 L = normalize(directLight.direction);
            vec3 C = normalize(geometry.viewDir);
            vec3 H = normalize( directLight.direction + geometry.viewDir );
            float NdL = max(0.0,dot(N,L));
           
            vec4 tex = texture2D(u_texture,vUv);

            DirectionalLightShadow directionalShadowTemp = directionalLightShadows[0];
    
            float shadow = getShadow(
                directionalShadowMap[0],
                directionalShadowTemp.shadowMapSize,
                directionalShadowTemp.shadowBias,
                directionalShadowTemp.shadowRadius,
                vDirectionalShadowCoord[0]
              );
            
            

            float toonNdL = NdL * shadow;

            vec3 toonNdLShadow = mix(vec3(0.063,0.137,0.494), vec3(1.0,1.0,1.0), toonNdL) + 0.09;
            vec3 toonDiffuse = (outgoingLight * toonNdLShadow + 0.08) * tex.rgb; //나무의 색감을 풍부하게하기위해 기본 아래쪽 보다 이쪽이 더 좋다.
            //vec3 toonDiffuse = mix(outgoingLight, vec3(0.063,0.137,0.494),toonNdL );

           //gl_FragColor = vec4( outgoingLight, diffuseColor.a );
           gl_FragColor = vec4( toonDiffuse, diffuseColor.a );
            `
        )
    }

    this.customDepth.onBeforeCompile = (shader) =>
    {
        shader.uniforms.u_time = this.params.u_time
       
                shader.vertexShader = shader.vertexShader.replace(
                    "#include <common>",
                    `#include <common>
                    attribute vec4 color;
                     uniform float u_time;
                    `
                )

                shader.vertexShader = shader.vertexShader.replace(
                    "#include <displacementmap_pars_vertex>",
                    `#include <displacementmap_pars_vertex>
                     #include <color_pars_vertex>
                     
                    `
                )

                shader.vertexShader = shader.vertexShader.replace(
                    "#include <uv2_vertex>",
                    `#include <uv2_vertex>
                     #include <color_vertex>
                     
                    `
                )
                shader.vertexShader = shader.vertexShader.replace(
                    "#include <begin_vertex>",
                    `
                    #include <begin_vertex>
                    vec3 windDirection = vec3(1.0, 0.0, 0.0); // 바람의 방향
                    vec3 windSpeed = vec3(1.0, 1.0, 1.0); // 바람의 속도

                    transformed.z += (sin(transformed.x + transformed.y + u_time) * 2.5) * color.r;
                    transformed += windDirection * windSpeed * sin(u_time) * color.r;
                  
                    `
                )
    }

        this.model.traverse((child)=>
        {
            if(child instanceof THREE.Mesh)
            {
                child.material = this.treeMaterial
                child.customDepthMaterial = this.customDepth
                child.castShadow = true
                child.receiveShadow = true
            }

          //  
        })

        this.scene.add(this.model)
    }

    update()
    {
        
        this.params.u_time.value += 0.2;
        
    }
}