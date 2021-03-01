angular.module('WebApiApp').controller("ModelUserHandlerController", function ($rootScope, $filter, $scope, $http, $uibModalInstance) {
    $scope.itemUser = $scope.$resolve.itemUser;
    $scope.GetUserGroup = function (username) {
        $http({
            method: 'GET',
            url: '/Group/GetGroupByUser',
            params: { user: username }
        }).then(function successCallback(response) {
            $scope.itemGroup = JSON.parse(response.data);
        }, function errorCallback(response) {
        });
    }

    if ($scope.itemUser == null || $scope.itemUser == undefined || $scope.itemUser == '') {
        $scope.LoadProvin('0', '0', '0');
        $scope.itemUser = {
            Gender: "Nam",
            IDDonVi: '',
            IsOnline: true
        };
        $scope.itemGroup = [];
        if ($rootScope.user.DaiDien == true) {
            $scope.itemUser.IDDonVi = $rootScope.user.IDDonVi;
            $scope.GetUserGroup($rootScope.user.UserName)
        }
    }
    else {

        $scope.LoadProvin('0', '0', '0');
        $scope.LoadProvin($scope.itemUser.IDTinh, $scope.itemUser.IDHuyen, $scope.itemUser.IDXa);

        $scope.GetUserGroup($scope.itemUser.UserName)
    }

    
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.SaveModal = function (isNew) {
        if (typeof $scope.itemUser == 'undefined') {
            $scope.itemUser = {};
        }
        
        if (typeof $scope.itemUser.Id == 'undefined' || $scope.itemUser.Id == null || $scope.itemUser.Id == '') {
            $scope.itemRegUser = {
                "UserName": $scope.itemUser.UserName,
                "Email": $scope.itemUser.Email,
                "PhoneNumber": $scope.itemUser.Mobile,
            };

            $http({
                method: 'POST',
                url: '/api/Account/Register',
                data: $scope.itemRegUser
            }).then(function successCallback(response) {
                $http({
                    method: 'POST',
                    url: '/api/UserProfiles',
                    data: $scope.itemUser
                }).then(function successCallback(response) {
                    $rootScope.LoadUser();
                    $http({
                        method: 'POST',
                        url: '/Group/SaveGroupByUser',
                        params: { user: $scope.itemUser.UserName, CodeGroup: JSON.stringify($scope.itemGroup) },
                    }).then(function successCallback(response) {

                    }, function errorCallback(response) {

                    });
                    toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');
                    $uibModalInstance.dismiss('close');
                }, function errorCallback(response) {
                    $scope.itemUserError = response.data
                    $scope.LoadError($scope.itemUserError.ModelState);
                });

            }, function errorCallback(response) {
                $scope.itemUserError = response.data
                $scope.LoadError($scope.itemUserError.ModelState);

            });
        }
        else {
            $http({
                method: 'POST',
                url: '/api/UserProfiles',
                data: $scope.itemUser
            }).then(function successCallback(response) {
                $rootScope.LoadUser();
                $http({
                    method: 'POST',
                    url: '/Group/SaveGroupByUser',
                    params: { user: $scope.itemUser.UserName, CodeGroup: JSON.stringify($scope.itemGroup) },
                }).then(function successCallback(response) {

                }, function errorCallback(response) {

                });
                toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');
                $uibModalInstance.dismiss('close');
            }, function errorCallback(response) {
                $scope.itemUserError = response.data
                $scope.LoadError($scope.itemUserError.ModelState);
            });
        }

        if (isNew == 1) $scope.openEditUser('', 'User')
    }
    

    $scope.LoadGroups();


});
/* Setup blank page controller */

angular.module('WebApiApp').controller('UserManagerController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.cancelModal = function () {
        $uibModal.dismiss('close');
    }

    $scope.DeleteUser = function (username) {
        if (confirm('Bạn có chắc chắn xóa bản ghi này ko ?')) {
            $http({
                method: 'POST',
                url: '/api/UserProfiles/DeleteUser',
                params: { username: username }
            }).then(function successCallback(response) {
                toastr.warning('Đã xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadUser();
            }, function errorCallback(response) {
                toastr.error('Không xóa được dữ liệu! ' + response.data.Message, 'Thông báo');
            });
        }
    };
    
    $scope.ResetPass = function (item) {
        bootbox.prompt({
            title: "Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản " + item.UserName
                + "? Mật khẩu đặt lại mặc định là aBc@123. Vui lòng nhập lại mật khẩu nếu có sự thay đổi!",
            value: 'aBc@123',
            callback: function (result) {
                if (!result) return;
                $http({
                    method: 'GET',
                    url: 'api/Account/DatLaiMatKhau?username=' + item.UserName
                        + '&password=' + result
                }).then(function successCallback(response) {
                    toastr.success('Đặt lại mật khẩu thành công cho tài khoản ' + item.UserName + '. Mật khẩu sau khi đặt lại là ' + result, 'Thông báo');
                }, function errorCallback(response) {
                    toastr.error('Đặt lại mật khẩu không thành công! Vui lòng kiểm tra lại', 'Thông báo');
                });
            }
        });

    }

    $scope.UseChange = function () {
        $rootScope.LoadUser();
    }
    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "pageStart": 0,
        "pageEnd": 0,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "maDV": 0
    };
    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.LoadUser();
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.LoadUser();
        }

    }
    if ($rootScope.CurDonVi.NhomLoai != "ADMIN") {
        $scope.Paging.maDV = $rootScope.user.IDDonVi
    }
    $rootScope.LoadUser = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
        $http({
            method: 'GET',
            url: 'api/UserProfile/GetUsers?pageNumber=' + $scope.Paging.currentPage + '&pageSize=' + $scope.Paging.pageSize + '&searchKey=' + $scope.Paging.searchKey + '&maDV=' + $scope.Paging.maDV
        }).then(function successCallback(response) {
            console.log(response.data)
            $scope.Users = response.data.dt;
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;



        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.openEditUser = function (itemUser, type, Code) {
        if (itemUser.DonVi == null) $scope.DonVi == Code;
        if (itemUser != '' && itemUser != undefined) $scope.disabled = 'disabled'; else $scope.disabled = '';

        var templateUrl = 'views-client/template/Edit' + type + '.html?bust=' + Math.random().toString(36).slice(2);
        var controller = 'Model' + type + 'HandlerController';
        $scope.modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            animation: true,
            ariaDescribedBy: 'modal-body',
            templateUrl: templateUrl,
            controller: controller,
            controllerAs: 'vm',
            scope: $scope,
            size: 'lg',
            resolve: {
                itemUser: function () { return itemUser }
            }

        });


    }
    $scope.exportToExcel = function () {
        $http({
            method: 'POST',
            url: 'api/UserProfile/ExportDSTaiKhoan?IDDonVi=' + $scope.Paging.maDV,
            responseType: "arraybuffer"
        }).then(function successCallback(response) {
            $scope.fileOut = new Blob([response.data], { type: 'application/vnd.ms-excel' });
            saveAs($scope.fileOut, 'DSTaiKhoan.xlsx');

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
        
    }
    $scope.$on('$viewContentLoaded', function () {
        $scope.LoadAllDonVi();

        $rootScope.LoadUser();
        $scope.LoadProvin("0", "0", "0");
        ComponentsSelect2.init();

    });

}]);