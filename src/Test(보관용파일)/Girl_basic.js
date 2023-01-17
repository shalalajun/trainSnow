import * as THREE from 'three' 
import TrainTown from "../TrainTown/TrainTown.js";
import KeyControl from '../Utils/KeyControl.js';

export default class Girl{
    constructor()
    {
        this.clock = new THREE.Clock()
        this.trainTown = new TrainTown()
        this.scene = this.trainTown.scene
        this.resources = this.trainTown.resources
        this.time = this.trainTown.time
        this.resource = this.resources.items.girl
        this.aniName = 
        [
            'idle', 'walk', 'run'
        ]
        this.player = new THREE.Object3D() 
        this.walk = false;
        this.debug = this.trainTown.debug
       
        
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('girl')
        }

        this.keyControl = new KeyControl(this.resource.scene)

        this.setModel()
        this.setAnimation()
        this.addControl()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(0.1, 0.1, 0.1)
        this.player.add(this.model)
        //this.player.userData.move = { forward: this.forward, turn: this.turn }; 
        this.scene.add(this.player)

        this.model.traverse((child)=>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        this.animation.actions = {}
        // gltf 객체에 scene에는 모델링이 있고 animation에 animation 이 있기때문에 리소스에서 끄집어 내야한다.
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[7])
        this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[17])
        this.animation.actions.run = this.animation.mixer.clipAction(this.resource.animations[12])
      
        //this.animation.actions.idle.play()

        //애니가 여러개 있을때 참고

        this.animation.actions.current = this.animation.actions.idle
        //this.animation.actions.current.play()

      
        
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 0.4)

            this.animation.actions.current = newAction
        }   
    
        
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle')},
                playWalking: () => { this.animation.play('walk')},
                playRunning: () => { this.animation.play('run')}
            }

            this.debugFolder.add(debugObject,'playIdle')
            this.debugFolder.add(debugObject,'playWalking')
            this.debugFolder.add(debugObject,'playRunning')
        }

        // document.addEventListener('keydown',(e)=>
        // {
            
        //     if(e.keyCode === 87 && !this.walk)
        //     {
        //         this.aniName = 'walk'
        //         this.walk = true
        //         this.animation.play(this.aniName)
        //     }
        // })
        // document.addEventListener('keyup',(e)=>
        // {
        //         if(this.walk)
        //         this.aniName = 'idle'
        //         this.walk = false
        //         this.animation.play(this.aniName)
        // })


    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
        this.updateAction()
    }

    updateAction()
    {
        const dt = this.clock.getDelta();
         //플레이어의 유저데이터.무브가 정의되어 있다면
        if (this.player.userData.move !== undefined){
            //그리고 그 중에 플레이어의 유저데이터 무브 포워드가 0보다 크고 스피드가 10보다 작다면
            //스피드에 0.1을 계속 더해주고, 플레이어의 포워드에 dt 값을 곱해 이동시킨다. 그리고 로테이션 시킨다.
            if (this.player.userData.move.forward>0 && this.player.userData.move.speed<8) this.player.userData.move.speed += 0.04;
            this.player.translateZ(this.player.userData.move.forward * dt * this.player.userData.move.speed);
            this.player.rotateY(this.player.userData.move.turn * dt);
            
            
            //Update actions here
            if (this.player.userData.move.forward<0){
                this.playAction('walk');
               
            }else if (this.player.userData.move.forward==0){
                //포워드가0이고 턴이 0보다 작다면 레프트돌기
              if (this.player.userData.move.turn<0){
                this.playAction('walk');
              }else{
                //포워드가0이고 그외에는 오른쪽 돌기
                this.playAction('walk');
              }
              //속도가 5보다 크면 런
            }else if (this.player.userData.move.speed>5){
                this.playAction('run');
            }else{
                this.playAction('walk');
            }
          }else{
            this.playAction('idle');
          }
         
    }

    playAction(name){
        if (this.player.userData.actionName == name) 
        {
            return;
        }
        const newAction = this.animation.actions[name];
        const oldAction = this.animation.actions.current
        this.player.userData.actionName = name;
        newAction.reset()
        newAction.play()
        newAction.crossFadeFrom(oldAction, 0.4)
       
        // this.animation.mixer.stopAllAction();
        // action.reset();
        // action.fadeIn(1.0);
        // action.play();

        this.animation.actions.current = newAction

      
      }
      

    addControl()
    {
        document.addEventListener( 'keydown', (e)=>this.keyDown(e) );
        document.addEventListener( 'keyup', (e)=>this.keyUp(e) );
    }

   
 
    keyDown(evt){
       
        
        let forward = ( this.player.userData.move !== undefined) ? this.player.userData.move.forward : 0; //포워드는 유저데이터 무브가 정의되어 있다면 유저데이터 무브의 포워드값, 무브가 정의되어 있지않다면 0
        let turn = (this.player.userData.move !== undefined) ?  this.player.userData.move.turn : 0;
        //턴은 무브가 정의되어 있다면 포워드는 유저데이터 무브의 턴값, 무브가 정의되어 있지않다면 0
        
        switch(evt.keyCode){
          case 87://W
            //console.log('up')
            forward = 1;
            break;
          case 83://S
            forward = -1;
            break;
          case 65://A
             turn = 1;
            // console.log(this.player.userData)
            break;
          case 68://D
            turn = -1;
            break;
        }
        
       this.playerControl(forward, turn);
       //console.log(this.player.userData.move)
     
    }
      
   keyUp(evt){
   
        let forward = (this.player.userData.move!==undefined) ? this.player.userData.move.forward : 0;
        //포워드는 유저데이터 무브가 정의되어 있다면 유저데이터 무브의 포워드값, 무브가 정의되어 있지않다면 0
        let turn = (this.player.userData.move!==undefined) ?  this.player.userData.move.turn : 0;
        //턴은 유저데이터의 무브가 정의되어 있다면 포워드는 유저데이터 무브의 턴값, 무브가 정의되어 있지않다면 0
        
        switch(evt.keyCode){
          case 87://W
          forward = 0;
            break;
          case 83://S
          forward = 0;
            break;
          case 65://A
          turn = 0;
            break;
          case 68://D
          turn = 0;
            break;
        }
        
        this.playerControl(forward, turn);
       // console.log(this.player.userData.move)
     
    }

    playerControl(forward, turn){
        //유저데이터의 무브 포워드, 턴값이 0이라면 유저데이터 무브값을 삭제
        if (forward==0 && turn==0){
             delete this.player.userData.move;
         }else{
        //유저데이터의 무브 있다면 포워드에 포워드를 적용, 턴에 턴값을 적용
       if (this.player.userData.move){
        this.player.userData.move.forward = forward;
        this.player.userData.move.turn = turn;
       }else{
         //그외에는 유저데이터는 포워드, 턴, 타임, 스피드가 적용된다.
         //카메라 인덱스는 1이다.
         this.player.userData.move = { forward, turn, time: this.clock.getElapsedTime(), speed: 1 }; 
         //cameraIndex = 1;
       }
     }
    }

   
}