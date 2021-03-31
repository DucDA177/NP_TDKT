angular.module('WebApiApp').controller('ThietLapGiayToController', function ($rootScope, $scope, $http, $timeout) {
    $scope.LoadDanhMuc('LoaiDanhHieu', 'LDH');
    $scope.ListYear = [];
    
    $scope.SelectedYear = new Date().getFullYear();
    for (var i = $scope.SelectedYear; i >= $scope.SelectedYear - 10; i--) $scope.ListYear.push(i);

    $scope.SltDanhHieu = null;
    $scope.OnSelectDanhHieu = function (item) {
        $scope.SltDanhHieu = item;
        $scope.LoadDanhMuc('LoaiGiayTo', 'LGT','','','', $scope.LoadGiayToDanhHieu);
    }
    $scope.LoadGiayToDanhHieu = function () {
        $http({
            method: 'GET',
            url: 'api/GiayToDanhHieu/Load?MaDH=' + $scope.SltDanhHieu.Ma + '&Nam=' + $scope.SelectedYear
        }).then(function successCallback(response) {

            angular.forEach($scope.LoaiGiayTo, function (gt, key) {
                angular.forEach(response.data, function (gtdh, key) {
                    if (gt.Id == gtdh.IdGiayto) gt.Check = true;
                });   
            });   

        }, function errorCallback(response) {
            toastr.warning('Lỗi !', 'Thông báo');
        });
    }
    $scope.Save = function (item) {
        $http({
            method: 'GET',
            url: 'api/GiayToDanhHieu/Save',
            params: {
                MaDH: $scope.SltDanhHieu.Ma,
                IdGiayto: item.Id,
                Nam: $scope.SelectedYear,
                isCheck: item.Check
            }
        }).then(function successCallback(response) {

            toastr.success('', 'Đã lưu');

        }, function errorCallback(response) {
            toastr.warning('Lỗi !', 'Thông báo');
        });
    }
});
