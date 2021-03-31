angular.module('WebApiApp').controller('LapToTrinhController', function ($rootScope, $scope, $http, $timeout) {

    $rootScope.SelectedDoiTuong = [];
    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi": $rootScope.CurDonVi.Id,
        "Searchkey": "",
        "Loai": "0",
        "Check": false
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
        if (confirm('Bạn có chắc chắn muốn xóa tờ trình này. Việc xóa tờ trình cũng sẽ xóa các đối tượng khỏi tờ trình đó ?'))
            $http({
                method: 'GET',
                url: 'api/ToTrinh/Delete?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.Load();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Lỗi ! ' + response.data.Message, 'Thông báo');

            });

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
            url: 'api/ToTrinh/LoadAllDoiTuong?pageNumber='
                + $scope.Paging.currentPage + '&pageSize=' + $scope.Paging.pageSize
                + '&Searchkey=' + $scope.Paging.Searchkey + '&IdDonvi=' + $scope.Paging.IdDonvi
                + '&Loai=' + $scope.Paging.Loai
        }).then(function successCallback(response) {

            $scope.ListDoiTuong = response.data.ListOut;

            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;

            angular.forEach($scope.ListDoiTuong, function (value1, key) {
                angular.forEach($rootScope.SelectedDoiTuong, function (value2, key) {
                    if (value1.Id == value2.Id) {
                        value1.Check = true;
                        value2.dtkt = null;
                    }

                });
            });

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $rootScope.Load();

    $scope.OnCheckAll = function () {
        angular.forEach($scope.ListDoiTuong, function (value, key) {
            value.Check = $scope.Paging.Check;
            $scope.OnCheck(value)
        });

    }
    $scope.OnCheck = function (item) {
        let check = $rootScope.SelectedDoiTuong.filter(t => t.Id != item.Id)

        if (item.Check && check.length == $rootScope.SelectedDoiTuong.length) {
            $rootScope.SelectedDoiTuong.push(item)
        }
        if (!item.Check && check.length != $rootScope.SelectedDoiTuong.length) {
            $rootScope.SelectedDoiTuong = check
        }

    }
});
