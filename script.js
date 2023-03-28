const score = document.getElementById("numero-score");
let player;
let oneBlockSize = 40; //larghezza di un blocco
let speedX, speedY;
let conta = 0;
let changeColor = 0;
let timer = 0;

//mappa dove 1 sono i muri e 0 sono gli spazi vuoti
var map = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
           [1,2,0,0,1,1,1,4,0,0,4,1,0,0,0,0,0,0,0,1],
           [1,0,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
           [1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,1],
           [1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,1],
           [1,0,0,0,1,1,1,0,0,0,1,0,0,1,1,1,0,0,0,1],
           [1,0,0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0,0,1],
           [1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,1,1],
           [1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,1,1],
           [1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,1],
           [1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,1],
           [1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,0,0,0,1],
           [1,0,0,0,0,1,0,0,0,1,1,0,0,1,1,1,1,1,0,1],
           [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

function startGame() {
    player = new MakePlayer(oneBlockSize, oneBlockSize, "yellow", 0, 0); //creo il player
    gameArea.start(); //avvio il gioco
    window.addEventListener("keydown", getKey); //evento che prende i tasti
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

function MakePlayer(width, height, color, x, y) {
    this.width = width; //assegno una larghezza
    this.height = height; //assegno l'altezza
    this.color = color; //assegno il colore
    this.x = x + oneBlockSize + this.width / 2; //assegno la poszione con la coordinata x
    this.y = y + oneBlockSize + this.height / 2; //assegno la poszione con la coordinata y
    this.update = function() {
        ctx = gameArea.context;
        ctx.save(); //salva le modifiche apportate
        ctx.translate(this.x, this.y); //trasla il player di x e y
        ctx.fillStyle = color; //gli attribuisce un colore
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height); //crea il player
        ctx.restore(); //ripristina la pagina prima del save()
    }
}

function updateGameArea() {
    gameArea.clear();
    player.update(); //aggiorna lo stato del player
    drawWall(); //crea tutti i muri
    getPlayerPosition(); //controlla la posizione del player sulla mappa
    gameOver();
}

function getKey(event){
    if(event.key == "ArrowRight"){ //verifica per la freccia destra
        for(let i = playerPosXMap; i < map[playerPosYMap].length; i++){
            if(map[playerPosYMap][playerPosXMap + 1] == 0){
                coinCount();
            }
            if((map[playerPosYMap][playerPosXMap + 1] != 1) && (map[playerPosYMap][playerPosXMap + 1] != 4) && (map[playerPosYMap][playerPosXMap + 1] != 5)){ //verifica che non ci siano muri
                map[playerPosYMap][playerPosXMap] = 3; //cambia la posizione nella mappa
                playerPosXMap++;
                map[playerPosYMap][playerPosXMap] = 2;
                player.x = ((playerPosXMap + 1) * oneBlockSize) - player.width / 2; //lo visualizza a schermo
            }
            
        }
    }
    if(event.key == "ArrowLeft"){ //verifica per la f reccia sinistra
        for(let i = (map[playerPosYMap].length) - 1; i > playerPosXMap; i--){
            if(map[playerPosYMap][playerPosXMap - 1] == 0){
                coinCount();
            }
            if((map[playerPosYMap][playerPosXMap - 1] != 1) && (map[playerPosYMap][playerPosXMap - 1] != 4) && (map[playerPosYMap][playerPosXMap - 1] != 5)){
                map[playerPosYMap][playerPosXMap] = 3;
                playerPosXMap--;
                map[playerPosYMap][playerPosXMap] = 2;
                player.x = (playerPosXMap * oneBlockSize) + player.width / 2;
            }
            
        }
    }
    if(event.key == "ArrowUp"){ //verifica per la freccia su
        for(let i = map.length - 1; i > playerPosYMap; i--){
            if(map[playerPosYMap - 1][playerPosXMap] == 0){
                coinCount();
            }
            if((map[playerPosYMap - 1][playerPosXMap] != 1) && (map[playerPosYMap - 1][playerPosXMap] != 4) && (map[playerPosYMap - 1][playerPosXMap] != 5)){
                map[playerPosYMap][playerPosXMap] = 3;
                playerPosYMap--;
                map[playerPosYMap][playerPosXMap] = 2;
                player.y = (playerPosYMap * oneBlockSize) + player.height / 2;
            }
            
        }
    }
    if(event.key == "ArrowDown"){ //verifica per la freccia giu
        for(let i = playerPosYMap; i < map.length; i++){
            if(map[playerPosYMap + 1][playerPosXMap] == 0){
                coinCount();
            }
            if((map[playerPosYMap + 1][playerPosXMap] != 1) && (map[playerPosYMap + 1][playerPosXMap] != 4) && (map[playerPosYMap + 1][playerPosXMap] != 5)){
                map[playerPosYMap][playerPosXMap] = 3;
                playerPosYMap++;
                map[playerPosYMap][playerPosXMap] = 2;
                player.y = ((playerPosYMap + 1) * oneBlockSize) - player.height / 2;
            }
        }
    }

    trigger=0;
    // console.log(map);
    //console.log(playerPosXMap, playerPosYMap);
}

function createRect(x, y, width, height, color){
    let ctxRect = gameArea.context; //prelevo il contesto 2d
    ctxRect.fillStyle = color; //attribuisco un colore
    ctxRect.fillRect(x, y, width, height); //lo metto nella pagina
}

function createCircle(x, y, color){
    let ctxCircle = gameArea.context; //prelevo il contesto
    ctxCircle.fillStyle = color; //attribuisco il colore
    ctxCircle.beginPath(); //lo creo
    ctxCircle.arc(x, y, 4, 0, 2 * Math.PI); //gli do le misure
    ctxCircle.fill(); //lo metto nella pagina
}

function drawWall(){
    for(let i = 0; i < map.length; i++){ //scorro tutto l'array
        for(let j = 0; j < map[0].length; j++){ //scorro di riga in riga
            if(map[i][j] == 1){
                createRect(j * oneBlockSize, i * oneBlockSize, oneBlockSize, oneBlockSize, "purple"); //creo il muro
            }
            if(map[i][j] == 4){
                createRect(j * oneBlockSize, i * oneBlockSize, oneBlockSize, oneBlockSize, "blue"); //creo la trappola
            }
            if(map[i][j] == 0){
                createCircle((j * oneBlockSize) + 20, (i * oneBlockSize ) + 20, "yellow"); //creo il cerchio
            }
            if(map[i][j] == 5){
                createRect(j * oneBlockSize, i * oneBlockSize, oneBlockSize, oneBlockSize, "red"); //creo la trappola
            }
        } 
    }
}

function getPlayerPosition(){
    for(let i = 0; i < map.length; i++){ //scorro la matrice
        for(let j = 0; j < map[i].length; j++){
            if(map[i][j] == 2){ // prelevo la posizione del player
                playerPosYMap = i;
                playerPosXMap = j;
                break;
            }
        }
    }
}

function coinCount(){
    conta++; //aumenta il numero di monete raccolte
    score.innerText = conta; //lo stampa a video
    // console.log(conta);
}

function gameOver(){

    if((map[playerPosYMap][playerPosXMap + 1]) == 4){
        let trapPosY = playerPosYMap;
        let trapPosX = playerPosXMap + 1;
        setTimeout(function(){map[trapPosY][trapPosX] = 5}, 750);
        setTimeout(function(){map[trapPosY][trapPosX] = 4}, 1250);
    }
    else if((map[playerPosYMap][playerPosXMap - 1]) == 4){
        let trapPosY = playerPosYMap;
        let trapPosX = playerPosXMap - 1;
        setTimeout(function(){map[trapPosY][trapPosX] = 5}, 750);
        setTimeout(function(){map[trapPosY][trapPosX] = 4}, 1250);
    }
    else if((map[playerPosYMap + 1][playerPosXMap]) == 4){
        let trapPosY = playerPosYMap + 1;
        let trapPosX = playerPosXMap;
        setTimeout(function(){map[trapPosY][trapPosX] = 5}, 750);
        setTimeout(function(){map[trapPosY][trapPosX] = 4}, 1250);
    }
    else if((map[playerPosYMap - 1][playerPosXMap]) == 4){
        let trapPosY = playerPosYMap - 1;
        let trapPosX = playerPosXMap;
        setTimeout(function(){map[trapPosY][trapPosX] = 5}, 750);
        setTimeout(function(){map[trapPosY][trapPosX] = 4}, 1250);
    }

    if((map[playerPosYMap][playerPosXMap + 1]) == 5 || (map[playerPosYMap][playerPosXMap - 1]) == 5 || (map[playerPosYMap + 1][playerPosXMap]) == 5 || (map[playerPosYMap - 1][playerPosXMap]) == 5){
        timer++;
        if(timer == 2)
        {
            window.removeEventListener("keydown", getKey);
            alert("GAME OVER!!, PRESS TO RESTART");
            window.location.reload();
        }
    }
}