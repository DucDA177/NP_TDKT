angular.module('WebApiApp').controller('BaoCaoTapTheController', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.Paging = {
        "Searchkey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi": 0,
        "Nam": 0,
        "MaDanhhieu": '',
        "HTKT": 0,
        "Searchkey": '',
        "Loai": "TAPTHE"
    };

    $scope.IsEdit = false;

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

        $scope.item = '<i>Vui lòng đợi trong quá trình tải dữ liệu báo cáo...</i>';

        $http({
            method: 'GET',
            url: 'api/BaoCao/LoadBaoCaoCaNhanTapThe',
            params: {
                pageNumber: $scope.Paging.currentPage,
                pageSize: $scope.Paging.pageSize,
                IdDonvi: $scope.Paging.IdDonvi,
                Nam: $scope.Paging.Nam,
                IdCurDonVi: $rootScope.CurDonVi.Id,
                MaDanhhieu: $scope.Paging.MaDanhhieu,
                HTKT: $scope.Paging.HTKT,
                Searchkey: $scope.Paging.Searchkey,
                Loai: $scope.Paging.Loai
            }
        }).then(function successCallback(response) {

            $scope.Data = response.data.ListOut;

            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;

            if ($scope.Data.length == 0) $scope.item = '<i>Không có dữ liệu...</i>'

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            $scope.item = '<i>Không có dữ liệu...</i>'
        });
    }
    $rootScope.Load();

    $scope.LoadDonViDuocQuanLy = function () {
        $http({
            method: 'POST',
            url: 'api/BaoCao/GetAllDVBaoCao',
            data: $rootScope.CurDonVi
        }).then(function successCallback(response) {
            $scope.ListDonVi = response.data;
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadDonViDuocQuanLy();

    $scope.LoadNam = function () {
        $http({
            method: 'GET',
            url: 'api/KhenThuong/LoadListNam',
        }).then(function successCallback(response) {
            $scope.ListNam = response.data;
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadNam();

    $scope.LoadDanhMuc('ListDanhHieu', 'LDH')
    $scope.LoadDanhMuc('ListHTKT', 'HTKT')


    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

        $scope.item = $("#fixTable").html();


    });
});
