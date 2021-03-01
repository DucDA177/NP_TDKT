angular.module('WebApiApp').controller("ModelMainMenuHandlerController", function ($scope, $http, $uibModalInstance) {
    $scope.itemMainMenu = $scope.$resolve.itemMainMenu;
    $scope.cancelModal = function () {
    $uibModalInstance.dismiss('close');
    }
    $scope.SaveModal = function () {
        
        if (typeof $scope.itemMainMenu == 'undefined') {
            $scope.itemMainMenu = {};
            toastr.error('Chưa cập nhật số liệu !', 'Thông báo');
            return;
        }
        if (typeof $scope.itemMainMenu.Id == 'undefined') {
             $http({
                method: 'POST',
                url: '/api/MainMenus',
                data: $scope.itemMainMenu
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');
                $scope.LoadMainMenus();
            }, function errorCallback(response) {
                $scope.itemRoleError = response.data;
                $scope.LoadError($scope.itemRoleError.ModelState);
            });
        }
        else
        {
            $http({
                method: 'PUT',
                url: '/api/MainMenus/' + $scope.itemMainMenu.Id,
                data: $scope.itemMainMenu
            }).then(function successCallback(response) {
                console.log(response);
                // this callback will be called asynchronously
                // when the response is available
                toastr.success('Cập nhật dữ liệu thành công Id = ' + $scope.itemMainMenu.Id +' !', 'Thông báo');
                $scope.LoadMainMenus();
            }, function errorCallback(response) {
                $scope.itemRoleError = response.data;
                $scope.LoadError($scope.itemRoleError.ModelState);
            });
        }
        $uibModalInstance.close('save');
    }
});
/* Setup blank page controller */
angular.module('WebApiApp').controller('MainMenuController', ['$rootScope', '$scope', '$http','$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
       
    $scope.cancelModal = function () {
       $uibModal.dismiss('close');
    }
    
    $scope.DeleteMainMenu = function (Id) {
        if (confirm('Bạn có chắc chắn xóa bản ghi này ko ?')) {
            $http({
                method: 'DELETE',
                url: '/api/MainMenus/' + Id
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available     
               
                toastr.warning('Đã xóa dữ liệu thành công !', 'Thông báo');
                $scope.LoadMainMenus();
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                toastr.error('Không xóa được dữ liệu !', 'Thông báo');
            });
        }
    };

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        //App.initAjax();
        //// set default layout mode
        //$rootScope.$settings.layout.pageContentWhite = true;
        //$rootScope.$settings.layout.pageBodySolid = false;
        //$rootScope.$settings.layout.pageSidebarClosed = true;
        // Simple GET request example:
        $scope.LoadMainMenus();

    });

}]);