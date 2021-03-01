angular.module('WebApiApp').controller('SaoLuuPhucHoiController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$stateParams', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $stateParams) {

}]);
angular.module('WebApiApp').controller('BackupController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$stateParams', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $stateParams) {
    $scope.Paging = {
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "Folder": "",
        "AutoBackup": true,
        "TimeBackup": 24,
        "dtb": true,
        "hsncc": true,
        "IsLock" : true
    };
    if ($rootScope.CurDonVi.TTGui == '1') {
        $scope.Paging.dtb = false;
        $("#dtb").attr('disabled', 'disabled');
    }
    $scope.ListBakChecked = []
    $scope.Check = false;

    $scope.OnCheckAll = function () {
        angular.forEach($scope.ListLogBackup, function (value, key) {

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

    $scope.DeleteBak = function () {
        if ($scope.ListBakChecked.length == 0) {
            toastr.error("Không có bản ghi nào được chọn!", "Thông báo");
            return;
        }
        if (confirm('Dữ liệu sao lưu mới nhất sẽ không được xóa. Bạn có chắc chắn thực hiện thao tác này?'))
            $http({
                method: "POST",
                url: "api/BackupRestore/DeleteBak",
                data: $scope.ListBakChecked
            }).then(
                function successCallback(response) {
                    toastr.success("Dọn dẹp dữ liệu thành công. Những tệp tin sao lưu gần nhất sẽ không được xóa!", "Thông báo");
                    $rootScope.LoadLogBackup();
                },
                function errorCallback(response) {

                    toastr.error("Lỗi " + response.data.Message, "Thông báo");
                }
            );
    };

    $scope.progress = 0;
    $scope.BackUp = function () {
        if (!$scope.Paging.Folder) {
            toastr.error('Chưa chọn đường dẫn lưu!', 'Thông báo');
            return;
        }
        if (!$scope.Paging.dtb && !$scope.Paging.hsncc) {
            toastr.error('Chọn ít nhất một loại sao lưu!', 'Thông báo');
            return;
        }
        if (confirm('Bạn có chắc chắn muốn sao lưu dữ liệu?')) {
            $scope.progress = 1;
            $scope.Handleprog = setInterval(function () {
                if ($scope.progress < 99) {
                    $scope.progress++;
                    $scope.$apply();
                }

            }, 1000);

            $http({
                method: 'GET',
                url: '/api/BackupRestore/BackUp',
                params: {
                    "backupFolder": $scope.Paging.Folder,
                    "dtb": $scope.Paging.dtb,
                    "hsncc": $scope.Paging.hsncc,
                    "IsLock": $scope.Paging.IsLock
                }
            }).then(function successCallback(response) {

                bootbox.alert("<b>Kết quả sao lưu: </b> </br>"
                    + "<b> - Cơ sở dữ liệu : " + response.data.LinkDatabase + "</b> </br>"
                    + "<b> - Hồ sơ NCC : " + response.data.LinkDataNCC + "</b> </br>"
                    + "<b> Bao gồm : " + response.data.fileCopy + " tệp được sao lưu mới và "
                    + response.data.fileDelete + " tệp được dọn dẹp</b> </br>"
                );
                clearInterval($scope.Handleprog);
                $scope.progress = 100;
                $rootScope.LoadLogBackup();

            }, function errorCallback(response) {
                toastr.error('Có lỗi xảy ra!', 'Thông báo');
                clearInterval($scope.Handleprog);
                $scope.progress = 0;
            });
        }
    }
    $scope.UnLockBackupFolder = function (item) {
       
        if (confirm('Bạn có chắc chắn muốn mở khóa thư mục sao lưu này?'))
            $http({
                method: "POST",
                url: "/api/BackupRestore/UnLockBackupFolder",
                data: item
            }).then(
                function successCallback(response) {
                    toastr.success("Mở khóa thư mục sao lưu thành công!", "Thông báo");
                  
                },
                function errorCallback(response) {

                    toastr.error("Lỗi " + response.data.Message, "Thông báo");
                }
            );
    };
    $scope.LockBackupFolder = function (item) {

        if (confirm('Bạn có chắc chắn muốn khóa thư mục sao lưu này?'))
            $http({
                method: "POST",
                url: "/api/BackupRestore/LockBackupFolder",
                data: item
            }).then(
                function successCallback(response) {
                    toastr.success("Khóa thư mục sao lưu thành công!", "Thông báo");

                },
                function errorCallback(response) {

                    toastr.error("Lỗi " + response.data.Message, "Thông báo");
                }
            );
    };
    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.LoadLogBackup();
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.LoadLogBackup();
        }

    }


    $rootScope.LoadLogBackup = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }

        $http({
            method: 'GET',
            url: 'api/BackupRestore/LoadLogBackup?pageNumber='
                + $scope.Paging.currentPage + '&pageSize=' + $scope.Paging.pageSize
        }).then(function successCallback(response) {
            $scope.ListLogBackup = response.data.ListOut;
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;

           // $scope.Paging.Folder = $scope.ListLogBackup[0].OriDisk;
            $scope.ListBakChecked = []
            $scope.Check = false;
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $rootScope.LoadLogBackup();

    $rootScope.LoadConfig = function () {
        $http({
            method: "GET",
            url: "/api/BackupRestore/LoadConfig",
        }).then(
            function successCallback(response) {
                $scope.CurConfig = response.data;
              
            },
            function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            }
        );
    }
    $rootScope.LoadConfig();

}]);
angular.module('WebApiApp').controller('RestoreController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$stateParams', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $stateParams) {
    $scope.Paging = {
        "LinkDatabase": '',
        "LinkDataNCC": '',
    };
    if ($rootScope.CurDonVi.TTGui == '1') {
        //$scope.Paging.dtb = false;
        $(".dtb").hide();
        
    }

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

    //$scope.dtb = false; $scope.hsncc = false;

    //if ($scope.Paging.LinkDatabase) $scope.dtb = true;
    //if ($scope.Paging.LinkDataNCC) $scope.hsncc = true;
    $scope.progress = 0;

    $scope.Restore = function () {

        if (!$scope.Paging.LinkDatabase && !$scope.Paging.LinkDataNCC) {
            toastr.error('Chọn ít nhất một loại dữ liệu để phục hồi!', 'Thông báo');
            return;
        }
        if (confirm('Bạn có chắc chắn muốn phục hồi dữ liệu?')) {
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
                    "bk": $scope.Paging,
                    "dtb": $scope.Paging.LinkDatabase ? true : false,
                    "hsncc": $scope.Paging.LinkDataNCC ? true : false
                }
            }).then(function successCallback(response) {

                clearInterval($scope.Handleprog);
                $scope.progress = 100;
                toastr.success('Phục hồi dữ liệu thành công!', 'Thông báo');
                $scope.LoadRestoreLog();
            }, function errorCallback(response) {
                toastr.error('Có lỗi xảy ra! ' + response.data.Message , 'Thông báo');
                clearInterval($scope.Handleprog);
                $scope.progress = 0;
                $scope.LoadRestoreLog();
            });
        }
    }

}]);


