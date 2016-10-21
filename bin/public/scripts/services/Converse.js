// Converse with WitAI by post requests handled on server
(function() {
    function Converse($http) {

        return {
            send: function(witData){
              return $http({
                 url: "converse/" + witData.type, //msg or action
                 method: "POST",
                 params: witData
             })                  
            }            
            
        }
        }
    angular
        .module('chatbot')
        .factory('Converse', ['$http', Converse]);
})();