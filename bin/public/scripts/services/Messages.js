(function() {
    function Messages($firebaseArray) {
        
        var ref = firebase.database().ref("messages");
        var messages = $firebaseArray(ref)


        return {
            getMessages: function(sessionId) {
                var sessionMessages = $firebaseArray(ref.orderByChild("session").equalTo(sessionId))
                sessionMessages.$loaded().then(function() {
                    console.log(sessionMessages)
                    return sessionMessages
                })

            },
            send: function(newMessage) {
                // Send to firebase
                messages.$add(newMessage).then(function() {})

            }
        }
    }
    angular
        .module('chatbot')
        .factory('Messages', ['$firebaseArray', Messages]);
})();