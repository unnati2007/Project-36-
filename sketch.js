var sadDog, happyDog, database, foodStock;
var name;
var fedTime, lastFed, foodObj;
var feedPetButton, addFoodButton;

function preload() {
  sadDog = loadImage("Images/dog.png"); 
  happyDog = loadImage("Images/happy dog.png");
}

function setup() {
  createCanvas(1000, 400);
  
  database = firebase.database();
  fedTime = database.ref("feedTime");

  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  foodsRef = database.ref("Food");
  foodsRef.on("value",function(data){
    foodStock = data.val();
  });
  
  dog = createSprite(650,200,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  foodObj = new Food();

  var nameInput = createInput("NAME THE DOG");
  nameInput.position(400,500);
  var saveNameButton = createButton("SAVE NAME");
  saveNameButton.position(400,550);

  saveNameButton.mousePressed(function(){
    var name = nameInput.value();
    database.ref("/").update({
      Name: name
    })
  })

  addFoodButton = createButton("ADD FOOD");
  addFoodButton.position(900,100);
  addFoodButton.mousePressed(addFoods);

  feedPetButton = createButton("FEED DOG");
  feedPetButton.position(1000,100);
  feedPetButton.mousePressed(feedDog);
}

function draw() {  
  background(46,139,87);

  foodObj.display();
  foodObj.getFoodStock();

  drawSprites();

  fill(255,255,254);
  strokeWeight(3);
  stroke(0);

  if(foodStock !== undefined) {
    textSize(35);
    text("Food Remaining: "+foodStock, 250, 650);
}
  if(lastFed>=12) {
    text("Last Fed: "+lastFed%12+" PM", 10, 30);
} 
  else if(lastFed===0) {
    text("Last Fed: Never", 10, 30);
} 
  else {
    text("Last Fed: "+lastFed + " AM", 10, 30);
  }
}

function addFoods() {
  foodStock++;
  database.ref("/").update({
    Food: foodStock
  });
}

function feedDog() {
  dog.addImage(happyDog);
  foodObj.deductFood(foodStock);
  database.ref("/").update({
    Food: foodStock,
    feedTime: hour()
  })
}