(function() {
    function Auth($firebaseAuth) {
        return $firebaseAuth();
    }
    angular
        .module('chatbot')
        .factory('Auth', ['$firebaseAuth', Auth]);
})();