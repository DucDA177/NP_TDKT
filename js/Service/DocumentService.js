

angular.module('WebApiApp').factory('DocumentService', function ($http) {
    return {
        GetAutoID: function (Code) {
            return $http({
                method: 'GET',
                url: '/api/AutoId/' + Code
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                //return response.data;
            });
        },

    }
})

