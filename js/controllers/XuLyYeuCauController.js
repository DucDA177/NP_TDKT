angular.module('WebApiApp').controller('XuLyYeuCauController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$stateParams', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $stateParams) {
    
    if (!isNaN($stateParams.param))
        $("#clickTab2").click()

    $scope.Del = function (Id, fn) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/ThongBao/Del?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                fn();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }
    $scope.UpdateTT = function (item, fn) {

        $http({
            method: 'POST',
            url: 'api/ThongBao/Save',
            data: item
        }).then(function successCallback(response) {
            fn();
        }, function errorCallback(response) {

        });

    }
}]);
angular.module('WebApiApp').controller('DatLaiMatKhauController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.Paging = {
        "pageSize": 15,
        "pageStart": 0,
        "pageEnd": 0,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "Loai": 1,
        "TrangThai": 0
    };
    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $scope.LoadYCDoiMK()
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $scope.LoadYCDoiMK()
        }

    }

    $scope.LoadYCDoiMK = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
        $http({
            method: 'GET',
            url: 'api/ThongBao/LoadYeuCauDoiMK?pageNumber=' + $scope.Paging.currentPage
                + '&pageSize=' + $scope.Paging.pageSize + '&TrangThai='
                + $scope.Paging.TrangThai + '&Loai=' + $scope.Paging.Loai
        }).then(function successCallback(response) {
            $scope.ListYCDoiMK = response.data.ListOut;
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $scope.LoadYCDoiMK();

    $scope.ResetPass = function (item) {
        bootbox.prompt({
            title: "Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản " + item.NguoiGui
                + "? Mật khẩu đặt lại mặc định là aBc@123. Vui lòng nhập lại mật khẩu nếu có sự thay đổi!",
            value: 'aBc@123',
            callback: function (result) {
                if (!result) return;
                $http({
                    method: 'GET',
                    url: 'api/Account/DatLaiMatKhau?username=' + item.NguoiGui
                        + '&password=' + result
                }).then(function successCallback(response) {
                    toastr.success('Đặt lại mật khẩu thành công cho tài khoản ' + item.NguoiGui + '. Mật khẩu sau khi đặt lại là ' + result, 'Thông báo');
                    item.TrangThai = 2;
                    $scope.UpdateTT(item, $scope.LoadYCDoiMK);
                }, function errorCallback(response) {
                    toastr.error('Đặt lại mật khẩu không thành công! Vui lòng kiểm tra lại', 'Thông báo');
                });
            }
        });

    }
}]);

angular.module('WebApiApp').controller('MoKhoaHoSoController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.Paging = {
        "pageSize": 15,
        "pageStart": 0,
        "pageEnd": 0,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "Loai": 2,
        "TrangThai": 0,
        "MaLoaiHoSo": '0',
        "IsLock": 2
    };

    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $scope.LoadYCMoKhoaHS()
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $scope.LoadYCMoKhoaHS()
        }

    }

    $scope.LoadYCMoKhoaHS = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
        $http({
            method: 'POST',
            url: 'api/ThongBao/LoadYeuCauMoKhoaHS',
            data: $scope.Paging
        }).then(function successCallback(response) {
            $scope.ListYCMoKhoaHS = response.data.ListOut;
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.MoKhoaHS = function (item) {
        if (confirm('Bạn có chắc chắn muốn mở khóa hồ sơ này?')) {
            item.hs.IsLock = 0;
            $http({
                method: 'POST',
                url: 'api/HoSoNCC/SaveHS',
                data: item.hs
            }).then(function successCallback(response) {
                toastr.success('Mở khóa hồ sơ thành công!', 'Thông báo');
                item.tb.TrangThai = 2;
                $scope.UpdateTT(item.tb, $scope.LoadYCMoKhoaHS);
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình mở khóa hồ sơ!', 'Thông báo');
            });
        }
    }
    $scope.KhoaHS = function (item) {
        if (confirm('Bạn có chắc chắn muốn khóa hồ sơ này?')) {
            item.hs.IsLock = 1;
            $http({
                method: 'POST',
                url: 'api/HoSoNCC/SaveHS',
                data: item.hs
            }).then(function successCallback(response) {
                toastr.success('Khóa hồ sơ thành công!', 'Thông báo');
                $scope.LoadYCMoKhoaHS();
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình mở khóa hồ sơ!', 'Thông báo');
            });
        }
    }
    $scope.LoadDanhMuc('LoaiHoSo', 'LHS', '', '', '')
    $scope.LoadYCMoKhoaHS()
}]);