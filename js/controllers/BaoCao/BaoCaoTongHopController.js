angular.module('WebApiApp').controller('BaoCaoTongHopController', function ($rootScope, $scope, $http, $timeout, $uibModal) {
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
});
angular.module('WebApiApp').controller('BaoCaoDanhHieuController', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.Paging = {
        "Searchkey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi": 0,
        "Nam": 0,
    };

    $scope.IsEdit = false;

    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.LoadDH();
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.LoadDH();
        }

    }
    $rootScope.LoadDH = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
        $scope.item = '<i>Vui lòng đợi trong quá trình tải dữ liệu báo cáo...</i>';

        $http({
            method: 'GET',
            url: 'api/BaoCao/LoadBaoCaoDanhHieu',
            params: {
                pageNumber: $scope.Paging.currentPage,
                pageSize: $scope.Paging.pageSize,
                IdDonvi: $scope.Paging.IdDonvi,
                Nam: $scope.Paging.Nam,
                IdCurDonVi: $rootScope.CurDonVi.Id
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
    $rootScope.LoadDH();

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $scope.item = $("#fixTable1").html();
    });
});
angular.module('WebApiApp').controller('BaoCaoHinhThucController', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.Paging = {
        "Searchkey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi": 0,
        "Nam": 0,
    };

    $scope.IsEdit = false;

    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.LoadHT();
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.LoadHT();
        }

    }
    $rootScope.LoadHT = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
        $scope.item = '<i>Vui lòng đợi trong quá trình tải dữ liệu báo cáo...</i>';

        $http({
            method: 'GET',
            url: 'api/BaoCao/LoadBaoCaoHinhThuc',
            params: {
                pageNumber: $scope.Paging.currentPage,
                pageSize: $scope.Paging.pageSize,
                IdDonvi: $scope.Paging.IdDonvi,
                Nam: $scope.Paging.Nam,
                IdCurDonVi: $rootScope.CurDonVi.Id
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
    $rootScope.LoadHT();

  


    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $scope.item = $("#fixTable2").html();
    });
});
