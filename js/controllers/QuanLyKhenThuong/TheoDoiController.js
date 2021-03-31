angular.module('WebApiApp').controller('TheoDoiController', function ($rootScope, $scope, $http, $timeout) {
    $scope.Paging = {
        "Searchkey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi": 0,
        "Nam": 0,
        "Loaihinh": '0',
        "Trangthai": 0,
        "Searchkey": ""
    };
    if ($rootScope.CurDonVi.LoaiDonVi == "TT")
        $scope.Paging.IdDonvi = $rootScope.CurDonVi.Id;

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
            url: 'api/KhenThuong/LoadTheoDoi',
            params: {
                pageNumber: $scope.Paging.currentPage,
                pageSize: $scope.Paging.pageSize,
                Searchkey: $scope.Paging.Searchkey,
                IdDonvi: $scope.Paging.IdDonvi,
                Nam: $scope.Paging.Nam,
                Loaihinh: $scope.Paging.Loaihinh,
                Trangthai: $scope.Paging.Trangthai,
                IdCurDonVi: $rootScope.CurDonVi.Id
            }
        }).then(function successCallback(response) {

            $scope.Data = response.data.ListOut;
           
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;



        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
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
});
