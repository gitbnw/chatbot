(function() {
    function Messages($firebaseArray, $firebaseObject) {

        var ref = firebase.database().ref("data")
        var data = $firebaseArray(ref);



        return {
            allMessages: $firebaseArray(ref),

            getSessionMessages: function(sessionId) {
                var sessionRef = ref.orderByChild("data").equalTo(sessionId)
                var messagesRef = sessionRef.ref("messages")
                var sessionMessages = $firebaseArray(messagesRef.orderByChild("session").equalTo(sessionId))
                return sessionMessages
            },
             getLastSessionMessage: function(sessionId) {
                // var query = ref.orderByChild("sessionId").equalTo(sessionId);
                // console.log($firebaseArray(query))
                // return $firebaseObject(query);

            },           
            
            send: function(newMessage, session) {
                // Send to firebase
                var messageRef = data.$ref().child(session + "/messages/" + Date.now() +"/");
                return messageRef.set(newMessage) //return Promise
            }
        }
    }
    angular
        .module('chatbot')
        .factory('Messages', ['$firebaseArray', '$firebaseObject', Messages]);
})();