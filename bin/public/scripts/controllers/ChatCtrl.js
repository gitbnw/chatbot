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


    //call func to send init msg to Wit AI
    Converse.send(witData)
     //call func to send response msg to firebase
     .success(function(data, status, headers, config) {
      witData.reset = "false";
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

   $ctrl.quickExchange = function(content, index) {
    $scope.formData.umsg = content;
    $scope.formData.option = index
    $ctrl.userExchange();
   };

   $ctrl.handleBotReply = function(reply) {
    if (reply.quickreplies) {
     $ctrl.messageData.quickreplies = reply.quickreplies;
    }

    if (reply.type !== "msg") {
     reply.session_id = $scope.wit_id;
     Converse.send(reply) // this should run the action in the reply
      .success(function(data, status, headers, config) {
       $ctrl.handleBotReply(data)
      })
    }
    else {
     $ctrl.messageData.role = "chatbot";
     $ctrl.messageData.sentAt = Date.now();
     $ctrl.messageData.content = reply.msg
     Messages.send($ctrl.messageData, $scope.session_id)
      .then(function() {
       $scope.formData = {};
      })
    }
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
      Converse.send(witData)
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
   .controller('ChatCtrl', ['$scope', '$firebaseArray', 'Messages', 'Auth', 'Converse', ChatCtrl]);
 })();
 