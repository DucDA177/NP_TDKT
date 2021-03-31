angular.module('WebApiApp').controller('XepHangController', function ($rootScope, $scope, $http, $timeout, $uibModal) {
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
angular.module('WebApiApp').controller('XepHangCaNhanController', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi": 0,
        "Loai": "CANHAN"
    };

    $scope.IsEdit = false;

    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.LoadCN();
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.LoadCN();
        }

    }
    $rootScope.LoadCN = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
        $scope.item = '<i>Vui lòng đợi trong quá trình tải dữ liệu báo cáo...</i>';

        $http({
            method: 'GET',
            url: 'api/BaoCao/LoadBaoCaoXepHang',
            params: {
                pageNumber: $scope.Paging.currentPage,
                pageSize: $scope.Paging.pageSize,
                IdDonvi: $scope.Paging.IdDonvi,
                Loai: $scope.Paging.Loai,
                IdCurDonVi: $rootScope.CurDonVi.Id,
                searchKey: $scope.Paging.searchKey
            }
        }).then(function successCallback(response) {

            $scope.Data = response.data.ListOut;
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;

            if ($scope.Data.length == 0) $scope.item = '<i>Không có dữ liệu...</i>'
            else
                angular.forEach($scope.Data, function (value, key) {
                    for (var i = 0; i < value.ListNam.length; i++)
                        if (i > 0 && value.ListNam[i] == value.ListNam[i - 1] + 1)
                            value.NamLienTiep++;

                });

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            $scope.item = '<i>Không có dữ liệu...</i>'
        });
    }
    $rootScope.LoadCN();

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $scope.item = $("#fixTable1").html();
    });
});
angular.module('WebApiApp').controller('XepHangTapTheController', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi": 0,
        "Loai": "TAPTHE"
    };

    $scope.IsEdit = false;

    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.LoadTT();
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.LoadTT();
        }

    }
    $rootScope.LoadTT = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
        $scope.item = '<i>Vui lòng đợi trong quá trình tải dữ liệu báo cáo...</i>';

        $http({
            method: 'GET',
            url: 'api/BaoCao/LoadBaoCaoXepHang',
            params: {
                pageNumber: $scope.Paging.currentPage,
                pageSize: $scope.Paging.pageSize,
                IdDonvi: $scope.Paging.IdDonvi,
                Loai: $scope.Paging.Loai,
                IdCurDonVi: $rootScope.CurDonVi.Id,
                searchKey: $scope.Paging.searchKey
            }
        }).then(function successCallback(response) {

            $scope.Data = response.data.ListOut;
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;

            if ($scope.Data.length == 0) $scope.item = '<i>Không có dữ liệu...</i>'
            else
                angular.forEach($scope.Data, function (value, key) {
                    for (var i = 0; i < value.ListNam.length; i++)
                        if (i > 0 && value.ListNam[i] == value.ListNam[i - 1] + 1)
                            value.NamLienTiep++;

                });

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            $scope.item = '<i>Không có dữ liệu...</i>'
        });
    }
    $rootScope.LoadTT();




    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $scope.item = $("#fixTable2").html();
    });
});
