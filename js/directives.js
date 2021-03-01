/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
WebApiApp.directive('ngSpinnerBar', ['$rootScope', '$state',
    function ($rootScope, $state) {
        return {
            link: function (scope, element, attrs) {

                // by defult hide the spinner bar
                // element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function () {
                    element.removeClass('hide'); // show spinner bar
                    // $rootScope.pageTitle = $stateParams.param.ControllerName;
                    //console.log($stateParams.param.ControllerName);
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function (event) {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator

                    Layout.setAngularJsSidebarMenuActiveLink('match', null, event.currentScope.$state); // activate selected link in the sidebar menu
                    //Layout.setAngularJsMainMenuActiveLink('match', null, event.currentScope.$state); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.$settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function () {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function () {
                    element.addClass('hide'); // hide spinner bar
                });

            }
        };
    }
])

// Handle global LINK click
WebApiApp.directive('a', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
WebApiApp.directive('dropdownMenuHover', function () {
    return {
        link: function (scope, elem) {
            elem.dropdownHover();
        }
    };
});
WebApiApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, { 'event': event });
                });

                event.preventDefault();
            }
        });
    };
});
WebApiApp.directive('ngFiles', ['$parse', function ($parse) {

    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    };

    return {
        link: fn_link
    }
}]);
WebApiApp.directive('select2', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            function format(state) {
                if (!state.id) return state.text; // optgroup
                return state.text;
            }
            var placeholder = "Chọn";
            element.select2({
                placeholder: placeholder,
                formatResult: format,
                formatSelection: format,
                escapeMarkup: function (m) { return m; },
                width: null,
                allowClear: true
            });

            //scope.$watch(attrs.ngModel, function () {
            //    $timeout(function () {
            //        element.trigger('change.select2');
            //    }, 100);
            //});

        }
    };
});
WebApiApp.directive('ngOnFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.broadcastEventName ? attr.broadcastEventName : 'ngRepeatFinished');
                });
            }
        }
    };
});
WebApiApp.directive('date', function (dateFilter) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            var dateFormat = attrs['date'] || 'dd/MM/yyyy';

            ctrl.$formatters.unshift(function (modelValue) {
                return dateFilter(modelValue, dateFormat);
            });
        }
    };
});
WebApiApp.directive('bsPopover', function () {
    return function (scope, element, attrs) {
        element.find("a[rel=popover]").popover({
            placement: 'left', html: 'true', trigger: 'focus', toggle: 'popover', content: function () {
                var elementId = $(this).attr("data-popover-content");
                return $(elementId).html();
            } });
        element.find("label[rel=popover]").popover({ placement: 'left', html: 'true', trigger: 'hover' });
    };
});
WebApiApp.directive('popover', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, elem) {

            var content = $("#popover-content").html();
            var compileContent = $compile(content)(scope);
            var title = $("#popover-head").html();
            var options = {
                content: compileContent,
                html: true,
                title: title
            };

            $(elem).popover(options);
        }
    }
});
WebApiApp.directive('tooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.hover(function () {
                // on mouseenter
                element.tooltip('show');
            }, function () {
                // on mouseleave
                element.tooltip('hide');
            });
        }
    };
});
WebApiApp.directive('allowOnlyNumbers', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {
                if (event.which == 64 || event.which == 16) {
                    // to allow numbers  
                    return false;
                } else if (event.which >= 48 && event.which <= 57) {
                    // to allow numbers  
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // to allow numpad number  
                    return true;
                } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                    // to allow backspace, enter, escape, arrows  
                    return true;
                } else {
                    event.preventDefault();
                    // to stop others  
                    return false;
                }
            });
        }
    }
});
WebApiApp.directive('ngJsonExportExcel', function () {
    return {
        restrict: 'AE',
        scope: {
            data: '=',
            filename: '=?',
            reportFields: '='
        },
        link: function (scope, element) {
            scope.filename = !!scope.filename ? scope.filename : 'export-excel';

            var fields = [];
            var header = [];

            angular.forEach(scope.reportFields, function (field, key) {
                if (!field || !key) {
                    throw new Error('error json report fields');
                }

                fields.push(key);
                header.push(field);
            });

            element.bind('click', function () {
                var bodyData = _bodyData();
                var strData = _convertToExcel(bodyData);

                var blob = new Blob([strData], { type: "text/plain;charset=utf-8" });

                return saveAs(blob, [scope.filename + '.csv']);
            });

            function _bodyData() {
                var data = scope.data;
                var body = "";
                angular.forEach(data, function (dataItem) {
                    var rowItems = [];

                    angular.forEach(fields, function (field) {
                        if (field.indexOf('.')) {
                            field = field.split(".");
                            var curItem = dataItem;

                            // deep access to obect property
                            angular.forEach(field, function (prop) {
                                if (curItem !== null && curItem !== undefined) {
                                    curItem = curItem[prop];
                                }
                            });

                            data = curItem;
                        }
                        else {
                            data = dataItem[field];
                        }

                        var fieldValue = data !== null ? data : ' ';

                        if (fieldValue !== undefined && angular.isObject(fieldValue)) {
                            fieldValue = _objectToString(fieldValue);
                        }

                        rowItems.push(fieldValue);
                    });

                    body += rowItems.toString() + '\n';
                });

                return body;
            }

            function _convertToExcel(body) {
                return header + '\n' + body;
            }

            function _objectToString(object) {
                var output = '';
                angular.forEach(object, function (value, key) {
                    output += key + ':' + value + ' ';
                });

                return '"' + output + '"';
            }
        }
    };
});
WebApiApp.directive('ckeditor', function ($rootScope) {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            var editorOptions;
            if (attr.ckeditor === 'minimal') {
                // minimal editor
                editorOptions = {
                    height: 100,
                    toolbar: [
                        { name: 'basic', items: ['Bold', 'Italic', 'Underline'] },
                        { name: 'links', items: ['Link', 'Unlink'] },
                        { name: 'tools', items: ['Maximize'] },
                        { name: 'document', items: ['Source'] },
                    ],
                    removePlugins: 'elementspath',
                    resize_enabled: false
                };
            } else {
                // regular editor
                editorOptions = {
                    filebrowserImageUploadUrl: $rootScope.globals.apiUrl + '/upload',
                    removeButtons: 'About,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Save,CreateDiv,Language,BidiLtr,BidiRtl,Flash,Iframe,addFile,Styles',
                    extraPlugins: 'simpleuploads,imagesfromword'
                };
            }

            // enable ckeditor
            var ckeditor = element.ckeditor(editorOptions);

            // update ngModel on change
            ckeditor.editor.on('change', function () {
                ngModel.$setViewValue(this.getData());
            });
        }
    };
});
WebApiApp.directive('numberInput', function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModelCtrl) {

            ngModelCtrl.$formatters.push(function (modelValue) {
                return setDisplayNumber(modelValue, true);
            });

            // it's best to change the displayed text using elem.val() rather than
            // ngModelCtrl.$setViewValue because the latter will re-trigger the parser
            // and not necessarily in the correct order with the changed value last.
            // see http://radify.io/blog/understanding-ngmodelcontroller-by-example-part-1/
            // for an explanation of how ngModelCtrl works.
            ngModelCtrl.$parsers.push(function (viewValue) {
                setDisplayNumber(viewValue);
                return setModelNumber(viewValue);
            });

            // occasionally the parser chain doesn't run (when the user repeatedly 
            // types the same non-numeric character)
            // for these cases, clean up again half a second later using "keyup"
            // (the parser runs much sooner than keyup, so it's better UX to also do it within parser
            // to give the feeling that the comma is added as they type)
            elem.bind('keyup focus', function () {
                setDisplayNumber(elem.val());
            });

            function setDisplayNumber(val, formatter) {
                var valStr, displayValue;

                if (typeof val === 'undefined') {
                    return 0;
                }

                valStr = val.toString();
                displayValue = valStr.replace(/,/g, '').replace(/[A-Za-z]/g, '');
                displayValue = parseFloat(displayValue);
                displayValue = (!isNaN(displayValue)) ? displayValue.toString() : '';

                // handle leading character -/0
                if (valStr.length === 1 && valStr[0] === '-') {
                    displayValue = valStr[0];
                } else if (valStr.length === 1 && valStr[0] === '0') {
                    displayValue = '';
                } else {
                    displayValue = $filter('number')(displayValue);
                }

                // handle decimal
                if (!attrs.integer) {
                    if (displayValue.indexOf('.') === -1) {
                        if (valStr.slice(-1) === '.') {
                            displayValue += '.';
                        } else if (valStr.slice(-2) === '.0') {
                            displayValue += '.0';
                        } else if (valStr.slice(-3) === '.00') {
                            displayValue += '.00';
                        }
                    } // handle last character 0 after decimal and another number
                    else {
                        if (valStr.slice(-1) === '0') {
                            displayValue += '0';
                        }
                    }
                }

                if (attrs.positive && displayValue[0] === '-') {
                    displayValue = displayValue.substring(1);
                }

                if (typeof formatter !== 'undefined') {
                    return (displayValue === '') ? 0 : displayValue;
                } else {
                    elem.val((displayValue === '0') ? '' : displayValue);
                }
            }

            function setModelNumber(val) {
                var modelNum = val.toString().replace(/,/g, '').replace(/[A-Za-z]/g, '');
                modelNum = parseFloat(modelNum);
                modelNum = (!isNaN(modelNum)) ? modelNum : 0;
                if (modelNum.toString().indexOf('.') !== -1) {
                    modelNum = Math.round((modelNum + 0.00001) * 100) / 100;
                }
                if (attrs.positive) {
                    modelNum = Math.abs(modelNum);
                }
                return modelNum;
            }
        }
    };
});
WebApiApp.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return val != null ? parseInt(val, 10) : null;
            });
            ngModel.$formatters.push(function (val) {
                return val != null ? '' + val : null;
            });
        }
    };
});

WebApiApp.directive('xeditable', ['$timeout', function ($timeout) {

    return {
        restrict: 'E',

        require: 'ngModel',

        scope: {
            ngModel: '=',
            placeholder: '@',
            title: '@'
        },

        replace: true,

        template: "<a class='editable' href='javascript:;' data-type='text' data-placement='right'>{{ngModel}}</a>",

        link: function (scope, elem, attrs, ctrl) {

            var loadXeditable = function () {
                angular.element(elem).editable({
                    display: function (value, srcData) {
                        ctrl.$setViewValue(value);
                        scope.$apply();
                    },
                    success: function (response, newValue) {
                        scope.ngModel = newValue;
                        scope.$emit('item:updated', scope.$parent.item);
                    },
                    placeholder: scope.placeholder
                });
            }

            $timeout(function () {
                loadXeditable();
            }, 10);
        }
    };

}]);

WebApiApp.directive('onFinishRender', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                    if (!!attr.onFinishRender) {
                        $parse(attr.onFinishRender)(scope);
                    }
                });
            }




            if (!!attr.onStartRender) {
                if (scope.$first === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatStarted');
                        if (!!attr.onStartRender) {
                            $parse(attr.onStartRender)(scope);
                        }
                    });
                }
            }
        }
    }
}]);