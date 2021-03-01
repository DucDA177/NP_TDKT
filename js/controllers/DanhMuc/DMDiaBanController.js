
angular.module('WebApiApp').controller("ModelAreasHandlerController", function ($scope, $rootScope, $http, $uibModal, $uibModalInstance) {
    $scope.itemArea = $scope.$resolve.itemArea;
    $scope.type = $scope.$resolve.type;
    
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('cancel');
    }
  
    $scope.LoadDanhMuc('DMVungDrop', 'VUNG')
    $scope.LoadDanhMuc('DMKhuVucDrop', 'KHUVUC')
    
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
                $rootScope.LoadAllTinh();
                toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');
                $scope.cancelModal()
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
                $rootScope.LoadAllTinh();
                $scope.cancelModal()
            }, function errorCallback(response) {
                $scope.itemAreaError = response.data;
                $scope.LoadError($scope.itemAreaError.ModelState);
            });
        }

    }
    $scope.SaveAndNew = function () {

        if (typeof $scope.itemArea == 'undefined') {
            $scope.itemArea = {};

        }
        if (typeof $scope.itemArea.Id == 'undefined' || $scope.itemArea.Id == 0) {
            $http({
                method: 'POST',
                url: '/api/Areas',
                data: $scope.itemArea
            }).then(function successCallback(response) {
                $rootScope.LoadAllTinh();
                toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');
                $scope.itemArea = []
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
                $rootScope.LoadAllTinh();
                $scope.itemArea = []
                // $scope.cancelModal
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
            return "  ---| " + obj.FName;
        // return " <b> " + obj.FName + " </b>";
    }
  
   
    if ($scope.itemArea != undefined) $scope.read = true;
    else $scope.read = false;
});
angular.module('WebApiApp').controller('DMDiaBanController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$timeout', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $timeout) {

    $scope.openEditAreaModal = function (itemArea, type) {

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
                itemArea: function () { return itemArea },
                type: function () { return type }
            }

        });

    }
    $scope.searchVis = false;
    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "Type": '0',
        "Parent": '0',
    };
    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.LoadAllTinh()
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.LoadAllTinh()
        }

    }
    $rootScope.LoadAllTinh = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
        $http({
            method: 'GET',
            url: 'api/GetAllAreas',
            params: {
                pageNumber: $scope.Paging.currentPage,
                pageSize: $scope.Paging.pageSize,
                searchKey: $scope.Paging.searchKey,
                Type: 'TINH',
                Parent: '',
                Code: $scope.DefaultArea
            }
        }).then(function successCallback(response) {

            $scope.AllTinh = response.data.Areas;
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;
            $rootScope.Loading = false;

         


        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $scope.LoadChild = function (item, searchKey, type) {
        //try {
        //    item.icon = !item.icon;
        //} catch {}
        if (searchKey == null) searchKey = ''
        $http({
            method: 'GET',
            url: 'api/GetAllAreas',
            params: {
                pageNumber: 1,
                pageSize: 9999,
                searchKey: searchKey,
                Type: type,
                Parent: item.FCode,
                Code: ''
            }
        }).then(function successCallback(response) {

            item.Child = response.data.Areas;
            //item.icon = true
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $scope.DeleteArea = function (Id) {
        if (confirm('Bạn có chắc chắn xóa bản ghi này ko ?')) {
            $http({
                method: 'DELETE',
                url: '/api/Areas/' + Id
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available     
                $rootScope.LoadAllTinh();
                toastr.success('Đã xóa dữ liệu thành công !', 'Thông báo');
               
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
    };
    $scope.LoadDropArea = function () {

        $http({
            method: 'GET',
            url: 'api/Area/GetDropArea'
        }).then(function successCallback(response) {
            $scope.DropArea = response.data
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $scope.LoadDropArea();
    $rootScope.LoadAllTinh();
    
}]);
