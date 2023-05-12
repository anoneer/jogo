const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;

var engine, world;

var backgroundImg, canvas, angle, tower, ground, cannon;
var cannonBall;
var boat;
var balls = [];
var boats = [];

var score = 0;

var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

var isgamerover = false;

var backgroundsound, cannonsound, watersound, piratesound;
var islaughing = false;

var score = 0

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");

  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");

  brokenBoatSpritedata = loadJSON("assets/boat/brokenBoat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/brokenBoat.png");

  backgroundsound = loadSound("assets/background_music.mp3");
  cannonsound = loadSound("assets/cannon_explosion.mp3");
  watersound = loadSound("assets/cannon_water.mp3");
  piratesound = loadSound("assets/pirate_laugh.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);

  engine = Engine.create();
  world = engine.world;

  angleMode(DEGREES);
  angle = 15;
  
  var options = {
    isStatic: true
  }

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);
  
  var boatFrames = boatSpritedata.frames;
  for (var i=0; i<boatFrames.length; i++){
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i=0; i<brokenBoatFrames.length; i++){
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }
}

function draw() {
  image(backgroundImg, 0, 0, width, height);

  fill("#6d4c41");
  textSize(40);
  text(`Pontuação: ${score}`, width - 200, 50);
  textAlign(CENTER, CENTER);

  if(!backgroundsound.isPlaying()){
    backgroundsound.play();
    backgroundsound.setVolume(0.1);
  }

  Engine.update(engine);

  rect(ground.position.x, ground.position.y, width * 2, 1);

  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 160, 310);
  pop();

  for (var i = 0; i < balls.length; i++){
    showCannonBall(balls[i], i);
    collisionWithBoat(i);
  }

  cannon.display();
  showBoats();
}

function keyPressed(){
  if (keyCode === 32) {
    cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function keyReleased() {
  if (keyCode === 32) {
    cannonsound.play();
    balls[balls.length - 1].shoot();
  }
}

function showCannonBall(ball, index){
  if(ball) {
    ball.display();
    if(ball.body.position.x >= width || ball.body.position.y >= height -50){
      watersound.play();
      ball.remove(index);
    }
  }
}

function showBoats() {
  if (boats.length > 0){
    if (boats[boats.length - 1] === undefined ||
        boats[boats.length - 1].body.position.x < width - 300){
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(width, height - 60, 170, 170, position, boatAnimation);
      boats.push(boat);
    }
    for (var i = 0; i < boats.length; i++){
      if (boats[i]){
        Body.setVelocity(boats[i].body, {x: -0.9, y:0});
        boats[i].display();
        boats[i].animate();
        var collision = Matter.SAT.collides(tower, boats[i].body);
        if(collision.collided && !boats[i].isBroken){
          if(!islaughing && !piratesound.isPlaying()){
            piratesound.play();
            islaughing = true;
          }
          isgamerover = true;
          gamerover();
        }
      }
    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -80, boatAnimation);
    boats.push(boat);
  }
}

function collisionWithBoat(index){
  for(var i = 0; i < boats.length; i++){
    if (balls[index] !== undefined && boats[i] !== undefined){
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);
      if (collision.collided && !boats[i].isBroken){
        score += 5;
        boats[i].remove(i);
        World.remove(world, balls[index].body);
        delete balls[index];
      }
    }
  }
}

function gamerover(){
  swal({
    title:"fim de jogo",
    text:"obrigado por jogar",
    imageUrl:"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    imageSize:"150x150",
    confirmButtonText:"jogar novamente"
  },
  function(isConfirm){
    if(isConfirm){
      location.reload();
    }
  }
  )
}