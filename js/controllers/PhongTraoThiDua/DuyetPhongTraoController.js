angular.module('WebApiApp').controller('DuyetPhongTraoController', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi": 0,
        "Nam": $rootScope.CurYear,
        "Trangthai": 0
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
    
    $rootScope.Load = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }

        $http({
            method: 'GET',
            url: 'api/PhongTrao/Get?pageNumber='
                + $scope.Paging.currentPage + '&pageSize=' + $scope.Paging.pageSize
                + '&searchKey=' + $scope.Paging.searchKey + '&IdDonvi=' + $scope.Paging.IdDonvi
                + '&Nam=' + $scope.Paging.Nam + '&Trangthai=' + $scope.Paging.Trangthai
        }).then(function successCallback(response) {

            $scope.PhongTrao = response.data.ListOut;

            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;



        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    
    $scope.LoadListDonVi = function () {

        $http({
            method: 'GET',
            url: '/api/DonVi/GetDonViDuocQuanLy',
            params: {
                IDDVQuanLy: $rootScope.CurDonVi.Id,
            }
        }).then(function successCallback(response) {
            $scope.ListDonVi = response.data;
            if ($scope.ListDonVi.length > 0) {
                $scope.Paging.IdDonvi = $scope.ListDonVi[0].Id
                $rootScope.Load();
            }
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadListDonVi();

    $rootScope.Duyet = function (item) {
        if (confirm('Bạn có chắc chắn duyệt phong trào thi đua này?')) {
            item.Trangthai = 2
            $http({
                method: 'POST',
                url: '/api/PhongTrao/UpdatePT',
                data: item
            }).then(function successCallback(response) {
                $rootScope.Load();
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
        }
       
    }
});
