angular.module('WebApiApp').controller('TapTheController', function ($rootScope, $scope, $http, $timeout) {
    $rootScope.CurDanhSach = null;
    $scope.LoadDanhMuc('LoaiDanhHieu', 'LDH');
    $scope.itemKT = {
        IdDonvi: $rootScope.CurDonVi.Id,
        Nam: $rootScope.CurYear
    }
    $scope.Save = function (item) {
        if (!item.IdDoituong) {
            toastr.error('Chưa chọn tập thể hoặc tập thể đã được chọn trước đó!', 'Thông báo');
            return;
        }
        if (!item.MaDanhhieu) {
            toastr.error('Chưa chọn danh hiệu !', 'Thông báo');
            return;
        }
        item.IdKhenthuong = $scope.IdDSDeNghi;
        $http({
            method: 'POST',
            url: '/api/KhenThuong/SaveDoiTuongKhenThuong',
            data: item
        }).then(function successCallback(response) {
            toastr.success('', 'Đã lưu');
            if (!item.Id)
                $scope.itemKT = {
                    IdDonvi: $rootScope.CurDonVi.Id,
                    Nam: $rootScope.CurYear
                }
            $scope.LoadListTapThe();
        }, function errorCallback(response) {

            toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
        });
    }
    $scope.Reset = function () {
        $scope.itemKT = {
            IdDonvi: $rootScope.CurDonVi.Id,
            Nam: $rootScope.CurYear
        }
    }

    $rootScope.LoadDSDeNghi = function () {
        $http({
            method: 'GET',
            url: '/api/KhenThuong/LoadDanhSach',
            params: {
                IdDonvi: $rootScope.CurDonVi.Id,
                Nam: $rootScope.CurYear,
                Trangthai: 0,
                Loai: "TAPTHE"
            }
        }).then(function successCallback(response) {
            $scope.DSDeNghi = response.data;

            if ($scope.DSDeNghi.length)
                $scope.IdDSDeNghi = $scope.DSDeNghi[0].Id;
            else $scope.IdDSDeNghi = 0;

            if ($rootScope.CurDanhSach)
                $scope.IdDSDeNghi = $rootScope.CurDanhSach.Id;

            $scope.LoadListTapThe();

        }, function errorCallback(response) {

            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $rootScope.LoadDSDeNghi();
    $scope.EditDSDeNghi = function () {
        $scope.itemDS = $scope.DSDeNghi.filter(t => t.Id == $scope.IdDSDeNghi)[0];
        $scope.openModal($scope.itemDS, 'DanhSachDeNghi','TAPTHE');
    }
    $scope.DeleteDSDeNghi = function () {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này?'))
            $http({
                method: 'GET',
                url: '/api/KhenThuong/DelDanhSach',
                params: {
                    Id: $scope.IdDSDeNghi
                }
            }).then(function successCallback(response) {
                $rootScope.CurDanhSach = null;
                $rootScope.LoadDSDeNghi();
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });
    }

    $scope.LoadDoiTuongKhenThuong = function () {

        $http({
            method: 'GET',
            url: '/api/KhenThuong/LoadDoiTuongKhenThuong',
            params: {
                IdKhenthuong: $scope.IdDSDeNghi,
                IdDonvi: $rootScope.CurDonVi.Id,
                Chuaduyet: false
            }
        }).then(function successCallback(response) {
            $scope.ListDoiTuong = response.data;
            
            angular.forEach($scope.ListTapThe, function (cn, key) {
                angular.forEach($scope.ListDoiTuong, function (dt, key) {
                    if (cn.Id == dt.IdDoituong) cn.Check = true;
                });
            });

        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
        });
    }
    $scope.DeleteDoiTuongKhenThuong = function (id) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này?'))
            $http({
                method: 'GET',
                url: '/api/KhenThuong/DeleteDoiTuongKhenThuong',
                params: {
                    IdDoiTuongKhenThuong: id
                }
            }).then(function successCallback(response) {
                $scope.LoadListTapThe();
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });
    }

    $scope.LoadListTapThe = function () {
        $rootScope.CurDanhSach = $scope.DSDeNghi.filter(t => t.Id == $scope.IdDSDeNghi)[0];
        $http({
            method: 'GET',
            url: '/api/DMTapThe/LoadTapTheByDonVi',
            params: {
                IdDonvi: $rootScope.CurDonVi.Id
            }
        }).then(function successCallback(response) {
            $scope.ListTapThe = response.data;
            $scope.LoadDoiTuongKhenThuong();
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.GuiDanhSach = function () {
        if (confirm('Bạn có chắc chắn muốn gửi danh sách này lên cấp trên. Sau khi gửi duyệt, bạn sẽ ko thể chỉnh sửa dữ liệu!'))
            $http({
                method: 'GET',
                url: '/api/KhenThuong/GuiDanhSachDeNghi',
                params: {
                    IdKhenthuong: $scope.IdDSDeNghi
                }
            }).then(function successCallback(response) {
                toastr.success('Đã gửi danh sách đề nghị !', 'Thông báo');
                $rootScope.LoadDSDeNghi();
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình gửi dữ liệu !', 'Thông báo');
            });
    }
    //$(document).keypress(function (e) {
    //    var key = e.which;
    //    if (key == 13)  // the enter key code
    //    {
    //        $scope.Save($scope.itemKT);
    //        return false;
    //    }
    //});   
});
