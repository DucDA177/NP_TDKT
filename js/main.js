
var $stateProviderRef = null;
var WebApiApp = angular.module("WebApiApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngCookies",
    "angularUtils.directives.dirPagination",
    "angular.filter",
    "ngCookies",
    "ngStorage",
    "datetime"
]).filter('unique', function () {
    return function (collection, primaryKey) { //no need for secondary key
        var output = [],
            keys = [];
        var splitKeys = primaryKey.split('.'); //split by period


        angular.forEach(collection, function (item) {
            var key = {};
            angular.copy(item, key);
            for (var i = 0; i < splitKeys.length; i++) {
                key = key[splitKeys[i]];    //the beauty of loosely typed js :)
            }

            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});
WebApiApp.factory('httpResponseInterceptor', ['$q', '$rootScope', '$location', function ($q, $rootScope, $location) {
    return {
        responseError: function (rejection) {
            ////console.log(rejection)
            if (rejection.status === 401) {
                
                window.location.assign('/login.html');
            }
            return $q.reject(rejection);
        }
    };
}]);

WebApiApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({

    });
}]);

WebApiApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

WebApiApp.factory('$settings', ['$rootScope', function ($rootScope) {
    // supported languages

    var $settings = {
        layout: {
            pageSidebarClosed: true, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load

        },
        assetsPath: 'assets',
        globalPath: 'assets/global',
        layoutPath: 'assets/layouts/layout',
    };
    return $settings;
}]);

WebApiApp.controller('AppController', ['$stateParams', '$scope', '$rootScope', '$http', '$uibModal', '$cookies', '$state', '$uibModalStack'
    , function ($stateParams, $scope, $rootScope, $http, $uibModal, $cookies, $state, $uibModalStack) {
    
        $scope.LoaiDonVi = [
            { Code: 'ADMIN', Name: 'Quản trị hệ thống' },
            { Code: 'XD', Name: 'Đơn vị cấp xét duyệt' },
            { Code: 'QL', Name: 'Đơn vị cấp quản lý' },
            { Code: 'CS', Name: 'Đơn vị cấp cơ sở' },
        ];
        $scope.TypeArea = [
            { Code: 'XA', Name: 'Xã/Phường' },
            { Code: 'HUYEN', Name: 'Quận/Huyện' },
            { Code: 'TINH', Name: 'Tỉnh/Thành phố' }
        ];

        $scope.GioiTinh = [
            { Name: 'Nam' },
            { Name: 'Nữ' }

        ];
        $scope.LoaiDanhHieu = [
            { Code: 'CSTD', Name: 'Chiến sỹ thi đua' },
            { Code: 'LDTT', Name: 'Lao động tiên tiến' },
        ];
        
        $scope.optionsEditor = {
            height: 150,
            toolbar: [
                ['style', ['bold', 'italic', 'underline']],
                ['para', ['ul', 'ol']]
            ]
        };

        $scope.DefaultArea = '30' // Tỉnh Hải Dương
        $scope.isHidePagebar = 0;

        $scope.toggleChat = function () {
            $('body').toggleClass('page-quick-sidebar-open');

        }
        

        $scope.CheckReadTB = function (u) {
            if (u.NguoiDoc == null || !u.NguoiDoc.includes($rootScope.user.UserName + '#'))
                $http({
                    method: 'GET',
                    url: 'api/ThongBao/CheckReadTB?IdTB=' + u.Id + '&User=' + $rootScope.user.UserName
                }).then(function successCallback(response) {
                    $rootScope.LoadThongBao();
                }, function errorCallback(response) {
                    toastr.warning('Lỗi !', 'Thông báo');
                });
            bootbox.confirm("<b>" + u.NoiDung + "</b>"
                + "</br> <i> - Người gửi: " + u.NguoiGui + "</i> </br>"
                + "<i>- Ngày gửi: " + ConvertToDate(new Date(u.NgayGui)) + "</i>"
                , function (result) {
                    if (u.Link && result)
                        try {

                            $state.go(u.Link, { param: u.IdHoso })
                        } catch{ }
                    else return;
                }
            );
        }
        $scope.CheckReadAll = function () {
            $http({
                method: 'GET',
                url: 'api/ThongBao/CheckReadAll'
            }).then(function successCallback(response) {
                $rootScope.LoadThongBao();
            }, function errorCallback(response) {
                toastr.warning('Lỗi !', 'Thông báo');
            });
        }
        // Lấy danh sách Menu chính
        $scope.LoadMainMenus = function () {
            $http({
                method: 'GET',
                url: '/api/MainMenus'
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.MainMenu = response.data;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                toastr.warning('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
        }

        $scope.LoadGroups = function () {
            $http({
                method: 'GET',
                url: '/api/Groups'
            }).then(function successCallback(response) {

                $scope.Group = response.data;
                if ($rootScope.CurDonVi.NhomLoai != "ADMIN")
                    $scope.Group = $scope.Group.filter(t => t.FCode != "ADMIN")
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
        }

     
        $scope.displayPage = [
            //{
            //    "value": 0,
            //    "text": 'Tất cả',
            //},
            {
                "value": 15,
                "text": '15 bản ghi',
            },
            {
                "value": 25,
                "text": '25 bản ghi',
            },
            {
                "value": 50,
                "text": '50 bản ghi',
            },
            {
                "value": 75,
                "text": '75 bản ghi',
            },
            {
                "value": 100,
                "text": '100 bản ghi',
            },
            {
                "value": 200,
                "text": '200 bản ghi',
            },
            {
                "value": 1000,
                "text": '1000 bản ghi',
            }
        ]

        $scope.LoadDanhMuc = function (item, Maloai, ttkhac1, ttkhac2, ttkhac3, fn) {
            //item là Tên biến danh mục
            //Maloai là loại danh mục trong DB
            //fn là hàm truyền vào sau khi call back
            $http({
                method: 'GET',
                url: 'api/DMChung/GetAllbyMaLoai?MaLoai=' + Maloai + '&TTKhac1=' + ttkhac1 + '&TTKhac2=' + ttkhac2 + '&TTKhac3=' + ttkhac3
            }).then(function successCallback(response) {
                $scope[item] = response.data;
                if (fn != null && fn != undefined)
                    fn();
            }, function errorCallback(response) {
                toastr.warning('Có lỗi!', 'Thông báo');

            });
        }
        $scope.openEditMainMenuModal = function (itemMainMenu) {
            $scope.modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                animation: true,
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views-client/template/EditMainMenu.html?bust=' + Math.random().toString(36).slice(2),
                controller: 'ModelMainMenuHandlerController',
                controllerAs: 'vm',
                scope: $scope,
                size: 'full',
                resolve: {
                    itemMainMenu: function () { return itemMainMenu }
                }
            });
        }

        $scope.LoadAllDonVi = function () {

            $http({
                method: 'GET',
                url: 'api/DonVi/LoadAllDonVi',
            }).then(function successCallback(response) {
                $scope.DonVi = response.data;

            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });

        }
  
        $scope.LoadProvin = function (ProvinId, DistrictId, WardId) {
            //ProvinId = ProvinId.toString();
            //DistrictId = DistrictId.toString();
            // //debugger
            if (ProvinId == "0") {
                $http({
                    method: 'GET',
                    url: '/Area/TINH/' + ProvinId,
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.Provin = response.data;
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    toastr.warning('Có lỗi trong quá trình tải dữ liệu Provin!', 'Thông báo');
                });
            }
            else {
                if (DistrictId == "0") {
                    $http({
                        method: 'GET',
                        url: '/Area/HUYEN/' + ProvinId,
                    }).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.District = response.data;

                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        toastr.warning('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
                    });
                }
                else {
                    $http({
                        method: 'GET',
                        url: '/Area/HUYEN/' + ProvinId,
                    }).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.District = response.data;

                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        toastr.warning('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
                    });

                    $http({
                        method: 'GET',
                        url: '/Area/XA/' + DistrictId,
                    }).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.Ward = response.data;

                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        // toastr.warning('Có lỗi trong quá trình tải dữ liệu District!', 'Thông báo');
                    });
                }

            }
        }
        
        // Lấy danh sách Menu hệ thống
        $scope.LoadMenus = function () {
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

        // Lấy danh sách Menu hệ thống
        $scope.GetDropMenu = function () {
            $http({
                method: 'GET',
                url: '/api/ApiMenus/GetMenusByLevel/'
            }).then(function successCallback(response) {
                $scope.DropMenu = response.data;

            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
        }

        $scope.GetMenusByLevel = function () {

            $http({
                method: 'GET',
                url: '/api/ApiMenus/GetMenusByLevel/'
            }).then(function successCallback(response) {
                $scope.MenuLevel = response.data;

            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
        }

        // Lấy ID tự động
        $scope.AutoID = function (Code) {

            $http({
                method: 'POST',
                url: '/AutoId/' + Code
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.objAutoID = response.data;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                toastr.warning('Có lỗi trong quá trình tạo ID tự động !', 'Thông báo');
            });
        }
        // Lấy ID tự động
        $scope.AutoIDCallBack = function (Code, res) {

            $http({
                method: 'POST',
                url: '/AutoId/' + Code
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.objAutoID = response.data;
                // //////console.log(response.data)
                return res(response.data);

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                toastr.warning('Có lỗi trong quá trình tạo ID tự động !', 'Thông báo');
                return res(response);
            });
        }
        $scope.LoadError = function (err) {
            var i = 0;
            for (var prop in err) {
                if (err.hasOwnProperty(prop) && prop != null) {
                    toastr.error(err[prop][0], 'Lỗi cập nhật dữ liệu');
                    $("#" + prop).focus();
                    i++;
                    if (i == 1) return;
                }

            }
        }


        $scope.openEditMenuModal = function (itemMenu) {

            $scope.modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                animation: true,
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views-client/template/EditMenu.html?bust=' + Math.random().toString(36).slice(2),
                controller: 'ModelMenuHandlerController',
                controllerAs: 'vm',
                scope: $scope,
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    itemMenu: function () { return itemMenu }
                }
            });
        }

        $rootScope.openEditItem = function (itemUser, type, Code) {
            if (itemUser.FBranchCode == null)
                itemUser.FBranchCode = Code;


            var templateUrl = 'views-client/template/Edit' + type + '.html?bust=' + Math.random().toString(36).slice(2);
            var controller = 'Model' + type + 'HandlerController';
            $scope.modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                animation: true,
                ariaDescribedBy: 'modal-body',
                templateUrl: templateUrl,
                controller: controller,
                controllerAs: 'vm',
                keyboard: false,
                scope: $scope,
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    itemUser: function () { return itemUser }
                }

            });


        }
       
        $scope.openModal = function (item, type, check) {
           
            $scope.modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                animation: true,
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views-client/template/Modal/Modal' + type + '.html?bust=' + Math.random().toString(36).slice(2),
                controller: 'Modal' + type + 'HandlerController',
                controllerAs: 'vm',
                scope: $scope ,
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    item: function () { return item },
                    check: function () { return check }
                }
            });
           
        }


        $scope.LogOut = function () {
            $http({
                method: 'POST',
                url: 'api/Account/Logout'
            }).then(function successCallback(response) {
                $cookies.remove("username");
                $cookies.remove("token_type");
                $cookies.remove("token");
                window.location.assign('/login.html');
            }, function errorCallback(response) {
                toastr.warning('Đăng xuất thất bại!', 'Thông báo');
            });
        }

        $scope.LoadTreeText = function (dataAll) {
            ////debugger
            var tree = [];
            var arrparent = dataAll.filter(t => t.FParent == null || t.FParent == '');
            var i = 1;
            angular.forEach(arrparent, function (item) {
                item.FName = i + '.' + item.FName;
                tree.push(item);
                var arrChild = dataAll.filter(t => t.FParent == item.FCode);
                if (arrChild.length > 0)
                    $scope.LoadChildText(dataAll, arrChild, i, tree);
                i = i + 1;
            });
            return tree;
        }
        $scope.LoadChildText = function (dataAll, data, j, arr) {

            //var arrChild = dataAll.filter(t => t.FParent == item.Fcode);
            var i = 1;
            angular.forEach(data, function (item) {
                var stt = j + '.' + i;
                item.FName = stt + '. ' + item.FName;
                arr.push(item);
                var arrChild = dataAll.filter(t => t.FParent == item.FCode);
                if (arrChild.length > 0)
                    $scope.LoadChildText(dataAll, arrChild, stt, arr);
                i = i + 1;
            });
        }


        $rootScope.setIdleTime = function (idleDurationSecs, username) {

            const redirectUrl = '/login.html';  // Redirect idle users to this URL
            let idleTimeout; // variable to hold the timeout, do not modify
            //var auth = { username: username, password: '' };
            const resetIdleTimeout = function () {

                // Clears the existing timeout
                if (idleTimeout) clearTimeout(idleTimeout);

                // Set a new idle timeout to load the redirectUrl after idleDurationSecs
                idleTimeout = setTimeout(() => {
                    $scope.LockScreen();
                }, idleDurationSecs * 1000
                );

            };

            resetIdleTimeout();

            ['click', 'touchstart', 'mousemove'].forEach(evt =>
                document.addEventListener(evt, resetIdleTimeout, false)
            );

        };


        $scope.LockScreen = function () {
            if ($rootScope.IsLockScreen) return;
            var templateUrl = 'views-client/template/Modal/ModalLockScreen.html?bust=' + Math.random().toString(36).slice(2);
            var controller = 'ModalLockScreenHandlerController';
            $scope.modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                animation: true,
                ariaDescribedBy: 'modal-body',
                templateUrl: templateUrl,
                controller: controller,
                controllerAs: 'vm',
                keyboard: false,
                scope: $scope,
                backdrop: 'static',
                size: 'md',
            });
            $rootScope.IsLockScreen = true;
        }
      

    }]);//])

WebApiApp.controller("ModalLockScreenHandlerController", function ($cookies, $scope, $http, $uibModalInstance, $rootScope) {
    $scope.item = {
        username: $rootScope.user.UserName,
        password: ''
    };
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    $cookies.remove('token');
    $scope.UnLockScreen = function () {

        var data = "grant_type=password&username=" + $scope.item.username + "&password=" + $scope.item.password;
        $http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .success(function (response) {
                $http.defaults.headers.common.Authorization = response.token_type + ' ' + response.access_token;
                $cookies.put('token', response.access_token);
                toastr.success('Mở khóa màn hình thành công !', 'Thông báo');
                $rootScope.IsLockScreen = false;
                $scope.cancelModal();
            }).error(function (err, status) {
                toastr.error('Mật khẩu không đúng !', 'Đăng nhập');
            });

    }

});
WebApiApp.controller("ModelPasswordHandlerController", function ($cookies, $scope, $http, $uibModalInstance, $rootScope) {
    $scope.item = $scope.$resolve.itemUser;
    $scope.cancelModal = function () {

        $uibModalInstance.dismiss('close');
    }
    $scope.SaveModal = function () {

        $http({
            method: 'POST',
            url: '/api/Account/ChangePassword',
            data: $scope.item
        }).then(function successCallback(response) {

            toastr.success('Thay đổi mật khẩu thành công', 'Thông báo');
            $uibModalInstance.close('save');
            $rootScope.user.ConnId = 1;

            $http({
                method: 'POST',
                url: '/api/UserProfiles',
                data: $rootScope.user
            }).then(function successCallback(response) {

                $http({
                    method: 'GET',
                    url: '/api/UserProfile/SetUserUpdatePass',
                }).then(function successCallback(response) {

                    window.location.reload(true);

                }, function errorCallback(response) {

                });


            }, function errorCallback(response) {

            });

        }, function errorCallback(response) {
            $scope.itemError = response.data;
            $scope.LoadError($scope.itemError.ModelState);
        });
    }

});

WebApiApp.controller('HeaderController', ['$scope', '$http', function ($scope, $http) {
    $scope.HandleLockFolder = function (type) {
        if (type == 'lock')
            $http({
                method: 'GET',
                url: '/api/Files/LockFolder'
            }).then(function successCallback(response) {
                toastr.success('Khóa thư mục dữ liệu thành công !', 'Thông báo');

            }, function errorCallback(response) {

                toastr.warning(response.data.Message, 'Thông báo');
            });
        else
            $http({
                method: 'GET',
                url: '/api/Files/UnLockFolder'
            }).then(function successCallback(response) {
                toastr.success('Mở khóa thư mục dữ liệu thành công !', 'Thông báo');

            }, function errorCallback(response) {

                toastr.warning(response.data.Message, 'Thông báo');
            });
    }
    $scope.$on('$includeContentLoaded', function () {

        Layout.initHeader();

    });
}]);

WebApiApp.controller('SidebarController', ['$state', '$scope', function ($state, $scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state); // init sidebar
    });
}]);

WebApiApp.controller('QuickSidebarController', function ($rootScope, $scope, $http, $timeout, $cookies, $localStorage) {
    $scope.Onloaded = function () {
        var wrapper = $('.page-quick-sidebar-wrapper');
        var wrapperChat = wrapper.find('.page-quick-sidebar-chat');
        var initChatSlimScroll = function () {
            var chatUsers = wrapper.find('.page-quick-sidebar-chat-users');
            var chatUsersHeight;

            chatUsersHeight = wrapper.height() - wrapper.find('.nav-justified > .nav-tabs').outerHeight();

            // chat user list 
            Metronic.destroySlimScroll(chatUsers);
            chatUsers.attr("data-height", chatUsersHeight);
            Metronic.initSlimScroll(chatUsers);

            var chatMessages = wrapperChat.find('.page-quick-sidebar-chat-user-messages');
            var chatMessagesHeight = chatUsersHeight - wrapperChat.find('.page-quick-sidebar-chat-user-form').outerHeight() - wrapperChat.find('.page-quick-sidebar-nav').outerHeight();

            // user chat messages 
            Metronic.destroySlimScroll(chatMessages);
            chatMessages.attr("data-height", chatMessagesHeight);
            Metronic.initSlimScroll(chatMessages);
        };

        initChatSlimScroll();
        Metronic.addResizeHandler(initChatSlimScroll); // reinitialize on window resize

        $rootScope.isShowChat = true;
    }
    $rootScope.LoadUserActive = function () {
        $http({
            method: 'GET',
            url: 'api/UserProfile/GetOtherUsers',
        }).then(function successCallback(response) {

            $rootScope.allUser = response.data;
            $scope.UserOnline = $rootScope.allUser.filter(t => $rootScope.userList[t.UserName] != undefined && $rootScope.userList[t.UserName].length > 0);
            $rootScope.MessageUnread = $rootScope.allUser.filter(t => t.ConnId != '0').length;

        }, function errorCallback(response) {
            toastr.warning('Lỗi !', 'Thông báo');
        });
    }
    $scope.myHub = null;
    $scope.myHub = $.connection.userActivityHub;
    $scope.myHub.client.updateUserList = function (userList) {
        $rootScope.userList = userList;
        if (!$rootScope.allUser)
            $rootScope.LoadUserActive()
        else
            $scope.UserOnline = $rootScope.allUser.filter(t => userList[t.UserName] != undefined && userList[t.UserName].length > 0);

        $scope.$apply();
    };
    // Thông báo đẩy
    $scope.myHub.client.receive = function (id, message, HoSo) {
        $rootScope.LoadThongBao();
        toastr.options.onclick = function () {
            if (id)
                $http({
                    method: 'GET',
                    url: 'api/ThongBao/CheckReadTB?IdTB=' + id + '&User=' + $rootScope.user.UserName
                }).then(function successCallback(response) {
                    $rootScope.LoadThongBao();
                }, function errorCallback(response) {
                    toastr.warning('Lỗi !', 'Thông báo');
                });
        }

        if (HoSo == "ADMIN" && !$rootScope.checkAdmin) {
            toastr.options.onclick = null;
            return;
        }

        toastr.info(message, 'Thông báo');
        toastr.options.onclick = null;
        
    };


});

WebApiApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer

        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
        }
    });


}]);

WebApiApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('httpResponseInterceptor');
    $urlRouterProvider.deferIntercept();
    $urlRouterProvider.otherwise("dashboard");
    $urlRouterProviderRef = $urlRouterProvider;
    $stateProviderRef = $stateProvider;



    // Dashboard
    $stateProvider.state('dashboard', {

        url: "/dashboard",
        templateUrl: "views-client/dashboard.html?bust=" + Math.random().toString(36).slice(2),

        data: { pageTitle: '  PHẦN MỀM QUẢN LÝ THI ĐUA KHEN THƯỞNG' },
        controller: "DashboardController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'WebApiApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        '../assets/pages/scripts/dashboard.min.js',
                        'js/controllers/DashboardController.js',
                    ]
                });
            }]
        }
    })
        .state('account', {

            url: "/account/" + "?eraseCache=true",
            templateUrl: "views-client/profile/account.html?bust=" + Math.random().toString(36).slice(2),

            data: { pageTitle: 'Hệ thống' },
            controller: "AccountController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'WebApiApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/AccountController.js',
                        ]
                    });
                }]
            }
        })
  
}]);
WebApiApp.run(['$q', '$rootScope', '$http', '$urlRouter', '$settings', '$cookies', "$state", "$stateParams",
    function ($q, $rootScope, $http, $urlRouter, $settings, $cookies, $state, $stateParams, ) {

        $rootScope.$on('$includeContentLoaded', function () {
            // $rootScope.GetNotificationTTDX();
            Layout.initHeader(); // init header
        });
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = $settings; // state to be accessed from view
        $rootScope.$stateParams = $stateParams;
        $rootScope.avatar = [];
        
        if ($cookies.get('username') == 'undefined' || $cookies.get('username') == null)
            window.location.assign('/login.html');
        else {
            $http.defaults.headers.common.Authorization = $cookies.get('token_type') + ' ' + $cookies.get('token')
        };


        // debugger
        $http({
            method: 'GET',
            url: '/api/GetCurrentUserProfiles',

        }).then(function successCallback(response) {
            //console.log(response.data)
            $rootScope.user = response.data;

            if ($rootScope.user.LockScreenTime == null) $rootScope.user.LockScreenTime = 10;

            $rootScope.setIdleTime($rootScope.user.LockScreenTime * 60, $rootScope.user.UserName)

            onStartInterceptor = function (data, headersGetter) {
                App.startPageLoading({
                    animate: true,
                });

                $('body').addClass('no-pointer');

                // $("body").css("cursor", "wait");

                return data;
            }
            onCompleteInterceptor = function (data, headersGetter) {

                App.stopPageLoading();

                $('body').removeClass('no-pointer');
                // $("body").css("cursor", "default");



                return data;
            }

            $http.defaults.transformRequest.push(onStartInterceptor);
            $http.defaults.transformResponse.push(onCompleteInterceptor);
            
            $cookies.put('DonVi', response.data.IDDonVi);

            if ($cookies.get('DonVi') != null)
                $http({
                    method: 'GET',
                    url: 'api/DonVi/GetDVbyId?Id=' + $cookies.get('DonVi'),
                }).then(function successCallback(response) {
                    $rootScope.CurDonVi = response.data;
                    $rootScope.LoadThongBao();
                    $rootScope.LoadMenu();


                }, function errorCallback(response) {
                    ////console.log(response)
                });


            $http({
                method: 'GET',
                url: 'api/Group/LoadGroupbyUser?UserName=' + $rootScope.user.UserName,

            }).then(function successCallback(response) {
                //console.log(response.data)
                if (response.data[0].includes("ADMIN")) $rootScope.checkAdmin = true;
                else $rootScope.checkAdmin = false;

                $rootScope.CurUserGroup = response.data;
               
            }, function errorCallback(response) {

            });
        }, function errorCallback(response) {

        });


        $rootScope.LoadThongBao = function () {
            $rootScope.TBLength = 0
            $http({
                method: 'GET',
                url: 'api/ThongBao/GetThongBao?DonViNhan=' + $rootScope.user.Id
            }).then(function successCallback(response) {
                $rootScope.ThongBao = response.data;
                angular.forEach($rootScope.ThongBao, function (value, key) {
                    if (value.NguoiDoc == null || value.NguoiDoc.includes($rootScope.user.UserName + '#') == false)
                        $rootScope.TBLength += 1;
                });
            }, function errorCallback(response) {
            });
        }
        // $rootScope.LoadThongBao();
        $rootScope.$settings.layout.pageContentWhite = true;
        $rootScope.$settings.layout.pageBodySolid = false;
        $rootScope.$settings.layout.pageSidebarClosed = false;
        $rootScope.LoadMenu = function () {
            
            $http({
                method: 'POST',
                url: '/api/getMenuByUser',
            }).then(function successCallback(response) {
                $rootScope.menu = response.data;
                
                angular.forEach($rootScope.menu, function (value, key) {

                    $stateProviderRef.state(value.FCode, {
                        url: "/" + value.FCode,
                        templateProvider: function ($templateRequest, $stateParams) {

                            if ($stateParams.param == null) $stateParams.param = value;
                            var fiename = value.Url;
                            var templateName = "views-client/template/" + fiename + "?bust=" + Math.random().toString(36).slice(2);
                            return $templateRequest(templateName);
                        },

                        params: {
                            param: null,

                        },
                        data: {
                            pageTitle: '  PHẦN MỀM QUẢN LÝ THI ĐUA KHEN THƯỞNG'
                        },
                        controllerProvider: ['$stateParams', function ($stateParams) {
                            var controller = '';
                            var arr = value.ControllerName.split('/');
                            if (arr.length > 1) controller = arr[arr.length - 1]; else controller = value.ControllerName;
                            return controller;
                        }],
                        resolve: {

                            deps: ['$ocLazyLoad', '$stateParams', function ($ocLazyLoad, $stateParams) {
                                return $ocLazyLoad.load({
                                    name: 'WebApiApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'js/controllers/' + value.ControllerName + '.js?bust=' + Math.random().toString(36).slice(2)
                                    ]
                                });
                            }],
                        }
                    })
                });


                $urlRouter.sync();
                $urlRouter.listen();

            }, function errorCallback(response) {

            });
        }
        
    }]);
