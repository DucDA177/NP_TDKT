angular.module('WebApiApp').controller('LapToTrinhController', function ($rootScope, $scope, $http, $timeout) {
    $scope.LoaiDoiTuong = '0';
    $scope.Trangthai = '0';
    $scope.CheckAll = false;
    $rootScope.SelectedDoiTuong = [];
    $scope.LoadDanhMuc('LoaiDanhHieu', 'LDH');
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
        $rootScope.SelectedDoiTuong = [];
        $rootScope.LoadDSDeNghi();
    }
    $rootScope.LoadDSDeNghi = function () {
        $http({
            method: 'GET',
            url: '/api/KhenThuong/LoadDanhSach',
            params: {
                IdDonvi: $rootScope.SelectedDonVi.Id,
                Nam: $rootScope.CurYear,
                Trangthai: 0,
                Loai: $scope.LoaiDoiTuong
            }
        }).then(function successCallback(response) {
            $scope.DSDeNghi = response.data;

            if ($scope.DSDeNghi.length > 0)
                $scope.IdDSDeNghi = $scope.DSDeNghi[0].Id;
            else $scope.IdDSDeNghi = 0;
            
            $rootScope.LoadDoiTuongKhenThuong();

        }, function errorCallback(response) {

            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    
    $rootScope.LoadDoiTuongKhenThuong = function () {
        $scope.CheckAll = false;
        $http({
            method: 'GET',
            url: '/api/KhenThuong/LoadThongTinDoiTuongKhenThuong',
            params: {
                IdKhenthuong: $scope.IdDSDeNghi,
                IdDonvi: $rootScope.SelectedDonVi.Id,
                Trangthai: $scope.Trangthai
            }
        }).then(function successCallback(response) {
            $scope.ListDoiTuong = response.data;

            angular.forEach($scope.ListDoiTuong, function (value1, key) {
                angular.forEach($rootScope.SelectedDoiTuong, function (value2, key) {
                    if (value1.dtkt.Id == value2.dtkt.Id) {
                        value1.Check = value2.Check;
                    }

                });

            });

        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    
    $scope.OnCheckAll = function () {
        angular.forEach($scope.ListDoiTuong, function (value, key) {
            if (value.dtkt.Trangthai == 1) {
                value.Check = $scope.CheckAll;
                $scope.OnCheck(value)
            }
            
        });

    }
    $scope.OnCheck = function (item) {
        let check = $rootScope.SelectedDoiTuong.filter(t => t.dtkt.Id != item.dtkt.Id)

        if (item.Check && check.length == $rootScope.SelectedDoiTuong.length) {
            $rootScope.SelectedDoiTuong.push(item)
        }
        if (!item.Check && check.length != $rootScope.SelectedDoiTuong.length) {
            $rootScope.SelectedDoiTuong = check
        }

    }
    $scope.HuyTrinh = function (item) {
        if (confirm('Bạn có chắc chắn loại bỏ đối tượng này khỏi tờ trình?')) {
            item.IdTotrinh = null;
            item.Ngaytrinh = null;
            item.Trangthai = 1;
            $http({
                method: 'POST',
                url: '/api/KhenThuong/SaveDoiTuongKhenThuong',
                data: item
            }).then(function successCallback(response) {
                toastr.success('', 'Đã lưu');
                $rootScope.LoadDoiTuongKhenThuong();
            }, function errorCallback(response) {

                toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
            });
        }
       
    }
});
