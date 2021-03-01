angular.module('WebApiApp').controller("ModelMenuHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.itemMenu = $scope.$resolve.itemMenu;
    $scope.selectedGroup = []
    try {
        $http({
            method: 'GET',
            url: 'api/Group/LoadGroupbyMenu?codeMn=' + $scope.itemMenu.FCode
        }).then(function successCallback(response) {
            debugger
            $scope.selectedGroup = response.data;

        }, function errorCallback(response) {
            toastr.error('Có lỗi xảy ra trong quá trình tải dữ liệu !', 'Thông báo');
        });
    } catch{ }
    if ($scope.selectedGroup == [] || $scope.selectedGroup.length == 0)
        $scope.selectedGroup = ["ADMIN"];

    $scope.OnLoad = function () {
        App.initAjax();
        ComponentsSelect2.init();

    }

    $scope.LoadListBox = function () {

        if (typeof $scope.itemMenu != 'undefined') {
            $scope.itemMenuPermission = JSON.parse($scope.itemMenu.Permission);
        } else
            $scope.itemMenuPermission = JSON.parse('[""]');

        $scope.LoadAllGroup();
    }

    $scope.LoadAllGroup = function () {
        //if ($scope.CoCode == "")
        //    return;
        $http({
            method: 'GET',
            url: '/api/Groups'
        }).then(function successCallback(response) {
            $scope.ListGroup = response.data;
           
        }, function errorCallback(response) {
            toastr.error('Có lỗi xảy ra trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    $scope.MainMenuChange = function (MainMenu) {
        if (MainMenu == "" || MainMenu == 'undefined' || MainMenu == null) {
            $http({
                method: 'GET',
                url: '/api/Menus'
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.Menu = response.data;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                toastr.warning('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
        }
        else {
            $scope.Menu = null;
        }
    }
    $scope.SaveGroupMenu = function () {

        $http({
            method: 'POST',
            url: 'api/Group/SaveMenuGroup?codeGr=' + JSON.stringify($scope.selectedGroup) + '&codeMn=' + $scope.itemMenu.FCode,
        }).then(function successCallback(response) {

        }, function errorCallback(response) {
            toastr.success('Có lỗi trong quá trình lưu nhóm Menu', 'Thông báo');
        });



    }
    $scope.SaveModal = function () {

        if (typeof $scope.itemMenu == 'undefined') {
            $scope.itemMenu = {};
        }
        $scope.itemMenu.Permission = JSON.stringify($scope.itemMenuPermission);
        if (typeof $scope.itemMenu.Id == 'undefined' || $scope.itemMenu.Id == 0) {
            $http({
                method: 'POST',
                url: '/api/Menus',
                data: $scope.itemMenu
            }).then(function successCallback(response) {

                // this callback will be called asynchronously
                // when the response is available
                $scope.SaveGroupMenu();
                toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadTreeMenu();
                $rootScope.LoadTreeTextMenu();
                $http({
                    method: 'GET',
                    url: '/Menus/MenuByGroup/' + $scope.CoCode
                }).then(function successCallback(response) {
                    $scope.MenuLevel = response.data;
                }, function errorCallback(response) {
                });

                $uibModalInstance.close('save');
            }, function errorCallback(response) {
                $scope.itemMenuError = response.data;
                $scope.LoadError($scope.itemMenuError.ModelState);
            });
        }
        else {
            $http({
                method: 'PUT',
                url: '/api/Menus/' + $scope.itemMenu.Id,
                data: $scope.itemMenu
            }).then(function successCallback(response) {
                $scope.SaveGroupMenu();
                toastr.success('Cập nhật dữ liệu thành công Id = ' + $scope.itemMenu.FCode + ' !', 'Thông báo');
                $rootScope.LoadTreeMenu();
                $rootScope.LoadTreeTextMenu();
                $http({
                    method: 'GET',
                    url: '/Menus/MenuByGroup/' + $scope.CoCode
                }).then(function successCallback(response) {
                    $scope.MenuLevel = response.data;
                }, function errorCallback(response) {
                });

                $uibModalInstance.close('save');
            }, function errorCallback(response) {
                $scope.itemMenuError = response.data;
                $scope.LoadError($scope.itemMenuError.ModelState);
            });
        }

    }
    $scope.ValidOnlyCode = function (FCode) {
        if (typeof $scope.itemMenu == 'undefined') {
            $scope.itemMenu = {};

        }
        $http({
            method: 'GET',
            url: '/api/ApiMenus/CheckValidMenu',
            params: { fcode: FCode }
        }).then(function successCallback(response) {

            if (response.data != 'undefined') {
                $scope.itemMenu = response.data;
                $scope.itemMenu.Permission = JSON.stringify($scope.itemMenuPermission);
                toastr.warning('Mã này đã tồn tại !', 'Thông báo');
            }
            else {

                $scope.itemMenu.Id = 0;
                toastr.success('Có thể sử dụng mã này !', 'Thông báo');
            }
        }, function errorCallback(response) {
        });
    }
   
    $scope.LoadListBox();
    //$scope.LoadAllGroup();
    if ($scope.itemMenu != undefined) $scope.read = true;
    else $scope.read = false;

});


/* Setup blank page controller */
angular.module('WebApiApp').controller('MenuController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$timeout', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $timeout) {

    $rootScope.LoadTreeMenu = function () {
        //if ($scope.CoCode == "")
        //    return;
        $http({
            method: 'GET',
            url: '/Menus/Tree/' + $scope.CoCode
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.MenuTree = response.data;
            // console.log(response.data);
            $("#tree_3").jstree({
                "core": {
                    "themes": {
                        "responsive": false
                    },
                    // so that create works
                    "check_callback": true,
                    'data': $scope.MenuTree
                },
                "types": {
                    "default": {
                        "icon": "fa fa-folder icon-state-warning icon-lg"
                    },
                    "file": {
                        "icon": "fa fa-file icon-state-warning icon-lg"
                    }
                },
                "state": { "key": "demo2" },
                "plugins": ["dnd", "state", "types"]
                //"plugins": ["contextmenu", "dnd", "state", "types"]
            });
            $('#tree_3').jstree(true).settings.core.data = $scope.MenuTree;
            $('#tree_3').jstree(true).refresh();
            $('#tree_3').on("select_node.jstree", function (e, data) {
                if (data.node.id != null) {
                    data.instance.deselect_node(data.node);
                    //_selectedNodeId = "";
                }
                $http({
                    method: 'GET',
                    url: '/Menus/MenuByGroup/' + data.node.original.code
                }).then(function successCallback(response) {
                    $scope.MenuLevel = response.data;

                }, function errorCallback(response) {
                });
                ComponentsSelect2.init();

            });
        }, function errorCallback(response) {
            toastr.error('Có lỗi xẩy ra trong quá trình cập nhật dữ liệu !', 'Lỗi cập nhật dữ liệu');
        });

    }
    $rootScope.LoadTreeTextMenu = function () {
        if ($scope.CoCode == "")
            return;
        $http({
            method: 'GET',
            url: '/Menus/TreeText/' + $scope.CoCode
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.TreeTextMenu = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            toastr.warning('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.MainMenuChange = function () {
        $rootScope.LoadTreeMenu();
        $rootScope.LoadTreeTextMenu();
        $http({
            method: 'GET',
            url: '/Menus/MenuByGroup/' + $scope.CoCode
        }).then(function successCallback(response) {
            $scope.MenuLevel = response.data;
        }, function errorCallback(response) {
        });
    };
    $scope.GetMenuName = function (obj) {
        if (obj.FLevel == 2)
            return " |--" + obj.FName;
        return obj.FName;
    }



    $scope.cancelModal = function () {
        // alert('cancelModal');
        //alert($scope.modalInstance);
        //$uibModal.dismiss('close');
    }

    $scope.DeleteMenu = function (Id, FCode) {
        if (confirm('Bạn có chắc chắn xóa bản ghi này ko ?')) {

            $http({
                method: 'DELETE',
                url: '/api/Menus/' + Id
            }).then(function successCallback(response) {
                
                $http({
                    method: 'GET',
                    url: '/api/Group/DeleteGroupMenubyMenuFCode?MenuFCode=' + FCode
                }).then(function successCallback(response) {
                    toastr.warning('Đã xóa dữ liệu thành công !', 'Thông báo');
                    $rootScope.LoadTreeMenu();
                    $rootScope.LoadTreeTextMenu();
                    $scope.GetMenusByLevel();

                    $http({
                        method: 'GET',
                        url: '/Menus/MenuByGroup/' + $scope.CoCode
                    }).then(function successCallback(response) {
                        $scope.MenuLevel = response.data;
                    }, function errorCallback(response) {
                    });
                }, function errorCallback(response) {
                });


            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
    };
    $scope.UpdateTree = function () {
        if ($scope.CoCode == "")
            return;
        var v = $('#tree_3').jstree(true).get_json('#', { flat: true })

        var dt = JSON.stringify(v);
        //console.log(v);
        $http({
            method: 'POST',
            url: '/api/ApiMenus/UpdateTree',
            data: dt,
            contentType: "application/json"
        }).then(function successCallback(response) {
            toastr.success('Cập nhật cây danh mục thành công !', 'Thông báo');
            //console.log(response.data);
        }, function errorCallback(response) {
            toastr.error('Có lỗi xảy ra trong quá trình cập nhật !', 'Thông báo');
        });
        $scope.LoadMainMenus();
        // $scope.LoadMenus();
        $rootScope.LoadTreeMenu();
        $scope.GetMenusByLevel();

    }
    $scope.$on('$viewContentLoaded', function () {
        $scope.CoCode = "ALL";
        // initialize core components
        App.initAjax();
        ComponentsSelect2.init();


        $rootScope.$settings.layout.pageContentWhite = true;
        $rootScope.$settings.layout.pageBodySolid = false;
        $rootScope.$settings.layout.pageSidebarClosed = false;
        $scope.LoadMainMenus();
        // $scope.LoadMenus();
        $scope.GetDropMenu();
        $rootScope.LoadTreeMenu();
        $scope.GetMenusByLevel();


        $scope.$state.current.data.pageTitle = "Quản lý danh mục Menu";

    });



}]);