 (function() {
     function ChatCtrl($scope, $firebaseArray, $http, Messages, Auth) {
         var $ctrl = this;
         var d = Date.now();
         $scope.session_id = null
         var witData  = {
                 v: d,
                 q: "skynet online",
                 intent: "greeting"
         }
         $ctrl.auth = Auth;

         $ctrl.auth.$signInAnonymously().then(function(firebaseUser) {
             $scope.firebaseUser = firebaseUser;
             $scope.session_id = $scope.firebaseUser.uid

                 // create a query for messages related to session
             $ctrl.sessionMessages = Messages.getSessionMessages($scope.session_id)
             //quick replies should only show for last session message
             $ctrl.lastSessionMessage = Messages.getLastSessionMessage($scope.session_id)
             
             $ctrl.messageData = {};
             
             witData.session_id =  $scope.firebaseUser.uid + "-" + d

             //call func to send init msg to Wit AI
             $ctrl.sendWitMessage(witData)
             //call func to send response msg to firebase
             .success(function(data, status, headers, config) {
                     $ctrl.messageData.session = $scope.session_id
                     $ctrl.messageData.content = data.msg;
                     $ctrl.messageData.quickreplies = data.quickreplies;
                     $ctrl.messageData.sentAt = d;
                     $ctrl.messageData.role = "chatbot";
                     $ctrl.sendMessage($ctrl.messageData);
                     $ctrl.messageData.content = "";
                 })
                 .error(function(data, status, header, config) {});
         }).catch(function(error) {
             $scope.error = error;
         });

         //sends to firebase
         $ctrl.sendMessage = function(messageData) {
             var form = document.getElementById("messageForm");
             form.reset();         
             return Messages.send(messageData, $scope.session_id)

         };
         
         //sends to Wit AI
         $ctrl.sendWitMessage = function(witData){

            return $http({
                     url: "/converse",
                     method: "POST",
                     params: witData
                 })      
         };
         
         $ctrl.userExchange = function(){
          //send user message to firebase
          $ctrl.messageData.role = "chatbot";
          $ctrl.messageData.sentAt = Date.now();
         Messages.send($ctrl.messageData, $scope.session_id)
          .then(function(){
            //send user message to wit
            witData.intent = "";
            witData.q = $ctrl.messageData.content;
            $ctrl.sendWitMessage(witData)
            // .success(function(data, status, headers, config){
            //  //send response to firebase
            //  $ctrl.sendMessage(data.msg);
            // })
          })
          
          
         };


         $ctrl.loadData = function() {
             $http.get('chat.json').success(function(data) {
                 $ctrl.data = data;
             });
         };
         // $ctrl.sendMessage = function() {
         //     $ctrl.messageData.role = "user"
         //     $http.post('/converse', $ctrl.messageData).success(function() {
         //         Messages.send($ctrl.messageData) //send to firebase
         //     })
         //     var form = document.getElementById("messageForm");
         //     form.reset();
         // };

     }
     angular
         .module('chatbot')
         .controller('ChatCtrl', ['$scope', '$firebaseArray', '$http', 'Messages', 'Auth', ChatCtrl]);
 })();