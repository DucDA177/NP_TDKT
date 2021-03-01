
angular.module('WebApiApp').controller('ChatController', function ($rootScope, $scope, $http, $timeout, $cookies) {
    $scope.allMess = []
    $scope.stopScroll = false;
    var wrapper = $('.page-quick-sidebar-wrapper');
    var wrapperChat = wrapper.find('.page-quick-sidebar-chat');
    var chatContainer = wrapperChat.find(".page-quick-sidebar-chat-user-messages");

    var getLastPostPos = function () {
        var height = 0;
        var i = 0;
        chatContainer.find(".post").each(function () {
            height = height + $(this).outerHeight();
            i++;
            if ($scope.allMess.length > 20 && i > 23)
                return false;

        });

        return height;
    };


    $scope.LoadMess = function (pageSize) {
        if (pageSize == null || pageSize == undefined) pageSize = 0;
        $http({
            method: 'GET',
            url: 'api/Message/GetMessage?IdNguoigui=' + $rootScope.user.Id
                + '&IdNguoinhan=' + $rootScope.SelectedUser.Id
                + '&pageSize=' + pageSize,
        }).then(function successCallback(response) {

            $scope.stopScroll = ($scope.allMess.length == response.data.count)
            $scope.allMess = response.data.mes;

        }, function errorCallback(response) {
            toastr.warning('Lỗi !', 'Thông báo');
        });
    }
    $scope.CloseChat = function () {

        wrapperChat.removeClass("page-quick-sidebar-content-item-shown");
        $rootScope.SelectedUser = null;
    }
    $scope.OnSelectUser = function (item) {
        
        $scope.allMess = []
        $rootScope.SelectedUser = item;
        wrapperChat.addClass("page-quick-sidebar-content-item-shown");
        $scope.inputMess = '';
        $http({
            method: 'GET',
            url: 'api/Message/ReadAllMessage?IdNguoigui=' + $rootScope.SelectedUser.Id
                + '&IdNguoinhan=' + $rootScope.user.Id

        }).then(function successCallback(response) {
            $scope.LoadMess($scope.allMess.length)
            $rootScope.LoadUserActive();
        }, function errorCallback(response) {
            toastr.warning('Lỗi !', 'Thông báo');
        });
    }
   
    //Tin nhắn
    $scope.myHub.client.sendmess = function (user, message, recv) {
        
        if ($rootScope.SelectedUser == null || !$('body').hasClass('page-quick-sidebar-open')
            || (user.Id != $rootScope.SelectedUser.Id && user.Id != $rootScope.user.Id)
            || $scope.UserOnline.filter(t => t.Id == $rootScope.SelectedUser.Id).length == 0
        ) {
            $scope.sendUnreadMessage(user, message, recv)

        }
        if ($rootScope.SelectedUser == null)
            return;
        if (user.Id != $rootScope.SelectedUser.Id && recv.Id != $rootScope.SelectedUser.Id)
            return;

        var mes = {
            Id: message.Id,
            us_send: user,
            time: message.Thoigian,
            message: message.Tinnhan,
            type: user.Id == $rootScope.user.Id ? 'out' : 'in',
            us_recv: recv
        }



        $scope.$apply(function () {
            $scope.allMess.push(mes);
            $scope.allMess.splice(0, $scope.allMess.length - 20)
            $scope.stopScroll = false
        });

    };
    $scope.myHub.client.sendtyping = function (user, recv, typingFlag) {
        if ($rootScope.SelectedUser != null)
            $scope.$apply(function () {
                if (user.Id == $rootScope.SelectedUser.Id && recv.Id == $rootScope.user.Id
                    && typingFlag == true)
                    $scope.isTyping = true
                else $scope.isTyping = false

            });

    };
    $scope.myHub.client.sendnotimes = function (userSend, message) {

        toastr.options.onclick = function () {
            if (!$('body').hasClass('page-quick-sidebar-open'))
                $scope.toggleChat();
            $scope.OnSelectUser(userSend)
        }
        toastr.options.positionClass = 'toast-bottom-right'
        toastr.info(message.Tinnhan, userSend.HoTen);
        toastr.options.onclick = null;
        toastr.options.positionClass = 'toast-top-right'

        $rootScope.LoadUserActive();
    };
    $.connection.hub.start().done(function () {
        $scope.$apply(function () {

            $scope.checkIsTyping = function (typingFlag) {

                $scope.myHub.server.isTyping($rootScope.user, $rootScope.SelectedUser, typingFlag);

            }
            $scope.sendChatMessage = function () {

                if (!$scope.inputMess) return;

                $scope.myHub.server.send($rootScope.user, $scope.inputMess, $rootScope.SelectedUser);

                $scope.inputMess = '';

            }
            $scope.sendUnreadMessage = function (user, message, recv) {
                
                $scope.myHub.server.checkReadMessage(user, message, recv);
                
            }

        });
    });

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

        if ($scope.stopScroll == false)
            chatContainer.slimScroll({
                scrollTo: getLastPostPos(),

            });

    });
    $('#message_div').scroll(function () {
        var pos = $('#message_div').scrollTop();
        if (pos == 0)
            $scope.LoadMess($scope.allMess.length)

    });

});
