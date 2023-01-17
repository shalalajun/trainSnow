import * as THREE from 'three'

export default class KeyControl
{
    // 콘스트럭터에서 캐릭터와 애니메이션을 설정해주고 이후에 업데이트만 적용하면 거의 된다.
    
    constructor(player, animation)
    {
        this.player = player
        this.clock = new THREE.Clock()
        this.animation = animation
        this.addControl()
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