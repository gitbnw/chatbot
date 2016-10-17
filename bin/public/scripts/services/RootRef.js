(function() {
    function RootRef ($firebaseArray, $firebaseObject) {

    }
    angular
        .module('chatbot')
        .service('RootRef', ['$firebaseArray', '$firebaseObject', RootRef()]);
})();