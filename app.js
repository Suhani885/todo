const app = angular.module('myapp', ['ui.router']);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'register.html',
            controller: 'RegisterController',
            controllerAs: 'regCtrl'
        })
        .state('todo', {
            url: '/todo',
            templateUrl: 'todo.html',
            controller: 'TodoController',
            controllerAs: 'todoCtrl'
        });
}]);

// app.controller('LoginController', function() {
//     this.login = function() {
//         console.log('Login attempted');

//     };
// });

// app.controller('RegisterController', function() {
//     this.register = function() {
//         console.log('Registration attempted');
        
//     };
// });

// app.controller('TodoController', function() {
//     this.todos = [];
//     this.newTodo = '';

//     this.addTodo = function() {
//         if (this.newTodo) {
//             this.todos.push({text: this.newTodo, done: false});
//             this.newTodo = '';
//         }
//     };
// });