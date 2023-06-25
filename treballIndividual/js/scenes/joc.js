class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.username = '';
        this.cards = null;
        this.firstClick = null;
        this.score = 100;
        this.correct = 0;
        this.temps = 2100;
        this.dif = 20;
        this.items = [];
        this.current_card = [];
        this.options_data = JSON.parse(localStorage.getItem("config"))||{cards:2,dificulty:"hard"};
        this.level = 1;
        this.nombre_cartes = 2;
        this.dificultatNivell = this.options_data.dificulty;
        this.comprovarDif = true;
        this.puntuacio = 0;
    }

    preload() {
        this.username = sessionStorage.getItem("username","unknown");
        this.load.image('back', '../resources/back.png');
        this.load.image('cb', '../resources/cb.png');
        this.load.image('co', '../resources/co.png');
        this.load.image('sb', '../resources/sb.png');
        this.load.image('so', '../resources/so.png');
        this.load.image('tb', '../resources/tb.png');
        this.load.image('to', '../resources/to.png');
        this.items = ['cb','co','sb','so','tb','to']

        if (sessionStorage.idPartida && localStorage.partides){
			let arraypartides = JSON.parse(localStorage.partides);
			if (sessionStorage.idPartida < arraypartides.length){
				this.l_partida = arraypartides[sessionStorage.idPartida];
				sessionStorage.idPartida=null;
			}
				
		}
    }

    dificultat() {
        if(this.comprovarDif){
            if (this.dificultatNivell === "easy"){
                this.dif = 10;
            }
            else if (this.dificultatNivell === "normal"){
                this.dif = 20;
            }
            else if (this.dificultatNivell === "hard"){
                this.dif = 30;
            }
            this.comprovarDif = false;
        }
    }

    mostrar(vectorCartes){;
        this.time.delayedCall(0, () => {
            if (this.cards !== null) {
                this.cards.children.iterate((card, index) => {
                    card.setTexture(vectorCartes[index]); // Assigna la textura de la carta corresponent
                });
            }
        });
    
        this.time.delayedCall(this.temps, () => {
            if (this.cards !== null) {
                this.cards.children.iterate((card) => {
                    card.setTexture('back');
                });
            }
        });
    }

    actualitzarNivell(){
        if(this.temps > 300) this.temps -= 100;
        if(this.dif < 50) this.dif += 5;

        console.log(this.dif);
        console.log(this.temps);
    }

    nextLevel(){
        if (this.nombre_cartes < 4) this.nombre_cartes += 1; 
        else this.nombre_cartes = 2;
        this.level += 1;
        this.puntuacio += 10;
        this.scene.restart({level:this.level});
        this.actualitzarNivell();
        console.log(this.dificultatNivell);
    }

    funcScores() {
        let scores = [];
        if (localStorage.getItem("scores")) {
            scores = JSON.parse(localStorage.getItem("scores"));
        }
    
        let punt = { id: this.username, nivell: this.level, punts: this.puntuacio };
    
        if (scores.length === 0 || scores.length < 10) {
            scores.push(punt);
        }
        else {
            let lowestScoreIndex = -1;
            let lowestScore = Infinity;
            for (let i = 0; i < scores.length; i++) {
                if (scores[i].punts < lowestScore) {
                    lowestScore = scores[i].punts;
                    lowestScoreIndex = i;
                }
            }
            if (this.puntuacio > lowestScore) {
                scores.splice(lowestScoreIndex, 1, punt);
            }
        }
    
        //Ordenar
        scores.sort((a, b) => b.punts - a.punts);
    
        if (scores.length > 10) {
            scores = scores.slice(0, 10);
        }
    
        localStorage.setItem("scores", JSON.stringify(scores));
        for (let g = 0; g < scores.length; g++) console.log(scores[g]);
    }    
    

    create() {
        this.correct = 0;
        let arraycards = [];
        this.dificultat();
        if (this.l_partida){
			arraycards = this.l_partida.cartes;
			this.username = this.l_partida.id;
			this.score = this.l_partida.score;
			this.options_data = this.l_partida.options_data;
			this.correct = this.l_partida.correct;
		}
		else{
			arraycards=this.items.slice();
			arraycards = Phaser.Utils.Array.Shuffle(arraycards);
			arraycards = arraycards.slice(0,this.nombre_cartes);
			arraycards = arraycards.concat(arraycards);
			arraycards=Phaser.Utils.Array.Shuffle(arraycards);
		}

        var mig = 400;
        var pos = mig - (this.nombre_cartes * 100) + 50;
		this.cards = this.physics.add.staticGroup();
		for (var a = 0; a<arraycards.length; a++){
			this.add.image(pos,300,arraycards[a]);
            this.cards.create(pos,300,'back');
			pos += 100;
		}

        this.mostrar(arraycards);
        var segonaCarta = false;
        this.cameras.main.setBackgroundColor(0xBFFCFF);

        let i = 0;
        this.time.delayedCall(this.temps, () => {
            this.cards.children.iterate((card) => {
                card.card_id = arraycards[i];
                i++;
                card.setInteractive();
                card.on('pointerup', () => {
                    if (!segonaCarta){
                        if (this.firstClick) {
                            if (this.firstClick.card_id !== card.card_id) {
                                this.score -= this.dif;
                                segonaCarta = true;
                                var aux = this.firstClick;
                                setTimeout(() => {
                                    aux.enableBody(false, 0, 0, true, true);
                                    card.enableBody(false, 0, 0, true, true);
                                    segonaCarta = false;
                                }, this.temps);
                                if (this.score <= 0) {
                                    this.funcScores();
                                    alert("Game Over");
                                    loadpage("../");
                                }
                            } else {
                                this.correct++;
                                if (this.correct >= this.nombre_cartes) {
                                    this.nextLevel();
                                }
                            }
                            this.firstClick = null;
                        } else {
                            this.firstClick = card;
                        }
                        card.disableBody(true,true);
                    }
                }, card);
            });
        });

    }

    update() {}
}
