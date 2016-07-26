(function ($) {
    $(function () {

        var manifest = chrome.runtime.getManifest();
        $('#version').text(manifest.version);

        function lStorage() {
            //var data = JSON.stringify(localStorage);
            var temp = {};
            temp.options = typeof localStorage.options == "string" ? JSON.parse(localStorage.options) : localStorage.options;
            temp.tasks = typeof localStorage.tasks == "string" ? JSON.parse(localStorage.tasks) : localStorage.tasks;
            var data = JSON.stringify(temp);

            data = data.replace(/\\"/g, '"');
            data = data.replace(/"{/g, '{');
            data = data.replace(/\}"/g, '}');
            data = data.replace(/"\[/g, '[');
            data = data.replace(/]"/g, ']');
            return data;
        }

        function badge() {
            var counter = 0;
            if (localStorage.tasks) {
                var tasks = $.parseJSON(localStorage.tasks);
                if (tasks.length > 0) {
                    for (var i = 0; i < tasks.length; i++) {
                        if (tasks[i].completed === false) counter += 1;
                    }
                }
            }
            chrome.browserAction.setBadgeText({
                text: '' + counter + ''
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: '#777'
            });
        }

        var isChrome = false;
        if (
            (navigator.userAgent.match(/Chrome/i)) &&
            !(navigator.userAgent.match(/OPR/i)) &&
            !(navigator.userAgent.match(/YaBrowser/i))
        ) isChrome = true;

        function doSyncData() {
            var json = {};
            console.log('localstorage ' + localStorage);
            json.syncData = JSON.stringify(localStorage);
            chrome.storage.sync.set(json);
            // chrome.storage.sync.clear();

        }

        function updateOptions() {
            var defaultPriority;

            if (document.getElementById('chkDefaultPriority1').checked) {
                console.log('df1');
                defaultPriority = 1;
            }
            else if (document.getElementById('chkDefaultPriority2').checked) {
                console.log('df2');
                defaultPriority = 2;
            }
            else if (document.getElementById('chkDefaultPriority3').checked) {
                defaultPriority = 3;
            }
            else {
                defaultPriority = 4;
            }

            $("body").css("background-color", $('#backgroundColor').val());
            $("#wrapper").css("background-color", $('#backgroundColor').val());
            localStorage.options = '{' +
                '"task_css": "' + encodeURIComponent($('#task-css').val()) + '",' +
                '"backgroundColor": "' + $('#backgroundColor').val() + '",' +
                '"color1": "' + $('#color1').val() + '",' +
                '"font1": "' + $("#selectP1 option:selected").text() + '",' +
                '"font11": "' + $("#selectP11 option:selected").text() + '",' +
                '"position1": "' + $("#selectPosition1 option:selected").text() + '",' +
                '"color2": "' + $('#color2').val() + '",' +
                '"font2": "' + $("#selectP2 option:selected").text() + '",' +
                '"font22": "' + $("#selectP22 option:selected").text() + '",' +
                '"position2": "' + $("#selectPosition2 option:selected").text() + '",' +
                '"color3": "' + $('#color3').val() + '",' +
                '"font3": "' + $("#selectP3 option:selected").text() + '",' +
                '"font33": "' + $("#selectP33 option:selected").text() + '",' +
                '"position3": "' + $("#selectPosition3 option:selected").text() + '",' +
                '"color4": "' + $('#color4').val() + '",' +
                '"font4": "' + $("#selectP4 option:selected").text() + '",' +
                '"font44": "' + $("#selectP44 option:selected").text() + '",' +
                '"position4": "' + $("#selectPosition4 option:selected").text() + '",' +
                '"defaultPriority": "' + defaultPriority + '",' +
                '"hotkeys": "' + $('#hotkeys input[name="hotkey"]:checked').val() + '",' +
                '"context_menu": "' + $('#context-menu').data('val') + '"' +
                '}';
            console.log(localStorage.options);
            if (isChrome) doSyncData();
            //window.location.reload();
        }

        function defaultOptions(defaults) {
            $('input:text').each(function () {
                $(this).val($(this).data('default'));
            });
            if (defaults) $('input.color').minicolors('destroy');
            $('input.color').minicolors({
                letterCase: 'uppercase'
            });
            $('div.checkbox').each(function () {
                $(this).data('val', $(this).data('default'));
            });
            $('#hotkeys [value="0"]').prop('checked', true);
            $('#context-menu').attr('data-val', '0').removeClass('checked');

            $("body").css("background-color", $('#backgroundColor').val());
            $("#wrapper").css("background-color", $('#backgroundColor').val());

            //set default settings
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectP1')).scope();
                scope.$apply(function () {
                    scope.default4 = true;
                    scope.default3 = false;
                    scope.default2 = false;
                    scope.default1 = false;
                    scope.font1 = "13";
                    scope.font11 = "normal";
                    scope.position1 = "bottom";
                    scope.font2 = "13";
                    scope.font22 = "normal";
                    scope.position2 = "bottom";
                    scope.font3 = "13";
                    scope.font33 = "normal";
                    scope.position3 = "bottom";
                    scope.font4 = "13";
                    scope.font44 = "normal";
                    scope.position4 = "bottom";
                    var defaultPriority = 4;

                    localStorage.options = '{' +
                      //'"task_css": "' + encodeURIComponent($('#task-css').val()) + '",' +
                      //'"backgroundColor": "' + $('#backgroundColor').val() + '",' +
                      //'"color1": "' + $('#color1').val() + '",' +
                      '"task_css": "' + encodeURIComponent($('#task-css').val()) + '",' +
                      '"backgroundColor": "' + $('#backgroundColor').val() + '",' +
                      '"color1": "' + $('#color1').val() + '",' +
                      '"font1": "' + scope.font1 + '",' +
                      '"font11": "' + scope.font11 + '",' +
                      '"position1": "' + scope.position1 + '",' +
                      '"color2": "' + $('#color2').val() + '",' +
                      '"font2": "' + scope.font2 + '",' +
                      '"font22": "' + scope.font22 + '",' +
                      '"position2": "' + scope.position2 + '",' +
                      '"color3": "' + $('#color3').val() + '",' +
                      '"font3": "' + scope.font3 + '",' +
                      '"font33": "' + scope.font33 + '",' +
                      '"position3": "' + scope.position3 + '",' +
                      '"color4": "' + $('#color4').val() + '",' +
                      '"font4": "' + scope.font4 + '",' +
                      '"font44": "' + scope.font44 + '",' +
                      '"position4": "' + scope.position4 + '",' +
                      '"defaultPriority": "' + defaultPriority + '",' +
                      '"hotkeys": "' + $('#hotkeys input[name="hotkey"]:checked').val() + '",' +
                      '"context_menu": "' + $('#context-menu').data('val') + '"' +
                      '}';

                    doSyncData();
                });
            }, 10);







        }

        function exportAsFile() {
            var file = new Blob([lStorage()]);
            $('#export-link').attr({
                'href': URL.createObjectURL(file),
                'download': 'todoMation.json'
            });
        }

        // load options
        if (!localStorage.options || localStorage.options == '{}') {
            defaultOptions();
        } else {
            var options = $.parseJSON(localStorage.options);
            $('#task-css').val(decodeURIComponent(options.task_css));
            $('#backgroundColor').val(options.backgroundColor);
            $("#body").css("background-color", options.backgroundColor);
            $("#wrapper").css("background-color", options.backgroundColor);
            $('#color1').val(options.color1);
            $('#color2').val(options.color2);
            $('#color3').val(options.color3);
            $('#color4').val(options.color4);
            //font1
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectP1')).scope();
                scope.$apply(function () {
                    scope.font1 = options.font1;
                });
            }, 200);
            //font11
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectP11')).scope();
                scope.$apply(function () {
                    scope.font11 = options.font11;
                });
            }, 200);
            //position1
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectPosition1')).scope();
                scope.$apply(function () {
                    scope.position1 = options.position1;
                });
            }, 200);
            //font2
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectP2')).scope();
                scope.$apply(function () {
                    scope.font2 = options.font2;
                });
            }, 200);
            //font22
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectP22')).scope();
                scope.$apply(function () {
                    scope.font22 = options.font22;
                });
            }, 200);
            //position2
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectPosition2')).scope();
                scope.$apply(function () {
                    scope.position2 = options.position2;
                });
            }, 200);
            //font3
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectP3')).scope();
                scope.$apply(function () {
                    scope.font3 = options.font3;
                });
            }, 200);
            //font33
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectP33')).scope();
                scope.$apply(function () {
                    scope.font33 = options.font33;
                });
            }, 200);
            //position3
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectPosition3')).scope();
                scope.$apply(function () {
                    scope.position3 = options.position3;
                });
            }, 200);
            //font4
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectP4')).scope();
                scope.$apply(function () {
                    scope.font4 = options.font4;
                });
            }, 200);
            //font44
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectP44')).scope();
                scope.$apply(function () {
                    scope.font44 = options.font44;
                });
            }, 200);
            //position4
            setTimeout(function () {
                var scope = angular.element(document.querySelector('#selectPosition4')).scope();
                scope.$apply(function () {
                    scope.position4 = options.position4;
                });
            }, 200);
            //Default priority
            if (options.defaultPriority == 1) {
                setTimeout(function () {
                    var scope = angular.element(document.querySelector('#chkDefaultPriority1')).scope();
                    scope.$apply(function () {
                        scope.default1 = true;
                    });
                }, 200);
            } else if (options.defaultPriority == 2) {
                setTimeout(function () {
                    var scope = angular.element(document.querySelector('#chkDefaultPriority2')).scope();
                    scope.$apply(function () {
                        scope.default2 = true;
                    });
                }, 200);
            }
            else if (options.defaultPriority == 3) {
                setTimeout(function () {
                    var scope = angular.element(document.querySelector('#chkDefaultPriority3')).scope();
                    scope.$apply(function () {
                        scope.default3 = true;
                    });
                }, 200);
            }
            else {

            }
            if (options.hotkeys > 0) {
                $('#hotkeys [value="' + options.hotkeys + '"]').prop('checked', true);
            } else {
                $('#hotkeys [value="0"]').prop('checked', true);
            }
            if (options.context_menu == '1') {
                $('#context-menu').attr('data-val', options.context_menu).addClass('checked');
            }
            $('input.color').minicolors({
                letterCase: 'uppercase'
            });
        }

        // checkboxes
        $('div.checkbox').click(function () {
            if ($(this).is('.checked')) {
                $(this).removeClass('checked');
                $(this).attr('data-val', '0');
            } else {
                $(this).addClass('checked');
                $(this).attr('data-val', '1');
            }
        });

        // save options
        $('#save').click(function () {
            $(this).addClass('active');
            setTimeout(function () {
                $('#save').removeClass('active');
            }, 800);
            updateOptions();
        });

        // restore default options
        $('#defaults').click(function () {
            defaultOptions(defaults = true);
            $(this).addClass('active');
            setTimeout(function () {
                $('#defaults').removeClass('active');
            }, 800);
            //updateOptions();
            return false;
        });

        // tabs
        $('ul.tabs__caption').on('click', 'li:not(.active)', function () {
            $(this).addClass('active').siblings().removeClass('active')
                .parents('div.tabs').find('div.tabs__content').eq($(this).index()).show().siblings('div.tabs__content').hide();

            $('#export').val(lStorage());

            var top = ($(window).height() - $('div.modal').outerHeight()) / 2;
            var left = ($(window).width() - $('div.modal').outerWidth()) / 2;
            $('div.modal').css({
                top: (top > 0 ? top : 0) + 'px',
                left: (left > 0 ? left : 0) + 'px'
            });
        });

        // translation
        $('body *').each(function () {
            //		if ( $(this).attr('data-i18n') ) {
            //			$(this).text( chrome.i18n.getMessage( $(this).attr('data-i18n') ) );
            //		}
            //		if ( $(this).attr('data-i18n-title') ) {
            //			$(this).attr('title', chrome.i18n.getMessage( $(this).attr('data-i18n-title') ) );
            //		}
            //		if (chrome.i18n.getMessage('@@ui_locale') == 'ru') {
            //			$('#developer-url').attr('href', 'http://dimox.name/');
            //		}
        });

        var labelWidth = 0;
        var label = $('div.option label');
        label.each(function () {
            if ($(this).width() > labelWidth) labelWidth = $(this).width();
        }).width(labelWidth);

        $('body').prepend('<div id="overlay"></div>');

        $('#import-button').click(function () {
            $('#overlay,#confirm-import').addClass('visible');
        });

        // import data
        $('#import-yes').on('click', function () {
            $('#confirm-import').removeClass('visible');
            var data = $('#import').val();
            $('#done div.modal__headline').hide();
            $('#done').addClass('visible');

            // check for correct JSON
            var IS_JSON = true;
            try {
                data = $.parseJSON(data);
            } catch (err) {
                IS_JSON = false;
            }
            if (IS_JSON) {
                localStorage.clear();
                for (var key in data) {
                    localStorage[key] = JSON.stringify(data[key]);
                }
                $('#data-imported-successfully').show();
            } else {
                $('#could-not-be-imported').show();
            }

            if (isChrome) doSyncData();

            $('#import').val('');
            $('#export').val(lStorage());
            badge();
            exportAsFile();
        });

        $('#clear-button').click(function () {
            $('#overlay, #confirm-clear').addClass('visible');
        });

        // clear data
        $('#clear-yes').on('click', function () {
            $('#confirm-clear').removeClass('visible');
            $('#done').addClass('visible');
            $('#done div.modal__headline').hide();
            $('#all-data-is-deleted').show();
            localStorage.clear();
            if (isChrome) doSyncData();
            $('#export').val(lStorage());
            badge();
            $("#divTasks ul li[class*='field']").remove();
            $("#divTasks ul li").removeClass("emptyli").addClass("hide-emptyli");
        });

        $('#overlay, #import-no, #clear-no, #ok').on('click', function () {
            $('#overlay, div.modal_new').removeClass('visible');
        });

        // export data
        $('#export').val(lStorage()).click(function () {
            $(this).select();
        });

        // export data as file
        exportAsFile();

    });
})(jQuery);