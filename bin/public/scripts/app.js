 (function() {
     function config($stateProvider, $locationProvider) {
         $locationProvider
             .html5Mode({
                 enabled: true,
                 requireBase: false
             });
         $stateProvider
             .state('chat', {
                 url: '/',
                 controller: 'ChatCtrl as chat',
                 templateUrl: '/templates/chat.html'
             });
     }
     angular
         .module('chatbot', ['firebase', 'ui.router'])
         .config(config);
 })();