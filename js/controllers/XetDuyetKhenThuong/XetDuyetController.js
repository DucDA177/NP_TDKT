angular.module('WebApiApp').controller('XetDuyetController', function ($rootScope, $scope, $http, $timeout, $stateParams) {

    $scope.Dotxuat = $stateParams.param.FCode == 'XDKTDX' ? true : 'null'
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
                Trangthai: 1,
                Dotxuat: $scope.Dotxuat
            }
        }).then(function successCallback(response) {
            $scope.DSDeNghi = response.data;

            if ($scope.DSDeNghi.length > 0)
                $scope.IdDSDeNghi = $scope.DSDeNghi[0].Id;
            else $scope.IdDSDeNghi = 0;

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
                Loai: 'ALL'
            }
        }).then(function successCallback(response) {
            $rootScope.SelectedDoiTuong = [];
            $scope.ListDoiTuong = response.data;

            angular.forEach($scope.ListDoiTuong, function (value, key) {
                if (value.dtkt.Trangthai == 2) value.Check = true;
                if (value.dtkt.Trangthai == 3) value.Check = false;
            });
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    };

    $scope.IsCheckAll = false;
    $scope.OnCheckAll = function () {
        angular.forEach($scope.ListDoiTuong, function (value, key) {
            value.Check = $scope.IsCheckAll;
            $scope.OnCheck(value)
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
    $scope.ViewToTrinh = function () {
        $scope.SelectedToTrinh = $scope.DSDeNghi.filter(t => t.Id == $scope.IdDSDeNghi);
        if ($scope.SelectedToTrinh.length == 0) {
            toastr.error('Chưa chọn tờ trình !', 'Thông báo');
            return;
        }
        $scope.openModal($scope.SelectedToTrinh[0], 'InToTrinh', true)
    }
    $scope.XemDanhGia = function (item) {
        if (!item.Ghichu) {
            toastr.error('Đối tượng này không có đánh giá nào !', 'Thông báo');
            return;
        }
        bootbox.prompt({
            title: "Xem chi tiết đánh giá đối tượng",
            inputType: 'textarea',
            value: item.Ghichu,
            callback: function (result) {
                //console.log(result);
            }
        });

    }
    $scope.KoDuyetDoiTuong = function (item) {
        bootbox.prompt({
            title: "Nhập lý do đối tượng không đạt",
            inputType: 'textarea',
            value: item.dtkt.TieuchiKoDat ? item.dtkt.TieuchiKoDat : 'Không đạt yêu cầu' ,
            callback: function (result) {
                
                if (result == null) {

                    if (item.dtkt.Trangthai == 3)
                        item.Check = false;
                    else if (item.dtkt.Trangthai == 2)
                        item.Check = true;
                    else item.Check = null;

                    $scope.$apply();
                    return;
                }
                   
                if (result == '') {
                    toastr.error('Bắt buộc nhập lý do không đạt. Nếu không nhập lý do, đối tượng sẽ trở về trạng thái trước đó !', 'Thông báo');
                    if (item.dtkt.Trangthai == 3)
                        item.Check = false;
                    else if (item.dtkt.Trangthai == 2)
                        item.Check = true;
                    else item.Check = null;

                    $scope.$apply();
                    return;
                }
                item.dtkt.TieuchiKoDat = result;
                item.dtkt.Trangthai = 3;
                $http({
                    method: 'POST',
                    url: '/api/KhenThuong/SaveDoiTuongKhenThuong',
                    data: item.dtkt
                }).then(function successCallback(response) {
                    toastr.success('', 'Đã lưu');

                }, function errorCallback(response) {

                    toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
                });
            }
        });


    }
    $scope.HuyDuyet = function (item) {
        item.dtkt.TieuchiKoDat = null;
        item.dtkt.Trangthai = 4;
        item.dtkt.IdQuyetdinh = null;
        item.dtkt.SoQD = null;
        item.dtkt.IdHinhthucKhenthuong = null;
        item.dtkt.Ngayduyet = null;
        item.Check = null;
        $http({
            method: 'POST',
            url: '/api/KhenThuong/SaveDoiTuongKhenThuong',
            data: item.dtkt
        }).then(function successCallback(response) {
            //toastr.success('', 'Đã lưu');

        }, function errorCallback(response) {

            toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
        });
    }
   
});
