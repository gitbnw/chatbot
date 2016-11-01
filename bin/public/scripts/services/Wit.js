// Converse with WitAI by post requests handled on server
(function() {
    function Wit($http) {

        return {
            converse: function(witData, context = {}){
              return $http({
                 url: "converse/" + witData.type, //action or stop
                 method: "POST",
                 params: witData,
                 data: context
             })                  
            },
            message: function(witData){
              return $http({
                 url: "message",
                 method: "GET",
                 params: witData
             })   
                
            }
            
        }
        }
    angular
        .module('chatbot')
        .factory('Wit', ['$http', Wit]);
})();