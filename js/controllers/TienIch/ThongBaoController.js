angular.module('WebApiApp').controller('ThongBaoController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {


    $scope.Del = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/ThongBao/Del?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadThongBao();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }
    $rootScope.LoadThongBao = function () {

        $http({
            method: 'GET',
            url: 'api/ThongBao'
        }).then(function successCallback(response) {

            $scope.ThongBao = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $rootScope.LoadThongBao();

    $scope.$on('$viewContentLoaded', function () {

        ComponentsSelect2.init();


    });

}]);