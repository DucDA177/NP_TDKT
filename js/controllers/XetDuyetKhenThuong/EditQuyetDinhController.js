angular.module('WebApiApp').controller('EditQuyetDinhController', function ($rootScope, $scope, $http, $timeout, $stateParams, $localStorage, $state) {

    if (!$rootScope.SelectedDoiTuong || $rootScope.SelectedDoiTuong.length == 0) {
        window.history.back();
        // window.location.assign('/home.html');
    }


    $scope.LoadDanhMuc('HinhThucKhenThuong', 'HTKT');

    $scope.item = $stateParams.myParam;
    if (!$scope.item) {
        $scope.item = {
            Id: 0,
            IdDonvi: $rootScope.CurDonVi.Id,
            Nam: $rootScope.CurYear,
            NgayQD: new Date()
        }
    }
    else {
        if ($scope.item.NgayQD)
            $scope.item.NgayQD = new Date($scope.item.NgayQD);
    }

    $scope.SaveQuyetDinh = function (isQD) {
        if ($scope.Validate() != 1) {
            var str = $scope.Validate();
            toastr.error(str, "Thông báo");
            return;
        }
        if ($scope.item.NgayQD instanceof Date)
            $scope.item.NgayQD = ConvertToDate($scope.item.NgayQD);
        let ls = $rootScope.SelectedDoiTuong.map(t => t.dtkt)

        $scope.item.Noidung = $("#Noidung").html();
        $http({
            method: "POST",
            url: 'api/QuyetDinh/SaveQuyetDinh',
            data: { tt: $scope.item, ls: ls },
        }).then(
            function successCallback(response) {
                $scope.item = response.data.tt;
                angular.forEach(response.data.ls, function (value1, key) {
                    angular.forEach($rootScope.SelectedDoiTuong, function (value2, key) {
                        if (value1.IdDoituong == value2.dt.Id)
                            value2.dtkt = value1;
                    });
                });
                if (isQD == 1) {
                    toastr.success("Đã công bố quyết định ", "Thông báo");
                    window.history.back();
                }
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.Validate = function () {
        if (!$scope.item.SoQD) return "Số quyết định bắt buộc nhập!";
        if (!$scope.item.NgayQD) return "Ngày quyết định bắt buộc nhập!";
        if (!$scope.item.Ten) return "Tên quyết định bắt buộc nhập!";
        return 1;
    };

    $scope.SaveDoiTuongKhenThuong = function (item) {

        if (!item.IdHinhthucKhenthuong) {
            toastr.error('Chưa chọn hình thức khen thưởng !', 'Thông báo');
            return;
        }
        $http({
            method: 'POST',
            url: '/api/KhenThuong/SaveDoiTuongKhenThuong',
            data: item
        }).then(function successCallback(response) {
            toastr.success('', 'Đã lưu');

        }, function errorCallback(response) {

            toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
        });
    }
    $scope.DeleteDoiTuongKhenThuong = function (item) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này khỏi quyết định?')) {
            item.dtkt.TieuchiKoDat = null;
            item.dtkt.Trangthai = 4;
            item.dtkt.IdQuyetdinh = null;
            item.dtkt.SoQD = null;
            item.dtkt.IdHinhthucKhenthuong = null;
            item.dtkt.Ngayduyet = null;
            $http({
                method: 'POST',
                url: '/api/KhenThuong/SaveDoiTuongKhenThuong',
                data: item.dtkt
            }).then(function successCallback(response) {
                $rootScope.SelectedDoiTuong = $rootScope.SelectedDoiTuong.filter(t => t.dt.Id != item.dt.Id)

            }, function errorCallback(response) {

                toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
            });
        }

    }

    $scope.HuyQuyetDinh = function () {
        if (!$scope.item.Id) {
            window.history.back();
            return;
        }

        if (confirm('Bạn có chắc chắn muốn hủy quyết định này?'))
            $http({
                method: 'GET',
                url: '/api/QuyetDinh/Delete',
                params: {
                    Id: $scope.item.Id
                }
            }).then(function successCallback(response) {
                $rootScope.SelectedDoiTuong = [];
                window.history.back();
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });
    }
    $scope.SaveAndExit = function () {
        var check = true;
        angular.forEach($rootScope.SelectedDoiTuong, function (value, key) {
            if (!value.dtkt.IdHinhthucKhenthuong) {
                check = false;
                return;
            }
        });

        if (!check) {
            toastr.error('Có đối tượng chưa được chọn hình thức khen thưởng. Vui lòng kiểm tra lại !', 'Thông báo');
            return;
        }

        $scope.SaveQuyetDinh();

        toastr.success('Đã lưu quyết định thành công !', 'Thông báo');
        $rootScope.SelectedDoiTuong = [];
        window.history.back();

    }
   
    $scope.InQuyetDinh = function () {
        $scope.item.Noidung = $("#Noidung").html();
        $scope.openModal($scope.item, 'InQuyetDinh');
    }
});
