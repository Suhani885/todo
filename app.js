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
                console.log(response);
                window.alert("Login successful");
                sessionStorage.setItem('username', loginCtrl.username);
                $state.go('todo');
            }, function(error) {
                window.alert("Error");
                console.log("error", error);
            });
        } else {
            loginCtrl.errorMessage = "Enter username and password";
        }
    };
}]);

app.controller('TodoController', ['$http', '$state', function($http, $state) {
    var todoCtrl = this;
    todoCtrl.todos = [];
    todoCtrl.newTodo = '';
    todoCtrl.username = sessionStorage.getItem('username');
    var baseUrl = 'http://10.21.97.17:8000';

    todoCtrl.logout = function() {
        var req = {
            method: 'POST',
            url: `${baseUrl}/todo/todo/`,
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                "Todo": "logout",
                "Status": "logout"
            }
        };
        if (confirm("Are you sure you want to logout?")) {
        $http(req).then(function(response) {
            console.log(response);
            sessionStorage.removeItem('username');
            $state.go('login');
        }, function(error) {
            console.log("error", error);
        });
    }};

    todoCtrl.fetchTodos = function() {
        var req = {
            method: 'GET',
            url: `${baseUrl}/todo/todo/`,
            params: { 
                "username": todoCtrl.username
            }       
        };
        $http(req).then(function(response) {
            console.log(response);
            todoCtrl.todos = response.data.todos;
            console.log(response.data.todos);
        }, function(error) {
            console.log("Error", error);
        });
    };
    todoCtrl.fetchTodos();

    todoCtrl.addTodo = function() {
        var req = {
            method: 'POST',
            url: `${baseUrl}/todo/todo/`,
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                "Todo": todoCtrl.newTodo
            }
        };
        $http(req).then(function(response) {
            console.log(response);
            todoCtrl.fetchTodos();
            todoCtrl.newTodo = '';
        }, function(error) {
            console.log(error);
        });
    };

    todoCtrl.updateTodo = function(todo) {
        var req = {
            method: 'PUT',
            url: `${baseUrl}/todo/todo/`,
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                "id": todo.id,
                "title": todo.todo,
                "completed": todo.done
            }
        };
        $http(req).then(function(response) {
            console.log(response);
            todoCtrl.fetchTodos();
        }, function(error) {
            console.log(error);
        });
    };

    todoCtrl.deleteTodo = function(ID) {
        console.log(ID);
        var req = {
            method: 'DELETE',
            url: `${baseUrl}/todo/todo/`,
            params: { 
                "ID": ID
            } 
        };
        $http(req).then(function(response) {
            console.log(response.data);
            todoCtrl.fetchTodos();  
        }, function(error) {
            console.log("error", error);
        });
    };
}]);