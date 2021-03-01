angular.module('WebApiApp').controller('DMDonViController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {

    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "LoaiDonVi": '0',
        "DVCha": '0',
        "LoaiTruong": '0'
    };
    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.LoadDMDonVi();
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.LoadDMDonVi();
        }

    }
    $scope.LoadLoaiTruong = function () {

        $http({
            method: 'GET',
            url: 'api/DonVi/LoadLoaiTruong',
        }).then(function successCallback(response) {
            $scope.LoaiTruong = response.data;
            console.log($scope.LoaiTruong )
        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }
    $scope.DelDv = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa đơn vị này ?'))
            $http({
                method: 'GET',
                url: 'api/DonVi/DelDv?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadDMDonVi();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }
    $rootScope.LoadDMDonVi = function () {
        if ($scope.Paging.totalPage != 0 ) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
            
        $http({
            method: 'GET',
            url: 'api/DonVi/GetDonVi?pageNumber=' + $scope.Paging.currentPage + '&pageSize=' + $scope.Paging.pageSize + '&searchKey=' + $scope.Paging.searchKey + '&LoaiDonVi=' + $scope.Paging.LoaiDonVi + '&DVCha=' + $scope.Paging.DVCha + '&LoaiTruong=' + $scope.Paging.LoaiTruong
        }).then(function successCallback(response) {

            $scope.DMDonVi = response.data.DMDonVi;
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;
            
          

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
 

    $scope.LoadAllDonVi = function () {

        $http({
            method: 'GET',
            url: 'api/DonVi/LoadAllDonVi',
        }).then(function successCallback(response) {
            $scope.DonVi = response.data;

        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }
    $scope.GetNameLoaiDV = function (item) {

        if (item.LoaiDonVi == 'SO') return item.TenLDV = 'Đơn vị cấp Sở'
        if (item.LoaiDonVi == 'PHONG') return item.TenLDV = 'Đơn vị cấp Phòng'
        if (item.LoaiDonVi == 'TRUONG') return item.TenLDV = 'Đơn vị cấp Trường'
        if (item.LoaiDonVi == 'DIEMTRUONG') return item.TenLDV = 'Đơn vị cấp Điểm trường'

    }
    $scope.LoadLoaiTruong();
    $rootScope.LoadDMDonVi();
    $scope.LoadAllDonVi();
    $scope.$on('$viewContentLoaded', function () {

        ComponentsSelect2.init();


    });

}]);