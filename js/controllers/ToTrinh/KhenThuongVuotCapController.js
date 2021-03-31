angular.module('WebApiApp').controller('KhenThuongVuotCapController', function ($rootScope, $scope, $http, $timeout) {
    
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
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/ToTrinh/DeleteDoiTuongVuotCap?Id=' + Id,
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
            url: 'api/ToTrinh/LoadAllDoiTuongVuotCap?pageNumber='
                + $scope.Paging.currentPage + '&pageSize=' + $scope.Paging.pageSize
                + '&Searchkey=' + $scope.Paging.Searchkey + '&IdDonvi=' + $scope.Paging.IdDonvi
                + '&Loai=' + $scope.Paging.Loai + '&Nam=' + $rootScope.CurYear
        }).then(function successCallback(response) {

            $scope.ListDoiTuong = response.data.ListOut;

            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;
            

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $rootScope.Load();
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

        const table = document.querySelector('table');
        debugger
        let headerCell = null;

        for (let row of table.rows) {
            const firstCell = row.cells[1];

            if (headerCell === null || firstCell.innerText !== headerCell.innerText) {
                headerCell = firstCell;
            } else {
                headerCell.rowSpan++;
                firstCell.remove();
            }
            
        }


    });
});
