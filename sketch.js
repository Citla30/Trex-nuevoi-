var trex, trex_running,trex_collider;
var ground,groundimage,invisibleground;
var cloud,cloudimg,cloudsGroup;
var obstacles,ob1,ob2,obstaclesGroup;
var score;
var PLAY=1;
var END=0;
var gameState=PLAY;
var gameOverimg,gameOver,restartimg,restart;
var jumpSound,checkSound,dieSound;
var fondo1,sol,solimg;

function preload(){
  //cargar la animación para el trex
  trex_running = loadAnimation("trex_1.png","trex_2.png", "trex_1.png");
  groundimage = loadImage ("suelo.png");
  cloudimg = loadImage ("cloud-1-1.png");
  ob1=loadImage("cactus.png");
  ob2=loadImage("cactus2.png");
  trex_collider=loadAnimation("trex_collided-1.png");
  gameOverimg=loadImage("gameOver-1.png");
  restartimg=loadImage("restart-1.png");
  jumpSound=loadSound("jump.mp3");
  checkSound=loadSound("checkPoint.mp3");
  dieSound=loadSound("die.mp3");
  fondo1=loadImage("fondo2.jpg");
  solimg=loadImage("sun.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  //crea el sprite del Trex
  trex = createSprite (70,height-75,20,50);
  //agregar la animación a la variable trex
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collider);
  trex.scale = 0.2;
  trex.x = 70;
  trex.setCollider("circle",0,0,370);
  trex.debug=false;
  
  //crea el sprite del suelo
  ground= createSprite(width/2,height+200,width,20);
  ground.addImage("imagen del suelo",groundimage);
  ground.scale=5;
  ground.depth=trex.depth;
  trex.depth=trex.depth+1;
  
  //crea un sprite de un suelo invisible
  invibleground=createSprite (width/2,height-10,width,125);
  invibleground.visible=false;
  invibleground.shapeColor="#f4cbaa";
  //imagenes de gameover y resart
  gameOver=createSprite(width/2,height/2-50);
  gameOver.addImage("imagen de gameover",gameOverimg);
  gameOver.scale=0.6;
  gameOver.visible=false;
  
  //puntuación del juego
  score=0;
  
  restart=createSprite(width/2,height/2);
  restart.addImage("imagen de restart",restartimg);
  restart.scale=0.1;
  restart.visible=false;
  
  sol=createSprite(width-50,80,10,10);
  sol.addImage(solimg);
  sol.scale=0.12;
  //agregar grupos de nubes y obstaculos
  cloudsGroup= new Group();
  obstaclesGroup= new Group();
  
}

function draw() {
  //limpiar la pantalla y fondo de pantalla
  background(fondo1);
  //muestra un texto para la puntuación
  fill("black");
  textFont("Comic Sans MS");
  textSize(20);
  text("Puntuación: "+score,30,50);
  
   //score=score+Math.round(getFrameRate()/60);
  //console.log(frameCount);
  
  if(gameState==PLAY){
    ground.velocityX=-(6+3*score/100);
    score=score+Math.round(getFrameRate()/60);
    if(score>0&&score%200===0){
      checkSound.play();
    }
    
    if(ground.x<0){
      ground.x=ground.width/2;
    }
    
    //al precionar la barra espaciadora que salte el trex
    if(touches.length>0||keyDown ("space")&&trex.y>=height-200){
      trex.velocityY = -15;
      jumpSound.play();
      touches=[];
     }
    //Asigna la gravedad
    trex.velocityY = trex.velocityY + 0.5;
    
    Spawnclouds();
    Spawnobstacles();
    
    if(trex.isTouching(obstaclesGroup)){
      gameState=END;
      dieSound.play();
      
    }  
  }
  else if(gameState===END){
    trex.changeAnimation("collided",trex_collider);
    ground.velocityX=0;
    //establece un ciclo de vida a los objetos del juego para que nunca sean destruidos.
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.velocityY=0;
    gameOver.visible=true;
    restart.visible=true;
    
    if(touches.length>0||keyDown("space")||mousePressedOver(restart)){
      reset();
      touches=[];
    }
    
  }
    
  //se quede en el suelo invisible
  trex.collide(invibleground);
    
  
  drawSprites();
  
}

function Spawnclouds(){
  if(frameCount%60===0){
    cloud= createSprite(width+20,height-300,40,10);
    cloud.velocityX=-(6+score/200);
    cloud.addImage("imagen de las nubes ",cloudimg);
    //hace que la imagen sea alternativa
    cloud.y=Math.round(random(50,220));
    cloud.scale=0.5;
    //ajusta la profundidad
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    cloud.lifetime=300;
    cloudsGroup.add(cloud);
    cloud.depth=gameOver.depth;
    gameOver.depth=gameOver.depth+1;
  }
  
}
function Spawnobstacles(){
  if(frameCount%100===0){
  obstacles=createSprite(1000,height-120,20,30);
  obstacles.velocityX=-(6+score/100);
    //genera obstaculos al asar
    var rand=Math.round(random(1,2));
    switch(rand) {
      case 1:obstacles.addImage("imagen del ob1",ob1);
      break;
   
      case 2:obstacles.addImage("imagen del ob2",ob2);
        break;
       default: break;  
    }
    
    //asigna escala y tiempo de vida
    obstacles.scale=0.3;
    obstacles.lifetime=300;
    obstaclesGroup.add(obstacles);
    obstacles.debug=false;
    obstacles.setCollider("rectangle",0,0,400,400);
    
  }
}

function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0;
}