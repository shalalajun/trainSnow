import * as THREE from 'three' 
import TrainTown from "../TrainTown.js";

export default class Train
{
    constructor()
    {
        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.time = this.trainTown.time.elapsed
        this.timeSin = 0.0;

        this.resource = this.resources.items.train

        this.trainTex = this.resources.items.trainTex
        this.trainTex.encoding = THREE.sRGBEncoding
        this.trainTex.flipY = false;
        this.trainTex.needsUpdate = true;
        this.params =
        {
            u_texture: { value: this.trainTex }
        }

      //  console.log(this.resource)

        this.setMesh()
    }

    setMesh()
    {
        this.model = this.resource.scene
        this.model.scale.set(0.68, 0.68, 0.68)
        this.model.position.set(-5.0,4.0,-2.0)
        this.model.rotation.y = Math.PI * -0.05;
        this.scene.add(this.model)

        this.trainMaterial = new THREE.MeshStandardMaterial({
            roughness: 0.4,
            map:this.trainTex,
            defines: 
            {
                SMOOTHTOON: true
            }
        })

        this.model.traverse((child)=>
        {
            if(child instanceof THREE.Mesh)
            {
                child.material = this.trainMaterial
                //child.customDepthMaterial = this.customDepth
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        this.trainMaterial.onBeforeCompile = (shader) => {

           //shader.uniforms.u_time = this.params.u_time;
            shader.uniforms.u_texture = this.params.u_texture;
    
            shader.vertexShader = shader.vertexShader.replace(
                "#include <common>",
                `#include <common>
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
               
                #ifdef SMOOTHTOON
                
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
               // vec3 toonDiffuse = (outgoingLight * toonNdLShadow) * tex.rgb; 
                vec3 toonDiffuse = toonNdLShadow *  tex.rgb;
                gl_FragColor = vec4( toonDiffuse, diffuseColor.a );
                #endif

                gl_FragColor = vec4( toonDiffuse, diffuseColor.a );
              
                `
            )
        }
    }
}