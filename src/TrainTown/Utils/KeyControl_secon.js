import EventEmitter from "./EventEmitter.js";
import listen from 'key-state';

export default class KeyControl extends EventEmitter
{
    constructor(charactor)
    {
        super()
        this.player = charactor
        this.position = charactor.position;

        this.keys = listen(window,{
            left: [ "ArrowLeft", "KeyA" ],
            right: [ "ArrowRight", "KeyD" ],
            up: [ "ArrowUp", "KeyW" ],
            down: [ "ArrowDown", "KeyS" ]
        })

       // console.log(this.position)
        this.speed = 0.06
        
    }

    checkAni()
    {
        if(this.keys.up)
        {
           console.log('up')
            
        }
        if(this.keys.down)
        {
            console.log('down')
        }
        if(this.keys.left)
        {
            console.log('left')
        }
        if(this.keys.right)
        {
            console.log('right')
        }
    }

    addControls()
    {
        if(this.keys.up)
        {
            this.player.translateZ(this.speed);
        }
        if(this.keys.down)
        {
            this.player.translateZ(-this.speed);
        }
        if(this.keys.left)
        {
            this.player.rotateY(this.speed*0.5);
        }
        if(this.keys.right)
        {
            this.player.rotateY(-this.speed*0.5);
        }
    }

   
}