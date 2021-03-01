angular.module('WebApiApp').controller('NhatKySuDungController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.LoadAllUsers = function () {

        $http({
            method: 'GET',
            url: 'api/UserProfiles',
        }).then(function successCallback(response) {
            $scope.ListUser = response.data;
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $scope.LoadAllUsers()

    $scope.Paging = {
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "username" : ""
    };
    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $scope.LoadNhatKy();
        }
    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = parseInt($scope.Paging.currentPage) + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $scope.LoadNhatKy();
        }
    }
    $scope.LoadNhatKy = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
        $http({
            method: "GET",
            url: "api/Message/LoadNhatKy?Id=" + $rootScope.CurDonVi.Id
                + '&pageNumber=' + $scope.Paging.currentPage
                + '&pageSize=' + $scope.Paging.pageSize
                + '&username=' + $scope.Paging.username
        }).then(function successCallback(response) {
            $scope.tblNhatky = response.data.ListOut;
            console.log(response.data)
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $scope.LoadNhatKy()
    $scope.Del = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa trường này ?'))
            $http({
                method: "GET",
                url: "api/Message/Del?Id=" + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $scope.LoadNhatKy();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error(response.data.Message, 'Thông báo');
            });
    }

    $scope.DelCheck = function () {
        let data = $scope.tblNhatky.filter(t => t.Check)
        if (data.length == 0) {
            toastr.error('Chưa chọn bản ghi nào!', 'Thông báo');
            return;
        }
        if (confirm('Bạn có chắc chắn muốn xóa các mục đã chọn ?'))
            $http({
                method: "POST",
                url: "api/Message/DellCheck",
                data: data
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $scope.LoadNhatKy();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error(response.data.Message, 'Thông báo');
            });
    }

    $scope.DelAll = function () {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả ?'))
            $http({
                method: "GET",
                url: "api/Message/DelAll?Id=" + $rootScope.CurDonVi.Id,
            }).then(function successCallback(response) {
                toastr.success('Đã xóa ' + response.data + ' bản ghi', 'Thông báo');
                $scope.LoadNhatKy();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error(response.data.Message, 'Thông báo');
            });
    }
}]);