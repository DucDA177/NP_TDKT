angular.module('WebApiApp').controller('EditToTrinhController', function ($rootScope, $scope, $http, $timeout, $stateParams, $localStorage, $state) {

    if (!$rootScope.SelectedDoiTuong || $rootScope.SelectedDoiTuong.length == 0) {
        window.history.back();
        // window.location.assign('/home.html');
    }

    $scope.LoadDanhMuc('LoaiDanhHieu', 'LDH');

    $scope.item = $stateParams.myParam;
    if (!$scope.item) {
        $scope.item = {
            Id: 0,
            IdDonvi: $rootScope.CurDonVi.Id,
            Nam: $rootScope.CurYear,
            Ngaytrinh: new Date(),
            Ten: ''
        }

        if ($rootScope.SelectedPhongTrao)
            $scope.item.Ten = 'Về việc đề nghị khen thưởng dựa theo ' + $rootScope.SelectedPhongTrao.Ten
    }
    else {
        if ($scope.item.Ngaytrinh)
            $scope.item.Ngaytrinh = new Date($scope.item.Ngaytrinh);
    }



    $rootScope.SaveToTrinh = function (isTrinh) {
        if ($scope.Validate() != 1) {
            var str = $scope.Validate();
            toastr.error(str, "Thông báo");
            return;
        }
        if ($scope.item.Ngaytrinh instanceof Date)
            $scope.item.Ngaytrinh = ConvertToDate($scope.item.Ngaytrinh);
        let ls = []
        angular.forEach($rootScope.SelectedDoiTuong, function (value, key) {
            if (value.dtkt) ls.push(value.dtkt)
            else {
                let dtkt = {
                    IdTotrinh: $scope.item.Id,
                    IdDoituong: value.Id,
                    Nam: $rootScope.CurYear,
                    IdDonvi: $rootScope.CurDonVi.Id
                }
                ls.push(dtkt)
            }

        });
        $scope.item.Noidung = $("#Noidung").html();
        $http({
            method: "POST",
            url: 'api/ToTrinh/SaveToTrinh',
            data: { tt: $scope.item, ls: ls },
        }).then(
            function successCallback(response) {
                $scope.item = response.data.tt;
                angular.forEach(response.data.ls, function (value1, key) {
                    angular.forEach($rootScope.SelectedDoiTuong, function (value2, key) {
                        if (value1.IdDoituong == value2.Id)
                            value2.dtkt = value1;
                    });
                });
                if (isTrinh == 1) {
                    toastr.success("Đã gửi tờ trình lên cấp trên ", "Thông báo");
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
        if (!$scope.item.Sototrinh) return "Số tờ trình bắt buộc nhập!";
        if (!$scope.item.Ngaytrinh) return "Ngày trình bắt buộc nhập!";
        if (!$scope.item.Ten) return "Tên tờ trình bắt buộc nhập!";
        return 1;
    };

    $scope.SaveDoiTuongKhenThuong = function (item) {

        if (!item.MaDanhhieu) {
            toastr.error('Chưa chọn danh hiệu !', 'Thông báo');
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
    $scope.DeleteDoiTuongKhenThuong = function (dv) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này khỏi tờ trình?'))
            $http({
                method: 'GET',
                url: '/api/KhenThuong/DeleteDoiTuongKhenThuong',
                params: {
                    IdDoiTuongKhenThuong: dv.dtkt.Id
                }
            }).then(function successCallback(response) {
                $rootScope.SelectedDoiTuong = $rootScope.SelectedDoiTuong.filter(t => t.Id != dv.Id)
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });
    }

    $scope.HuyToTrinh = function () {
        if (!$scope.item.Id) {
            window.history.back();
            return;
        }

        if (confirm('Bạn có chắc chắn muốn hủy tờ trình này?'))
            $http({
                method: 'GET',
                url: '/api/ToTrinh/Delete',
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

        $rootScope.SaveToTrinh();

        toastr.success('Đã lưu tờ trình thành công !', 'Thông báo');
        $rootScope.SelectedDoiTuong = [];
        window.history.back();

    }
    $scope.GuiTrinh = function () {
        var checkDH = $rootScope.SelectedDoiTuong.filter(t => t.dtkt.MaDanhhieu);

        if (checkDH.length != $rootScope.SelectedDoiTuong.length) {
            toastr.error('Có đối tượng chưa được chọn danh hiệu thi đua. Vui lòng kiểm tra lại !', 'Thông báo');
            return;
        }

        $http({
            method: 'POST',
            url: '/api/KhenThuong/CheckDuGiayTo',
            data: $rootScope.SelectedDoiTuong.map(t => t.dtkt)
        }).then(function successCallback(response) {

            if (confirm('Bạn có chắc chắn gửi trình thông tin khen thưởng này. Sau khi gửi trình bạn sẽ không thể chỉnh sửa lại tờ trình?')) {
                $scope.item.Trangthai = 1;
                angular.forEach($rootScope.SelectedDoiTuong, function (value, key) {
                    value.dtkt.Trangthai = 4;
                });

                $rootScope.SaveToTrinh(1);
            }

        }, function errorCallback(response) {

            toastr.error(response.data.Message, 'Thông báo');
        });

        

    }
    $scope.InToTrinh = function () {
        $scope.item.Noidung = $("#Noidung").html();
        $scope.openModal($scope.item, 'InToTrinh');
    }
});
