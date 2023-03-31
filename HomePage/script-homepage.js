window.addEventListener("keydown", (ev)=> {
    
    let immagini = document.getElementById("immagini");

    //console.log(ev);

    if(ev.key == "Enter")
    {   
        immagini.style.display = "none";
        document.getElementById("levels").style.display = "flex";
        document.getElementById("bottoni_livelli").style.display = "flex";
        document.getElementsByTagName("body")[0].style.backgroundImage = "none";
    }
});

//mappa dove W(Wall) sono i muri, E(Empty) sono gli spazi vuoti, C(Coin) le monete, P(player) il player, T0(Trap Off) per la trappola e T1(Trap On)
function levelOne(){
    map = [
        ["E","E","E","E","E","E","E","E","E","W","W","W","E","E","E","E"],
        ["E","E","E","E","E","E","E","E","E","W","END","W","E","E","E","E"],
        ["E","E","E","E","E","E","E","E","E","W","C","W","E","E","E","E"],
        ["E","E","E","E","E","E","E","E","E","W","C","W","E","E","E","E"],
        ["E","E","E","E","E","E","E","E","E","W","C","W","E","E","E","E"],
        ["E","E","E","E","E","E","W","W","W","W","C","W","E","E","E","E"],
        ["E","E","E","E","E","E","W","S","C","C","C","W","E","E","E","E"],
        ["E","E","E","E","E","E","W","C","E","W","W","W","E","E","E","E"],
        ["E","E","E","E","E","E","W","C","E","W","W","E","E","E","E","E"],
        ["E","E","E","E","E","E","W","C","C","C","W","E","E","E","E","E"],
        ["E","E","E","E","E","E","W","W","W","C","W","E","E","E","E","E"],
        ["E","E","E","E","E","E","E","E","W","C","W","E","E","E","E","E"],
        ["E","E","E","E","E","E","W","W","W","C","W","W","W","E","E","E"],
        ["E","E","E","E","E","E","W","C","C","C","C","C","W","E","E","E"],
        ["E","E","E","E","E","E","W","C","E","C","W","C","W","E","E","E"],
        ["E","E","E","E","E","E","W","C","E","C","W","C","W","E","E","E"],
        ["E","E","E","E","E","E","W","C","C","S","W","C","W","E","E","E"],
        ["E","E","E","W","W","W","W","W","W","W","W","C","W","E","E","E"],
        ["E","E","E","W","C","C","C","C","C","W","W","C","W","E","E","E"],
        ["E","E","E","W","C","W","W","W","C","W","W","C","W","E","E","E"],
        ["E","E","E","W","C","W","E","W","C","C","C","C","W","E","E","E"],
        ["E","E","E","W","C","W","E","W","W","W","W","W","W","E","E","E"],
        ["W","W","W","W","C","W","W","W","W","W","E","W","W","W","W","W"],
        ["W","C","C","C","C","C","C","C","C","W","W","W","S","C","C","W"],
        ["W","C","E","E","C","W","W","W","C","C","C","C","C","E","C","W"],
        ["W","C","E","E","C","W","E","W","W","W","W","W","W","E","C","W"],
        ["W","C","C","C","C","W","E","E","E","W","E","E","E","E","C","W"],
        ["W","W","W","W","W","W","E","E","E","W","E","E","E","E","C","W"],
        ["E","E","E","E","E","E","E","E","E","W","E","E","P","E","C","W"],
        ["E","E","E","E","E","E","E","E","E","W","W","W","W","W","W","W"]
    ];
    window.localStorage.setItem('map', JSON.stringify(map)); //deposita la mappa nello storage locale
    window.localStorage.setItem('stage-level',  "1");//cambi il numero del livello
    window.location.href = "../game.html"; //reindirizza l'utente nel livello selezionato
}

function levelTwo(){
    map = [
        ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"],
        ["W","E","E","E","E","W","W","T0","E","E","T0","W","E","E","E","E","E","E","E","W"],
        ["W","E","E","E","E","E","W","E","E","E","E","W","E","E","E","E","E","E","E","W"],
        ["W","E","E","E","E","E","W","E","E","E","E","E","E","W","W","W","E","E","E","W"],
        ["W","E","E","E","E","E","W","E","E","E","E","E","E","W","W","W","E","E","E","W"],
        ["T0","E","E","E","E","T0","W","E","E","E","W","E","E","W","W","W","E","E","E","W"],
        ["W","E","E","P","E","E","W","E","E","W","W","E","E","W","W","W","E","E","E","W"],
        ["W","E","E","E","E","E","W","E","E","E","E","E","E","W","W","W","E","E","W","W"],
        ["W","E","E","E","E","E","W","E","E","E","E","E","E","W","W","W","E","E","W","W"],
        ["W","E","E","E","E","E","W","E","E","E","E","E","E","W","W","W","E","E","E","W"],
        ["W","E","E","E","W","W","W","E","E","E","E","E","E","W","W","W","E","E","E","W"],
        ["W","E","E","E","E","E","E","E","E","W","W","E","E","W","W","W","E","E","E","W"],
        ["W","E","E","E","E","W","E","E","E","W","W","E","E","W","W","W","W","W","E","W"],
        ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"]
    ];
    window.localStorage.setItem('map', JSON.stringify(map));
    window.localStorage.setItem('stage-level', "2");//cambi il numero del livello
    window.location.href = "../game.html";
}