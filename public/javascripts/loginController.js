angular.module('loginModule')
        .controller('loginController', loginController);
loginController.$inject = ['$scope', '$location', 'authService'];
function loginController($scope, $location, authService) {
    $scope.admin = {};
    $scope.login = {
        email: "",
        password: ""
    };
    $scope.loginError = {
        show: false,
        message: "Hi"
    };
    $scope.doLogin = function () {
        $scope.loginError.show = false;
        authService.login($scope.login.email, $scope.login.password)
                .success(function (data) {
                    if (data.success) {
                        $location.path('/mongo');
                    } else {
                        $scope.loginError.show = true;
                        $scope.loginError.message = data.message;
                    }
                });
    };
}