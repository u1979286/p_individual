var modes = new Vue({
    el: "#modes",
    data: {},

    created: function () {},

    methods: {
		mode_1: function(){
			name = prompt("User name");
			sessionStorage.setItem("username", name);
			window.location.href = "./mode1.html"
		},

		mode_2: function(){
			name = prompt("User name");
			sessionStorage.setItem("username", name);
			window.location.href = "./joc.html"
		}
    }
});
