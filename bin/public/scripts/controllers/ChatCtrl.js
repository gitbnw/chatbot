 (function() {
     function ChatCtrl($scope, $http, Messages, Auth) {
         var $ctrl = this;

         $ctrl.auth = Auth;
         $ctrl.auth.$onAuthStateChanged(function(firebaseUser) {
             var d = Date.now();
             $scope.firebaseUser = firebaseUser;
                 var data = {
                         v: d,
                         q: "skynet online",
                         session_id: $scope.firebaseUser.uid + "-" + d 
                 };
                 
                 $http({
                  url: "/converse",
                  method: "POST",
                  params: data
                 }).success(function (data, status, headers, config) {
                  console.log(data)
            })
            .error(function (data, status, header, config) {
            });
                 

         });

         $ctrl.messageData = {};

         $ctrl.getHistory = function(chatSession) {
             Messages.getMessages(chatSession)
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
         .controller('ChatCtrl', ['$scope', '$http', 'Messages', 'Auth', ChatCtrl]);
 })();