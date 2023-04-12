const limit = Math.tan(45 * 1.5 / 180 * Math.PI); //touch
const gestureZone = document.body; //touch
const score = document.getElementById("numero-score");
const wallImage = new Image(); //crea una variabile contenente un immagine
const trap4Image = new Image();
const upTrap = new Image();
const rightTrap = new Image();
const downTrap = new Image();
const leftTrap = new Image();
const exitBox = new Image();
let map = JSON.parse(window.localStorage.getItem('map')); //prende la mappa dallo storage locale
let stageLevel = window.localStorage.getItem('stage-level');
let playerRotation = "down_player";
let playerSprites = new Image(); //creiamo l'immagine per il player
let starSprites = new Image();
let coinSprites = new Image();
let player;
let oneBlockSize = 40; //larghezza di un blocco
let starUp = 0;
let changeColor = 0;
let timer = 0;
let pageWidth = window.innerWidth || document.body.clientWidth; //touch
let treshold = Math.max(1,Math.floor(0.01 * (pageWidth))); //touch
let touchstartX = 0; //touch
let touchstartY = 0; //touch
let touchendX = 0; //touch
let touchendY = 0; //touch
let playerFrames = 0;
let exitFrames = 0;
let starFrames = 0;
let coinFrames = 0;
let delay = false //delay del movimento del player

document.getElementById("stage-level").innerHTML = stageLevel;
wallImage.src = 'Images/Altro/muro.png'; //trova l'immagine
trap4Image.src = 'Images/Traps/trap.png';
upTrap.src = 'Images/Traps/upTrap.png';
rightTrap.src = 'Images/Traps/rightTrap.png';
downTrap.src = 'Images/Traps/downTrap.png';
leftTrap.src = 'Images/Traps/leftTrap.png';
exitBox.src = 'Images/Altro/exit'+exitFrames+'.png'
playerSprites.src = 'Images/Player/' + playerRotation + '9.png';
starSprites.src = 'Images/Altro/star0.png';
coinSprites.src = 'Images/Altro/coin0.png';

function startGame() {
    getPlayerPosition();
    player = new MakePlayer(oneBlockSize, oneBlockSize, playerPosXMap, playerPosYMap); //creo il player
    gameArea.start() //avvio il gioco
    window.addEventListener("keydown", getKey); //evento che prende i tasti
    gestureZone.addEventListener('touchstart', function(event) { //evento che prende il touch
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }, false);
    
    gestureZone.addEventListener('touchend', function(event) { //evento che prende il touch
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture(event);
    }, false);
    updateTextures();
}

let gameArea = {
    canvas : document.createElement("canvas"), //crea un elemento canvas
    start : function() {
        this.canvas.width = (map[0].length) * oneBlockSize; //attribuisce larghezza al canvas
        this.canvas.height = (map.length) * oneBlockSize; //attribuisce altezza al canvas
        this.canvas.id = "map"; //attribuisce l'id
        this.context = this.canvas.getContext("2d"); // gli da il modo di lavorare, in questo caso 2d
        document.getElementById("map-container").appendChild(this.canvas); //lo inserisco nella pagina
        this.interval = setInterval(updateGameArea, 20); //aggiorna la mappa
    },
    stop : function() {
        clearInterval(this.interval); //per stoppare la funzione
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); //per eliminare il vecchio player
    }
}

function MakePlayer(width, height, x, y) {
    this.width = width; //assegno una larghezza
    this.height = height; //assegno l'altezza
    this.x = x * oneBlockSize + this.width / 2; //assegno la poszione con la coordinata x
    this.y = y * oneBlockSize + this.height / 2; //assegno la poszione con la coordinata y
    this.update = function() {
        ctx = gameArea.context;
        ctx.save(); //salva le modifiche apportate
        ctx.translate(this.x, this.y); //trasla il player di x e y
        ctx.drawImage(playerSprites, this.width / -2, this.height / -2);
        ctx.restore(); //ripristina la pagina prima del save()
    }
}

function updateGameArea() {
    gameArea.clear();
    player.update(); //aggiorna lo stato del player
    drawWall(); //crea e aggiorna tutti i muri
    getPlayerPosition(); //controlla la posizione del player sulla mappa
    activateTrap();
}

function getKey(event){
    if(delay==false)
    {
        if(event.key == "ArrowRight"){ //verifica per la freccia destra
            playerRotation = "right_player";
            playerSprites.src = "Images/Player/"+ playerRotation + playerFrames + ".png"; //cambia l'immagine
            delay = true; //metto un delay per i tasti
            setTimeout(function(){delay = false}, 70); //dopo 70 millisecondi il delay sparisce e quindi si possono riutilizzare i tasti
            for(let i = 0; i < map[0].length; i++){//verifico collisioni vaire
                if(map[playerPosYMap][playerPosXMap + 1] == "S"){ //verifica la collisione con le monete
                    starCount();
                }
                if((map[playerPosYMap][playerPosXMap + 1] != "W") && (map[playerPosYMap][playerPosXMap + 1] != "T0") && (map[playerPosYMap][playerPosXMap + 1] != "END")){ //verifica che non ci siano muri
                    map[playerPosYMap][playerPosXMap] = "E"; //cambia la posizione nella mappa
                    playerPosXMap++;
                    activateTrap();
                    gameOver();
                    map[playerPosYMap][playerPosXMap] = "P";
                    player.x = ((playerPosXMap + 1) * oneBlockSize) - player.width / 2; //lo visualizza a schermo
                }
            }
        }
        if(event.key == "ArrowLeft"){ //verifica per la f reccia sinistra
            playerRotation = "left_player";
            playerSprites.src = "Images/Player/"+ playerRotation + playerFrames + ".png";
            delay = true;
            setTimeout(function(){delay = false}, 70);
            for(let i = 0; i < map[0].length; i++){
                if(map[playerPosYMap][playerPosXMap - 1] == "S"){
                    starCount();
                }
                if((map[playerPosYMap][playerPosXMap - 1] != "W") && (map[playerPosYMap][playerPosXMap - 1] != "T0") && (map[playerPosYMap - 1][playerPosXMap] != "END")){
                    map[playerPosYMap][playerPosXMap] = "E";
                    playerPosXMap--;
                    activateTrap();
                    gameOver();
                    map[playerPosYMap][playerPosXMap] = "P";
                    player.x = (playerPosXMap * oneBlockSize) + player.width / 2;
                }
                
            }
        }
        if(event.key == "ArrowUp"){ //verifica per la freccia su
            playerRotation = "up_player";
            playerSprites.src = "Images/Player/"+ playerRotation + playerFrames + ".png";
            delay = true;
            setTimeout(function(){delay = false}, 70);
            for(let i = 0; i < map.length; i++){
                if(map[playerPosYMap - 1][playerPosXMap] == "S"){
                    starCount();
                }
                if((map[playerPosYMap - 1][playerPosXMap] != "W") && (map[playerPosYMap - 1][playerPosXMap] != "T0") && (map[playerPosYMap - 1][playerPosXMap] != "END")){
                    map[playerPosYMap][playerPosXMap] = "E";
                    playerPosYMap--;
                    activateTrap();
                    gameOver();
                    map[playerPosYMap][playerPosXMap] = "P";
                    player.y = (playerPosYMap * oneBlockSize) + player.height / 2;
                }
            }
        }
        if(event.key == "ArrowDown"){ //verifica per la freccia giu
            playerRotation = "down_player";
            playerSprites.src = "Images/Player/"+ playerRotation + playerFrames + ".png";
            delay = true;
            setTimeout(function(){delay = false}, 70);
            for(let i = 0; i < map.length; i++){
                if(map[playerPosYMap + 1][playerPosXMap] == "S"){
                    starCount();
                }
                if((map[playerPosYMap + 1][playerPosXMap] != "W") && (map[playerPosYMap + 1][playerPosXMap] != "T0") && (map[playerPosYMap - 1][playerPosXMap] != "END")){
                    map[playerPosYMap][playerPosXMap] = "E";
                    playerPosYMap++;
                    activateTrap();
                    gameOver();
                    map[playerPosYMap][playerPosXMap] = "P";
                    player.y = ((playerPosYMap + 1) * oneBlockSize) - player.height / 2;
                }
            }
        }
        
        trigger=0;
        console.log(map);
    }
}

function handleGesture(e) {
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
        if(delay==false)
        {
            if (yx <= limit) {
                if (x < 0) {
                    playerRotation = "left_player";
                    playerSprites.src = "Images/Player/"+ playerRotation + playerFrames + ".png";
                    delay = true;
                    setTimeout(function(){delay = false}, 70);
                    for(let i = 0; i < map[0].length; i++){
                        if(map[playerPosYMap][playerPosXMap - 1] == "S"){
                            starCount();
                        }
                        if((map[playerPosYMap][playerPosXMap - 1] != "W") && (map[playerPosYMap][playerPosXMap - 1] != "T0") && (map[playerPosYMap - 1][playerPosXMap] != "END")){
                            map[playerPosYMap][playerPosXMap] = "E";
                            playerPosXMap--;
                            activateTrap();
                            gameOver();
                            map[playerPosYMap][playerPosXMap] = "P";
                            player.x = (playerPosXMap * oneBlockSize) + player.width / 2;
                        }
                        
                    }
                }
                else{
                    playerRotation = "right_player";
                    playerSprites.src = "Images/Player/"+ playerRotation + playerFrames + ".png"; //cambia l'immagine
                    delay = true; //metto un delay per i tasti
                    setTimeout(function(){delay = false}, 70); //dopo 70 millisecondi il delay sparisce e quindi si possono riutilizzare i tasti
                    for(let i = 0; i < map[0].length; i++){//verifico collisioni vaire
                        if(map[playerPosYMap][playerPosXMap + 1] == "S"){ //verifica la collisione con le monete
                            starCount();
                        }
                        if((map[playerPosYMap][playerPosXMap + 1] != "W") && (map[playerPosYMap][playerPosXMap + 1] != "T0") && (map[playerPosYMap][playerPosXMap + 1] != "END")){ //verifica che non ci siano muri
                            map[playerPosYMap][playerPosXMap] = "E"; //cambia la posizione nella mappa
                            playerPosXMap++;
                            activateTrap();
                            gameOver();
                            map[playerPosYMap][playerPosXMap] = "P";
                            player.x = ((playerPosXMap + 1) * oneBlockSize) - player.width / 2; //lo visualizza a schermo
                        }
                    }
                }
            }
        }
        if(delay==false)
        {
            if (xy <= limit) {
                if (y < 0) {
                    playerRotation = "up_player";
                    playerSprites.src = "Images/Player/"+ playerRotation + playerFrames + ".png";
                    delay = true;
                    setTimeout(function(){delay = false}, 70);
                    for(let i = 0; i < map.length; i++){
                        if(map[playerPosYMap - 1][playerPosXMap] == "S"){
                            starCount();
                        }
                        if((map[playerPosYMap - 1][playerPosXMap] != "W") && (map[playerPosYMap - 1][playerPosXMap] != "T0") && (map[playerPosYMap - 1][playerPosXMap] != "END")){
                            map[playerPosYMap][playerPosXMap] = "E";
                            playerPosYMap--;
                            activateTrap();
                            gameOver();
                            map[playerPosYMap][playerPosXMap] = "P";
                            player.y = (playerPosYMap * oneBlockSize) + player.height / 2;
                        }
                    }
                }
                else {
                    playerRotation = "down_player";
                    playerSprites.src = "Images/Player/"+ playerRotation + playerFrames + ".png";
                    delay = true;
                    setTimeout(function(){delay = false}, 70);
                    for(let i = 0; i < map.length; i++){
                        if(map[playerPosYMap + 1][playerPosXMap] == "S"){
                            starCount();
                        }
                        if((map[playerPosYMap + 1][playerPosXMap] != "W") && (map[playerPosYMap + 1][playerPosXMap] != "T0") && (map[playerPosYMap - 1][playerPosXMap] != "END")){
                            map[playerPosYMap][playerPosXMap] = "E";
                            playerPosYMap++;
                            activateTrap();
                            gameOver();
                            map[playerPosYMap][playerPosXMap] = "P";
                            player.y = ((playerPosYMap + 1) * oneBlockSize) - player.height / 2;
                        }
                    }
                }
            }
        }
    }
}

function drawWall(){
    let ctxRect = gameArea.context; //prelevo il contesto 2d
    for(let i = 0; i < map.length; i++){ //scorro tutto l'array
        for(let j = 0; j < map[0].length; j++){ //scorro di riga in riga
            if(map[i][j] == "W"){
                ctxRect.drawImage(wallImage, j * oneBlockSize, i * oneBlockSize); //creo il muro
            }
            if(map[i][j] == "C"){
                ctxRect.drawImage(coinSprites, j * oneBlockSize, i * oneBlockSize); //creo la monetina
            }
            if(map[i][j] == "S"){
                ctxRect.drawImage(starSprites, j * oneBlockSize, i * oneBlockSize); //creo la stella  
            }
            if(map[i][j] == "T0"){
                ctxRect.drawImage(trap4Image, j * oneBlockSize, i * oneBlockSize); //creo la trappola spenta
            }
            if(map[i][j] == "TU"){
                ctxRect.drawImage(upTrap, j * oneBlockSize, i * oneBlockSize); //creo la trappola accesa
            }
            if(map[i][j] == "TR"){
                ctxRect.drawImage(rightTrap, j * oneBlockSize, i * oneBlockSize); //creo la trappola accesa
            }
            if(map[i][j] == "TD"){
                ctxRect.drawImage(downTrap, j * oneBlockSize, i * oneBlockSize); //creo la trappola accesa
            }
            if(map[i][j] == "TL"){
                ctxRect.drawImage(leftTrap, j * oneBlockSize, i * oneBlockSize); //creo la trappola accesa
            }
            if(map[i][j] == "END"){
                ctxRect.drawImage(exitBox, j * oneBlockSize, i * oneBlockSize); //creo la endbox
            }
        } 
    }
}

function getPlayerPosition(){
    for(let i = 0; i < map.length; i++){ //scorro la matrice
        for(let j = 0; j < map[i].length; j++){
            if(map[i][j] == "P"){ // prelevo la posizione del player
                playerPosYMap = i;
                playerPosXMap = j;
                break;
            }
        }
    }
}

function starCount(){
    starUp++; //aumenta il numero di monete raccolte
    score.innerText = starUp; //lo stampa a video
}

function activateTrap(){
    if((map[playerPosYMap][playerPosXMap + 1]) == "T0"){
        let trapPosY = playerPosYMap; //prende la posizione y della trappola
        let trapPosX = playerPosXMap + 1; //prende la posizione x della trappola
        let down = map[trapPosY + 1][trapPosX];
        let up = map[trapPosY - 1][trapPosX];
        let right = map[trapPosY][trapPosX + 1];
        let left = map[trapPosY][trapPosX - 1];
        if(down == "P"){
            down = "E";
        }
        else if(up == "P"){
            up = "E";
        }
        else if(right == "P"){
            right = "E";
        }
        else{
            left = "E";
        }
        setTimeout(function(){
            map[trapPosY][trapPosX - 1] = "TL";
        }, 550); //attiva la trappola
        setTimeout(function(){
            map[trapPosY][trapPosX - 1] = left;
        }, 1550); //attiva la trappola
    }
    if((map[playerPosYMap][playerPosXMap - 1]) == "T0"){
        let trapPosY = playerPosYMap;
        let trapPosX = playerPosXMap - 1;
        let down = map[trapPosY + 1][trapPosX];
        let up = map[trapPosY - 1][trapPosX];
        let right = map[trapPosY][trapPosX + 1];
        let left = map[trapPosY][trapPosX - 1];
        if(down == "P"){
            down = "E";
        }
        else if(up == "P"){
            up = "E";
        }
        else if(right == "P"){
            right = "E";
        }
        else{
            left = "E";
        }
        setTimeout(function(){
            map[trapPosY][trapPosX + 1] = "TR";;
        }, 550); //attiva la trappola
        setTimeout(function(){
            map[trapPosY][trapPosX + 1] = right;
        }, 1550); //attiva la trappola
    }
    if((map[playerPosYMap + 1][playerPosXMap]) == "T0"){
        let trapPosY = playerPosYMap + 1;
        let trapPosX = playerPosXMap;
        let down = map[trapPosY + 1][trapPosX];
        let up = map[trapPosY - 1][trapPosX];
        let right = map[trapPosY][trapPosX + 1];
        let left = map[trapPosY][trapPosX - 1];
        if(down == "P"){
            down = "E";
        }
        else if(up == "P"){
            up = "E";
        }
        else if(right == "P"){
            right = "E";
        }
        else{
            left = "E";
        }
        setTimeout(function(){
            map[trapPosY - 1][trapPosX] = up;
        }, 550); //attiva la trappola
        setTimeout(function(){
            map[trapPosY - 1][trapPosX] = up;
        }, 1550); //attiva la trappola
    }
    if((map[playerPosYMap - 1][playerPosXMap]) == "T0"){
        let trapPosY = playerPosYMap - 1;
        let trapPosX = playerPosXMap;
        let down = map[trapPosY + 1][trapPosX];
        let up = map[trapPosY - 1][trapPosX];
        let right = map[trapPosY][trapPosX + 1];
        let left = map[trapPosY][trapPosX - 1];
        if(down == "P"){
            down = "E";
        }
        else if(up == "P"){
            up = "E";
        }
        else if(right == "P"){
            right = "E";
        }
        else{
            left = "E";
        }
        setTimeout(function(){
            map[trapPosY + 1][trapPosX] = "TD";
        }, 550); //attiva la trappola
        setTimeout(function(){
            map[trapPosY + 1][trapPosX] = down;
        }, 1550); //attiva la trappola
    }
    gameOver();
}

function gameOver() {
    //se sei sopra ad una trappola spina...
    if((map[playerPosYMap][playerPosXMap]) == "TL" || (map[playerPosYMap][playerPosXMap]) == "TR" || (map[playerPosYMap][playerPosXMap]) == "TU" || (map[playerPosYMap][playerPosXMap]) == "TD"){
        timer++;
        if(timer == 2)
        {
            window.removeEventListener("keydown", getKey); //disattiva pressione tasti
            alert("GAME OVER!!, PRESS TO RESTART"); //allert morte
            window.location.reload(); //ricarica pagina
            timer = 0;
        }
    }
}

function updateTextures(){ //aggiorna tutte le texture
    setInterval(function(){ //ogni tot millisecondi cambia l'immagine che si trova dentro la cartella
        playerSprites.src = "Images/Player/"+ playerRotation + playerFrames + ".png"; //prelevo l'immagine
        playerFrames++; //aumento per il l'immagine successiva
        if(playerFrames == 10) //se arriva alla fine delle immagini reincomincia l'animazione da capo
            playerFrames = 0;
    }, 250);
    setInterval(function(){
        starSprites.src = 'Images/Altro/star' + starFrames + '.png';
        starFrames++;
        if(starFrames == 2){
            starFrames = 0;
        }
    }, 250);
    setInterval(function(){
        coinSprites.src = 'Images/Altro/coin' + coinFrames + '.png';
        coinFrames++;
        if(coinFrames == 2){
            coinFrames = 0;
        }
    }, 250);
    setInterval(function(){
        exitBox.src = 'Images/Altro/exit'+exitFrames+'.png';
        exitFrames++;
        if(exitFrames == 4){
            exitFrames = 0;
        }
    }, 250);
}