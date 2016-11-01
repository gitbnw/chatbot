 (function() {
     function ChatCtrl($scope, $firebaseArray, Messages, Auth, Wit) {
         var $ctrl = this;
         var d = Date.now();
         var form = document.getElementById("messageForm");
         var chatboxEl = document.getElementById("chat-box");
         var isScrolledToBottom = chatboxEl.scrollHeight - chatboxEl.clientHeight <= chatboxEl.scrollTop + 1;

         $ctrl.updateScroll = function() {
             if (isScrolledToBottom) {
                 chatboxEl.scrollTop = chatboxEl.scrollHeight - chatboxEl.clientHeight;
             }
         };

         function randomIntFromInterval(min, max) {
             return Math.floor(Math.random() * (max - min + 1) + min);
         }

         $scope.session_id = null
         $scope.formData = {};

         var witData = {
             v: d,
             q: "skynet online",
             type: "msg",
             reset: "true"
         }
         $ctrl.auth = Auth;

         $ctrl.auth.$signInAnonymously().then(function(firebaseUser) {
             $scope.firebaseUser = firebaseUser;
             $scope.session_id = $scope.firebaseUser.uid
             $scope.wit_id = $scope.firebaseUser.uid + randomIntFromInterval(1, 99)
             witData.session_id = $scope.wit_id
                 // create a query for messages related to session
             $ctrl.sessionMessages = Messages.getSessionMessages($scope.session_id)
                 //quick replies should only show for last session message
             $ctrl.lastSessionMessage = Messages.getLastSessionMessage($scope.session_id)
             $ctrl.messageData = {};
             $ctrl.messageData.session = $scope.session_id
             
             $ctrl.prepMessage = function(reply){
                     $ctrl.messageData.role = "chatbot";
                     $ctrl.messageData.sentAt = Date.now();
                     $ctrl.messageData.content = reply.msg              
             }

             $ctrl.handleBotReply = function(bot_reply) {
                 //the user reply is ALWAYS msg
                 //the bot will converse until it gets a stop

                 if (bot_reply.quickreplies) {
                     $ctrl.messageData.quickreplies = bot_reply.quickreplies;
                 }

                 if (bot_reply.type == "msg") {
                     $ctrl.prepMessage(bot_reply)
                     Messages.send(bot_reply, $scope.session_id)
                         .then(function() {
                             Wit.converse(bot_reply)
                                 .success(function(data, status, headers, config) {
                                     bot_reply = data;
                                     $ctrl.handleBotReply(bot_reply)
                                 })
                         })
                 } else if (bot_reply.type != "stop"){
                             Wit.converse(bot_reply)
                                 .success(function(data, status, headers, config) {
                                     bot_reply = data;
                                     $ctrl.handleBotReply(bot_reply)
                                 })
                 } 
             }

             //call func to send init msg to Wit AI
             Wit.message(witData)
                 //call func to send response msg to firebase
                 .success(function(success, status, headers, config) {
                  //difference is with message there is not bot reply, have to converse
                     witData.q = ""
                     Wit.converse(witData)
                       .success(function(reply, status, headers, config){
                         $ctrl.handleBotReply(reply);
                       })
                    

                     $ctrl.messageData.content = "";
                 })
                 .error(function(data, status, header, config) {});
         }).catch(function(error) {
             $scope.error = error;
         });

         //sends to firebase, need for button
         $ctrl.sendMessage = function(messageData) {
             return Messages.send(messageData, $scope.session_id)
         };

         //sends to Wit AI, need for button
         $ctrl.messageWit = function(witData) {
             return Wit.message(witData);
         };

         $ctrl.quickExchange = function(content, index) {
             $scope.formData.umsg = content;
             $scope.formData.option = index
             $ctrl.userExchange();
         };

         $ctrl.userExchange = function() {

             //prepare message for firebase
             $ctrl.messageData.role = "human";
             $ctrl.messageData.quickreplies = null;
             $ctrl.messageData.sentAt = Date.now();
             $ctrl.messageData.content = $scope.formData.umsg


             //send user message to firebase
             Messages.send($ctrl.messageData, $scope.session_id)
                 .then(function() {
                     $scope.formData = {}; //reset form
                     witData.q = $ctrl.messageData.content; //send same msg to wit
                     witData.session_id = $scope.wit_id;
                     //send user message to wit
                     Wit.message(witData)
                         .success(function(reply, status, headers, config) {
                             // prepare wit response for firebase

                             //handle bot reply message vs function
                             $ctrl.handleBotReply(reply)
                         })
                 })
         };
     }
     angular
         .module('chatbot')
         .controller('ChatCtrl', ['$scope', '$firebaseArray', 'Messages', 'Auth', 'Wit', ChatCtrl]);
 })();