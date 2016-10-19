 (function() {
     function ChatCtrl($scope, $firebaseArray, $http, Messages, Auth) {
         var $ctrl = this;
         var d = Date.now();
         var form = document.getElementById("messageForm");
         var chatboxEl = document.getElementById("chat-box");
         var isScrolledToBottom = chatboxEl.scrollHeight - chatboxEl.clientHeight <= chatboxEl.scrollTop + 1;
         
        $ctrl.updateScroll = function(){
             console.log('pre scrolltop: ' + chatboxEl.scrollTop)
             if(isScrolledToBottom){
                chatboxEl.scrollTop = chatboxEl.scrollHeight - chatboxEl.clientHeight;
                console.log('post scrolltop: ' + chatboxEl.scrollTop)
                console.log('scrollheight: ' + chatboxEl.scrollHeight)
                console.log('clientheight: ' + chatboxEl.clientHeight)
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
             
            $ctrl.sessionMessages.$watch(function(event) {
                  // $ctrl.updateScroll();
            });    
            
              $scope.$on('$viewContentLoaded', function(){
    //Here your view content is fully loaded !!
    // $ctrl.updateScroll();
  });
             
             
             
             
                 //quick replies should only show for last session message
             $ctrl.lastSessionMessage = Messages.getLastSessionMessage($scope.session_id)

             $ctrl.messageData = {};

             witData.session_id = $scope.firebaseUser.uid

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
             return Messages.send(messageData, $scope.session_id)
         };

         //sends to Wit AI
         $ctrl.sendWitMessage = function(witData) {

             return $http({
                 url: "/converse",
                 method: "POST",
                 params: witData
             })
         };

         $ctrl.userExchange = function() {
             //send user message to firebase
             $ctrl.messageData.role = "human";
             $ctrl.messageData.sentAt = Date.now();
             $ctrl.messageData.content = $scope.formData.umsg
             Messages.send($ctrl.messageData, $scope.session_id)
                 .then(function() {
                    $scope.formData={};
                     //send user message to wit
                     witData.intent = "";
                     witData.q = $ctrl.messageData.content;
                     $ctrl.sendWitMessage(witData)
                         .success(function(data, status, headers, config) {
                             //send response to firebase
                             $ctrl.messageData.role = "chatbot";
                             $ctrl.messageData.sentAt = Date.now();
                             $ctrl.messageData.content = data.msg
                             
                             Messages.send($ctrl.messageData, $scope.session_id)
                              .then(function(){
                               
                              })
                             
                         })
                 })


         };


         $ctrl.loadData = function() {
             $http.get('chat.json').success(function(data) {
                 $ctrl.data = data;
             });
         };


     }
     angular
         .module('chatbot')
         .controller('ChatCtrl', ['$scope', '$firebaseArray', '$http', 'Messages', 'Auth', ChatCtrl]);
 })();