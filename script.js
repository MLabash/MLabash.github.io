var settings = JSON.parse(settingsText);
var trashElementsArr = JSON.parse(trashElementsSrsText);

var myGame = new game();

/********************************* Play sound when trash comes in the container *************************/
// If trash is put in the right container, play CORRECT_ANSWER_SOUN.
// Otherwise play INCORRECT_ANSWER_SOUND.

function playSound(isCorrectAnswer) {   
    var answerSound = new Audio();
    
    answerSound.src = (isCorrectAnswer ? settings.CORRECT_ANSWER_SOUND : settings.INCORRECT_ANSWER_SOUND);
    answerSound.play();
}

/********************************* Draw  grey, green and blue trash Containers  ************************/
//Draw each container image according to it's coordinates
function drawTrashContainers() {
     var image1 = new Image;
     var image2 = new Image;
     var image3 = new Image;
    
    image1.src = settings.GREY_CONTAINER_IMAGE;
    myGame.ctx.drawImage(image1, Number(settings.GREY_CONTAINER_X), Number(settings.GREY_CONTAINER_Y));
    image2.src = settings.GREEN_CONTAINER_IMAGE;
    myGame.ctx.drawImage(image2, Number(settings.GREEN_CONTAINER_X), Number(settings.GREEN_CONTAINER_Y));
    image3.src = settings.BLUE_CONTAINER_IMAGE;
    myGame.ctx.drawImage(image3, Number(settings.BLUE_CONTAINER_X), Number(settings.BLUE_CONTAINER_Y));
}

/************** Determine in which container is the trash ******************************************/
//Compare trash element coordinats(x,y) with containers coordinates to check if it is inside 
function inWichContainer(x, y){
    var container='';
    
    if (x >= Number(settings.GREY_CONTAINER_X) && x <= (Number(settings.GREY_CONTAINER_X) + Number(settings.CONTAINER_WIDTH)) &&
        y >= Number(settings.GREY_CONTAINER_Y) && y <= (Number(settings.GREY_CONTAINER_Y) + (Number(settings.CONTAINER_HEIGHT)/3)))
    {
        // Trash is in the grey container
        container = 'grey';
    }
    else if (x >= Number(settings.GREEN_CONTAINER_X) && x <= (Number(settings.GREEN_CONTAINER_X) + Number(settings.CONTAINER_WIDTH)) && y >= Number(settings.GREEN_CONTAINER_Y) && y <= (Number(settings.GREEN_CONTAINER_Y) + (Number(settings.CONTAINER_HEIGHT)/3)))
    {
        // Trash is in the green container
        container = 'green';
    }
    else if (x >= Number(settings.BLUE_CONTAINER_X) && x <= (Number(settings.BLUE_CONTAINER_X) + Number(settings.CONTAINER_WIDTH)) 
    && y >= Number(settings.BLUE_CONTAINER_Y) && y <= (Number(settings.BLUE_CONTAINER_Y) + (Number(settings.CONTAINER_HEIGHT)/3)))
    {
        // Trash is in the blue container
        container = 'blue';
    }
    else
    {
        // Trash is still out containers
        container = 'out';
    }
            
    return container;
}

/*********************************** Draw and update score ***************************/
var score = {
    correctCounter : 0,
    incorrectCounter : 0,
    // display score on screen
    drawScore : function() {
        myGame.ctx.font = settings.SCORE_FONT;
        myGame.ctx.fillText(settings.SCORE_CORRECT_TEXT + this.correctCounter, Number(settings.SCORE_CORRECT_X)                         , Number(settings.SCORE_CORRECT_Y));
        myGame.ctx.fillText(settings.SCORE_INCORRECT_TEXT + this.incorrectCounter, Number(settings.SCORE_INCORRECT_X)                   , Number(settings.SCORE_INCORRECT_Y));
    },
    // display score on screen if the game ended.
    drawFinalScore(){
        myGame.ctx.font = settings.FINAL_SCORE_FONT;
        myGame.ctx.fillText(settings.SCORE_CORRECT_TEXT + this.correctCounter, 200 , 50);
        myGame.ctx.fillText(settings.SCORE_INCORRECT_TEXT + this.incorrectCounter, 200, 100);
    },
    // update score every time the user put trash in container.
    updateScore : function(isCorrectAnswer) {
        if(isCorrectAnswer) {
            this.correctCounter++;
        }
        else{
            this.incorrectCounter++;
        }
    } 
};
/***************************** Trash Element Object **********************************/
var trashElements = {
    x : 150,
    y : 275,
    incrementX : 0,
    incrementY : 0,
    imageIndex : 0,
    
    // Array of trash element images
    trashElementsSrs : trashElementsArr,
    
    // Draw trash element in it's position 
    drawTrashElement : function() {
        var image = new Image;
        
        image.src = this.trashElementsSrs[this.imageIndex].url;
        myGame.ctx.drawImage(image,this.x,this.y);
        
        myGame.ctx.font = settings.IMAGE_NAME_FONT;
        myGame.ctx.fillText(this.trashElementsSrs[this.imageIndex].name, this.x , this.y - 10);
    },
    
    // If trash element still outside any container upate it's position according to arrow keys.
    // Otherwise play suitable sound and and update score and get another trash element from trash element array.   
    updateTrashElement : function() {
        var container = inWichContainer(this.x, this.y);
        
        if(container == 'out')
        {
            if (( (this.x + this.incrementX) < 0) || ((this.x + this.incrementX) > Number(settings.CANVAS_WIDTH) - Number(settings.TRASH_ITEM_DIMENSION))) {
               this.incrementX = 0;
            }
            if (( (this.y + this.incrementY) < 0) || ((this.y + this.incrementY) > Number(settings.CANVAS_HEIGHT)  - Number(settings.TRASH_ITEM_DIMENSION))) {
               this.incrementY = 0;
            }
            this.x += this.incrementX; 
            this.y += this.incrementY;
        }
        else 
        {
            var isCorrectAnswer = (container == this.trashElementsSrs[this.imageIndex].container);
            trashElements.draggedByMouse = false;
            trashElements.draggedByTuoch = false;
            
            playSound(isCorrectAnswer);
            score.updateScore(isCorrectAnswer);
         
            this.x  = 150;
            this.y  = 275;
            if (this.imageIndex < this.trashElementsSrs.length - 1)
                this.imageIndex++;
            else 
            {
                imageIndex = 0;
                game.stoped = true;
                stopMyGame();
            }
        } 
    }
}

/*************************************** Update game *************************************/
//Clear canvas and draw it again to reflect changes in score and trash element 
function updateGame() {
    myGame.ctx.clearRect(0, 0, Number(settings.CANVAS_WIDTH), Number(settings.CANVAS_HEIGHT));
    drawTrashContainers();
    
    trashElements.incrementX = 0;
    trashElements.incrementY = 0; 
    
    if (game.key && game.key == Number(settings.LEFT_KEY)) {trashElements.incrementX = Number(settings.MINUS_STEP);}
    if (game.key && game.key == Number(settings.RIGHT_KEY)) {trashElements.incrementX = Number(settings.STEP);}
    if (game.key && game.key == Number(settings.UP_KEY)) {trashElements.incrementY = Number(settings.MINUS_STEP);}
    if (game.key && game.key == Number(settings.DOWN_KEY)) {trashElements.incrementY = Number(settings.STEP);}
    trashElements.updateTrashElement(); 
    if (!game.stoped)
    {
        trashElements.drawTrashElement();
        score.drawScore();
    }  
}

/******************* mouse listner ***************************/
// EventListener to get mouse coordinates when its button is pressed down.
function mouseDown (e) {
    if ((e.pageX >trashElements.x)  &&
        (e.pageX < trashElements.x + settings.TRASH_ITEM_DIMENSION) &&
        (e.pageY >trashElements.y) &&
        (e.pageY < trashElements.y + settings.TRASH_ITEM_DIMENSION))
     {
         trashElements.draggedByMouse = true;
         trashElements.x = e.pageX;
         trashElements.y = e.pageY;
     } 
}
//EventListener to get mouse coordinates when its button is pressed up.
function mouseUp (e) {
    if ((e.pageX > trashElements.x) &&
        (e.pageX < trashElements.x + settings.TRASH_ITEM_DIMENSION) &&
        (e.pageY >trashElements.y)  &&
        (e.pageY < trashElements.y + settings.TRASH_ITEM_DIMENSION) 
        ){
            trashElements.draggedByMouse = false;
         }
}

//EventListener to get mouse coordinates while it is moving.
function mouseMove (e) {
    if (trashElements.draggedByMouse){
        trashElements.x = e.pageX - settings.TRASH_ITEM_DIMENSION / 2 ;
        trashElements.y = e.pageY - settings.TRASH_ITEM_DIMENSION / 2;
    }
}
/******************* Touch listner ***************************/
// EventListener to get coordinates when touch starts
function ontouchstart (e) {
    if ((e.pageX >trashElements.x)  &&
        (e.pageX < trashElements.x + settings.TRASH_ITEM_DIMENSION) &&
        (e.pageY >trashElements.y) &&
        (e.pageY < trashElements.y + settings.TRASH_ITEM_DIMENSION))
     {
         trashElements.draggedByTuoch = true;
         trashElements.x = e.pageX;
         trashElements.y = e.pageY;
     } 
}
// EventListener to get coordinates when touch ends
function ontouchend (e) {
    if ((e.pageX > trashElements.x) &&
        (e.pageX < trashElements.x + settings.TRASH_ITEM_DIMENSION) &&
        (e.pageY >trashElements.y)  &&
        (e.pageY < trashElements.y + settings.TRASH_ITEM_DIMENSION) 
        ){
            trashElements.draggedByTuoch = false;
         }
}

// EventListener to get coordinates when touch moves
function ontouchmove (e) {
    if (trashElements.draggedByTuoch){
        trashElements.x = e.pageX - settings.TRASH_ITEM_DIMENSION / 2 ;
        trashElements.y = e.pageY - settings.TRASH_ITEM_DIMENSION / 2;
    }
}

/**************************** Start game ***********************************/
// Prepare canvas 
// Draw containers and score and trash elements.
// Add EventListener to get user's keyboard input .
// Add EventListener to get mouse coordinates.
// update game
function game () {
    this.startGameButton = document.getElementById("start-game");
    this.stopGameButton = document.getElementById("stop-game");
    this.started = false;
    this.stoped = false;
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.stopGameButton.disabled = true;
    
    this.startGame = function() {
        if (!myGame.started){
                this.startGameButton.disabled = true;
                this.stopGameButton.disabled = false;
                myGame.started = true;
                game.stoped = false;
                drawTrashContainers();
                score.correctCounter = 0;
                score.incorrectCounter = 0;
                score.drawScore();
                trashElements.imageIndex = 0;
                trashElements.drawTrashElement();
                this.interval = setInterval(updateGame, 20);
            
                // mouse event listner
                this.canvas.onmousedown = mouseDown;                      
                this.canvas.onmouseup = mouseUp;  //ontouchend                       
                this.canvas.onmousemove = mouseMove; //ontouchmove
                
                //touch event listner
                this.canvas.onmousedown = ontouchstart;                         
                this.canvas.onmouseup = ontouchend;                   
                this.canvas.onmousemove = ontouchmove;
            
                //Keybord event listener
                window.addEventListener('keydown', function (e) {
                        game.key = e.keyCode;
                });
                window.addEventListener('keyup', function (e) {
                        game.key = false;
                });
            };
        };
        this.stopGame = function(){
            myGame.started = false;
            this.startGameButton.disabled = false;
            this.stopGameButton.disabled = true;
            clearInterval(this.interval)
            this.ctx.clearRect(0, 0, 700,400);
            if (score.correctCounter != 0||score.incorrectCounter != 0)
                score.drawFinalScore();
        
        };
}

//Start the game
function startMyGame() {
    myGame = new game;
    myGame.startGame();
}

//Stop the game
function stopMyGame() {
    myGame.stopGame();
}

//  When Show info/Hide info  bottun pressed. 
//  Display the information div
//  If it is already shown then hide the information div
function displayInfo() {
    var displayValue = "Show info";
    var hideValue = "Hide info";
    var infoDiv = document.getElementById("info-div");
    var displayButton  = document.getElementById("display-info");
    
    if (displayButton.innerHTML == displayValue){
        infoDiv.className = " display-block";
        displayButton.innerHTML = hideValue;
        fillInfoTable();
    } else {
        infoDiv.className = " display-none";
        displayButton.innerHTML = displayValue;
    }
}

// Fill information table with images name and in which container should be put. 
function fillInfoTable() {
    var table = document.getElementById("info-table");
    var tableRows = '';
    var index = 0;
    
    tableRows += '<th>Trash</th><th>Container</th>';
    
    for (index = 0; index < trashElements.trashElementsSrs.length;index++){
        
        tableRows += '<tr> <td>'; 
        tableRows += trashElements.trashElementsSrs[index].name; 
        tableRows += ' </td><td>';
        tableRows += trashElements.trashElementsSrs[index].container;
        tableRows += '</td> </tr> ';
    }
    table.innerHTML = tableRows;
}
