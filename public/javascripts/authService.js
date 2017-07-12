angular.module('loginModule')
        .factory('authService', authService)
        .factory('AuthToken', AuthToken)
        .factory('AuthInterceptor', AuthInterceptor);
authService.$inject = ['$http', '$q', 'AuthToken'];
AuthToken.$inject = ['$window'];
AuthInterceptor.$inject = ['$q', 'AuthToken'];
function authService($http, $q, AuthToken) {
    return {
        login: function (email, password) {
            return $http.post('/admin/login', {
                email: email,
                password: password
            })
                    .success(function (data) {
                        if (data.success) {
                            AuthToken.setToken(data.token);
                            return data;
                        }
                    });
        },
        logout: function () {
            AuthToken.setToken();
        },
        isLoggedin: function () {
            if (AuthToken.getToken())
                return true;
            else
                return false;
        }
    };
}
function AuthToken($window) {
    return {
        setToken: function (token) {
            if (token)
                $window.localStorage.setItem('token', token);
            else
                $window.localStorage.removeItem('token');
        },
        getToken: function () {
            return $window.localStorage.getItem('token');
        }
    };
}
function AuthInterceptor($q, AuthToken) {
    return {
        request: function (config) {
            var token = AuthToken.getToken();
            if (token)
                config.headers['x-access-token'] = token;
            return config;
        }
    };
}