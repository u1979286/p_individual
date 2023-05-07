function start_game(){
	
	loadpage("./html/modes.html");
}

function play_game(){
	
	loadpage("./game.html");
	console.log();
}

function phaser_game(){
	loadpage("./html/phasergame.html");
}

function exit (){
	if (name != ""){
		alert("Leaving " + name + "'s game");
	}
	name = "";
}

function options(){
	loadpage("./html/options.html");
}

function load(){
	loadpage("./html/load.html");
}

function mode_1(){
	name = prompt("User name");
	
	sessionStorage.setItem("username", name);
	loadpage("./mode1.html")
}

function mode_2(){
	name = prompt("User name");
	
	sessionStorage.setItem("username", name);
	loadpage("./mode2.html")
}
