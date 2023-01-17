import * as THREE from 'three'
import TrainTown from "../TrainTown.js";


export default class Environment
{
    constructor()
    {
        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.debug = this.trainTown.debug
        this.params = {
            color: "#6495ED",
            directionalLight: "#f8f1e6",
            ambientLight: "#81b2df"
          };

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setSunLight()
        this.setAmbient()
        this.setEnvironmentMap()
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 1)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(2048, 2048)
        this.sunLight.shadow.normalBias = 0.02
        this.sunLight.position.set(7.1, 24.1, 7.5)
        this.scene.add(this.sunLight)

        this.sunLight.shadow.camera.left = -20
        this.sunLight.shadow.camera.right = 20
        this.sunLight.shadow.camera.top = 20
        this.sunLight.shadow.camera.bottom = -20
        this.sunLight.shadow.camera.far = 40
        
        // const helper = new THREE.CameraHelper( this.sunLight.shadow.camera );
        // this.scene.add( helper );


        if(this.debug.active)
        {
            this.debugFolder
                .add(this.sunLight,'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
            .add(this.sunLight.position,'x')
            .name('sunLightX')
            .min(-20)
            .max(20)
            .step(0.001)

            this.debugFolder
            .add(this.sunLight.position,'y')
            .name('sunLightY')
            .min(-5)
            .max(28)
            .step(0.001)

            this.debugFolder
            .add(this.sunLight.position,'z')
            .name('sunLightZ')
            .min(-20)
            .max(20)
            .step(0.001)
        }
    }

    setAmbient()
    {
        this.ambientLight = new THREE.AmbientLight("#ffffff", 0);

        this.scene.add(this.ambientLight);

        if(this.debug.active)
        {
            this.debugFolder
            .add(this.ambientLight,'intensity')
            .name('ambientIntensity')
            .min(0)
            .max(2)
            .step(0.001)

           
        }
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 1.5
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding

        this.scene.environment = this.environmentMap.texture 
        
        this.setEnvironmentMap.updateMaterial = () => 
        {
            this.scene.traverse((child)=>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }

        this.setEnvironmentMap.updateMaterial()

        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.setEnvironmentMap.updateMaterial)
        }
    }
}