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
            controller: 'RegController',
            controllerAs: 'regCtrl'
        })
        .state('todo', {
            url: '/todo',
            templateUrl: 'todo.html',
            controller: 'TodoController',
            controllerAs: 'todoCtrl'
        });
}]);

app.controller('RegController', ['$http', '$state', function ($http, $state) {
    var regCtrl = this;
    regCtrl.register = function() {
        console.log(regCtrl.fname, regCtrl.lname, regCtrl.username, regCtrl.email, regCtrl.pass1, regCtrl.pass2);
        if (regCtrl.pass1 !== regCtrl.pass2) {
            regCtrl.errorMessage = "Passwords do not match";
            return;
        }
        var req = {
            method: 'POST',
            url: 'http://10.21.97.17:8000/todo/register/',
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                "Fname": regCtrl.fname,
                "Lname": regCtrl.lname,
                "Uname": regCtrl.username,
                "Email": regCtrl.email,
                "Passwd1": regCtrl.pass1,
                "Passwd2": regCtrl.pass2
            }
        };
        $http(req).then(function(response) {
            console.log(response);
            regCtrl.successMessage = "Registration successful!";
            $state.go('login');
        }, function(error) {
            regCtrl.errorMessage = "Registration failed. Please try again.";
            console.log("error", error);
        });
    };
}]);

app.controller('LoginController', ['$http','$state', function ($http,$state) {
    var loginCtrl = this;
    loginCtrl.login = function() {
        console.log(loginCtrl.username, loginCtrl.password);
        if (loginCtrl.username && loginCtrl.password) {
            var req = {
                method: 'POST',
                url: 'http://10.21.97.17:8000/todo/login/',
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "Uname": loginCtrl.username,
                    "Passwd": loginCtrl.password
                }
            };
            $http(req).then(function(response) {
                console.log(response.data);
                loginCtrl.successMessage = "Login successful!";
                sessionStorage.setItem('username', response.data.username);
                $state.go('todo');
            }, function(error) {
                loginCtrl.errorMessage = "Error";
                console.log("error", error);
            });
        } else {
            loginCtrl.errorMessage = "Enter username and password";
        }
    };
}]);

app.controller('TodoController', ['$http', '$state', function($http, $state) {
    this.logout = function() {
            var req = {
                method: 'POST',
                url: 'http://10.21.97.17:8000/todo/todo/',
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "Todo": "logout",
                    "Status":"logout"
                }
            };
            $http(req).then(function(response) {
                console.log(response);
                sessionStorage.removeItem('username');
                $state.go('login');
            }, function(error) {
                console.log("error", error);
            });
    };
}]);

// app.controller('TodoController', ['$http', '$state', function($http, $state) {
//     var todoCtrl = this;
//     todoCtrl.todos = [];
//     todoCtrl.newTodo = '';
//     todoCtrl.username = sessionStorage.getItem('username') || 'User';

//     todoCtrl.fetchTodos = function() {
//         $http.get('http://10.21.97.17:8000/todo/todo/')
//             .then(function(response) {
//                 todoCtrl.todos = response.data;
//             }, function(error) {
//                 console.log("Error fetching todos:", error);
//             });
//     };
//     todoCtrl.fetchTodos();

//     todoCtrl.addTodo = function() {
//         if (todoCtrl.newTodo) {
//             $http.post('http://10.21.97.17:8000/todo/todo/', { text: todoCtrl.newTodo })
//                 .then(function(response) {
//                     todoCtrl.todos.push(response.data);
//                     todoCtrl.newTodo = '';
//                 }, function(error) {
//                     console.log("Error adding todo:", error);
//                 });
//         }
//     };

    // todoCtrl.updateTodo = function(index) {
    //     var updatedText = prompt("Update todo:", todoCtrl.todos[index].text);
    //     if (updatedText !== null) {
    //         $http.put('http://10.21.97.17:8000/todo/todo/' + todoCtrl.todos[index].id, { text: updatedText })
    //             .then(function(response) {
    //                 todoCtrl.todos[index].text = updatedText;
    //             }, function(error) {
    //                 console.log("Error updating todo:", error);
    //             });
    //     }
    // };

    // todoCtrl.deleteTodo = function(index) {
    //     if (confirm("Are you sure you want to delete this todo?")) {
    //         $http.delete('http://10.21.97.17:8000/todo/todo/' + todoCtrl.todos[index].id)
    //             .then(function(response) {
    //                 todoCtrl.todos.splice(index, 1);
    //             }, function(error) {
    //                 console.log("Error deleting todo:", error);
    //             });
    //     }
    // };
// }]);