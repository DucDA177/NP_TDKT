angular.module('WebApiApp').controller('DMChungController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
   
    
    $scope.Del = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/DMChung/Del?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadDMChung();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }
    $rootScope.LoadDMCha = function () {

        $http({
            method: 'GET',
            url: 'api/DMChung/GetAllDMCha'
        }).then(function successCallback(response) {

            $scope.DMCha = response.data;
            $scope.IdCha = $scope.DMCha[0].Id
            $rootScope.LoadDMChung();
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $rootScope.LoadDMChung = function () {

        $http({
            method: 'GET',
            url: 'api/DMChung/GetAllbyDMCha?IdCha=' + $scope.IdCha
        }).then(function successCallback(response) {

            $scope.DMChung = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $rootScope.LoadDMCha();

    $scope.openModalDM = function (item) {
        $scope.Cha = $scope.DMCha.filter(t => t.Id == $scope.IdCha)[0];
        $scope.openModal(item, 'DMChung', $scope.Cha)
    }
    $scope.$on('$viewContentLoaded', function () {

        ComponentsSelect2.init();


    });

}]);