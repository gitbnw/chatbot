// (function() {
//     function ReplyButton(Messages) {
//         return {
//             restrict: 'E',
//             scope: {
//               quickreplyContent: '=content'
//             },            
//             template: '<button class="btn btn-info" content="{{reply}}">{{reply}}</button>',
//             link: function(scope, elem) {
//                 elem.bind('click', function() {
//                 var messageData = {}
//                  messageData.role = "human"
//                  messageData.quickreplies = null;
//                  messageData.sentAt = Date.now();
//                  messageData.content = elem.content;

//                   Messages.send(messageData, $scope.session_id)
//                 //     scope.$apply(function() {
//                 //         scope.item.star = !scope.item.star;
//                 //     });
//                 });
//             }
//         };
//     }
//     angular
//         .module('chatbot')
//         .directive('ReplyButton', ['Messages', ReplyButton]);
// })();