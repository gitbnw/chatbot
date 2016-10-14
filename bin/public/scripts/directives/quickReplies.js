(function() {
    function quickReplies($document) {

        return {
            templateUrl: '/templates/directives/quickreplies.html',
            replace: true,
            restrict: 'E',
            scope: {
                onChange: '&'
            },
            link: function(scope, element, attributes) {

            }

        }
    }

    angular
        .module('chatbot')
        .directive('quickReplies', ['$document', quickReplies]);
})();