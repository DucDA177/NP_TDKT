var WebApiApp = angular.module('WebApiApp', ['']);
WebApiApp.controller('LoginController', ['$rootScope', '$scope', '$http', '$cookies', '$settings', 'loginAppFactory', function ($rootScope, $scope, $http, $cookies, $settings, loginAppFactory) {

    try {
        $scope.auth = JSON.parse(readUserConfig())
        if (!$scope.auth.remember) $scope.auth.password = ''
    } catch{ }
    $scope.Nam = new Date().getFullYear();
    $scope.$on('$viewContentLoaded', function () {
        // initi    ize core components
        App.initAjax();
        //App.init();
        // set default layout mode
        $rootScope.$settings.layout.pageContentWhite = true;
        $rootScope.$settings.layout.pageBodySolid = false;
        $rootScope.$settings.layout.pageSidebarClosed = true;
        // Simple GET request example:

        $('.login-bg').backstretch([
            "../assets/pages/img/login/bg1.jpg",
            "../assets/pages/img/login/bg2.jpg",
            "../assets/pages/img/login/bg3.jpg"
            // "../assets/BackGround.jpg"
        ], {
                fade: 1000,
                duration: 8000
            }
        );
        $scope.loading = "Đăng nhập";
        $scope.CheckLocationHash();
    });


    //$scope.LoadKyThi();
    $scope.fnLogin = function (obj) {
        $scope.show = 1;
        if ($scope.auth == null) {
            toastr.error('Chưa nhập tên đăng nhập hoặc mật khẩu !', 'Đăng nhập');
            $scope.show = 0;
            return;
        }
        if ($scope.auth.username == null || $scope.auth.password == null) {
            toastr.error('Chưa nhập tên đăng nhập hoặc mật khẩu !', 'Đăng nhập');
            $scope.show = 0;
            return;
        }
        if (!$scope.Nam) {
            toastr.error('Chưa chọn năm tiến hành !', 'Đăng nhập');
            $scope.show = 0;
            return;
        }


        var data = "grant_type=password&username=" + $scope.auth.username + "&password=" + $scope.auth.password;
        $scope.loading = 'loading ...';
        $http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .success(function (response) {

                $cookies.put('username', response.userName);

                $cookies.put('token_type', response.token_type);
                $cookies.put('token', response.access_token);
                $cookies.put('Nam', $scope.Nam);
                
                toastr.success('Đăng nhập thành công !', 'Đăng nhập');
                window.location.assign('/home.html');

            }).error(function (err, status) {
                
                    $scope.loading = "Đăng nhập";
                    toastr.error('Sai tên đăng nhập hoặc mật khẩu !', 'Đăng nhập');
                    $scope.show = 0;
                

            });

        //$cookies.put('username', $scope.auth.username);
        //window.location.assign('/home.html');
    };
    $scope.authenExProvider = function (provider) {
        var str = "&response_type=token&client_id=self&redirect_uri=http%3A%2F%2Flocalhost%3A23815%2Flogin.html&state=BnwLgVjy8UypsGKjQ9u32FCuYxKs6Q_86J92RemSxpM1";
        var external = "api/Account/ExternalLogin?provider=" + provider + str;
        window.location.href = external;

    }
    $scope.RequestPasswordReset = function () {
        if (!$scope.auth.username) {
            toastr.error('Vui lòng điền tên tài khoản cần đặt lại mật khẩu vào phần Tên đăng nhập', 'Thông báo');
            return;
        }
        if (confirm('Bạn có chắc chắn yêu cầu đặt lại mật khẩu cho tài khoản ' + $scope.auth.username))
            $http({
                method: 'POST',
                url: '/api/ThongBao/YeuCauDoiMatKhau',
                data: { NguoiGui: $scope.auth.username }
            }).then(function successCallback(response) {
                toastr.success('Đã gửi yêu cầu đặt lại mật khẩu cho tải khoản ' + $scope.auth.username, 'Thông báo');
            }, function errorCallback(response) {
                toastr.error('Lỗi! ' + response.data.Message);
            });
    }
    $scope.CheckLocationHash = function () {
        if (location.hash) {
            if (window.location.href.indexOf("access_token=") > -1) {
                if (location.hash.split('access_token=')) {
                    $scope.accessToken = location.hash.split('access_token=')[1].split('&')[0];
                    if ($scope.accessToken) {
                        console.log(loginAppFactory.CheckRegistration($scope.accessToken));

                    }
                }
            }

        }
    }
}]);
WebApiApp.factory('loginAppFactory', function ($q, $http) {
    var fac = {};
    fac.CheckRegistration = function (token) {
        var deferred = $q.defer();
        var request = {
            method: 'get',
            url: 'api/Account/UserInfo',
            header: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer:' + token
            }
        }
        return $http(request)
    }
    return fac;
})
