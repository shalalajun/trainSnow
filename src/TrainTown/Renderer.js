import * as THREE from 'three'
import TrainTown from "./TrainTown.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import vertex from '../shaders/Post/vertexPost.glsl'
import fragment from '../shaders/Post/fragPost.glsl'


export default class Renderer
{
    constructor()
    {
        this.trainTown = new TrainTown()
        this.canvas = this.trainTown.canvas
        this.resources = this.trainTown.resources

        this.brushTex = new THREE.TextureLoader().load('textures/cat/brush.jpg')
        //console.log(this.brushTex)
        this.brushTex.encoding = THREE.sRGBEncoding
        this.brushTex.flipY = false;
        this.brushTex.needsUpdate = true;

        this.OverRayShader =
        {
            uniforms: 
            {
                tDiffuse : { value: null },
                overRayTexture : { value : this.brushTex},
                uTint : { value: null }
            } ,
            vertexShader: vertex,
            fragmentShader: fragment
        }


        this.sizes = this.trainTown.sizes
        this.scene = this.trainTown.scene
        this.camera = this.trainTown.camera

       
        this.setInstance()

        
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer(
            {
                canvas : this.canvas,
                antialias : true
            })

            this.instance.physicallyCorrectLights = true
            this.instance.outputEncoding = THREE.sRGBEncoding
            this.instance.toneMapping = THREE.CineonToneMapping
            this.instance.toneMappingExposure = 1.75
            this.instance.shadowMap.enabled = true
            this.instance.shadowMap.type = THREE.PCFSoftShadowMap
            this.instance.physicallyCorrectLights = true;
            this.instance.setClearColor('#211d20')
            this.instance.setSize(this.sizes.width, this.sizes.height)
            this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        this.effectComposer = new EffectComposer(this.instance);
        this.effectComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)

        this.renderPass = new RenderPass(this.scene, this.camera.instance)
        this.effectComposer.addPass(this.renderPass)
       
        this.bokehPass = new BokehPass( this.scene, this.camera.instance, {
            focus: 100.00,
            aperture: 0.055,
            maxblur: 0.0025
        } );
      
    
        
        this.overRayPass = new ShaderPass(this.OverRayShader)
       // this.effectComposer.addPass(this.overRayPass)

        //this.rgbShiftPass = new ShaderPass(RGBShiftShader)
        //this.effectComposer.addPass(this.rgbShiftPass)

            // console.log(this.renderPass)
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        // this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        // this.effectComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        
    }
    
    update()
    {
        this.instance.render(this.scene, this.camera.instance)
       
        /**
         * postProcessing
         */

       // this.effectComposer.render()
        
    }
}