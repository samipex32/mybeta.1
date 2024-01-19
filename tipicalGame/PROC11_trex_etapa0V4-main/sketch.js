var PLAY = 1;
var END = 0;
var gameState = PLAY;

var canvas;
var man, man_die, man_jump, man_shot, man_walk;
var backgroundImage;
var ground, invisibleGround, groundImage;

var castlesGroup, castleImage;
var enemysGroup, enemy1, enemy2, enemy3;


var score;
var gameOverImg,restartImg

function preload(){
  man = loadAnimation("man.png");
  man_die = loadAnimation("man_die1.png","man_die2.png");
  man_shot = loadAnimation("man_shot1.png","man_shot2.png");
  man_jump = loadAnimation("man_jump1.png","man_jump2.png","man_jump3.png","man_jump4.png","man_jump5.png","man_jump6.png","man_jump7.png","man_jump8.png");
  man_walk = loadAnimation("man_walk1.png","man_walk2.png","man_walk3.png","man_walk4.png","man_walk5.png","man_walk6.png","man_walk7.png","man_walk8.png","man_walk9.png","man_walk10.png");
  
  groundImage = loadImage("ground2.png");
  backgroundImage = loadImage("background1.png");

  castleImage = loadImage("castle1.png");
  
    enemy1 = loadImage("enemy1.png");
    enemy2 = loadImage("enemy2.png");
    enemy3 = loadImage("enemy3.png");
  
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkpoint.mp3");
}

function setup() {
  canvas = createCanvas(600, 200);
  
  man = createSprite(50,180,20,50);
  man.addAnimation("running", man_walk);
  man.addAnimation("collided" ,man_die);
  man.addAnimation("jump", man_jump);
  man.scale = 0.6;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
    gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
    enemysGroup = createGroup();
    castlesGroup = createGroup();
  
  console.log("Hola" + 5);
  
  score = 0;
}

function draw() {
  background(backgroundImage);
  //mostrar puntuación
  text("Puntuación: "+ score, 500,50);
  
  // trex.setCollider("circle",0,0,40);
  //trex.debug = true
  
  
  if(gameState === PLAY){
     gameOver.visible = false
    restart.visible = false
    //mover el suelo
    ground.velocityX = -4;
    ground.velocityX = -(4 + 3* score/100)
    //puntuación
    score = score + Math.round(getFrameRate()/60);
      //cambiar la animación del trex
      man.changeAnimation("running", man_walk);
    if(score>0 && score%100 === 0){
      checkPointSound.play() 
   }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el Trex salte al presionar la barra espaciadora
    if(keyDown("Up")&& man.y >= 160) {
        man.changeAnimation("jump", man_jump);
        man.velocityY = -13;
        jumpSound.play();

    }
    
     //agregar gravedad
     man.velocityY = man.velocityY + 0.8
  
     //aparecer nubes 
     spawnCastles();
  
     //aparecer obstáculos en el suelo
     spawnEnemys();
    
       if(enemysGroup.isTouching(man)){
          gameState = END;
          dieSound.play();
   //}
  }
   else if (gameState === END) {
      ground.velocityX = 0;
      man.velocityY = 0
      gameOver.visible = true;
      restart.visible = true;
     
    //cambiar la animación del trex
    man.changeAnimation("collided", man_die);

    //establecer lifetime de los objetos del juego para que no sean destruidos nunca
     enemysGroup.setLifetimeEach(-1);
     castlesGroup.setLifetimeEach(-1);

     if(mousePressedOver(restart)) {
      reset();
      }

     obstaclesGroup.setVelocityXEach(0);
     castleGroup.setVelocityXEach(0);
   }
  
 
   //evitar que el Trex caiga
   man.collide(invisibleGround);
  
  
  
   drawSprites();
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  enemyGroup.destroyEach();
  catlesGroup.destroyEach();
  score = 0;
}

function spawnCastles() {
  //escribir aquí el código para aparecer las nubes
   if (frameCount % 60 === 0) {
     castle = createSprite(600,100,40,10);
    castle.y = Math.round(random(10,60));
    castle.addImage(castleImage);
    castle.scale = 0.5;
    castle.velocityX = -3;
    
     //asignar lifetime a la variable
    castle.lifetime = 134;
    
    //ajustar la profundidad
    castle.depth = man.depth;
    man.depth = man.depth + 1;
    
    //agregar cada nube al grupo
   castlesGroup.add(castle);
    }
}

function spawnEnemys(){
  if (frameCount % 60 === 0){
    var enemy = createSprite(400,165,10,40);
    enemy.velocityX = -(6 + score/100);
 
    
     //generar obstáculos al azar
     var rand = Math.round(random(1,6));
     switch(rand) {
       case 1: enemy.addImage(enemy);
               break;
       case 2: enemy.addImage(enemy2)
               break;
     }
    
     //asignar escala y lifetime al obstáculo           
     enemy.scale = 0.5;
     enemy.lifetime = 300;
    
    //agregar cada obstáculo al grupo
     enemysGroup.add(enemy);
  }
}

