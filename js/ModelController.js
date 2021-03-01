angular.module('WebApiApp').controller("ModalDMDonViHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    // console.log($scope.item)
    $scope.type = $scope.$resolve.type;
    $scope.ArrThongTinKhac = []
    if ($scope.item != null && $scope.item != null && $scope.item != '') {
        try { $scope.ArrThongTinKhac = JSON.parse($scope.item.ThongTinKhac) } catch{ }

        $scope.LoadProvin('0', '0', '0');
        $scope.LoadProvin($scope.item.IDTinh, $scope.item.IDHuyen, $scope.item.IDXa);
        //console.log($scope.item)
    }
    else {
        $scope.LoadProvin('0', '0', '0');
        $scope.item = {
            FInUse: true
        }
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }


    $scope.SaveModal = function () {
        $scope.item.ThongTinKhac = JSON.stringify($scope.ArrThongTinKhac)

        $http({
            method: 'POST',
            url: 'api/DonVi/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadDMDonVi", {});
            $rootScope.LoadDMDonVi();
            $scope.cancelModal();
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.SaveAndNew = function () {
        $scope.item.ThongTinKhac = JSON.stringify($scope.ArrThongTinKhac)

        $http({
            method: 'POST',
            url: 'api/DonVi/Save',
            data: $scope.item
        }).then(function successCallback(response) {

            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadDMDonVi", {});
            $rootScope.LoadDMDonVi();
            $scope.item = '';
            $scope.ArrThongTinKhac = []
            //console.log($scope.ArrThongTinKhac)
            $scope.itemError = "";
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.ValidMaDv = function () {

        $http({
            method: 'GET',
            url: 'api/DonVi/ValidMaDV?MaDV=' + $scope.item.MaDonVi,
        }).then(function successCallback(response) {
            if (response.data == null || response.data == [] || response.data == '' || response.data == undefined)
                toastr.success('Có thể sử dụng mã này!', 'Thông báo');
            else {
                toastr.error('Mã này đã sử dụng!', 'Thông báo');
                $scope.item.MaDonVi = ''
            }
        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }

    $scope.LoadLoaiTruong = function () {

        $http({
            method: 'GET',
            url: 'api/DonVi/LoadLoaiTruong',
        }).then(function successCallback(response) {
            $scope.LoaiTruong = response.data;

        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }

    $scope.ValidOnlyCode = function (FCode) {
        if (typeof $scope.item == 'undefined') {
            $scope.item = {};

        }
        $http({
            method: 'GET',
            url: '/api/CheckValidPosition/' + FCode,
        }).then(function successCallback(response) {

            if (response.data != 'undefined') {
                $scope.item = response.data;
                toastr.warning('Mã này đã tồn tại !', 'Thông báo');
            }
            else {

                $scope.item.Id = 0;
                $scope.item.FName = null;
                $scope.item.FDescription = null;
                toastr.success('Có thể sử dụng mã này !', 'Thông báo');
            }
        }, function errorCallback(response) {
        });
    }
    if ($scope.item != null) $scope.read = true;
    else {
        $scope.item = {};
        $scope.read = false;
    }
    $scope.LoadLoaiTruong();

    $scope.LoadAllDonVi();
});

angular.module('WebApiApp').controller("ModalDMChungHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;
    if ($scope.item == null || $scope.item == undefined || $scope.item == '') {
        $scope.item = {
            FInUse: true,
            Maloai: $scope.check.Ma,
            IdCha: $scope.check.Id
        }
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }


    $scope.SaveModal = function () {

        $http({
            method: 'POST',
            url: 'api/DMChung/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadDMChung", {});
            $rootScope.LoadDMChung();
            $scope.cancelModal();
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.SaveAndNew = function () {


        $http({
            method: 'POST',
            url: 'api/DMChung/Save',
            data: $scope.item
        }).then(function successCallback(response) {

            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadDMChung", {});
            $rootScope.LoadDMChung();
            $scope.item = {
                FInUse: true,
                Maloai: $scope.check.Ma,
                IdCha: $scope.check.Id
            }
            document.getElementById("Ma").focus();
            $scope.itemError = "";
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.ValidMa = function () {

        $http({
            method: 'GET',
            url: 'api/DMChung/ValidMa?Ma=' + $scope.item.Ma + '&IdCha=' + $scope.item.IdCha,
        }).then(function successCallback(response) {
            if (response.data == null || response.data == [] || response.data == '' || response.data == undefined)
                toastr.success('Có thể sử dụng mã này!', 'Thông báo');
            else {
                toastr.error('Mã này đã sử dụng!', 'Thông báo');
                $scope.item.Ma = ''
            }
        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }
    $(document).keyup(function (e) {
        if (e.which == 13) {
            $scope.SaveAndNew();
        }
    });
});
angular.module('WebApiApp').controller("ModalDMChaHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;
    if ($scope.item == null || $scope.item == undefined || $scope.item == '') {
        $scope.item = {
            FInUse: true
        }
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }


    $scope.SaveModal = function () {

        $http({
            method: 'POST',
            url: 'api/DMChung/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadDMChung", {});
            $rootScope.LoadDMCha();
            $scope.cancelModal();
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.SaveAndNew = function () {


        $http({
            method: 'POST',
            url: 'api/DMChung/Save',
            data: $scope.item
        }).then(function successCallback(response) {

            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadDMChung", {});
            $rootScope.LoadDMCha();
            $scope.item = {
                FInUse: true
            }
            $scope.itemError = "";
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.ValidMa = function () {

        $http({
            method: 'GET',
            url: 'api/DMChung/ValidMa?Ma=' + $scope.item.Ma + '&IdCha=' + $scope.item.IdCha,
        }).then(function successCallback(response) {
            if (response.data == null || response.data == [] || response.data == '' || response.data == undefined)
                toastr.success('Có thể sử dụng mã này!', 'Thông báo');
            else {
                toastr.error('Mã này đã sử dụng!', 'Thông báo');
                $scope.item.Ma = ''
            }
        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }

});
angular.module('WebApiApp').controller("ModalHoSoDonViHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.LoadProvin('0', '0', '0')

    if ($scope.item == null || $scope.item == undefined || $scope.item == '') {
        $scope.item = {
            FInUse: true,
            Loai: $scope.$resolve.check,
            Matinh: '30'
        }
        $scope.LoadProvin("0", "0", "0");
        $scope.LoadProvin($scope.DefaultArea, "0", "0");
    }
    else {
        if ($scope.item.Ngaysinh)
            $scope.item.Ngaysinh = new Date($scope.item.Ngaysinh);
        if ($scope.item.Ngaycap)
            $scope.item.Ngaycap = new Date($scope.item.Ngaycap);
        if ($scope.item.Ngayhethan)
            $scope.item.Ngayhethan = new Date($scope.item.Ngayhethan);
        $scope.LoadProvin("0", "0", "0");
        $scope.LoadProvin($scope.item.Matinh, $scope.item.Mahuyen, '0');
    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.Save = function (isNew) {
        if ($scope.Validate() != 1) {
            var str = $scope.Validate();
            toastr.error(str, "Thông báo");
            return;
        }
        $http({
            method: "POST",
            url: 'api/HoSoDonVi/Save',
            data: $scope.item,
        }).then(
            function successCallback(response) {
                toastr.success("Lưu dữ liệu thành công!", "Thông báo");
                $scope.item = response.data;
                if (isNew == 1) {
                    $scope.item = {
                        FInUse: true,
                        Loai: $scope.$resolve.check,
                        Matinh: '30'
                    }
                } else $scope.cancelModal();

                $rootScope.LoadDonVi();
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.Validate = function () {
        if (!$scope.item.Hovaten) return "Họ và tên bắt buộc nhập!";
        if (!$scope.item.Matinh) return "Tỉnh/ Thành phố bắt buộc chọn!";
        if (!$scope.item.Mahuyen) return "Quận/ Huyện bắt buộc chọn!";
        if (!$scope.item.Maxa) return "Xã/ Phường bắt buộc chọn!";
        try {
            $scope.item.Ngaysinh = ConvertToDate($scope.item.Ngaysinh);
            $scope.item.Ngaycap = ConvertToDate($scope.item.Ngaycap);
            $scope.item.Ngayhethan = ConvertToDate($scope.item.Ngayhethan);
        } catch { }
        return 1;
    };

});
angular.module('WebApiApp').controller("ModalCanBoNhanVienHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $timeout) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;
    $scope.LoadProvin('30', '0', '0')

    if ($scope.item == null || $scope.item == undefined || $scope.item == '') {
        $scope.item = {
            FInUse: true,
        }
    }
    else {
        if ($scope.item.Ngaysinh)
            $scope.item.Ngaysinh = new Date($scope.item.Ngaysinh);

    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.Save = function (isNew) {
        if ($scope.Validate() != 1) {
            var str = $scope.Validate();
            toastr.error(str, "Thông báo");
            return;
        }
        $http({
            method: "POST",
            url: 'api/CanBoNhanVien/Save',
            data: $scope.item,
        }).then(
            function successCallback(response) {
                toastr.success("Lưu dữ liệu thành công!", "Thông báo");
                $scope.item = response.data;
                if (isNew == 1) {
                    $scope.item = {
                        FInUse: true,
                    }
                } else $scope.cancelModal();

                $rootScope.LoadCanBoNhanVien();
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.Validate = function () {
        if (!$scope.item.Hovaten) return "Họ và tên bắt buộc nhập!";
        if (!$scope.item.Macap) return "Đơn vị trực thuộc bắt buộc chọn!";
        if (!$scope.item.Chucvu) return "Chức vụ bắt buộc nhập!";
        return 1;
    };

});
angular.module('WebApiApp').controller("ModalThongBaoHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    if ($scope.item == null || $scope.item == undefined || $scope.item == '') {
        $scope.item = {
            FInUse: true,
            NguoiGui: $rootScope.user.HoTen
        }
    } else {
        if ($scope.item.DonViNhan != null && $scope.item.DonViNhan != '') $scope.CacDonVi = JSON.parse($scope.item.DonViNhan)
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    $scope.LoadDMDonVi = function () {

        $http({
            method: 'GET',
            url: 'api/DonVi/LoadAllDonVi'
        }).then(function successCallback(response) {

            $scope.ListDonVi = response.data.filter(t => t.Id != $rootScope.CurDonVi.Id);

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $scope.LoadDMDonVi();

    $scope.SaveModal = function () {
        $scope.item.DonViNhan = JSON.stringify($scope.CacDonVi)
        $http({
            method: 'POST',
            url: 'api/ThongBao/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadThongBao", {});
            $rootScope.LoadThongBao();
            $scope.cancelModal();
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.SaveAndNew = function () {
        $scope.item.DonViNhan = JSON.stringify($scope.CacDonVi)

        $http({
            method: 'POST',
            url: 'api/ThongBao/Save',
            data: $scope.item
        }).then(function successCallback(response) {

            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadThongBao", {});
            $rootScope.LoadThongBao();
            $scope.item = {
                FInUse: true,
                NguoiGui: $rootScope.user.HoTen
            }
            $scope.itemError = "";
            $scope.LoadDMDonVi();
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }


});
angular.module('WebApiApp').controller("ModalConfigHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.itemUser = $scope.$resolve.item;
    $scope.item = {};
    if ($scope.itemUser.GhiChu) {
        $scope.item = JSON.parse($scope.itemUser.GhiChu)
        if ($scope.item.LoaiHoSo != undefined && $scope.item.LoaiHoSo.length == 20)
            $scope.checkAll = true;
    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.onCheckAll = function () {
        $scope.item.LoaiHoSo = []
        if ($scope.checkAll) {
            angular.forEach($scope.LoaiHoSo, function (value, key) {
                $scope.item.LoaiHoSo.push(value.Ma)
            });
        }

    }
    $scope.SaveModal = function () {
        if (!$scope.item.CanBo) {
            toastr.error('Tên cán bộ quản lý bắt buộc nhập', 'Thông báo');
            return;
        }
        $scope.itemUser.GhiChu = JSON.stringify($scope.item);
        $http({
            method: 'POST',
            url: '/api/UserProfiles',
            data: $scope.itemUser
        }).then(function successCallback(response) {
            toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');
            //$scope.itemUser.Config = $scope.item;
            $scope.cancelModal();
        }, function errorCallback(response) {
            //$scope.itemUserError = response.data;
            toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
        });
    }


});



//Quản lý hồ sơ NCC
angular.module("WebApiApp").controller("ModalHoSoNCCHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;
    $scope.LoadProvin($scope.DefaultArea, "0", "0");
    $scope.UploadTypes = [
        { Code: 1, Name: 'Thêm mới' },
        { Code: 2, Name: 'Bổ sung' }
    ]
    if ($scope.item == null || $scope.item == undefined || $scope.item == "") {
        $scope.item = {
            'GioiTinh': true,
            'ThoiKy_Id': 0,
            'TrangThai': 2,
            'TinhTrang': 0,
            'Huyen_Id': 0,
            'NguoiDung_Id': $rootScope.user.Id,
            'Nam': new Date().getFullYear(),
            'MaLoaiHoSo': $scope.check,
            'UploadType': 1
        };

    } else {

        $scope.item.NgayQD = new Date($scope.item.NgayQD);
        $scope.item.UploadType = 2;
    }

    $scope.Save = function (isNew) {
        if ($scope.Validate() != 1) {
            var str = $scope.Validate();
            toastr.error(str, "Thông báo");
            return;
        }
        if ($scope.ListFileUpLoad.length > 0) $scope.item.Hienthi = 1
        if ($scope.item.GioiTinh) $scope.item.GioiTinh = true
        else $scope.item.GioiTinh = false
        $scope.item.NgaySinh = $scope.item.NamSinh
        $scope.item.Vitriluu = $scope.item.HopSo
        $http({
            method: "POST",
            url: "api/HoSoNCC/SaveHS",
            data: $scope.item,
        }).then(
            function successCallback(response) {
                toastr.success("Lưu dữ liệu thành công!", "Thông báo");

                if ($scope.ListFileUpLoad.length > 0)
                    $scope.uploadFiles(response.data.Id);
                $rootScope.LoadHS();
                $scope.cancelModal();

                if (isNew == 1) $scope.openModal('', 'HoSoNCC')

            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );

    };
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $scope.SplitName = function () {
        $scope.item.Hodem = $scope.item.HoTen.split(" ").slice(0, -1).join(" ");
        $scope.item.Ten = $scope.item.HoTen.split(" ").slice(-1).join(" ");
        $scope.item.Hovaten = $scope.item.HoTen.split(" ")[0] + " " + $scope.item.Ten;

    };

    $scope.Validate = function () {
        if (!$scope.item.HoTen) return "Họ và tên bắt buộc nhập!";
        if (!$scope.item.SoHS) return "Số hồ sơ bắt buộc nhập!";
        if (!$scope.item.HopSo) return "Vị trí lưu bắt buộc nhập!";

        if ($scope.item.NamSinh >= new Date().getFullYear())
            return "Năm sinh không đúng!";

        try {

            $scope.item.NgayQD = ConvertToDate($scope.item.NgayQD);

        } catch { }
        return 1;
    };

    $scope.LoadFileUpload = function () {
        //debugger
        if (
            $scope.item.Id != null &&
            $scope.item.Id != undefined &&
            $scope.item.Id != ""
        )
            $http({
                method: "GET",
                url:
                    "/api/Files/LoadFilebyHSNCC?Id=" + $scope.item.Id,
            }).then(
                function successCallback(response) {
                    $scope.ListFileUpLoad = response.data;

                },
                function errorCallback(response) {
                    toastr.error("Có lỗi trong quá trình tải dữ liệu !", "Thông báo");
                }
            );
        else $scope.ListFileUpLoad = [];
    };
    var formdata = new FormData();
    $scope.getTheFiles = function ($files) {
        // formdata = new FormData();
        angular.forEach($files, function (value, key) {
            formdata.append(key, value, value.name);
            var o = {
                FName: value.name,
                key: key,
                filename: value.path,
                isSaved: false,
            };
            $scope.ListFileUpLoad.push(o);

        });

    };
    $scope.RemoveFile = function (index, link) {
        if (confirm('Bạn có chắc chắn xóa tệp này?')) {
            $scope.ListFileUpLoad.splice(index, 1);

            $http({
                method: "GET",
                url: "api/Files/RemoveFile?link=" + link,
            })
                .success(function (response) { })
                .error(function (response) {
                    //  console.log(response)
                });
        }
    };
    $scope.uploadFiles = function (Id) {
        var request = {
            method: "POST",
            url: "api/Files/UploadFileHSNCC?Id=" + Id + '&UploadType=' + $scope.item.UploadType,
            data: formdata,
            headers: {
                "Content-Type": undefined,
            },
        };
        $http(request)
            .success(function (d) {
                $scope.ListFileUpLoad = [];
                formdata = new FormData();
            })
            .error(function () {
                toastr.error(
                    "Có lỗi trong quá trình tải lên tệp đính kèm!",
                    "Thông báo"
                );
            });
    };

    $scope.ValidSoHS = function () {
        if (!$scope.item.HopSo) {
            toastr.error("Vui lòng nhập vị trí lưu trước !", "Thông báo");
            $scope.item.SoHS = '';
            return;
        }
        $http({
            method: "GET",
            url: "api/HoSoNCC/ValidSoHS?SoHS=" + $scope.item.SoHS
                + '&MaLoaiHoSo=' + $scope.item.MaLoaiHoSo + '&HopSo=' + $scope.item.HopSo,
        }).then(
            function successCallback(response) {
                if (response.data.length > 0) {
                    toastr.error("Số Hồ sơ này đã sử dụng. Vui lòng nhập lại !", "Thông báo");
                    $scope.item.SoHS = ''
                }
            },
            function errorCallback(response) {
                toastr.error("Có lỗi trong quá trình tải dữ liệu !", "Thông báo");
            }
        );

    };
    $scope.OnOptionThemMoi = function () {
        $scope.ListFileUpLoad = $scope.ListFileUpLoad.filter(t => !t.isSaved);
    }

    $scope.LoadFileUpload();
});
angular.module("WebApiApp").controller("ModalPhieuMuonHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    angular.forEach($scope.item, function (value, key) {
        value.TenLoaiHS = $scope.LoaiHoSo.filter(t => t.Ma == value.MaLoaiHoSo)[0].Ten
    });
    // $scope.TenLoaiHS = $scope.LoaiHoSo.filter(t => t.Ma == $scope.item[0].MaLoaiHoSo)[0].Ten

    var date = new Date(); // Now
    date.setMonth(date.getMonth() + 1);

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $scope.Phieu = {
        Maphieu: '',
        Ngaydangky: new Date(),
        Ngayhentra: date,
        Lydo: 'Mục đích khai thác, sử dụng hồ sơ: Giải quyết chính sách',
        Tennguoimuon: $rootScope.user.HoTen,
        Tennguoilap: $rootScope.user.HoTen,
        trangthai: 1,
        UserID: $rootScope.user.Id,
        Soluonghoso: '',
        Hoso: {},
        columnPhieu: 'PM'
    }

    $scope.Save = function (isNew) {
        $scope.Phieu.Hoso = $scope.item.filter(t => t.Check == true)
        $scope.Phieu.Soluonghoso = $scope.Phieu.Hoso.length

        if ($scope.Phieu.Ngayhentra < $scope.Phieu.Ngaydangky) {
            toastr.error("Ngày hẹn trả không được nhỏ hơn ngày đăng ký!", "Thông báo");
            return;
        }

        if ($scope.Phieu.Ngaydangky instanceof Date)
            $scope.Phieu.Ngaydangky = ConvertToDate($scope.Phieu.Ngaydangky)
        if ($scope.Phieu.Ngayhentra instanceof Date)
            $scope.Phieu.Ngayhentra = ConvertToDate($scope.Phieu.Ngayhentra)


        if (!$scope.Phieu.Tennguoimuon) {
            toastr.error("Người đăng ký bắt buộc nhập!", "Thông báo");
            return;
        }
        if ($scope.Phieu.Soluonghoso == 0) {
            toastr.error("Không có hồ sơ nào được chọn!", "Thông báo");
            return;
        }
        $http({
            method: "POST",
            url: "api/DKHoSo/SavePhieu",
            data: $scope.Phieu
        }).then(
            function successCallback(response) {
                toastr.success("Cập nhập phiếu đăng ký mượn thành công!", "Thông báo");
                $scope.Phieu = response.data;
                $rootScope.LoadHS();
                $scope.cancelModal();
                $rootScope.SelectedHoSo = []
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GetMa = function () {
        $http({
            method: "GET",
            url: "api/DKHoSo/GetMaPhieu?Tiento=" + $scope.Phieu.columnPhieu,
        }).then(
            function successCallback(response) {
                $scope.Phieu.Maphieu = response.data
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GetMa()
});
angular.module("WebApiApp").controller("ModalViewPDFHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $(document).contextmenu(function () { return false; });
    url = $scope.check;
    var thePdf = null;
    var scale = 1;
    pdfjsLib.getDocument(url).promise.then(function (pdf) {

        thePdf = pdf;
        viewer = document.getElementById('pdf-viewer');
        for (page = 1; page <= pdf.numPages; page++) {
            canvas = document.createElement('canvas');
            canvas.className = 'pdf-page-canvas';
            viewer.appendChild(canvas);
            renderPage(page, canvas);
        }
    });
    function renderPage(pageNumber, canvas) {
        thePdf.getPage(pageNumber).then(function (page) {
            viewport = page.getViewport(scale);
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport });
        });
    }
    // console.log($scope.item)

});
angular.module("WebApiApp").controller("ModalPhieuDiChuyenHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    angular.forEach($scope.item, function (value, key) {
        value.TenLoaiHS = $scope.LoaiHoSo.filter(t => t.Ma == value.MaLoaiHoSo)[0].Ten
    });
    // $scope.TenLoaiHS = $scope.LoaiHoSo.filter(t => t.Ma == $scope.item[0].MaLoaiHoSo)[0].Ten

    var date = new Date(); // Now
    date.setMonth(date.getMonth() + 1);

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $scope.Phieu = {
        Maphieu: '',
        Ngaydangky: new Date(),
        Ngayhentra: date,
        Lydo: 'Mục đích khai thác, sử dụng hồ sơ: Di chuyển hồ sơ',
        Tennguoimuon: $rootScope.user.HoTen,
        Tennguoilap: $rootScope.user.HoTen,
        trangthai: 4,
        UserID: $rootScope.user.Id,
        Soluonghoso: '',
        Hoso: {},
        columnPhieu: 'PDC'
    }
    $scope.Save = function (isNew) {
        $scope.Phieu.Hoso = $scope.item.filter(t => t.Check == true)
        $scope.Phieu.Soluonghoso = $scope.Phieu.Hoso.length

        if ($scope.Phieu.Ngayhentra < $scope.Phieu.Ngaydangky) {
            toastr.error("Ngày hẹn trả không được nhỏ hơn ngày đăng ký!", "Thông báo");
            return;
        }
        if ($scope.Phieu.Ngaydangky instanceof Date)
            $scope.Phieu.Ngaydangky = ConvertToDate($scope.Phieu.Ngaydangky)
        if ($scope.Phieu.Ngayhentra instanceof Date)
            $scope.Phieu.Ngayhentra = ConvertToDate($scope.Phieu.Ngayhentra)


        if (!$scope.Phieu.Tennguoimuon) {
            toastr.error("Người đăng ký bắt buộc nhập!", "Thông báo");
            return;
        }
        if ($scope.Phieu.Soluonghoso == 0) {
            toastr.error("Không có hồ sơ nào được chọn!", "Thông báo");
            return;
        }
        $http({
            method: "POST",
            url: "api/DKHoSo/SavePhieu",
            data: $scope.Phieu
        }).then(
            function successCallback(response) {
                toastr.success("Cập nhập phiếu đăng ký di chuyển thành công!", "Thông báo");
                $scope.Phieu = response.data;
                $rootScope.LoadHS();
                $scope.cancelModal();
                $rootScope.SelectedHoSo = []
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GetMa = function () {
        $http({
            method: "GET",
            url: "api/DKHoSo/GetMaPhieu?Tiento=" + $scope.Phieu.columnPhieu,
        }).then(
            function successCallback(response) {
                $scope.Phieu.Maphieu = response.data
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GetMa()
});
angular.module("WebApiApp").controller("ModalPhieuSaoLucHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    angular.forEach($scope.item, function (value, key) {
        value.TenLoaiHS = $scope.LoaiHoSo.filter(t => t.Ma == value.MaLoaiHoSo)[0].Ten
    });
    // $scope.TenLoaiHS = $scope.LoaiHoSo.filter(t => t.Ma == $scope.item[0].MaLoaiHoSo)[0].Ten

    var date = new Date(); // Now
    date.setMonth(date.getMonth() + 1);

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $scope.Phieu = {
        Maphieu: '',
        Ngaydangky: new Date(),
        Ngayhentra: date,
        Lydo: 'Mục đích khai thác, sử dụng hồ sơ: Sao lục hồ sơ',
        Tennguoimuon: $rootScope.user.HoTen,
        Tennguoilap: $rootScope.user.HoTen,
        trangthai: 6,
        UserID: $rootScope.user.Id,
        Soluonghoso: '',
        Hoso: {},
        columnPhieu: 'PSL'
    }
    $scope.Save = function (isNew) {
        $scope.Phieu.Hoso = $scope.item.filter(t => t.Check == true)
        $scope.Phieu.Soluonghoso = $scope.Phieu.Hoso.length

        if ($scope.Phieu.Ngayhentra < $scope.Phieu.Ngaydangky) {
            toastr.error("Ngày hẹn trả không được nhỏ hơn ngày đăng ký!", "Thông báo");
            return;
        }
        if ($scope.Phieu.Ngaydangky instanceof Date)
            $scope.Phieu.Ngaydangky = ConvertToDate($scope.Phieu.Ngaydangky)
        if ($scope.Phieu.Ngayhentra instanceof Date)
            $scope.Phieu.Ngayhentra = ConvertToDate($scope.Phieu.Ngayhentra)


        if (!$scope.Phieu.Tennguoimuon) {
            toastr.error("Người đăng ký bắt buộc nhập!", "Thông báo");
            return;
        }
        if ($scope.Phieu.Soluonghoso == 0) {
            toastr.error("Không có hồ sơ nào được chọn!", "Thông báo");
            return;
        }
        $http({
            method: "POST",
            url: "api/DKHoSo/SavePhieu",
            data: $scope.Phieu
        }).then(
            function successCallback(response) {
                toastr.success("Cập nhập phiếu đăng ký sao lục thành công!", "Thông báo");
                $scope.Phieu = response.data;
                $rootScope.LoadHS();
                $scope.cancelModal();
                $rootScope.SelectedHoSo = []
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GetMa = function () {
        $http({
            method: "GET",
            url: "api/DKHoSo/GetMaPhieu?Tiento=" + $scope.Phieu.columnPhieu,
        }).then(
            function successCallback(response) {
                $scope.Phieu.Maphieu = response.data
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GetMa()
});

angular.module("WebApiApp").controller("ModalDSHoSoDKMuonHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    //$scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };

    $scope.item = {
        "MaLoaiHoSo": '0',
        "TrangThai": 1,
        "SoHS": '',
        "HoTen": '',
        "Ten": '',
        "NguyenQuan": '',
        "TruQuan": '',
        "pageSize": 100,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
    }
    $scope.PrePage = function () {
        if ($scope.item.currentPage > 1) {
            $scope.item.currentPage = $scope.item.currentPage - 1;
            $scope.LoadDS();
        }

    }
    $scope.NextPage = function () {
        if ($scope.item.currentPage < $scope.item.totalPage) {
            $scope.item.currentPage = parseInt($scope.item.currentPage) + 1;
            if ($scope.item.currentPage == $scope.item.totalPage) {
                $scope.item.currentPage == $scope.item.totalPage
            }
            $scope.LoadDS();
        }

    }
    $scope.LoadDS = function () {
        if ($scope.item.totalPage != 0) {
            if ($scope.item.currentPage > $scope.item.totalPage)
                $scope.item.currentPage = $scope.item.totalPage
            if ($scope.item.currentPage < 1)
                $scope.item.currentPage = 1
        }
        $http({
            method: "POST",
            url: "api/DKHoSo/LoadDSHoSoDKMuon",
            data: $scope.item
        }).then(
            function successCallback(response) {
                //console.log(response.data)
                $scope.HoSoDKMuon = response.data.ListOut;
                $scope.item.totalCount = response.data.totalCount;
                $scope.item.pageStart = response.data.pageStart;
                $scope.item.totalPage = response.data.totalPage;
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Có lỗi trong quá trình tải dữ liệu! " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.LoadDanhMuc('LoaiHoSo', 'LHS', '', '', '')
    $scope.LoadDS();

});
angular.module("WebApiApp").controller("ModalDSLuotMuonHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };

    $scope.LoadDS = function () {

        $http({
            method: "GET",
            url: "api/HoSoNCC/GetDSLuotMuon?IdDoiTuong=" + $scope.item.Id,
        }).then(
            function successCallback(response) {
                $scope.DSLuotMuon = response.data;
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Có lỗi trong quá trình tải dữ liệu! " + response.data.Message, "Thông báo");
            }
        );
    };

    $scope.LoadDS();



});

angular.module("WebApiApp").controller("ModalLapPhieuMuonHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.itemIn = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;
    $scope.isPrinted = true;
    $scope.CheckAll = false
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $scope.OnCheckAll = function () {
        angular.forEach($scope.item, function (value, key) {
            value.hs.Check = $scope.CheckAll
        });
    }

    $scope.Save = function (isNew) {

        $scope.DataUpdate = {
            pm: $scope.item[0].pm,
            hsm: $scope.item.filter(t => t.hs.Check).map(item => item.hsm)
        }
        $scope.DataUpdate.pm.trangthai = $scope.check;
        $scope.DataUpdate.pm.UserIDChomuon = $rootScope.user.Id;
        if ($scope.DataUpdate.hsm.length == 0) {
            toastr.warning("Không có hồ sơ nào được chọn", "Thông báo");
            return;
        }

        if ($scope.DataUpdate.pm.Ngaydangky instanceof Date)
            $scope.DataUpdate.pm.Ngaydangky = ConvertToDate($scope.DataUpdate.pm.Ngaydangky)
        if ($scope.DataUpdate.pm.Ngayhentra instanceof Date)
            $scope.DataUpdate.pm.Ngayhentra = ConvertToDate($scope.DataUpdate.pm.Ngayhentra)


        if (!$scope.DataUpdate.pm.Tennguoimuon) {
            toastr.error("Người đăng ký bắt buộc nhập!", "Thông báo");
            return;
        }

        $http({
            method: "POST",
            url: "api/DKHoSo/UpdatePhieu",
            data: $scope.DataUpdate
        }).then(
            function successCallback(response) {
                toastr.success("Cập nhập phiếu thành công!", "Thông báo");
                $rootScope.LoadHS();
                $scope.cancelModal();
                if ($scope.isPrinted) $scope.exportPhieu($scope.DataUpdate.pm.id, $scope.check)
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GetItem = function () {
        $http({
            method: "GET",
            url: "api/MuonTra/LoadHoSoMuonByPhieu?IdPhieu=" + $scope.itemIn[0].pm.id + '&Tinhtrang=' + $scope.itemIn[0].hsm.Tinhtrang,
        }).then(
            function successCallback(response) {
                $scope.item = response.data;
                if ($scope.item[0].pm.Ngaydangky)
                    $scope.item[0].pm.Ngaydangky = new Date($scope.item[0].pm.Ngaydangky);
                if ($scope.item[0].pm.Ngayhentra)
                    $scope.item[0].pm.Ngayhentra = new Date($scope.item[0].pm.Ngayhentra);
                console.log($scope.item[0])
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GetItem();
});
angular.module("WebApiApp").controller("ModalLapPhieuTraHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;
    $scope.isPrinted = true;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $scope.Phieu = {
        Maphieu: '',
        Ngaytra: new Date(),
        Lydo: '',
        Tennguoimuon: '',
        Tennguoilap: $rootScope.user.HoTen,
        trangthai: 3,
        UserID: $rootScope.user.Id,
        UserIDChomuon: 0,
        Soluonghoso: '',
        Hoso: {},
        columnPhieu: 'PTRA'
    }
    $scope.OnChangeUserSelect = function () {

        if (!$scope.Phieu.UserIDChomuon) {
            $scope.Phieu.Tennguoimuon = '';
            return
        }
        $scope.Phieu.Tennguoimuon = $scope.ListUser.filter(t => t.Id == $scope.Phieu.UserIDChomuon)[0].HoTen
    }
    $scope.Save = function (isNew) {
        $scope.Phieu.Hoso = $scope.item.filter(t => t.Check == true).map(t => t.hsm)
        $scope.Phieu.Soluonghoso = $scope.Phieu.Hoso.length


        if ($scope.Phieu.Ngaytra instanceof Date)
            $scope.Phieu.Ngaytra = ConvertToDate($scope.Phieu.Ngaytra)


        if (!$scope.Phieu.UserIDChomuon) {
            toastr.error("Người trả hồ sơ bắt buộc chọn!", "Thông báo");
            return;
        }
        if (!$scope.Phieu.Tennguoilap) {
            toastr.error("Người lập phiếu bắt buộc nhập!", "Thông báo");
            return;
        }
        if ($scope.Phieu.Soluonghoso == 0) {
            toastr.error("Không có hồ sơ nào được chọn!", "Thông báo");
            return;
        }

        $http({
            method: "POST",
            url: "api/DKHoSo/SavePhieuTra",
            data: {
                pm: $scope.Phieu,
                hsm: $scope.Phieu.Hoso
            }
        }).then(
            function successCallback(response) {
                toastr.success("Cập nhập phiếu trả hồ sơ thành công!", "Thông báo");
                $rootScope.SelectedHoSoTra = []
                $rootScope.LoadHS();
                $scope.cancelModal();

                if ($scope.isPrinted) $scope.exportPhieu(response.data, 3)
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GetMa = function () {
        $http({
            method: "GET",
            url: "api/DKHoSo/GetMaPhieu?Tiento=" + $scope.Phieu.columnPhieu,
        }).then(
            function successCallback(response) {
                $scope.Phieu.Maphieu = response.data
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GetMa()
    $scope.LoadAllUsers = function () {

        $http({
            method: 'GET',
            url: 'api/UserProfiles',
        }).then(function successCallback(response) {
            $scope.ListUser = response.data;
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $scope.LoadAllUsers()
});
angular.module("WebApiApp").controller("ModalChonOCungHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;

    $scope.OnSubFolder = function (parFolder) {
        if ($scope.check == 'backup')
            $scope.item.Folder = parFolder;
        if ($scope.check == 'restore_bak') {
            if (!parFolder.includes('.bak')) {
                toastr.error("Không phải định dạng tệp tin cơ sở dữ liệu<.bak>. Vui lòng kiểm tra lại!", "Thông báo");
                return;
            }
            $scope.item.LinkDatabase = parFolder;
        }

        if ($scope.check == 'restore_datancc')
            $scope.item.LinkDataNCC = parFolder;

        $scope.cancelModal();
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };

    $scope.OnSelectDisk = function (parFolder, close) {
        if ($scope.ServerPath.includes(parFolder)) {
            if (confirm('Ổ cứng ' + parFolder
                + ' chứa dữ liệu gốc. Việc sao lưu nên được thực hiện ở ổ cứng khác. Bạn có chắc chắn tiếp tục?'))
                $scope.LoadSubFolders(parFolder)
        }
        else $scope.LoadSubFolders(parFolder)

        if (close) $scope.OnSubFolder(parFolder)
    }
    $scope.LoadAllDrives = function () {

        $http({
            method: "GET",
            url: "api/BackupRestore/GetAllDrives",
        }).then(
            function successCallback(response) {
                $scope.AllDrives = response.data.ls;
                console.log($scope.AllDrives)
                $scope.ServerPath = response.data.server;
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.LoadAllDrives();

    $scope.LoadSubFolders = function (parFolder) {

        $http({
            method: "GET",
            url: "api/BackupRestore/GetSubFolders",
            params: {
                "parFolder": parFolder
            }
        }).then(
            function successCallback(response) {

                $scope.CurFolder = parFolder;
                $scope.SubFolders = response.data;


            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GoBack = function () {
        $http({
            method: "GET",
            url: "api/BackupRestore/GetParentFolders?subFolder=" + $scope.CurFolder,
        }).then(
            function successCallback(response) {
                $scope.LoadSubFolders(response.data.FullPath)
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    }
    $scope.NewFolder = function () {
        bootbox.prompt("Nhập tên thư mục mới", function (result) {
            if (!result)
                return;
            else
                $http({
                    method: "GET",
                    url: "api/BackupRestore/CreateFolder",
                    params: {
                        path: $scope.CurFolder + '/' + result
                    }
                }).then(
                    function successCallback(response) {
                        toastr.success("Tạo mới thư mục thành công", "Thông báo");
                        $scope.LoadSubFolders($scope.CurFolder)
                        return;
                    },
                    function errorCallback(response) {
                        //console.log(response)
                        toastr.error("Lỗi " + response.data.Message, "Thông báo");
                    }
                );
        });


    }
});
angular.module("WebApiApp").controller("ModalDeleteBakHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $scope.ListBakChecked = []
    $scope.Check = false;

    $scope.OnCheckAll = function () {
        angular.forEach($scope.ListBak, function (value, key) {
            value.Check = $scope.Check;
            $scope.OnCheck(value)
        });

    }
    $scope.OnCheck = function (item) {
        let check = $scope.ListBakChecked.filter(t => t.Id != item.Id)

        if (item.Check && check.length == $scope.ListBakChecked.length) {
            $scope.ListBakChecked.push(item)
        }
        if (!item.Check && check.length != $scope.ListBakChecked.length) {
            $scope.ListBakChecked = check
        }

    }
    $scope.LoadAllBak = function () {

        $http({
            method: "GET",
            url: "api/BackupRestore/LoadAllBak",
        }).then(
            function successCallback(response) {
                $scope.ListBak = response.data
            },
            function errorCallback(response) {

                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.LoadAllBak();

    $scope.DeleteBak = function () {
        if ($scope.ListBakChecked.length == 0) {
            toastr.error("Không có bản ghi nào được chọn!", "Thông báo");
            return;
        }
        if (confirm('Bạn có chắc chắn thực hiện thao tác này?'))
            $http({
                method: "POST",
                url: "api/BackupRestore/DeleteBak",
                data: $scope.ListBakChecked
            }).then(
                function successCallback(response) {
                    toastr.success("Xóa dữ liệu thành công!", "Thông báo");
                    $scope.LoadAllBak();
                    $rootScope.LoadLogBackup();
                },
                function errorCallback(response) {

                    toastr.error("Lỗi " + response.data.Message, "Thông báo");
                }
            );
    };
});
angular.module("WebApiApp").controller("ModalRestoreHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $scope.dtb = true; $scope.hsncc = true;
    if (!$scope.item.LinkDatabase) $scope.dtb = false;
    if (!$scope.item.LinkDataNCC) $scope.hsncc = false;
    $scope.progress = 0;

    $scope.Restore = function () {

        if (!$scope.dtb && !$scope.hsncc) {
            toastr.error('Chọn ít nhất một loại dữ liệu để phục hồi!', 'Thông báo');
            return;
        }
        $scope.progress = 1;
        $scope.Handleprog = setInterval(function () {
            if ($scope.progress < 99) {
                $scope.progress++;
                $scope.$apply();
            }

        }, 2000);

        $http({
            method: 'POST',
            url: '/api/BackupRestore/Restore',
            data: {
                "bk": $scope.item,
                "dtb": $scope.dtb,
                "hsncc": $scope.hsncc
            }
        }).then(function successCallback(response) {

            //bootbox.alert(
            //    "<b>Kết quả phục hồi dữ liệu: </b> </br>" +
            //    //"<b> - Cơ sở dữ liệu : " + response.data.LinkDatabase + "</b> </br>" +
            //    //"<b> - Hồ sơ NCC : " + response.data.LinkDataNCC + "</b> </br>" +
            //    "<b> Bao gồm : " + response.data.fileCopy + " tệp được khôi phục </b> </br>"
            //);
            clearInterval($scope.Handleprog);
            $scope.progress = 100;
            toastr.success('Phục hồi dữ liệu thành công!', 'Thông báo');
        }, function errorCallback(response) {
            toastr.error('Có lỗi xảy ra! ' + response.data.Message, 'Thông báo');
            clearInterval($scope.Handleprog);
            $scope.progress = 0;
        });
    }

});
angular.module("WebApiApp").controller("ModalRestoreLogHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };

    $scope.LoadRestoreLog = function () {


        $http({
            method: 'GET',
            url: '/api/BackupRestore/LoadRestoreLog',
        }).then(function successCallback(response) {
            $scope.ListRsLog = response.data;
        }, function errorCallback(response) {
            toastr.error('Có lỗi xảy ra!', 'Thông báo');

        });
    }
    $scope.LoadRestoreLog();
});
angular.module("WebApiApp").controller("ModalSetBackupConfigHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    if ($rootScope.CurDonVi.TTGui == '1') {
        $scope.item.dtb = false;
        $("#dtb").attr('disabled', 'disabled');
    }

    $scope.LoadConfig = function () {
        $http({
            method: "GET",
            url: "/api/BackupRestore/LoadConfig",
        }).then(
            function successCallback(response) {


                $rootScope.LoadConfig();

                if (response.data) {
                    $scope.item = response.data;
                    $scope.item.time = new Date();
                    $scope.item.time.setHours($scope.item.hour);
                    $scope.item.time.setMinutes($scope.item.min);

                }

            },
            function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            }
        );
    }
    $scope.LoadConfig();

    $scope.Save = function () {

        if (!$scope.item.Folder) {
            toastr.error('Chưa chọn đường dẫn lưu!', 'Thông báo');
            return;
        }
        if (!$scope.item.dtb && !$scope.item.hsncc) {
            toastr.error('Chọn ít nhất một loại sao lưu!', 'Thông báo');
            return;
        }
        if (!$scope.item.time) {
            toastr.error('Chưa chọn thời gian sao lưu tự động trong ngày!', 'Thông báo');
            return;
        }
        $scope.item.hour = $scope.item.time.getHours();
        $scope.item.min = $scope.item.time.getMinutes();
        $scope.item.isActive = true;

        $http({
            method: 'POST',
            url: '/api/BackupRestore/SetTimeBackup',
            data: $scope.item
        }).then(function successCallback(response) {
            toastr.success('Đã thiết lập lịch tự động sao lưu lúc ' + $scope.item.hour
                + ' giờ ' + $scope.item.min + ' phút hàng ngày', 'Thông báo');

            $scope.LoadConfig();

        }, function errorCallback(response) {
            toastr.error('Có lỗi xảy ra!', 'Thông báo');

        });
    }
    $scope.CancelJob = function () {
        // $scope.item.isActive = false;
        $http({
            method: 'GET',
            url: '/api/BackupRestore/CancelTimeBackup',
        }).then(function successCallback(response) {
            toastr.success('Đã hủy lịch tự động sao lưu lúc ' + $scope.item.hour
                + ' giờ ' + $scope.item.min + ' phút hàng ngày', 'Thông báo');

            $scope.LoadConfig();

        }, function errorCallback(response) {
            toastr.error('Có lỗi xảy ra!', 'Thông báo');

        });
    }

});
