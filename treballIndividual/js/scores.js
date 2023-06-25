var puntuacions = function(){
    var vue_instance = new Vue ({
        el: "#scores_id",
        data: {
            scores: []
        },
        created: function(){
            let vectorScores = [];
            if(localStorage.getItem("scores")){
                vectorScores = JSON.parse(localStorage.getItem("scores"));
                if (!Array.isArray(vectorScores))vectorScores=[];
            }
            this.scores = vectorScores;
        },
        methods:{
            exit: function(){
                window.location.href = "../";
            }
        },
    })
    return {};
}();
