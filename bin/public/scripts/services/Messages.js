(function() {
    function Messages($firebaseArray, $firebaseObject) {
        
        var ref = firebase.database().ref("messages")

        var sessionsRef = firebase.database().ref().child("sessions"); 

        return {
            allMessages: $firebaseArray(ref),

            getSessionMessages: function(sessionId) {
                // var query = ref.orderByChild("session").equalTo(sessionId);
                // console.log($firebaseArray(query))
                // return $firebaseArray(query)
            },
             getLastSessionMessage: function(sessionId) {
                // var query = ref.orderByChild("sessionId").equalTo(sessionId);
                // console.log($firebaseArray(query))
                // return $firebaseObject(query);
                
            },           
            
            send: function(newMessage) {
                // Send to firebase
                console.log(newMessage)
                var newMessage = {"sessionID3":{
                    "messagedata1": {"content":"foo"}
                }}
                $firebaseArray(ref).$add(newMessage).then(function() {})

            }
        }
    }
    angular
        .module('chatbot')
        .factory('Messages', ['$firebaseArray', '$firebaseObject', Messages]);
})();