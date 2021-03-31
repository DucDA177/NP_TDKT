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
angular.module('WebApiApp').controller("ModalDMCacThanhVienHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $timeout) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    if (!$scope.item) {
        $scope.item = {
            IdDonvi: $scope.check,
            Gioitinh: 'Nam'
        }
    }
    else {
        if ($scope.item.Ngaysinh)
            $scope.item.Ngaysinh = new Date($scope.item.Ngaysinh);
        $scope.item.Hovaten = $scope.item.Hodem + ' ' + $scope.item.Ten;
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
        if ($scope.item.Ngaysinh instanceof Date)
            $scope.item.Ngaysinh = ConvertToDate($scope.item.Ngaysinh);
        $http({
            method: "POST",
            url: 'api/DMCacThanhVien/Save',
            data: $scope.item,
        }).then(
            function successCallback(response) {
                toastr.success("Lưu dữ liệu thành công!", "Thông báo");
                $scope.item = response.data;
                $rootScope.Load();
                $scope.cancelModal();
                if (isNew == 1)
                    $scope.openModal('', 'DMCacThanhVien', $scope.check)
                try {
                    $rootScope.SelectedDoiTuong.push($scope.item)
                } catch{ }
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.Validate = function () {
        if (!$scope.item.Hovaten) return "Họ và tên bắt buộc nhập!";
        if (!$scope.item.Chucvu) return "Chức vụ bắt buộc nhập!";

        $scope.item.Hodem = $scope.item.Hovaten.split(" ").slice(0, -1).join(" ");
        $scope.item.Ten = $scope.item.Hovaten.split(" ").slice(-1).join(" ");
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
angular.module('WebApiApp').controller("ModalDMTapTheHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $timeout) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    if (!$scope.item) {
        $scope.item = {
            IdDonvi: $scope.check
        }
    }
    else {
        if ($scope.item.Ngaysinh)
            $scope.item.Ngaysinh = new Date($scope.item.Ngaysinh);
    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.IsCheckAll = false
    $scope.SelectedCN = []
    $scope.OnCheckAll = function () {
        angular.forEach($scope.ListCaNhan, function (value, key) {
            value.Check = $scope.IsCheckAll;
            //$scope.OnCheck(value)
        });

    }
    //$scope.OnCheck = function (item) {
    //    let check = $scope.SelectedCN.filter(t => t.Id != item.Id)

    //    if (item.Check && check.length == $scope.SelectedCN.length) {
    //        $scope.SelectedCN.push(item)
    //    }
    //    if (!item.Check && check.length != $scope.SelectedCN.length) {
    //        $scope.SelectedCN = check
    //    }

    //}

    $scope.Save = function (isNew) {
        if ($scope.Validate() != 1) {
            var str = $scope.Validate();
            toastr.error(str, "Thông báo");
            return;
        }
        if ($scope.item.Ngaysinh instanceof Date)
            $scope.item.Ngaysinh = ConvertToDate($scope.item.Ngaysinh);

        if ($scope.ListCaNhan.filter(t => t.Check).length == 0) {
            toastr.error("Vui lòng chọn ít nhất 1 thành viên !", "Thông báo");
            return;
        }
        $http({
            method: "POST",
            url: 'api/DMTapThe/Save',
            data: { tt: $scope.item, listCN: $scope.ListCaNhan, Nam: $rootScope.CurYear },
        }).then(
            function successCallback(response) {
                toastr.success("Lưu dữ liệu thành công !", "Thông báo");
                $scope.item = response.data;
                $rootScope.Load();
                $scope.cancelModal();
                if (isNew == 1)
                    $scope.openModal('', 'DMTapThe', $scope.check);
                try {
                    $rootScope.SelectedDoiTuong.push($scope.item)
                } catch{ }
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.Validate = function () {
        if (!$scope.item.Ten) return "Tên tập thể bắt buộc nhập!";
        return 1;
    };
    $scope.ValidateSelectedCN = function () {
        if (!$scope.item.Id) return;
        $http({
            method: 'GET',
            url: '/api/DMTapThe/LoadCaNhanTapThe',
            params: {
                IdTapThe: $scope.item.Id,
                Nam: $rootScope.CurYear
            }
        }).then(function successCallback(response) {
            if (response.data.length > 0)
                angular.forEach($scope.ListCaNhan, function (cn, key) {

                    angular.forEach(response.data, function (sel, key) {
                        if (cn.Id == sel.IdCanhan)
                            cn.Check = true;
                    });

                });
            //$scope.ListCaNhan = response.data;
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadListCaNhan = function () {

        $http({
            method: 'GET',
            url: '/api/DMCacThanhVien/LoadCaNhanByDonVi',
            params: {
                IdDonvi: $rootScope.CurDonVi.Id
            }
        }).then(function successCallback(response) {
            $scope.ListCaNhan = response.data;
            $scope.ValidateSelectedCN();
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadListCaNhan();
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

angular.module('WebApiApp').controller("ModalDanhSachDeNghiHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    if (!$scope.item) $scope.item = {
        IdDonvi: $rootScope.CurDonVi.Id,
        Nam: $rootScope.CurYear,
        Loai: $scope.$resolve.check
    }
    $scope.Save = function (isNew) {

        $http({
            method: 'POST',
            url: '/api/KhenThuong/SaveDanhSach',
            data: $scope.item
        }).then(function successCallback(response) {
            toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');
            $rootScope.LoadDSDeNghi();
            $scope.cancelModal();
            if (isNew == 1) $scope.openModal('', 'DanhSachDeNghi', $scope.$resolve.check);
        }, function errorCallback(response) {

            toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
        });
    }

});
angular.module('WebApiApp').controller("ModalTepDinhKemDoiTuongHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.checkCN_TT = $scope.$resolve.check;
    $scope.other = $scope.$resolve.other;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    if (!$scope.item.MaDanhhieu) {
        toastr.error('Vui lòng chọn loại danh hiệu trước !', 'Thông báo');
        $scope.cancelModal();
        return;
    }
    if ($scope.item.Trangthai) $scope.other = true;


    $scope.LoadDMGiayTo = function () {

        $http({
            method: 'GET',
            url: '/api/KhenThuong/LoadDanhMucGiayTo',
            params: {
                IdDoituongKhenthuong: $scope.item.Id,
                MaDanhhieu: $scope.item.MaDanhhieu,
                Nam: $scope.item.Nam
            }
        }).then(function successCallback(response) {

            $scope.DMGiayto = response.data;
            if ($scope.DMGiayto.length == 0) {
                toastr.error('Chưa thiết lập giấy tờ minh chứng cho danh hiệu này trong năm '
                    + $rootScope.CurYear + '. Vui lòng kiểm tra lại hoặc liên hệ cấp trên !', 'Thông báo');
                $scope.cancelModal();
            }
        }, function errorCallback(response) {

            toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadDMGiayTo();

    //var formdata;
    $scope.getTheFiles = function ($files, gt) {
        if (!gt.formdata)
            gt.formdata = new FormData();

        angular.forEach($files, function (value, key) {

            gt.formdata.append(key, value, value.name);
            var o = {
                Ten: gt[0].Ten,
                MaDanhhieu: $scope.item.MaDanhhieu,
                IdGiayto: gt[0].IdGiayto,
                IdDoituongKhenthuong: $scope.item.Id,
                Tentep: value.name,
                Duongdan: null,
            };
            gt.push(o);
            $scope.$apply();
        });

    };
    var fileIndex = 0;
    $scope.RemoveFile = function (Tentep, link, gt) {
        if (confirm('Bạn có chắc chắn xóa tệp này?')) {

            if (!link) {
                var listTentep = gt.map(t => t.Tentep);
                var curItem = listTentep.filter(t => t == Tentep)[0];
                var curIndex = listTentep.indexOf(curItem);
                gt.splice(curIndex, 1);

                gt.formdata.delete(curIndex - 1 + fileIndex);
                fileIndex++;
                return;
            }

            $http({
                method: "GET",
                url: "api/Files/RemoveFileDoiTuongKhenThuong",
                params: {
                    link: link,
                    IdGiayto: gt[0].IdGiayto,
                    IdDoituongKhenthuong: $scope.item.Id,
                    Nam: $scope.item.Nam
                }
            })
                .success(function (response) {
                    $scope.LoadDMGiayTo();
                })
                .error(function (response) {
                    //  console.log(response)
                });
        }
    };
    $scope.uploadFiles = function (gt) {

        gt.progress = 1;
        $scope.Handleprog = setInterval(function () {
            if (gt.progress < 99) {
                gt.progress++;
                gt.$apply();
            }

        }, 500);

        var request = {
            method: "POST",
            url: "api/Files/UploadFileDoiTuongKhenThuong",
            params: {
                IdDoituongKhenthuong: $scope.item.Id,
                IdGiayto: gt[0].IdGiayto,
                Nam: $scope.item.Nam,
                Loai: $scope.checkCN_TT,
            },
            data: gt.formdata,
            headers: {
                "Content-Type": undefined,
            },
        };
        $http(request)
            .success(function (d) {
                //$scope.ListFileUpLoad = [];
                gt.formdata = new FormData();
                toastr.success(
                    "Tải lên thành công!",
                    "Thông báo"
                );
                clearInterval($scope.Handleprog);
                gt.progress = 100;
            })
            .error(function () {
                toastr.error(
                    "Có lỗi trong quá trình tải lên tệp đính kèm!",
                    "Thông báo"
                );
                clearInterval($scope.Handleprog);
                gt.progress = 0;
            });
    };
});
angular.module('WebApiApp').controller("ModalDuyetDoiTuongHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;
    $scope.other = $scope.$resolve.other;
    $scope.LoadDanhMuc('HinhThucKhenThuong', 'HTKT');
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.IsDat = true;
    if ($scope.item.Trangthai == 3) {
        $scope.IsDat = false;
        $scope.check = $scope.item.Trangthai;
    }


    if ($scope.item.Ngayduyet)
        $scope.item.Ngayduyet = new Date($scope.item.Ngayduyet);

    $scope.OnchangeCheckbox = function () {
        if ($scope.IsDat)
            $scope.check = 2;
        else
            $scope.check = 3;
    }
    $scope.Save = function () {
        $scope.item.Trangthai = $scope.check;

        if ($scope.item.Trangthai == 3 || ($scope.item.Trangthai == 2 && !$scope.item.Ngayduyet)) $scope.item.Ngayduyet = new Date();
        if ($scope.item.Ngayduyet instanceof Date)
            $scope.item.Ngayduyet = ConvertToDate($scope.item.Ngayduyet);
        $http({
            method: 'POST',
            url: '/api/KhenThuong/SaveDoiTuongKhenThuong',
            data: $scope.item
        }).then(function successCallback(response) {
            toastr.success('', 'Đã cập nhật thông tin đối tượng');

            if ($scope.item.Trangthai == 2 && document.getElementById("fileQD").files.length != 0) {
                $scope.uploadFiles();
            }

            $scope.cancelModal();
            $rootScope.LoadDSDeNghi();
        }, function errorCallback(response) {

            toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
        });
    }
    var formdata = new FormData();
    $scope.getTheFiles = function ($files) {
        formdata = new FormData();
        angular.forEach($files, function (value, key) {
            formdata.append(key, value, value.name);
        });

    };
    $scope.uploadFiles = function () {

        var request = {
            method: "POST",
            url: "api/Files/UploadFileQuyetDinhKhenThuong",
            params: {
                IdDoituongKhenthuong: $scope.item.Id,
            },
            data: formdata,
            headers: {
                "Content-Type": undefined,
            },
        };
        $http(request)
            .success(function (d) {
                $rootScope.LoadDSDeNghi();
            })
            .error(function () {
                toastr.error(
                    "Có lỗi trong quá trình tải lên tệp đính kèm!",
                    "Thông báo"
                );
            });
    };
    $scope.RemoveFile = function (link) {
        if (confirm('Bạn có chắc chắn xóa tệp này?')) {

            $http({
                method: "GET",
                url: "api/Files/RemoveFileXetDuyetKhenThuong",
                params: {
                    link: link,
                    IdDoituongKhenthuong: $scope.item.Id,
                }
            })
                .success(function (response) {
                    toastr.success(
                        "Xóa tệp tin thành công",
                        "Thông báo"
                    );
                    $scope.item.Duongdan = null;
                })
                .error(function (response) {
                    toastr.error(
                        "Xóa tệp tin không thành công",
                        "Thông báo"
                    );
                });
        }
    };
});
angular.module('WebApiApp').controller("ModalLapToTrinhHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;
    $scope.other = $scope.$resolve.other;

    if (!$scope.item) {
        $scope.item = {
            IdDonvi: $rootScope.CurDonVi.Id,
            Nam: $rootScope.CurYear,
            Ngaytrinh: new Date()
        }
    }
    else {
        if ($scope.item.Ngaytrinh)
            $scope.item.Ngaytrinh = new Date($scope.item.Ngaytrinh);
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
        if ($scope.item.Ngaytrinh instanceof Date)
            $scope.item.Ngaytrinh = ConvertToDate($scope.item.Ngaytrinh);

        var ls = $rootScope.SelectedDoiTuong.filter(t => t.Check).map(t => t.dtkt)
        if (ls.length == 0) {
            toastr.error("Vui lòng chọn ít nhất 1 đối tượng !", "Thông báo");
            return;
        }
        if (confirm('Bạn có chắc chắn gửi tờ trình gồm ' + ls.length + ' đối tượng này?'))
            $http({
                method: "POST",
                url: 'api/ToTrinh/SaveToTrinh',
                data: { tt: $scope.item, ls: ls },
            }).then(
                function successCallback(response) {
                    toastr.success("Lưu dữ liệu thành công !", "Thông báo");
                    $rootScope.SelectedDoiTuong = [];
                    $rootScope.LoadDoiTuongKhenThuong();
                    $scope.cancelModal();
                },
                function errorCallback(response) {
                    //console.log(response)
                    toastr.error("Lỗi " + response.data.Message, "Thông báo");
                }
            );
    };
    $scope.Validate = function () {
        if (!$scope.item.Sototrinh) return "Số tờ trình bắt buộc nhập!";
        return 1;
    };
});
angular.module('WebApiApp').controller("ModalDoiTuongToTrinhHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;
    $scope.other = $scope.$resolve.other;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    };

    $scope.LoadDanhMuc('LoaiDanhHieu', 'LDH')
});
angular.module('WebApiApp').controller("ModalInToTrinhHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    };
    $scope.UpdateToTrinh = function (isTrinh) {

        $http({
            method: "POST",
            url: 'api/ToTrinh/UpdateToTrinh',
            data: $scope.item,
        }).then(
            function successCallback(response) {
                $scope.cancelModal();
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
});
angular.module('WebApiApp').controller("ModalInQuyetDinhHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    };
    $scope.UpdateQuyetDinh = function () {

        $http({
            method: "POST",
            url: 'api/QuyetDinh/UpdateQuyetDinh',
            data: $scope.item,
        }).then(
            function successCallback(response) {
                $scope.cancelModal();
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
});
angular.module('WebApiApp').controller("ModalDoiTuongQuyetDinhHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;
    $scope.other = $scope.$resolve.other;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    };
    console.log($scope.item)
    $scope.LoadDanhMuc('HinhThucKhenThuong', 'HTKT')
});

angular.module('WebApiApp').controller("ModalPhongTraoHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $timeout) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    if (!$scope.item) {
        $scope.item = {
            IdDonvi: $rootScope.CurDonVi.Id,
            Nam: $rootScope.CurYear,
            Trangthai: 1,
            Ngaydenghi: ConvertToDate(new Date())
        }
    }
    else {
        if ($scope.item.Ngaybatdau)
            $scope.item.Ngaybatdau = new Date($scope.item.Ngaybatdau);
        if ($scope.item.Ngayketthuc)
            $scope.item.Ngayketthuc = new Date($scope.item.Ngayketthuc);

    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.IsCheckAll = false
    $scope.SelectedCN = []
    $scope.OnCheckAll = function () {
        angular.forEach($scope.ListDonVi, function (value, key) {
            value.Check = $scope.IsCheckAll;

        });

    }


    $scope.Save = function (isNew) {
        if ($scope.Validate() != 1) {
            var str = $scope.Validate();
            toastr.error(str, "Thông báo");
            return;
        }
        if ($scope.item.Ngaybatdau instanceof Date)
            $scope.item.Ngaybatdau = ConvertToDate($scope.item.Ngaybatdau);
        if ($scope.item.Ngayketthuc instanceof Date)
            $scope.item.Ngayketthuc = ConvertToDate($scope.item.Ngayketthuc);

        if ($scope.ListDonVi.filter(t => t.Check).length == 0) {
            toastr.error("Vui lòng chọn ít nhất 1 đơn vị tham gia !", "Thông báo");
            return;
        }
        $http({
            method: "POST",
            url: 'api/PhongTrao/Save',
            data: { pt: $scope.item, listDV: $scope.ListDonVi },
        }).then(
            function successCallback(response) {
                toastr.success("Lưu dữ liệu thành công !", "Thông báo");
                $scope.item = response.data;
                $rootScope.Load();
                $scope.cancelModal();
                if (isNew == 1)
                    $scope.openModal('', 'PhongTrao');

            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.Validate = function () {
        if (!$scope.item.Ten) return "Tên phong trào bắt buộc nhập!";
        return 1;
    };
    $scope.ValidateSelectedDV = function () {
        if (!$scope.item.Id) return;
        $http({
            method: 'GET',
            url: '/api/PhongTrao/LoadDonViPhongTrao',
            params: {
                IdPhongtrao: $scope.item.Id,
            }
        }).then(function successCallback(response) {
            if (response.data.length > 0)
                angular.forEach($scope.ListDonVi, function (dv, key) {

                    angular.forEach(response.data, function (sel, key) {
                        if (dv.Id == sel.IdDonvi)
                            dv.Check = true;
                    });

                });
            //$scope.ListCaNhan = response.data;
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadListDonVi = function () {

        $http({
            method: 'GET',
            url: '/api/DonVi/GetDonViDuocQuanLy',
            params: {
                IDDVQuanLy: $rootScope.CurDonVi.Id
            }
        }).then(function successCallback(response) {
            $scope.ListDonVi = response.data;
            $scope.ValidateSelectedDV();
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadListDonVi();
});
angular.module('WebApiApp').controller("ModalDuyetPhongTraoHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $timeout) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    if ($scope.item.Ngaybatdau)
        $scope.item.Ngaybatdau = new Date($scope.item.Ngaybatdau);
    if ($scope.item.Ngayketthuc)
        $scope.item.Ngayketthuc = new Date($scope.item.Ngayketthuc);

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.LoadDVByPhongTrao = function () {
        $http({
            method: 'GET',
            url: '/api/PhongTrao/LoadInfoDonViPhongTrao',
            params: {
                IdPhongTrao: $scope.item.Id
            }
        }).then(function successCallback(response) {
            $scope.ListDonVi = response.data;
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadDVByPhongTrao();
});
angular.module('WebApiApp').controller("ModalDoiTuongVuotCapHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $timeout) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;
    $scope.LoadDanhMuc('CapKT', 'CAPKT');
    $scope.LoadDanhMuc('DanhHieu', 'LDH');
    $scope.LoadDanhMuc('HTKT', 'HTKT');

    $scope.item = {
        IdDonvi: $rootScope.CurDonVi.Id,
        Nam: $rootScope.CurYear,
        Trangthai: 5,
        IdDoituong: 0
    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.IsCheckAll = false
    $scope.OnCheckAll = function () {
        angular.forEach($scope.ListDoiTuong, function (value, key) {
            value.Check = $scope.IsCheckAll;

        });

    }


    $scope.Save = function (isNew) {
        if ($scope.Validate() != 1) {
            var str = $scope.Validate();
            toastr.error(str, "Thông báo");
            return;
        }
        if ($scope.item.Ngayduyet instanceof Date)
            $scope.item.Ngayduyet = ConvertToDate($scope.item.Ngayduyet);

        $scope.Data = [];
        angular.forEach($scope.ListDoiTuong.filter(t => t.Check), function (value, key) {
            let item = {
                IdDonvi: $rootScope.CurDonVi.Id,
                Nam: $rootScope.CurYear,
                Trangthai: 5,
                IdDoituong: value.Id,
                IdCapKT: $scope.item.IdCapKT,
                IdHinhthucKhenthuong: $scope.item.IdHinhthucKhenthuong,
                MaDanhhieu: $scope.item.MaDanhhieu,
                Ngayduyet: $scope.item.Ngayduyet,
                SoQD: $scope.item.SoQD,
                Ghichu: $scope.item.Ghichu,

            };
            $scope.Data.push(item)
        });

        $http({
            method: "POST",
            url: 'api/KhenThuong/SaveListDoiTuongKhenThuong',
            data: $scope.Data,
        }).then(
            function successCallback(response) {
                toastr.success("Lưu dữ liệu thành công !", "Thông báo");
                $rootScope.Load();
                $scope.cancelModal();
                if (isNew == 1)
                    $scope.openModal('', 'DoiTuongVuotCap');

            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.Validate = function () {
        if (!$scope.item.IdCapKT) return "Cấp khen thưởng bắt buộc nhập!";
        if (!$scope.item.IdHinhthucKhenthuong) return "Hình thức khen thưởng bắt buộc nhập!";
        if (!$scope.item.MaDanhhieu) return "Danh hiệu bắt buộc nhập!";
        if (!$scope.item.Ngayduyet) return "Ngày khen thưởng bắt buộc nhập!";
        return 1;
    };
    $scope.Searchkey = ''
    $scope.LoadListDoiTuong = function () {

        $http({
            method: 'GET',
            url: '/api/ToTrinh/LoadAllDoiTuong',
            params: {
                pageNumber: 1,
                pageSize: 0,
                Searchkey: $scope.Searchkey,
                IdDonvi: $rootScope.CurDonVi.Id,
                Loai: '0'
            }
        }).then(function successCallback(response) {
            $scope.ListDoiTuong = response.data.ListOut;
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadListDoiTuong();
});
angular.module('WebApiApp').controller("ModalThemDoiTuongToTrinhHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $timeout) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

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

    $rootScope.Load = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }

        $http({
            method: 'GET',
            url: 'api/ToTrinh/LoadAllDoiTuong?pageNumber='
                + $scope.Paging.currentPage + '&pageSize=' + $scope.Paging.pageSize
                + '&Searchkey=' + $scope.Paging.Searchkey + '&IdDonvi=' + $scope.Paging.IdDonvi
                + '&Loai=' + $scope.Paging.Loai
        }).then(function successCallback(response) {

            $scope.ListDoiTuong = response.data.ListOut;

            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;

            angular.forEach($scope.ListDoiTuong, function (value1, key) {
                angular.forEach($rootScope.SelectedDoiTuong, function (value2, key) {
                    if (value1.Id == value2.Id) {
                        value1.Check = true;
                        if (value2.dtkt)
                            value1.dtkt = value2.dtkt;
                    }

                });
            });

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $rootScope.Load();

    $scope.OnCheckAll = function () {
        angular.forEach($scope.ListDoiTuong, function (value, key) {
            value.Check = $scope.Paging.Check;
            $scope.OnCheck(value)
        });

    }
    $scope.OnCheck = function (item) {
        let check = $rootScope.SelectedDoiTuong.filter(t => t.Id != item.Id)

        if (item.Check && check.length == $rootScope.SelectedDoiTuong.length) {
            $rootScope.SelectedDoiTuong.push(item)
        }
        if (!item.Check && check.length != $rootScope.SelectedDoiTuong.length) {
            $rootScope.SelectedDoiTuong = check
        }

    }

});
