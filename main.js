window.onload = function(){

  var canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  width = canvas.width = window.innerWidth,
  height = canvas.height = window.innerHeight;

  var LOADING = 0,
      MENU = 1,
      RUNNING = 2,
      GAMEOVER = 3;
  var currentState = RUNNING;

  var AABB = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  var tRect = Object.create(AABB),
      tRect2 = Object.create(AABB);
  function BlockObject(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  var ball = particle.create(0, 0, 0, 0);
  ball.setSpeed(utils.randomInt(10, 20));
  ball.setHeading(utils.randomRange(0, Math.PI * 2));

  var pad = particle.create(0, height/4, 0, 0);
  var padWidth = 100,
      padHeight = 20;
  pad.friction = 0.9;
  var velocityLimit = 10;
  var movingLeft = false,
      movingRight = false;

  //Blocks
  var GRID_WIDTH = 10,
      GRID_HEIGHT = 10,
      BLOCK_WIDTH = 80,
      BLOCK_HEIGHT = 10;
  var block_position = {
    x: 0,
    y: -width/8
  }
  var blocksGrid = new Array(GRID_HEIGHT);
  for(var i = 0; i < GRID_WIDTH; i++){
    blocksGrid[i] = new Array(GRID_WIDTH);
  }
  for(var i = 0; i < blocksGrid.length; i++){
    for(var j = 0; j < blocksGrid[0].length; j++){
      var x = block_position.x + ((j - blocksGrid[0].length/2) * BLOCK_WIDTH),
          y = block_position.y + ((i - blocksGrid.length/2) * BLOCK_HEIGHT);
      blocksGrid[i][j] = new BlockObject(x, y, BLOCK_WIDTH, BLOCK_HEIGHT);
    }
  }

  context.translate(width/2, height/2);
  update();


  function update(){

    switch(currentState){
      case RUNNING:
      updateGamePlay();
      renderGamePlay();
      break;
      case GAMEOVER:
      renderGameOver();
      currentState = MENU;
      break;
    }

    requestAnimationFrame(update);
  }

  function updateGamePlay(){
    if(movingLeft && !movingRight){
      pad.accelerate(-5, 0);
    } else if(movingRight && !movingLeft){
      pad.accelerate(5, 0);
    }
    pad.vx = Math.min(velocityLimit, Math.max(pad.vx, -velocityLimit));
    pad.vy = Math.min(velocityLimit, Math.max(pad.vy, -velocityLimit));
    ball.update();
    pad.update();
    pad.x = Math.min(width/2 - padWidth, Math.max(pad.x, -width/2));
    pad.y = Math.min(height/2, Math.max(pad.y, -height/2));
    checkBounds(ball);
    checkBallPadCollision();
    checkBallBlocksCollision();
  }

  function renderGamePlay(){
    context.clearRect(-width/2, -height/2, width, height);
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    context.fill();
    context.fillRect(pad.x, pad.y, padWidth, padHeight);

    context.beginPath();
    for(var i = 0; i < blocksGrid.length; i++){
      for(var j = 0; j < blocksGrid[i].length; j++){
        var currentBlock = blocksGrid[i][j];
        context.rect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);
      }
    }
    context.stroke();
  }

  function renderGameOver(){
    context.font = "20px Verdana";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("GAME OVER", 0, 0);
  }

  function checkBounds(p0){
    if(p0.x >= (width/2 - p0.radius)){
      p0.x = (width/2 - p0.radius);
      p0.vx *= -1;
    } else if(p0.x <= (-width/2 + p0.radius)){
      p0.x = (-width/2 + p0.radius);
      p0.vx *= -1;
    }
    if(p0.y >= (height/2 - p0.radius)){
      p0.y = (height/2 - p0.radius);
      p0.vy *= -1;
      currentState = GAMEOVER;
    } else if(p0.y <= (-height/2 + p0.radius)){
      p0.y = (-height/2 + p0.radius);
      p0.vy *= -1;
    }
  }

  function checkBallPadCollision(){
    tRect.x = ball.x - ball.radius;
    tRect.y = ball.y - ball.radius;
    tRect.width = ball.radius * 2;
    tRect.height = ball.radius * 2;
    tRect2.x = pad.x;
    tRect2.y = pad.y;
    tRect2.width = padWidth;
    tRect2.height = padHeight;
    if(utils.rectIntersect(tRect, tRect2)){
      ball.vy *= -1;
    }
  }

  function checkBallBlocksCollision(){
    for(var i = blocksGrid.length - 1; i >= 0; i--){
      for(var j =  blocksGrid[i].length - 1; j >= 0; j--){
        tRect.x = ball.x - ball.radius;
        tRect.y = ball.y - ball.radius;
        tRect.width = ball.radius * 2;
        tRect.height = ball.radius * 2;
        if(utils.rectIntersect(tRect, blocksGrid[i][j])){
          blocksGrid[i].splice(j, 1);
          ball.vy *= -1;
          break;
        }
      }
    }
  }

  document.body.addEventListener("keydown", function(event){
    switch(event.keyCode){
      case 37:
      movingLeft = true;
      break;
      case 38:
      break;
      case 39:
      movingRight = true;
      break;
      case 40:
      break;
    }
  });

  document.body.addEventListener("keyup", function(event){
    switch(event.keyCode){
      case 37:
      movingLeft = false;
      break;
      case 38:
      break;
      case 39:
      movingRight = false;
      break;
      case 40:
      break;
    }
  });

  // document.body.addEventListener("mousemove", function(event){
  //   ball.x = event.clientX - width/2;
  //   ball.y = event.clientY - height/2;
  // });

};
