 (function() {
     function ChatCtrl($scope, $firebaseArray, $http, Messages, Auth) {
         var $ctrl = this;
         var d = Date.now();
         $ctrl.auth = Auth;

         $ctrl.auth.$signInAnonymously().then(function(firebaseUser) {
             $scope.firebaseUser = firebaseUser;
             $scope.session_id = $scope.firebaseUser.uid + "-" + d
             var messagesRef = firebase.database().ref().child("messages");
             // download the data from a Firebase reference into a (pseudo read-only) array
             $ctrl.messages = Messages.allMessages
                 // create a query for messages related to session
             $ctrl.sessionMessages = Messages.getSessionMessages($scope.session_id)
             //quick replies should only show for last session message
             $ctrl.lastSessionMessage = Messages.getLastSessionMessage($scope.session_id)
             
             $ctrl.messageData = {};
             var initData = 
             {
                 v: d,
                 q: "skynet online",
                 session_id: $scope.firebaseUser.uid + "-" + d
             };
             $http({
                     url: "/converse",
                     method: "POST",
                     params: initData
                 }).success(function(data, status, headers, config) {
                     $ctrl.messageData.session = initData.session_id;
                     $ctrl.messageData.session.content = data.msg;
                     $ctrl.messageData.session.quickreplies = data.quickreplies;
                     $ctrl.messageData.session.sentAt = d;
                     $ctrl.messageData.session.role = "chatbot";
                     
                     
                     
                     $ctrl.sendMessages($ctrl.messageData);
                 })
                 .error(function(data, status, header, config) {});
         }).catch(function(error) {
             $scope.error = error;
         });

         $ctrl.sendMessages = function(messageData) {
             Messages.send(messageData);
         };


         $ctrl.loadData = function() {
             $http.get('chat.json').success(function(data) {
                 $ctrl.data = data;
             });
         };
         $ctrl.sendMessage = function() {
             $ctrl.messageData.role = "user"
             $http.post('/converse', newMessage).success(function() {
                 Messages.send($ctrl.messageData) //send to firebase
             })
             var form = document.getElementById("messageForm");
             form.reset();
         };

     }
     angular
         .module('chatbot')
         .controller('ChatCtrl', ['$scope', '$firebaseArray', '$http', 'Messages', 'Auth', ChatCtrl]);
 })();