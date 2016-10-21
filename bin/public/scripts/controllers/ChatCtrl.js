 (function() {
     function ChatCtrl($scope, $firebaseArray, Messages, Auth, Converse) {
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

         $scope.session_id = null
         $scope.formData = {};

         var witData = {
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

             witData.session_id = $scope.firebaseUser.uid

             //call func to send init msg to Wit AI
             Converse.send(witData)
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

         //sends to firebase, need for button
         $ctrl.sendMessage = function(messageData) {
             return Messages.send(messageData, $scope.session_id)
         };

         //sends to Wit AI, need for button
         $ctrl.converseWit = function(witData) {
             return Converse.send(witData);
         };

         $ctrl.quickExchange = function(content) {
           $scope.formData.umsg = content;
           $ctrl.userExchange();
         };

         $ctrl.userExchange = function() {
             
             $ctrl.messageData.role = "human";
             $ctrl.messageData.quickreplies = null;
             $ctrl.messageData.sentAt = Date.now();
             $ctrl.messageData.content = $scope.formData.umsg
             
             //send user message to firebase
             Messages.send($ctrl.messageData, $scope.session_id)
                 .then(function() {
                     $scope.formData = {};
                     witData.intent = null;
                     witData.q = $ctrl.messageData.content;
                     
                     //send user message to wit
                     Converse.send(witData)
                         .success(function(data, status, headers, config) {
                             
                             $ctrl.messageData.role = "chatbot";
                             $ctrl.messageData.sentAt = Date.now();
                             $ctrl.messageData.content = data.msg
                             if (data.quickreplies) {
                                 $ctrl.messageData.quickreplies = data.quickreplies;
                             }
                             
                             //send response to firebase
                             // this doesn't work if the reply is an action and not a message
                             // if this is an action need to POST & run action & get next step from wit

                             if (data.type == "msg"){
                              Messages.send($ctrl.messageData, $scope.session_id)
                             } else if (data.type == "action"){
                              //this is limited to only one action can occur before we reset // 
                              // can only handle 1 text or 1 action then 1 text
                              Converse.wit(witData)
                             }
                         })
                 })
         };
     }
     angular
         .module('chatbot')
         .controller('ChatCtrl', ['$scope', '$firebaseArray', 'Messages', 'Auth', 'Converse', ChatCtrl]);
 })();