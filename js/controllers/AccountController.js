angular.module('WebApiApp').controller('AccountController', function ($rootScope, $scope, $http, $timeout) {
   
    if ($rootScope.user != null && $rootScope.user != undefined && $rootScope.user != '') {
        $scope.LoadProvin('0', '0', '0');
        $scope.LoadProvin($rootScope.user.IDTinh, $rootScope.user.IDHuyen, $rootScope.user.IDXa);
    }
    else {
        $scope.LoadProvin('0', '0', '0');
    }
    var formdata = new FormData();
    $scope.getTheFiles = function ($files) {
        formdata = new FormData();
        angular.forEach($files, function (value, key) {
            $http({
                method: 'GET',
                url: '/api/AutoId/' + 'FILE',
            }).success(function (response, status, headers, config) {
                formdata.append(key, value, response.FName + '_' + value.name);
                var o = {
                    key: key,
                    DocName: '',
                    firstname: value.name,
                    filename: response.FName + '_' + value.name
                }
                $rootScope.user.Avatar = response.FName + '_' + value.name
            }).error(function (response, status, headers, config) {
            });

        });
    }
    $scope.uploadFiles = function () {
        var request = {
            method: 'POST',
            url: 'api/Files/FileUpload',
            data: formdata,
            headers: {
                'Content-Type': undefined
            }
        };
        // SEND THE FILES.
        $http(request)
            .success(function (d) {
               
                $scope.Save();
            })
            .error(function () {
                toastr.error('Cập nhật ảnh đại diện không thành công !', 'Thông báo');
            });
    }
    $scope.setFile = function (element) {
        $scope.isSetAvatar = true
        $scope.currentFile = element.files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
            $scope.image_source = event.target.result
            $scope.$apply()

        }
        // when the file is read it triggers the onload event above.
        reader.readAsDataURL(element.files[0]);
    }
    $scope.Save = function () {
       
        $http({
            method: 'POST',
            url: '/api/UserProfiles' ,
            data: $rootScope.user
        }).then(function successCallback(response) {
            toastr.success('Thay đổi thông tin hồ sơ thành công', 'Thông báo');
            $http({
                method: 'GET',
                url: '/api/GetCurrentUserProfiles',

            }).then(function successCallback(response) {
                $rootScope.user = response.data;
                if ($rootScope.user.GhiChu)
                    $rootScope.user.Config = JSON.parse($rootScope.user.GhiChu)
                window.location.reload(true)
            }, function errorCallback(response) {

            });
        }, function errorCallback(response) {

        });
    }
    $scope.ChangePass = function () {

        $http({
            method: 'POST',
            url: '/api/Account/ChangePassword',
            data: $scope.item
        }).then(function successCallback(response) {
            toastr.success('Thay đổi mật khẩu thành công', 'Thông báo');
        }, function errorCallback(response) {
            $scope.itemError = response.data;
            $scope.LoadError($scope.itemError.ModelState);
        });
    }
   

    $scope.$on('$viewContentLoaded', function () {
       
        App.initAjax();
   
    });

   
    ComponentsSelect2.init();
    // set sidebar closed and body solid layout mode
    $rootScope.$settings.layout.pageContentWhite = true;
    $rootScope.$settings.layout.pageBodySolid = false;
    $rootScope.$settings.layout.pageSidebarClosed = false;
});
