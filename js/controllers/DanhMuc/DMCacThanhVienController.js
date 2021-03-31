angular.module('WebApiApp').controller('DMCacThanhVienController', function ($rootScope, $scope, $http, $timeout) {
    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi" : 0
    };
    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.Load();
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.Load();
        }

    }

    $scope.Del = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/DMCacThanhVien/Del?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.Load();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Lỗi ! ' + response.data.Message , 'Thông báo');
            });

    }
    $rootScope.Load = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
        if ($rootScope.CurDonVi.NhomLoai != 'ADMIN')
            $scope.Paging.IdDonvi = $rootScope.CurDonVi.Id;

        $http({
            method: 'GET',
            url: 'api/DMCacThanhVien/Get?pageNumber='
                + $scope.Paging.currentPage + '&pageSize=' + $scope.Paging.pageSize
                + '&searchKey=' + $scope.Paging.searchKey + '&IdDonvi=' + $scope.Paging.IdDonvi
        }).then(function successCallback(response) {

            $scope.ThanhVien = response.data.ListOut;

            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;



        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $rootScope.Load();

    $scope.LoadDonViCoSo = function () {
            $http({
                method: 'GET',
                url: 'api/DonVi/GetDonViTheoLoai?LoaiDV=TT',
            }).then(function successCallback(response) {
                $scope.ListDonVi = response.data;
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
    }
    $scope.LoadDonViCoSo();
});
