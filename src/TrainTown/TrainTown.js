import * as THREE from 'three'
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import World from './World/World.js';
import Resources from './Utils/Resources.js';
import sources from './sources.js';
import Debug from './Utils/Debug.js';
import Stats from 'stats.js'



/**
 * stats
 */

let stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

let instance = null

export default class TrainTown
{
    constructor(canvas)
    {
        //Global Access
        if(instance)
        {
            return instance
        }

        instance = this

        window.trainTown = this;

        //Options
        this.canvas = canvas

        //setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.sceneColor = new THREE.Color('#b5d8e7')
        this.scene.background = new THREE.Color(this.sceneColor)
        this.scene.fog = new THREE.Fog(this.sceneColor, 60,120)
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        
      

        this.sizes.on('resize',() =>
        {
           this.resize()
        })

        this.time.on('tick',()=>
        {
           this.update()
        })
    }

 

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        stats.begin()

        this.camera.update()
        this.world.update()
        this.renderer.update()

        stats.end()
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()
       // this.dispose()

        if(this.debug.active)
            this.debug.ui.destroy()
    }
}