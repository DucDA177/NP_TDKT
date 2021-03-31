angular.module('WebApiApp').controller('TTDotXuatController', function ($rootScope, $scope, $http, $timeout) {
    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi": 0,
        "Dotxuat": true
    };
    $scope.IsAdded = false;
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

    $scope.Del = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa tờ trình này. Việc xóa tờ trình cũng sẽ xóa các đối tượng khỏi tờ trình đó ?'))
            $http({
                method: 'GET',
                url: 'api/ToTrinh/Delete?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.Load();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Lỗi ! ' + response.data.Message, 'Thông báo');

            });

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
            url: 'api/ToTrinh/GetToTrinhDotXuatNgoaiLuong?pageNumber='
                + $scope.Paging.currentPage + '&pageSize=' + $scope.Paging.pageSize
                + '&searchKey=' + $scope.Paging.searchKey + '&IdDonvi=' + $rootScope.CurDonVi.Id
                + '&Nam=' + $rootScope.CurYear 
        }).then(function successCallback(response) {

            $scope.ListToTrinh = response.data.ListOut;

            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;



        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $rootScope.Load();


    $scope.item = {
        IdDonvi: $rootScope.CurDonVi.Id,
        Nam: $rootScope.CurYear,
        Ngaytrinh: new Date(),
        Dotxuat: true,
        Ngoailuong: true
    }
    
    $scope.Save = function (isNew) {
        if ($scope.Validate() != 1) {
            var str = $scope.Validate();
            toastr.error(str, "Thông báo");
            return;
        }
        if ($scope.item.Ngaytrinh instanceof Date)
            $scope.item.Ngaytrinh = ConvertToDate($scope.item.Ngaytrinh);
        
        if (confirm('Bạn có chắc chắn gửi tờ trình đột xuất này?'))
            $http({
                method: "POST",
                url: 'api/ToTrinh/SaveToTrinh',
                data: { tt: $scope.item, ls: [] },
            }).then(
                function successCallback(response) {
                    toastr.success("Lưu dữ liệu thành công !", "Thông báo");
                    $rootScope.Load();
                    $scope.item = {
                        IdDonvi: $rootScope.CurDonVi.Id,
                        Nam: $rootScope.CurYear,
                        Ngaytrinh: new Date(),
                        Dotxuat: true,
                        Ngoailuong: true
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
        return 1;
    };
    $scope.ViewNoiDung = function (item) {
        //bootbox.alert({
        //    message: item.Ghichu,
        //    backdrop: true
        //});

        bootbox.confirm({
            title: 'Tờ trình số ' + item.Sototrinh + ' ngày ' + item.Ngaytrinh,
            message: item.Ghichu,
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Đóng'
                },
            },
            callback: function (result) {
                
            }
        });
    }
});
