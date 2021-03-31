angular.module('WebApiApp').controller('XDDotXuatController', function ($rootScope, $scope, $http, $timeout) {
    $rootScope.CurDanhSach = null;
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
    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
        "IdDonvi": 0,
        "Dotxuat": true
    };

    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.LoadDSDeNghi();
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.LoadDSDeNghi();
        }

    }


    $rootScope.LoadDSDeNghi = function () {
        $http({
            method: 'GET',
            url: 'api/ToTrinh/GetToTrinhDotXuatNgoaiLuong?pageNumber='
                + $scope.Paging.currentPage + '&pageSize=' + $scope.Paging.pageSize
                + '&searchKey=' + $scope.Paging.searchKey + '&IdDonvi=' + $rootScope.SelectedDonVi.Id
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

    $scope.Save = function (item) {
      
        let text = item.Daduyet ? 'duyệt' : 'hủy duyệt';
        if (confirm('Bạn có chắc chắn ' + text + ' tờ trình này?')) {

            if (item.Ngaytrinh instanceof Date)
                item.Ngaytrinh = ConvertToDate(item.Ngaytrinh);
            item.Ghichu += '</br> - <b><i>Đã ' + text + ' ngày ' + ConvertToDate(new Date()) + ' <i/></b>'
            $http({
                method: "POST",
                url: 'api/ToTrinh/SaveToTrinh',
                data: { tt: item, ls: [] },
            }).then(
                function successCallback(response) {
                    toastr.success("Lưu dữ liệu thành công !", "Thông báo");
                    $rootScope.LoadDSDeNghi();
                },
                function errorCallback(response) {
                    //console.log(response)
                    toastr.error("Lỗi " + response.data.Message, "Thông báo");
                }
            );
        }
            
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
                confirm: {
                    label: '<i class="fa fa-check"></i> Duyệt'
                }
            },
            callback: function (result) {
                if (result) {
                    item.Daduyet = true;
                    $scope.Save(item);
                }
            }
        });
    }
});
