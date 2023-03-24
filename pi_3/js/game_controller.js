const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];
var girar = false;
var temps = 1000;
var dif = 20;

function dificultat() {
	var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
	var options_data = JSON.parse(json);
	console.log(json);
	if (options_data.dificulty === "easy"){
		dif = 10;
		temps = 2000;
	}
	else if (options_data.dificulty === "normal"){
		dif = 20;
		temps = 1000;
	}
	else if (options_data.dificulty === "hard"){
		dif = 30;
		temps = 500;
	}
}
var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards: 2,
		bad_clicks: 0
	},
	created: function(){
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		var options_data = JSON.parse(json);
		this.num_cards = options_data.cards;
		this.username = sessionStorage.getItem("username","unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}
		setTimeout(() => {
			console.log("Delay for 1 second.");
			girar = true;
			for (var i = 0; i < this.items.length; i++){
				Vue.set(this.current_card, i, {done: false, texture: back});
			}
		},temps);
	},	
	methods: {
		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}
	},
	watch: {
		current_card: function(value){
			if(girar){
				if (value.texture === back) return;
				var front = null;
				var i_front = -1;
				for (var i = 0; i < this.current_card.length; i++){
					if (!this.current_card[i].done && this.current_card[i].texture !== back){
						if (front){
							if (front.texture === this.current_card[i].texture){
								front.done = this.current_card[i].done = true;
								this.num_cards--;
							}
							else{
								Vue.set(this.current_card, i, {done: false, texture: back});
								Vue.set(this.current_card, i_front, {done: false, texture: back});
								this.bad_clicks++;
								break;
							}
						}
						else{
							front = this.current_card[i];
							i_front = i;
						}
					}
				}
			}			
		}
	},
	computed: {
		score_text: function(){
			return 100 - this.bad_clicks * dif;
		}
	}
});
