var menu = new Vue({
    el: "#menu",
    data: {},

    created: function () {},

    methods: {
        phaserGame: function () {
            window.location.href = "./html/modes.html";
        },
        scores: function () {
            window.location.href = "./html/scores.html";
        },
        loadGame: function () {
            window.location.href = "./html/load.html";
        },
        options: function () {
            window.location.href = "./html/optionsJoc.html";
        },
        exit: function () {
			if (name != ""){
				alert("Leaving " + name + "'s game");
			}
			name = "";
            window.location.href = "../";
        }
    }
});
