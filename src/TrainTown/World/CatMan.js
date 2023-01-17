import * as THREE from 'three' 
import TrainTown from "../TrainTown.js";
import toonVert from '../../shaders/vert.glsl'
import toonFrag from '../../shaders/frag.glsl'
import FlipBookAni from '../Utils/FlipBookAni.js';


export default class CatMan{
    constructor()
    {
        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.time = this.trainTown.time
        this.resource = this.resources.items.catman
        
        this.brushTex = this.resources.items.brushTex
        this.brushTex.encoding = THREE.sRGBEncoding
        this.brushTex.flipY = false;
        this.brushTex.needsUpdate = true;

  
        this.toonRamp = this.resources.items.snowRamp
        this.toonRamp.encoding = THREE.sRGBEncoding
        this.toonRamp.flipY = false;
        this.toonRamp.needsUpdate = true;


        this.catManHeadTex = this.resources.items.catHead
        this.catManHeadTex.encoding = THREE.sRGBEncoding
        this.catManHeadTex.flipY = false;
        this.catManHeadTex.needsUpdate = true;

        this.spriteTex = this.resources.items.catFace
        this.spriteTex.flipY = false

        this.setBook()
 
       // this.spriteTex.repeat.set( 1, 1 );
        this.spriteTex.encoding = THREE.sRGBEncoding
        this.spriteTex.needsUpdate = true
        // this.spriteTex.warpS = THREE.RepeatWrapping;
        // this.spriteTex.warpT = THREE.RepeatWrapping;
        // this.spriteTex.repeat.set(1,1)

        this.catManBodyTex = this.resources.items.catBody
        this.catManBodyTex.encoding = THREE.sRGBEncoding
        this.catManBodyTex.flipY = false;
        this.catManBodyTex.needsUpdate = true;

        this.debug = this.trainTown.debug

       
        
        this.rampTex = this.resources.items.gradientTex

        this.params = {
           u_ramp : {value: this.rampTex},
           u_rimColor : {value:new THREE.Vector3(0.5,0.1,0.0)},
           u_resolution : {value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
           u_shadowPower : {value: 0.3},
           u_topColor : {value: new THREE.Color(0.925,0.560,0.042)},
           u_bottomColor : {value: new THREE.Color(1.000,0.656,0.860)},
           u_texture : [{value: this.spriteTex },{value: this.catManBodyTex }],
           u_ambient : {value: 0.09},
           u_shadowColor : {value: new THREE.Color('#10237e')},
           u_brushTex : { value: this.brushTex},
           u_snowAngle : { value: new THREE.Vector3(0.2,1.0,0.0) },
           u_snowColor : { value: new THREE.Color(0.5,0.5,0.5) },
           u_snowSize : { value: 1.0 },
           u_snowHeight : { value: 0.1},
           u_snowOffset : { value: 0.1},
           u_toonRamp : { value: this.toonRamp }
          
        }

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('cat')
        }
     
        this.setModel()
       
        this.flipBookAni = new FlipBookAni(this.spriteTex, 5, 5)
        this.flipBookAni.loop([0,1,2,3,4,5,6,7,11,12,13,14,15,16,17,18,19,20,21,22,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 3.8)
       // this.setAnimation()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(30, 30, 30)
        //console.log(this.model)
        this.scene.add(this.model)
        //console.log(this.model)

        this.box = new THREE.Mesh(new THREE.BoxGeometry(100,0.01,100),new THREE.MeshStandardMaterial())
        this.box.position.set(0.0,5.0,0.0)
        this.box.material.transparent = true;
        this.box.material.opacity = 0;
        this.box.castShadow = true
        
       // this.scene.add(this.box)

        this.catManHeadMaterial = new THREE.MeshStandardMaterial({
             map:this.spriteTex,
             roughness: 0.4,
             defines : {
                LINE: false,
                RAMP: false,
                HEIGHT:false,
                HEIGHTNIGHT:false,
                SMOOTHTOON:true,
                SIMPLETOON:false,
                NOISE:false
            }
        });

        this.catManBodyMaterial = new THREE.MeshStandardMaterial(
            {map:this.catManBodyTex,
            roughness: 0.4,
            defines : {
                LINE: false,
                RAMP: false,
                HEIGHT:false,
                HEIGHTNIGHT:false,
                SMOOTHTOON:true,
                SIMPLETOON:false,
                NOISE:false
               }
            });
        

        this.catManHeadMaterial.onBeforeCompile = (shader) => {
           
            shader.uniforms.u_ramp = this.params.u_ramp;
            shader.uniforms.u_rimColor = this.params.u_rimColor;
            shader.uniforms.u_resolution = this.params.u_resolution;
            shader.uniforms.u_shadowPower = this.params.u_shadowPower;
            shader.uniforms.u_topColor = this.params.u_topColor;
            shader.uniforms.u_bottomColor = this.params.u_bottomColor;
            shader.uniforms.u_texture = this.params.u_texture[0];
            shader.uniforms.u_ambient = this.params.u_ambient;
            shader.uniforms.u_shadowColor = this.params.u_shadowColor;
            shader.uniforms.u_snowAngle = this.params.u_snowAngle;
            shader.uniforms.u_snowColor = this.params.u_snowColor;
            shader.uniforms.u_snowSize = this.params.u_snowSize;
            shader.uniforms.u_snowHeight = this.params.u_snowHeight;
            shader.uniforms.u_snowOffset = this.params.u_snowOffset;
            shader.uniforms.u_toonRamp = this.params.u_toonRamp;

            shader.uniforms.u_brushTex = this.params.u_brushTex;

            shader.vertexShader = shader.vertexShader.replace(
                "#include <common>",
                `#include <common>
                  varying vec2 vUv2;
                  varying vec3 vPosition;
                  varying vec3 worldPosition;
                  varying mat4 vModelMatrix;
                  varying vec3 worldNormal;
                

                  uniform vec3 u_snowAngle;
                  uniform vec3 u_snowColor;
                  uniform float u_snowSize;
                  uniform float u_snowHeight;
                  uniform float u_snowOffset;

                 
                `
            )

            shader.vertexShader = shader.vertexShader.replace(
                "#include <beginnormal_vertex>",
                `
                #include <beginnormal_vertex>
                vec4 snowC = -modelMatrix * vec4(u_snowAngle, 1.0); // 월드좌표로 바꾸기 모델매트릭스를 곱한다.

                vec3 newNormal = normal;

                // if (dot(normal, -snowC.xyz) >= u_snowSize) 
                // {
                //     newNormal.xyz += normal * u_snowHeight;// scale vertices along normal
                // }

                objectNormal = vec3( newNormal );
                `
            )

            shader.vertexShader = shader.vertexShader.replace(
                "#include <begin_vertex>",
                `
                #include <begin_vertex>
               
                vec3 newPosition = position;

                if (dot(normal, snowC.xyz) > u_snowSize) 
                {
                    newPosition.xyz += normal * u_snowHeight;// scale vertices along normal
                }

                transformed = vec3( newPosition );
                
                `
            )

            shader.vertexShader = shader.vertexShader.replace(
                "#include <clipping_planes_vertex>",
                `#include <clipping_planes_vertex>
                 
                  vUv2 = uv;
                  vPosition = newPosition;
                  vModelMatrix = modelMatrix;
                  worldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
                  mat3 normalMatrix = mat3(transpose(inverse(modelMatrix)));
                  worldNormal = normalize(normalMatrix * newNormal);
                  
                `
              )

            shader.fragmentShader = shader.fragmentShader.replace(
                "#define STANDARD",
                `
                #define STANDARD

               // varying vec2 vUv;
                
                varying vec2 vUv2;
                varying vec3 vPosition;
                varying mat4 vModelMatrix;
                varying vec3 worldPosition;
                varying vec3 worldNormal;
              

                uniform sampler2D u_texture;
                uniform sampler2D u_ramp;
                uniform sampler2D u_brushTex;

                uniform vec3 u_rimColor;
                uniform vec2 u_resolution;
                uniform vec3 u_topColor;
                uniform vec3 u_bottomColor;

                uniform vec3 u_shadowColor;

                uniform float u_shadowPower;
                uniform float u_ambient;

                uniform sampler2D u_toonRamp;
                uniform vec3 u_snowAngle;
                uniform vec3 u_snowColor;
                uniform float u_snowSize;
                uniform float u_snowHeight;
                uniform float u_snowOffset;
                
           

                vec3 fresnel(in vec3 f0, in float product)
                {
                    //// 0(max fres) ~ 1(min fres)
                    return mix(f0, vec3(1.0), pow(1.0 - product, 5.0));
                } //에너지 보존 스넬

                `
            )

         
            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <output_fragment>",
                `
                #ifdef OPAQUE
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

                //---specular

                float HdN = max(0.0,dot(H,N)); 
                float shiness = 100.0;
                vec3 specCol = u_topColor;
                vec3 specular = u_bottomColor;  


                // -----physic specular

                vec3 pSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

                //---------fresnel 에너지보존

                float CdH = dot(C, H); // 0(max fres) ~ 1(min fres)
                vec3 fres = fresnel(vec3(0.2), CdH);

                
                
                //-----------------dot toon ----------------------

                vec2 st = gl_FragCoord.xy/u_resolution.xy;
                vec2 v;
                float f,s,g;
                float dotDiffuse = clamp(NdL,0.0,1.0);
                vec3 dotFinal;
            

                //-------rim

                float rim = dot(C,N);
                rim = 1.0 - rim;
                rim = rim*0.8;

                //-------texture, shadow
               // vec2 newUv = vUv / 5.0;
                vec4 tex = texture2D(u_texture,vUv);
                vec4 rampLight = texture2D(u_ramp,vec2(NdL,0.5));
                vec3 tempShadow = reflectedLight.directDiffuse * 0.6;



                DirectionalLightShadow directionalShadowTemp = directionalLightShadows[0];
                
                float shadow = getShadow(
                    directionalShadowMap[0],
                    directionalShadowTemp.shadowMapSize,
                    directionalShadowTemp.shadowBias,
                    directionalShadowTemp.shadowRadius,
                    vDirectionalShadowCoord[0]
                  );
          
                #ifdef SMOOTHTOON

             
                vec3 brushColor = texture2D(u_brushTex,vUv2).rgb;
               

                float snowNdL = max(0.0,dot(N,L));
                
               

              

                float toonNdL = NdL * shadow;

                vec3 snowRamp = texture2D(u_toonRamp, vec2(NdL)).rgb * 0.5 + 0.5;

                //shadowColr 를 더해준다.

                vec3 toonNdLShadow = mix(u_shadowColor, vec3(1.0,1.0,1.0), toonNdL) + u_ambient;

                vec2 vv = gl_FragCoord.xy * 1.2;

                float ff = (sin(vv.x) * 0.5 + 0.5) + (sin(vv.y) * 0.5 + 0.5);

                float ss;

                if(toonNdL > 0.6){
                    ss = 1.0;
                }
                else{
                    ss = 0.4;
                }

              

              //  toonNdLShadow = brushColor * toonNdLShadow;
                vec3 toonDiffuse = toonNdLShadow * tex.rgb;
               // 아래값은 도트쉐이더이다.
               // vec3 toonDiffuse = (((toonNdL + vec3(ff)) * ss) + u_shadowColor )* tex.rgb;
               

               // gl_FragColor = vec4( toonDiffuse , diffuseColor.a );

               vec4 snowC = -vModelMatrix * vec4(u_snowAngle, 1.0);
              
               gl_FragColor = vec4( toonDiffuse , diffuseColor.a );

               vec3 localPos = (vPosition - (vModelMatrix * vec4(-0.0, 0.0, 0.0, 1.0)).xyz);

               // 스노우쉐이더

            //    if (dot(worldNormal, u_snowAngle.xyz) >= u_snowSize - 0.2) 
            //    {
            //       vec3 snowFinal = mix(u_snowColor * snowRamp, u_snowColor * snowRamp,saturate(localPos.y));
            //       gl_FragColor = vec4(snowFinal,1.0);

            //    } else
            //    {
                

            //    }
                
                #endif

                // gl_FragColor = vec4( outgoingLight, diffuseColor.a );

            `
            )

        }

        this.catManBodyMaterial.onBeforeCompile = (shader) => {
           
            shader.uniforms.u_ramp = this.params.u_ramp;
            shader.uniforms.u_rimColor = this.params.u_rimColor;
            shader.uniforms.u_resolution = this.params.u_resolution;
            shader.uniforms.u_shadowPower = this.params.u_shadowPower;
            shader.uniforms.u_topColor = this.params.u_topColor;
            shader.uniforms.u_bottomColor = this.params.u_bottomColor;
            shader.uniforms.u_texture = this.params.u_texture[1];
            shader.uniforms.u_ambient = this.params.u_ambient;
            shader.uniforms.u_shadowColor = this.params.u_shadowColor;

            shader.vertexShader = shader.vertexShader.replace(
                "#define STANDARD",
                `#define STANDARD
                  //varying vec2 vUv;
                 
                `
            )

            shader.vertexShader = shader.vertexShader.replace(
                "#include <clipping_planes_vertex>",
                `#include <clipping_planes_vertex>
                 
                  //vUv = uv;
                  
                `
              )

            shader.fragmentShader = shader.fragmentShader.replace(
                "#define STANDARD",
                `
                #define STANDARD

               // varying vec2 vUv;
                uniform sampler2D u_texture;
                uniform sampler2D u_ramp;

                uniform vec3 u_rimColor;
                uniform vec2 u_resolution;
                uniform vec3 u_topColor;
                uniform vec3 u_bottomColor;

                uniform vec3 u_shadowColor;

                uniform float u_shadowPower;
                uniform float u_ambient;
                
           

                vec3 fresnel(in vec3 f0, in float product)
                {
                    //// 0(max fres) ~ 1(min fres)
                    return mix(f0, vec3(1.0), pow(1.0 - product, 5.0));
                } //에너지 보존 스넬

                `
            )

         
            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <output_fragment>",
                `
                #ifdef OPAQUE
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

                //---specular

                float HdN = max(0.0,dot(H,N)); 
                float shiness = 100.0;
                vec3 specCol = u_topColor;
                vec3 specular = u_bottomColor;  


                // -----physic specular

                vec3 pSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

                //---------fresnel 에너지보존

                float CdH = dot(C, H); // 0(max fres) ~ 1(min fres)
                vec3 fres = fresnel(vec3(0.2), CdH);

                
                
                //-----------------dot toon ----------------------

                vec2 st = gl_FragCoord.xy/u_resolution.xy;
                vec2 v;
                float f,s,g;
                float dotDiffuse = clamp(NdL,0.0,1.0);
                vec3 dotFinal;
            

                //-------rim

                float rim = dot(C,N);
                rim = 1.0 - rim;
                rim = rim*0.8;

                //-------texture, shadow
               // vec2 newUv = vUv / 5.0;
                vec4 tex = texture2D(u_texture,vUv);
                vec4 rampLight = texture2D(u_ramp,vec2(NdL,0.5));
                vec3 tempShadow = reflectedLight.directDiffuse * 0.6;



                DirectionalLightShadow directionalShadowTemp = directionalLightShadows[0];
                
                float shadow = getShadow(
                    directionalShadowMap[0],
                    directionalShadowTemp.shadowMapSize,
                    directionalShadowTemp.shadowBias,
                    directionalShadowTemp.shadowRadius,
                    vDirectionalShadowCoord[0]
                  );
          
                #ifdef SMOOTHTOON

             
                float toonNdL = NdL * shadow;

                //shadowColr 를 더해준다.

                vec3 toonNdLShadow = mix(u_shadowColor, vec3(1.0,1.0,1.0), toonNdL) + u_ambient;

               

                vec2 vv = gl_FragCoord.xy * 1.2;

                float ff = (sin(vv.x) * 0.5 + 0.5) + (sin(vv.y) * 0.5 + 0.5);

                float ss;

                if(toonNdL > 0.6){
                    ss = 1.0;
                }
                else{
                    ss = 0.4;
                }
                  
                
               vec3 toonDiffuse = toonNdLShadow * tex.rgb;

               // vec3 toonDiffuse = (outgoingLight * toonNdLShadow + 0.08) * tex.rgb;

               // 아래값은 도트쉐이더이다.
              //  vec3 toonDiffuse = (((toonNdL + vec3(ff)) * ss) + u_shadowColor )* tex.rgb;
               

                gl_FragColor = vec4( toonDiffuse , diffuseColor.a );
                
                
                #endif

                // gl_FragColor = vec4( outgoingLight, diffuseColor.a );

            `
            )

        }

        this.model.traverse((child)=>
        {
            if(child instanceof THREE.Mesh && child.name == "Head")
            {
                child.material = this.catManHeadMaterial
                child.castShadow = true
                child.receiveShadow = true
                child.material.needsUpdate = true

               // console.log(child.material)
            }
        })

        this.model.traverse((child)=>
        {
            if(child instanceof THREE.Mesh && child.name == "Body")
            {
                child.material = this.catManBodyMaterial
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        /**
         * 디버그
         */

        if(this.debug.active)
        {
            this.debugFolder
                .add(this.params.u_ambient,'value')
                .min(0.0)
                .max(1.0)
                .step(0.01)
                .name('u_ambient')


            this.debugFolder
                .add(this.params.u_snowSize,'value')
                .min(-2.0)
                .max(2.0)
                .step(0.001)
                .name('snowSize')

            this.debugFolder
                .add(this.params.u_snowHeight,'value')
                .min(0.0)
                .max(0.2)
                .step(0.001)
                .name('u_snowHeight')
            
            
           
            this.debugFolder
                .addColor(this.params.u_shadowColor, "value")
                .name('u_shadowColor')
        }

      


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
        this.flipBookAni.update(this.time.delta * 0.003)
        //this.catManHeadMaterial.uniforms.uMedSmooth = this.params.uMedSmooth
        //console.log(this.customUniforms.uMedSmooth)
       // this.animation.mixer.update(this.time.delta * 0.001)
    }


    setBook()
    {
       
        const currentTile = 24;
        const tileHoriz = 5;
        const tileVert = 5;

        this.spriteTex.magFilter = THREE.NearestFilter
        this.spriteTex.repeat.set(1/tileHoriz, 1/tileVert);
        const offsetX = (currentTile % tileHoriz) / tileHoriz
        const offsetY = (tileVert + Math.floor(currentTile / tileHoriz) - tileHoriz) /  tileVert
        
        this.spriteTex.offset.x = offsetX;
        this.spriteTex.offset.y = offsetY;

        //console.log(offsetX, offsetY)
    }

}