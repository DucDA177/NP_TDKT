angular.module('WebApiApp').controller("ModelAreasHandlerController", function ($scope, $http, $uibModal, $uibModalInstance) {
    $scope.itemArea = $scope.$resolve.itemArea;
    $scope.OnLoad = function () {
        //ComponentsSelect2.init();
        function format(state) {
            if (!state.id) return state.text; // optgroup
            return state.text;
        }
        var placeholder = "Chọn";

        $(".select2, .select2-multiple").select2({
            placeholder: placeholder,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) { return m; },
            width: null
        });

    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('cancel');
    }


    $scope.SaveModal = function () {

        if (typeof $scope.itemArea == 'undefined') {
            $scope.itemArea = {};

        }
        if (typeof $scope.itemArea.Id == 'undefined' || $scope.itemArea.Id == 0) {
            $http({
                method: 'POST',
                url: '/api/Areas',
                data: $scope.itemArea
            }).then(function successCallback(response) {
                $scope.LoadAreas();
                toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');

            }, function errorCallback(response) {
                $scope.itemAreaError = response.data;
                $scope.LoadError($scope.itemAreaError.ModelState);
            });
        }
        else {
            $http({
                method: 'PUT',
                url: '/api/Areas/' + $scope.itemArea.Id,
                data: $scope.itemArea
            }).then(function successCallback(response) {
                console.log(response);
                // this callback will be called asynchronously
                // when the response is available
                toastr.success('Cập nhật dữ liệu thành công Id = ' + $scope.itemArea.Id + ' !', 'Thông báo');
                $scope.LoadAreas();
                
            }, function errorCallback(response) {
                $scope.itemAreaError = response.data;
                $scope.LoadError($scope.itemAreaError.ModelState);
            });
        }

    }

    $scope.ValidOnlyCode = function (FCode) {
        if (typeof $scope.itemArea == 'undefined') {
            $scope.itemArea = {};

        }
        $http({
            method: 'GET',
            url: '/api/CheckValidArea/' + FCode,
        }).then(function successCallback(response) {

            if (response.data != 'undefined') {
                $scope.itemArea = response.data;
                toastr.warning('Mã này đã tồn tại !', 'Thông báo');
            }
            else {

                $scope.itemArea.Id = 0;
                $scope.itemArea.FName = null;
                $scope.itemArea.Type = null;
                $scope.itemArea.FDescription = null;
                $scope.itemArea.Parent = null;
                toastr.success('Có thể sử dụng mã này !', 'Thông báo');
            }
        }, function errorCallback(response) {
        });
    }

    $scope.GetMenuName = function (obj) {
        if (obj.Parent == "")
            return " <b> " + obj.FName + " </b>";
        else
            return "  ------ " + obj.FName;
        // return " <b> " + obj.FName + " </b>";
    }
    $scope.DeletePhone = function (Id) {
        if (confirm('Bạn có chắc chắn xóa bản ghi này ko ?')) {
            $http({
                method: 'DELETE',
                url: '/api/Areas/' + Id
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available     

                toastr.warning('Đã xóa dữ liệu thành công !', 'Thông báo');
                $scope.LoadAreas();
                $uibModalInstance.close('save');
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
    };
    if ($scope.itemArea != undefined) $scope.read = true;
    else $scope.read = false;
});

/* Setup blank page controller */
angular.module('WebApiApp').controller('AreasController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$timeout', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $timeout) {

    $scope.openEditAreaModal = function (itemArea) {

        var modalInstance = $uibModal.open({

            ariaLabelledBy: 'modal-title',
            animation: true,
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views-client/template/EditArea.html?bust=' + Math.random().toString(36).slice(2),
            controller: 'ModelAreasHandlerController',
            controllerAs: 'vm',
            scope: $scope,
            size: 'lg',
            resolve: {
                itemArea: function () { return itemArea }
            }

        });

    }


    $scope.LoadType = function () {
        $http({
            method: 'GET',
            url: '/Area/Type'
        }).then(function successCallback(response) {
            $scope.TypeCate = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

    
    $scope.LoadAreas = function () {
        $http({
            method: 'GET',
            url: '/api/DonViChuQuan',
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.OrgTree = response.data;
            //jQuery('#gtreetable').gtreetable({
            //    'draggable': true,
            //    'source': $scope.OrgTree //function (id) {
            //        //return {
            //        //    type: 'GET',
            //        //    url: 'demo/table_tree.php',
            //        //    data: {
            //        //        'id': id
            //        //    },
            //        //    dataType: 'json',
            //        //    error: function (XMLHttpRequest) {
            //        //        alert(XMLHttpRequest.status + ': ' + XMLHttpRequest.responseText);
            //        //    }
            //        //}
            //    //},
            //    ,
            //    'sort': function (a, b) {
            //        var aName = a.name.toLowerCase();
            //        var bName = b.name.toLowerCase();
            //        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
            //    },
            //    'types': { default: 'glyphicon glyphicon-folder-open', folder: 'glyphicon glyphicon-folder-open' },
            //    'inputWidth': '255px'
            //});
            $("#tree_3").jstree({
                "core": {
                    "themes": {
                        "responsive": false
                    },
                    // so that create works
                    "check_callback": true,
                    'data': $scope.OrgTree
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
                "plugins": ["dnd", "state", "types", "crrm"]
                //"plugins": ["contextmenu", "dnd", "state", "types"]
            });
            $('#tree_3').jstree(true).settings.core.data = $scope.OrgTree;
            $('#tree_3').jstree(true).refresh();
            $('#tree_3').on("select_node.jstree", function (e, data) {
                if (data.node.id != null) {
                    data.instance.deselect_node(data.node);
                    //_selectedNodeId = "";
                }
                $http({
                    method: 'GET',
                    url: '/api/Areas/' + data.node.id
                }).then(function successCallback(response) {

                    $scope.openEditAreaModal(response.data)
                }, function errorCallback(response) {

                });
                //ComponentsSelect2.init();

            });


        }, function errorCallback(response) {
            toastr.error('Có lỗi xẩy ra trong quá trình cập nhật dữ liệu !', 'Lỗi cập nhật dữ liệu');
        });
    }
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        //UITree.init();
        //// Simple GET request example:
        //// set default layout mode
        $rootScope.$settings.layout.pageContentWhite = true;
        $rootScope.$settings.layout.pageBodySolid = false;
        $rootScope.$settings.layout.pageSidebarClosed = false;
        //TableTree.init(); 
        $scope.LoadAreas();
        $scope.LoadType();
        $scope.LoadDropAreas();
        // $scope.$state.current.data.pageTitle = "Quản lý danh mục điện thoại";

    });
}]);
