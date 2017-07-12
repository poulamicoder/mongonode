var loginModule = angular.module('loginModule', [])
        .config(function($httpProvider){
            $httpProvider.interceptors.push('AuthInterceptor');
        });