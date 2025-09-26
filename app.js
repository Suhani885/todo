const app = angular.module("myapp", ["ui.router"]);
var baseUrl = "http://127.0.0.1:4000";

app.config([
  "$urlRouterProvider",
  "$stateProvider",
  function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/login");

    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "routes/login.html",
        controller: "LoginController",
        controllerAs: "loginCtrl",
      })
      .state("register", {
        url: "/register",
        templateUrl: "routes/register.html",
        controller: "RegController",
        controllerAs: "regCtrl",
      })
      .state("todo", {
        url: "/todo",
        templateUrl: "routes/todo.html",
        controller: "TodoController",
        controllerAs: "todoCtrl",
      });
  },
]);

app.controller("RegController", [
  "$http",
  "$state",
  function ($http, $state) {
    var regCtrl = this;

    regCtrl.register = function () {
      if (regCtrl.pass1 !== regCtrl.pass2) {
        regCtrl.errorMessage = "Passwords do not match";
        return;
      }

      var req = {
        method: "POST",
        url: `${baseUrl}/auth/register`,
        withCredentials: true,
        data: {
          name: regCtrl.username,
          email: regCtrl.email,
          password: regCtrl.pass1,
        },
      };

      $http(req).then(
        function (response) {
          console.log(response);
          window.alert("Registration successful");
          $state.go("login");
        },
        function (error) {
          regCtrl.errorMessage =
            error.data?.error || "An error occurred. Try again.";
          console.log("error", error);
        }
      );
    };
  },
]);

app.controller("LoginController", [
  "$http",
  "$state",
  function ($http, $state) {
    var loginCtrl = this;

    loginCtrl.login = function () {
      if (loginCtrl.username && loginCtrl.password) {
        var req = {
          method: "POST",
          url: `${baseUrl}/auth/login`,
          withCredentials: true,
          data: {
            email: loginCtrl.username,
            password: loginCtrl.password,
          },
        };

        $http(req).then(
          function (response) {
            console.log(response);
            alert("Login successful");
            $state.go("todo");
          },
          function (error) {
            loginCtrl.errorMessage =
              error.data?.error || "Invalid login. Try again.";
            console.log("Error", error);
          }
        );
      } else {
        loginCtrl.errorMessage = "Enter username and password";
      }
    };
  },
]);

app.controller("TodoController", [
  "$http",
  "$state",
  function ($http, $state) {
    var todoCtrl = this;
    todoCtrl.todos = [];
    todoCtrl.newTodo = "";

    todoCtrl.logout = function () {
      if (confirm("Are you sure you want to logout?")) {
        var req = {
          method: "POST",
          url: `${baseUrl}/auth/logout`,
          withCredentials: true,
        };
        $http(req).then(
          function (response) {
            console.log(response);
            $state.go("login");
          },
          function (error) {
            console.log("error", error);
          }
        );
      }
    };

    todoCtrl.fetchTodos = function () {
      var req = {
        method: "GET",
        url: `${baseUrl}/todos`,
        withCredentials: true,
      };
      $http(req).then(
        function (response) {
          console.log(response);
          todoCtrl.todos = response.data.todos;
        },
        function (error) {
          console.log("Error", error);
          if (error.status === 401) {
            $state.go("login");
          }
        }
      );
    };

    todoCtrl.addTodo = function () {
      if (!todoCtrl.newTodo) return;

      var req = {
        method: "POST",
        url: `${baseUrl}/todos`,
        withCredentials: true,
        data: {
          task: todoCtrl.newTodo,
        },
      };
      $http(req).then(
        function (response) {
          console.log(response);
          todoCtrl.fetchTodos();
          todoCtrl.newTodo = "";
        },
        function (error) {
          console.log(error);
        }
      );
    };

    todoCtrl.deleteTodo = function (ID) {
      var req = {
        method: "DELETE",
        url: `${baseUrl}/todos/${ID}`,
        withCredentials: true,
      };
      $http(req).then(
        function (response) {
          console.log(response.data);
          todoCtrl.fetchTodos();
        },
        function (error) {
          console.log("error", error);
        }
      );
    };

    todoCtrl.editTodo = function (todo) {
      todo.originalTask = todo.task;
      todo.editing = true;
    };

    todoCtrl.saveEdit = function (todo) {
      var req = {
        method: "PUT",
        url: `${baseUrl}/todos/${todo._id}`,
        withCredentials: true,
        data: {
          task: todo.task,
          completed: todo.completed || false,
        },
      };

      $http(req).then(
        function (response) {
          console.log(response);
          todo.editing = false;
          todoCtrl.fetchTodos();
        },
        function (error) {
          console.log(error);
        }
      );
    };

    todoCtrl.cancelEdit = function (todo) {
      todo.task = todo.originalTask;
      todo.editing = false;
    };

    todoCtrl.fetchTodos();
  },
]);
