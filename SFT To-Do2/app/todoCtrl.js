'use strict';

angular.module('app').controller('todoCtrl', function ($scope, $sce, todoStorage, $filter, $location) {

    $scope.todoStorage = todoStorage;

    $scope.opr = 'add';
    $scope.todoEdit = '';
    $scope.editIndex = '';
    $scope.showPopup = false;
    $scope.delCompleted = false;
    $scope.ulHeight;
    $scope.todoEdit2 = '';
    $scope.tasks = true;
    $scope.options = false;
    $scope.bodyWidth = 394;
    $scope.cnt = 0;
    $scope.fonts = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    $scope.fonts2 = ['normal', 'bold', 'italic'];
    $scope.positions = ['top', 'bottom'];

    $scope.default1Click = function () {
        if (!$scope.default1)
            $scope.default1 = false;
        else
            $scope.default1 = true;
        $scope.default2 = false;
        $scope.default3 = false;
        $scope.default4 = false;
    }

    $scope.default2Click = function () {
        $scope.default1 = false;
        $scope.default4 = false;
        if (!$scope.default2)
            $scope.default2 = false;
        else
            $scope.default2 = true;
        $scope.default3 = false;
    }

    $scope.default3Click = function () {
        $scope.default1 = false;
        $scope.default2 = false;
        $scope.default4 = false;
        if (!$scope.default3)
            $scope.default3 = false;
        else
            $scope.default3 = true;
    }

    $scope.default4Click = function () {
        $scope.default1 = false;
        $scope.default2 = false;
        $scope.default3 = false;
        if (!$scope.default4)
            $scope.default4 = false;
        else
            $scope.default4 = true;
    }

    $scope.AssignPriority = function (priorityValue, todo) {
        if ($("li").find("div.txtarea:visible").length > 0) {
            $("li").find("span").show();
            $("li").find("div.divOpt").show();
            $("li").find("div.txtarea").hide();
            return;
        }
        if (todo.priority == 5) {
            return;
        }
        todoStorage.AssignPriority(priorityValue, todo);

        $scope.todoList = $scope.todoStorage.data.sort(function (a, b) {
            var aPriority = a.priority;
            var bPriority = b.priority;
            var aId = a.id;
            var bId = b.id;
            if (aPriority == bPriority) {
                return (aId < bId) ? -1 : (aId > bId) ? 1 : 0;
            } else {
                return (aPriority < bPriority) ? -1 : 1;
            }
        });
    };

    $scope.getTextContent = function (e) {
        localStorage.setItem('textValue', $scope.newContent);
    }

    $scope.TextareaResize = function (id) {
        $('#' + id).autogrow({
            onInitialize: true
        });
    }

    $scope.showPopover = function () {
        $scope.popoverIsVisible = true;
    };

    $scope.hidePopover = function () {
        $scope.popoverIsVisible = false;
    };

    $scope.navigatePage = function () {
        $scope.todoStorage.findAll(function (data) {
            console.log("chorome data:");

            $scope.todoList = data.sort(function (a, b) {
                var aPriority = a.priority;
                var bPriority = b.priority;
                var aId = a.id;
                var bId = b.id;
                if (aPriority == bPriority) {
                    return (aId < bId) ? -1 : (aId > bId) ? 1 : 0;
                } else {
                    return (aPriority < bPriority) ? -1 : 1;
                }
            })
            console.log($scope.todoList);
            $scope.$apply();

        });
        $scope.tasks = true;
        $scope.options = false;
        $scope.bodyWidth = 394;

    };

    function lStorage() {
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

    $scope.navigatePage2 = function () {
        $scope.tasks = false;
        $scope.options = true;
        $scope.bodyWidth = 603;
        //Make priority 4 as default
        if ($scope.default4 == undefined && $scope.default1 == undefined && $scope.default2 == undefined && $scope.default3 == undefined) {
            $scope.default4 = true;
        }
        else if ($scope.default4 == false && $scope.default1 == false && $scope.default2 == false && $scope.default3 == false) {
            $scope.default4 = true;
        }
        $('#export').val(lStorage());
    };


    $scope.DecodeData = function (text) {
        return $sce.trustAsHtml(text.replace(/\n/g, '<br />'));
    }

    $scope.$watch('todoStorage.data', function () {
        var txtVal = localStorage.getItem('textValue');
        if (txtVal != undefined) {
            $scope.newContent = txtVal;
        }

        $scope.todoList = ($scope.todoStorage.data.sort(function (a, b) {
            var aPriority = a.priority;
            var bPriority = b.priority;
            var aId = a.id;
            var bId = b.id;
            if (aPriority == bPriority) {
                return (aId < bId) ? -1 : (aId > bId) ? 1 : 0;
            } else {
                return (aPriority < bPriority) ? -1 : 1;
            }
        }));
        countRemainingTasks();
    });

    $scope.todoStorage.findAll(function (data) {

        var completedCount = 0;
        angular.forEach($scope.todoStorage.data, function (item) {
            if (item.completed) {
                completedCount++;
            }
        });

        if (completedCount > 0) {
            $scope.delCompleted = true;
            if ($scope.todoStorage.data.length == completedCount)
                $scope.selectedAll = true;
        }

        var txtVal = localStorage.getItem('textValue');
        if (txtVal != undefined) {
            $scope.newContent = txtVal;
        }

        $scope.todoList = (data.sort(function (a, b) {
            var aPriority = a.priority;
            var bPriority = b.priority;
            var aId = a.id;
            var bId = b.id;
            if (aPriority == bPriority) {
                return (aId < bId) ? -1 : (aId > bId) ? 1 : 0;
            } else {
                return (aPriority < bPriority) ? -1 : 1;
            }
        }));

        countRemainingTasks();
        $scope.$apply();
    });

    function countRemainingTasks() {
        var count = 0;
        angular.forEach($scope.todoList, function (todo) {
            if (!todo.completed) {
                count += 1;
            }
        });

        chrome.browserAction.setBadgeText({
            text: count.toString()
        });
    }

    $scope.todoCount = function () {
        var count = 0;
        angular.forEach($scope.todoList, function (todo) {
            count += 1;
        });
        return count;
    }

    $scope.taskNameStyle = function (todo) {
        var options = localStorage.getItem('options');
        if (options == null) {
            var option = {
                backgroundColor: "#fdfd89",
                color1: "#F04B39",
                font1: "13",
                font11: "normal",
                position1: "bottom",
                color2: "#FFA600",
                font2: "13",
                font22: "normal",
                position2: "bottom",
                color3: "#75BE2C",
                font3: "13",
                font33: "normal",
                position3: "position3",
                color4: "#AAA",
                font4: "13",
                font44: "normal",
                position4: "bottom",
                defaultPriority: 4,
                context_menu: "0",
                hotkeys: "0",
                task_css: "font-size: 13px; line-height: 16px; font-family: Helvetica, Arial, sans-serif"
            };
            localStorage.setItem('options', JSON.stringify(option));
        }
        var optionsCSS = $.parseJSON(unescape(options));
        var style = {};
        if (options != null && optionsCSS != null) {
            //Add default font style
            if (optionsCSS.task_css != undefined) {
                var css = optionsCSS.task_css.split(";");
                for (var s in css) {
                    var k = css[s].toString().split(':');
                    style[k[0]] = k[1];
                }
            }
            if (todo.priority == 4) {
                //Put priority 4 settings if there
                if (optionsCSS.color4.toString() == '#AAA' || optionsCSS.color4.toString() == '#AAAAAA') {
                    style['color'] = '#333333';
                }
                else {
                    style['color'] = optionsCSS.color4.toString();
                }               
                if (optionsCSS.font4)
                    style['font-size'] = parseInt(optionsCSS.font4);
                if (optionsCSS.font44) {
                    if (optionsCSS.font44.toString() == 'bold') {
                        style['font-weight'] = 'bold';
                    }
                    else if (optionsCSS.font44.toString() == 'italic') {
                        style['font-style'] = 'italic';
                    }
                }
                else {
                    style['font-style'] = 'normal';
                }
            }
            if (todo.priority == 1) {
                style['color'] = optionsCSS.color1.toString();
                if (optionsCSS.font1)
                    style['font-size'] = parseInt(optionsCSS.font1);
                if (optionsCSS.font11) {
                    if (optionsCSS.font11.toString() == 'bold') {
                        style['font-weight'] = 'bold';
                    }
                    else if (optionsCSS.font11.toString() == 'italic') {
                        style['font-style'] = 'italic';
                    }
                }
                else {
                    style['font-style'] = 'normal';
                }
            } else if (todo.priority == 2) {
                style['color'] = optionsCSS.color2.toString();
                if (optionsCSS.font2)
                    style['font-size'] = parseInt(optionsCSS.font2);
                if (optionsCSS.font22) {
                    if (optionsCSS.font22.toString() == 'bold') {
                        style['font-weight'] = 'bold';
                    }
                    else if (optionsCSS.font22.toString() == 'italic') {
                        style['font-style'] = 'italic';
                    }
                }
                else {
                    style['font-style'] = 'normal';
                }
            } else if (todo.priority == 3) {
                style['color'] = optionsCSS.color3.toString();
                if (optionsCSS.font3)
                    style['font-size'] = parseInt(optionsCSS.font3);
                if (optionsCSS.font33) {
                    if (optionsCSS.font33.toString() == 'bold') {
                        style['font-weight'] = 'bold';
                    }
                    else if (optionsCSS.font33.toString() == 'italic') {
                        style['font-style'] = 'italic';
                    }
                }
                else {
                    style['font-style'] = 'normal';
                }
            }
            if (todo.completed) {
                style['color'] = '#BBB';
            }
        }
        return style;
    }

    $scope.backgroundButtonStyle = function () {
        var options = localStorage.getItem('options');
        var optionsCSS = $.parseJSON(unescape(options));
        var style = {};
        if (optionsCSS != null) {
            style['background-color'] = optionsCSS.backgroundColor.toString();
        } else {
            style['background-color'] = '#fdfd89';
        }
        return style;
    }

    $scope.priorityButtonStyle = function (todo) {
        var options = localStorage.getItem('options');
        var optionsCSS = $.parseJSON(unescape(options));
        var style = {};
        if (optionsCSS != null) {
            style['background-color'] = optionsCSS.color4.toString();
            if (todo.priority == 4)
                style['border'] = '2px solid #fcff2e';
        }
        else {
            style['background-color'] = 'background: #AAA';
        }
        return style;
    }

    $scope.priority1ButtonStyle = function (todo) {
        var options = localStorage.getItem('options');
        var optionsCSS = $.parseJSON(unescape(options));
        var style = {};
        if (optionsCSS != null) {
            style['background-color'] = optionsCSS.color1.toString();
            if (todo.priority == 1)
                style['border'] = '2px solid #fcff2e';
        } else {
            style['background-color'] = '#F04B39';

        }
        return style;
    }

    $scope.priority2ButtonStyle = function (todo) {
        var options = localStorage.getItem('options');
        var optionsCSS = $.parseJSON(unescape(options));
        var style = {};
        if (optionsCSS != null) {
            style['background-color'] = optionsCSS.color2.toString();
            if (todo.priority == 2)
                style['border'] = '2px solid #fcff2e';
        } else {
            style['background-color'] = '#FFA600';
        }
        return style;
    }

    $scope.priority3ButtonStyle = function (todo) {
        var options = localStorage.getItem('options');
        var optionsCSS = $.parseJSON(unescape(options));
        var style = {};
        if (optionsCSS != null) {
            style['background-color'] = optionsCSS.color3.toString();
            if (todo.priority == 3)
                style['border'] = '2px solid #fcff2e';
        } else {
            style['background-color'] = '#75BE2C';
        }
        return style;
    }

    function sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    $scope.keyPressAddEvent = function (e) {
        var options = localStorage.getItem('options');
        var optionsCSS = $.parseJSON(unescape(options));
        if (options != null && optionsCSS != null) {
            if (optionsCSS.hotkeys.toString() == 0) {
                if (event.keyCode == 13 && !event.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    $scope.add();
                } else if (event.keyCode == 10 && event.ctrlKey && !e.shiftKey) {
                    if ($scope.newContent != undefined) {
                        $scope.newContent = $scope.newContent + "\n";
                    } else {
                        $scope.newContent = '';
                        $scope.newContent = $scope.newContent + "\n";
                    }

                } else if (e.keyCode == 13 && e.shiftKey) {
                    if ($scope.newContent == undefined) {
                        $scope.newContent = '';
                        $scope.newContent = $scope.newContent + '\n';
                    }
                } else if (e.keyCode == 8) {

                }
            } else if (optionsCSS.hotkeys.toString() == 1) {
                if (event.keyCode == 13 && !event.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    if ($scope.newContent != undefined) {
                        $scope.newContent = $scope.newContent + "\n";
                    } else {
                        $scope.newContent = '';
                        $scope.newContent = $scope.newContent + "\n";
                    }
                } else if (event.keyCode == 10 && event.ctrlKey && !e.shiftKey) {
                    $scope.add();
                } else if (e.keyCode == 13 && e.shiftKey) {
                    if ($scope.newContent == undefined) {
                        $scope.newContent = '';
                        $scope.newContent = $scope.newContent + '\n';
                    }
                }
            }
        } else {
            //Default operations            
            if (event.keyCode == 13 && !event.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                $scope.add();
            } else if (event.keyCode == 10 && event.ctrlKey && !e.shiftKey) {
                if ($scope.newContent != undefined) {
                    $scope.newContent = $scope.newContent + "\n";
                } else {
                    $scope.newContent = '';
                    $scope.newContent = $scope.newContent + "\n";
                }
            } else if (e.keyCode == 13 && e.shiftKey) {
                if ($scope.newContent == undefined) {
                    $scope.newContent = '';
                    $scope.newContent = $scope.newContent + '\n';
                }
            } else if (e.keyCode == 8) {

            }
        }
    }

    $scope.keyPressEditEvent = function (e, todo) {
        var options = localStorage.getItem('options');
        var optionsCSS = $.parseJSON(unescape(options));
        if (options != null && optionsCSS != null) {
            if (optionsCSS.hotkeys.toString() == 0) {
                if (event.keyCode == 13 && !event.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    $scope.add(todo);
                } else if (event.keyCode == 10 && event.ctrlKey && !e.shiftKey) {
                    if (todo.text != undefined) {
                        todo.text = todo.text + "\n";
                    } else {
                        todo.text = '';
                        todo.text = todo.text + "\n";
                    }
                } else if (e.keyCode == 13 && e.shiftKey) {
                    if (todo.texttodo.text == undefined) {
                        todo.text = '';
                        todo.text = todo.text + '\n';
                    }
                }
            } else if (optionsCSS.hotkeys.toString() == 1) {
                if (event.keyCode == 13 && !event.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    if (todo.text != undefined) {
                        todo.text = todo.text + "\n";
                    } else {
                        todo.text = '';
                        todo.text = todo.text + "\n";
                    }
                } else if (event.keyCode == 10 && event.ctrlKey && !e.shiftKey) {
                    $scope.add(todo);
                } else if (e.keyCode == 13 && e.shiftKey) {
                    if (todo.text == undefined) {
                        todo.text = '';
                        todo.text = todo.text + '\n';
                    }
                }
            }
        } else {
            //Default operations 
            if (event.keyCode == 13 && !event.ctrlKey && !e.shiftKey) {
                $scope.add(todo);
            } else if (event.keyCode == 10 && event.ctrlKey && !e.shiftKey) {
                if (todo.text != undefined) {
                    todo.text = todo.text + "\n";
                } else {
                    todo.text = '';
                    todo.text = todo.text + "\n";
                }
            } else if (e.keyCode == 13 && e.shiftKey) {
                if (todo.text == undefined) {
                    todo.text = '';
                    todo.text = todo.text + '\n';
                }
            }
        }
    }

    $scope.add = function (todo) {
        if ($scope.opr == 'add') {
            if ($scope.newContent != undefined && $scope.newContent != '') {
                var defaultPriority;
                if ($scope.default1 == true) {
                    defaultPriority = 1;
                }
                else if ($scope.default2 == true) {
                    defaultPriority = 2;
                }
                else if ($scope.default3 == true) {
                    defaultPriority = 3;
                }
                else {
                    defaultPriority = 4;
                }
                todoStorage.add($scope.newContent, defaultPriority);

                $scope.ulHeight = $("ul")[0].scrollHeight;
                localStorage.removeItem('textValue');
            }
        } else if ($scope.opr == 'edit') {
            todo = $scope.todoEdit;
            $('li').each(function () {
                var li = $(this);
                li.find("span").show();
                li.find("div.divOpt").show();
                li.find("div.txtarea").hide();
            })
            if (todo.text != undefined && todo.text != '') {
                todoStorage.edit($scope.todoEdit, $scope.editIndex);
                $scope.saveEditContent($scope.todoEdit, $scope.editIndex);
            } else {
                var index = todoStorage.data.indexOf(todo);
                $scope.todo = $.parseJSON(sessionStorage.getItem('editValues'));
                if (index !== -1) {
                    todoStorage.data[index] = $scope.todo;
                }
            }
        }

        if ($scope.newContent != undefined && $scope.newContent != '') {
            $scope.todoList = $scope.todoStorage.data.sort(function (a, b) {
                var aPriority = a.priority;
                var bPriority = b.priority;
                var aId = a.id;
                var bId = b.id;
                if (aPriority == bPriority) {
                    var options = $.parseJSON(localStorage.options);
                    if (options.position1 == 'top' && aPriority == 1 && bPriority == 1) {
                        return (aId < bId) ? 1 : (aId > bId) ? -1 : 0;
                    }
                    else if (options.position2 == 'top' && aPriority == 2 && bPriority == 2) {
                        return (aId < bId) ? 1 : (aId > bId) ? -1 : 0;
                    }
                    else if (options.position3 == 'top' && aPriority == 3 && bPriority == 3) {
                        return (aId < bId) ? 1 : (aId > bId) ? -1 : 0;
                    }
                    else if (options.position4 == 'top' && aPriority == 4 && bPriority == 4) {
                        return (aId < bId) ? 1 : (aId > bId) ? -1 : 0;
                    }
                    else {
                        return (aId < bId) ? -1 : (aId > bId) ? 1 : 0;
                    }
                } else {
                    return (aPriority < bPriority) ? -1 : 1;
                }
            });
        }
        countRemainingTasks();

        $scope.opr = 'add';
        $scope.newContent = "";
        $('#txtNewTask').css('height', '30px');
    }

    $scope.saveEditContent = function (todo, todoIndex) {
        if (todoIndex !== -1) {
            todoStorage.data[todoIndex] = todo;
            todoStorage.sync();
        }
    }

    $scope.edit = function (todo, index) {

        $('li').each(function (i) {
            var li = $(this);
            if (i == index) {
                li.find("span").hide();
                li.find("div.divOpt").hide();
                li.find("div.txtarea").show();
            } else {
                li.find("span").show();
                li.find("div.divOpt").show();
                li.find("div.txtarea").hide();
            }
        });
        $scope.opr = 'edit';
        $scope.todoEdit = todo;
        sessionStorage.setItem('editValues', JSON.stringify(todo));
        $scope.editIndex = index;
        setTimeout(function () {
            var value = $("#txtEditTask" + index).val();
            $("#txtEditTask" + index).focus().val("").val(value);
            var ta = $('#txtEditTask' + index);
            if (ta.val() == '')
                ta.height(30);
            else
                ta.height(ta[0].scrollHeight - 13);
        }, 100)
    }   

    $scope.remove = function (todo) {
        todoStorage.remove(todo);
        countRemainingTasks();
    }

    $scope.removeAll = function () {
        if ($scope.selectedAll) {
            todoStorage.removeAll();
            $scope.selectedAll = false;
        } else {
            for (var i = 0; i < $scope.todoStorage.data.length; i++) {
                if ($scope.todoStorage.data[i].completed == true) {
                    todoStorage.remove($scope.todoStorage.data[i]);
                    i--;
                }
            }
        }
        $scope.delCompleted = false;
    }

    $scope.toggleCompleted = function (priorityVal, todo) {
        var index = todoStorage.data.indexOf(todo);
        if (index !== -1) {
            if (!todo.completed) {
                priorityVal = 4;
                if (todo.prevPriority != '' && todo.prevPriority != undefined)
                    todo.priority = todo.prevPriority;
                else
                    todo.priority = priorityVal;
                todoStorage.data[index] = todo;
                $scope.delCompleted = false;
            }
            if (priorityVal == 5) {
                if (todo.priority != 5) {
                    todo.prevPriority = todo.priority;
                }
                todo.priority = priorityVal;
                todoStorage.data[index] = todo;
                $scope.delCompleted = true;
            }

            //Change to add mode
            $('li').each(function (i) {
                var li = $(this);
                if (i == index) {
                    li.find("span").show();
                    li.find("div.divOpt").show();
                    li.find("div.txtarea").hide();
                }
            });
            $scope.opr = 'add';

        }
        todoStorage.sync();

        $scope.todoList = todoStorage.data.sort(function (a, b) {
            var aPriority = a.priority;
            var bPriority = b.priority;
            var aId = a.id;
            var bId = b.id;
            if (aPriority == bPriority) {
                return (aId < bId) ? -1 : (aId > bId) ? 1 : 0;
            } else {
                return (aPriority < bPriority) ? -1 : 1;
            }
        });

        //To check and uncheck selectAll based on either one of them is selected or not
        var countCompletedFalse = 0,
            countCompletedTrue = 0;
        for (var i = 0; i < $scope.todoStorage.data.length; i++) {
            if ($scope.todoStorage.data[i].completed == false) {
                countCompletedFalse++;
            } else if ($scope.todoStorage.data[i].completed == true) {
                countCompletedTrue++;
            }
        }
        if (countCompletedFalse > 0) {
            $scope.selectedAll = false;
            if (countCompletedTrue > 0) {
                $scope.delCompleted = true;
            }
        } else {
            $scope.selectedAll = true;
        }
        countRemainingTasks();
    }

    $scope.todoSortable = {
        containment: "parent", //Dont let the user drag outside the parent
        //        cursor: "move", //Change the cursor icon on drag
        tolerance: "pointer" 
    };

    $scope.toggleToDoItemEditMode = function (item) {
        item.editing = !item.editing;
        $scope.opr = 'add';
    };

    $scope.checkAll = function () {
        var index;
        var priorityVal;
        if ($scope.selectedAll) {
            angular.forEach($scope.todoStorage.data, function (item) {
                item.completed = true;
                index = todoStorage.data.indexOf(item);
                if (item.completed) {
                    priorityVal = 5;
                    if (item.priority != 5) {
                        item.prevPriority = item.priority;
                    }
                    item.priority = priorityVal;
                    todoStorage.data[index] = item;
                    $scope.delCompleted = true;
                }
                todoStorage.sync();
            });

        } else {
            angular.forEach($scope.todoStorage.data, function (item) {
                item.completed = false;
                index = todoStorage.data.indexOf(item);
                if (!item.completed) {
                    priorityVal = 4;
                    if (item.prevPriority != '' && item.prevPriority != undefined)
                        item.priority = item.prevPriority;
                    else
                        item.priority = priorityVal;
                    todoStorage.data[index] = item;
                    $scope.delCompleted = false;
                }
                todoStorage.sync();
            });
        }


        $scope.todoList = todoStorage.data.sort(function (a, b) {
            var aPriority = a.priority;
            var bPriority = b.priority;
            var aId = a.id;
            var bId = b.id;
            if (aPriority == bPriority) {
                return (aId < bId) ? -1 : (aId > bId) ? 1 : 0;
            } else {
                return (aPriority < bPriority) ? -1 : 1;
            }
        });

        if ($scope.todoCount() == 0) {
            $scope.delCompleted = false;
        }
        countRemainingTasks();
    };

}).directive('focusMe', function ($timeout) {
    return {
        scope: {
            trigger: '@focusMe'
        },
        link: function (scope, element) {
            scope.$watch('trigger', function (value) {
                if (value === "true") {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
});