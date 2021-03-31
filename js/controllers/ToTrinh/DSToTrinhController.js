angular.module('WebApiApp').controller('DSToTrinhController', function ($rootScope, $scope, $http, $timeout, $state) {
    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi": 0,
        "Dotxuat": null,
        "Trangthai": -1
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
            url: 'api/ToTrinh/Get?pageNumber='
                + $scope.Paging.currentPage + '&pageSize=' + $scope.Paging.pageSize
                + '&searchKey=' + $scope.Paging.searchKey + '&IdDonvi=' + $rootScope.CurDonVi.Id
                + '&Nam=' + $rootScope.CurYear + '&Dotxuat=' + $scope.Paging.Dotxuat
                + '&Trangthai=' + $scope.Paging.Trangthai
        }).then(function successCallback(response) {

            $scope.ListToTrinh = response.data.ListOut;

            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;



        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $rootScope.Load();
    $scope.EditToTrinh = function (tt) {
        $http({
            method: 'GET',
            url: 'api/ToTrinh/GetDoiTuongToTrinh?IdTotrinh=' + tt.Id,
        }).then(function successCallback(response) {
            
            $rootScope.SelectedDoiTuong = response.data;
            $state.go('EditToTrinh', {
                myParam: tt
            })
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
});
