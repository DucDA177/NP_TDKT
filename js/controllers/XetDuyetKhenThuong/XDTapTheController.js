angular.module('WebApiApp').controller('XDTapTheController', function ($rootScope, $scope, $http, $timeout) {
    $rootScope.CurDanhSach = null;
    $scope.LoadDVCon = function () {
        $http({
            method: 'GET',
            url: '/api/DonVi/GetDonViCon',
            params: {
                ParId: $rootScope.CurDonVi.Id,
                typeDV: 0,
                searchkey: 0
            }
        }).then(function successCallback(response) {
            $scope.ListDV = response.data;
            if ($scope.ListDV.length > 0) {
                $rootScope.SelectedDonVi = $scope.ListDV[0];
                $scope.IdSelectedDV = $rootScope.SelectedDonVi.Id;
                $rootScope.LoadDSDeNghi();
            }

        }, function errorCallback(response) {

            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadDVCon();

    $scope.OnChangeDV = function () {
        $rootScope.SelectedDonVi = $scope.ListDV.filter(t => t.Id == $scope.IdSelectedDV)[0];
        $rootScope.LoadDSDeNghi();
    }
    $rootScope.LoadDSDeNghi = function () {
        $http({
            method: 'GET',
            url: '/api/ToTrinh/LoadToTrinh',
            params: {
                IdDonvi: $rootScope.SelectedDonVi.Id,
                Nam: $rootScope.CurYear,
            }
        }).then(function successCallback(response) {
            $scope.DSDeNghi = response.data;

            if ($scope.DSDeNghi.length > 0)
                $scope.IdDSDeNghi = $scope.DSDeNghi[0].Id;
            else $scope.IdDSDeNghi = 0;

            if ($rootScope.CurDanhSach)
                $scope.IdDSDeNghi = $rootScope.CurDanhSach.Id;

            $scope.LoadDoiTuongKhenThuong();

        }, function errorCallback(response) {

            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }

    $scope.Chuaduyet = false;
    $scope.LoadDoiTuongKhenThuong = function () {

        $http({
            method: 'GET',
            url: '/api/KhenThuong/LoadDoiTuongKhenThuong',
            params: {
                IdTotrinh: $scope.IdDSDeNghi,
                Chuaduyet: $scope.Chuaduyet,
                Loai: 'TAPTHE'
            }
        }).then(function successCallback(response) {
            $scope.ListDoiTuong = response.data;

        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }


});
