import * as THREE from 'three'

export default class RayControl
{
    constructor(camera)
    {
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.camera = camera
        this.currentIntersect = null;
        this.target = []
        this.setMouse()
        
    }

    setMouse()
    {
        window.addEventListener('mousemove',(event)=>
        {
            this.mouse.x = event.clientX / window.innerWidth * 2 - 1
            this.mouse.y = - (event.clientY / window.innerHeight) *2 + 1
            //console.log(this.mouse)
        })
    }

    checkClick(...names)
    {
        window.addEventListener('click',()=>
        {
            
            if(this.currentIntersect)
            {
                for(const name of names)
                {
                    if(this.currentIntersect.object.name === name)
                    {
                        console.log( name + '클릭했어!')
                    }
                }
                // if(this.currentIntersect.object.name === names[0] )
                // {
                //     console.log( names[0] + '클릭했어!')
                // }
                // if(this.currentIntersect.object.name === names[1] )
                // {
                //     console.log( names[1] + '클릭했어!')
                // }
                // if(this.currentIntersect.object.name === names[2] )
                // {
                //     console.log( names[2] + '클릭했어!')
                // }
            }
        })
    }

    update(...target)
    {
        //console.log(this.currentIntersect)
        this.raycaster.setFromCamera(this.mouse, this.camera)
        this.objectsToTest = target
        this.intersects = this.raycaster.intersectObjects(target)

        for(const object of this.objectsToTest)
        {
            object.material.color.set('#ff0000')
        }

        for(const intersect of this.intersects)
        {
            intersect.object.material.color.set('#0000ff')
        }

        if(this.intersects.length)
        {
            if(this.currentIntersect === null)
            {
                console.log("마우스들어옴")
            }
           
            this.currentIntersect = this.intersects[0]
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

    //이벤트리스너와 레이캐스터를 만든다.
    //이벤트리스너는 그냥 아무대다 만들면 될것 이고
    //마우스좌표를 구하는 부분은 어디에 둘까? 이것도 인자를 받아서 할수 있을 것 같다.
    //될수 있으면 임ㅍ포트를 하지 않으면 좋으련 만 1차로는 구현에 목적을 두자
}