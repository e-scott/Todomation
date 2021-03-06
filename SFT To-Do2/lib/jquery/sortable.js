/*
 jQuery UI Sortable plugin wrapper
 */

var appSort = angular.module('ui.sortable', []);

appSort.value('uiSortableConfig', {});

appSort.directive('uiSortable', [
    'uiSortableConfig', '$timeout', '$log', '$controller',
    function (uiSortableConfig, $timeout, $log, $scope, $controller) {

        if (Array.prototype.move == undefined) {
            Array.prototype.move = function (old_index, new_index) {
                if (new_index >= this.length) {
                    var k = new_index - this.length;
                    while ((k--) + 1) {
                        this.push(undefined);
                    }
                }
                this.splice(new_index, 0, this.splice(old_index, 1)[0]);
                return this; // for testing purposes
            };
        }

        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel, $scope) {
                var savedNodes;

                function combineCallbacks(first, second) {
                    if (second && (typeof second === 'function')) {
                        return function (e, ui) {
                            first(e, ui);
                            second(e, ui);
                        };
                    }
                    return first;
                }

                function hasSortingHelper(element, ui) {
                    var helperOption = element.sortable('option', 'helper');
                    return helperOption === 'clone' || (typeof helperOption === 'function' && ui.item.sortable.isCustomHelperUsed());
                }

                // thanks jquery-ui
                function isFloating(item) {
                    return (/left|right/).test(item.css('float')) || (/inline|table-cell/).test(item.css('display'));
                }

                function afterStop(e, ui) {
                    ui.item.sortable._destroy();
                }

                var opts = {};

                // directive specific options
                var directiveOpts = {
                    'ui-floating': undefined
                };

                var callbacks = {
                    receive: null,
                    remove: null,
                    start: null,
                    stop: null,
                    update: null
                };

                var wrappers = {
                    helper: null
                };

                angular.extend(opts, directiveOpts, uiSortableConfig, scope.$eval(attrs.uiSortable));

                if (!angular.element.fn || !angular.element.fn.jquery) {
                    $log.error('ui.sortable: jQuery should be included before AngularJS!');
                    return;
                }

                if (ngModel) {

                    // When we add or remove elements, we need the sortable to 'refresh'
                    // so it can find the new/removed elements.
                    scope.$watch(attrs.ngModel + '.length', function () {
                        // Timeout to let ng-repeat modify the DOM
                        $timeout(function () {
                            // ensure that the jquery-ui-sortable widget instance
                            // is still bound to the directive's element
                            if (!!element.data('ui-sortable')) {
                                element.sortable('refresh');
                            }
                        });
                    });

                    callbacks.start = function (e, ui) {

                        //var fAll = callbacks.storageFindAll;
                        //todoStorage.findAll()
                        if (opts['ui-floating'] === 'auto') {
                            // since the drag has started, the element will be
                            // absolutely positioned, so we check its siblings
                            var siblings = ui.item.siblings();
                            angular.element(e.target).data('ui-sortable').floating = isFloating(siblings);
                        }

                        // Save the starting position of dragged item
                        ui.item.sortable = {
                            model: ngModel.$modelValue[ui.item.index()],
                            index: ui.item.index(),
                            source: ui.item.parent(),
                            sourceModel: ngModel.$modelValue,
                            cancel: function () {
                                ui.item.sortable._isCanceled = true;
                            },
                            isCanceled: function () {
                                return ui.item.sortable._isCanceled;
                            },
                            isCustomHelperUsed: function () {
                                return !!ui.item.sortable._isCustomHelperUsed;
                            },
                            _isCanceled: false,
                            _isCustomHelperUsed: ui.item.sortable._isCustomHelperUsed,
                            _destroy: function () {
                                angular.forEach(ui.item.sortable, function (value, key) {
                                    ui.item.sortable[key] = undefined;
                                });
                            }
                        };
                        
//                        if (!$(e.originalEvent.target).is("div.drag")) {
//                            ui.item.sortable.cancel();
//                            return;
//                        }

                    };

                    callbacks.activate = function ( /*e, ui*/ ) {
                        // We need to make a copy of the current element's contents so
                        // we can restore it after sortable has messed it up.
                        // This is inside activate (instead of start) in order to save
                        // both lists when dragging between connected lists.
                        savedNodes = element.contents();

                        // If this list has a placeholder (the connected lists won't),
                        // don't inlcude it in saved nodes.
                        var placeholder = element.sortable('option', 'placeholder');

                        // placeholder.element will be a function if the placeholder, has
                        // been created (placeholder will be an object).  If it hasn't
                        // been created, either placeholder will be false if no
                        // placeholder class was given or placeholder.element will be
                        // undefined if a class was given (placeholder will be a string)
                        if (placeholder && placeholder.element && typeof placeholder.element === 'function') {
                            var phElement = placeholder.element();
                            // workaround for jquery ui 1.9.x,
                            // not returning jquery collection
                            phElement = angular.element(phElement);

                            // exact match with the placeholder's class attribute to handle
                            // the case that multiple connected sortables exist and
                            // the placehoilder option equals the class of sortable items
                            var excludes = element.find('[class="' + phElement.attr('class') + '"]');

                            savedNodes = savedNodes.not(excludes);
                        }
                    };

                    callbacks.update = function (e, ui) {
//                        if (!$(e.originalEvent.target).is("div.drag")) {
//                            ui.item.sortable.cancel();
//                            e.preventDefault();
//                            return;
//                        }
                        // Save current drop position but only if this is not a second
                        // update that happens when moving between lists because then
                        // the value will be overwritten with the old value
                        if (!ui.item.sortable.received) {
                            ui.item.sortable.dropindex = ui.item.index();
                            var droptarget = ui.item.parent();
                            ui.item.sortable.droptarget = droptarget;
                            ui.item.sortable.droptargetModel = droptarget.scope().$eval(droptarget.attr('ng-model'));

                            //Exchange the todo items in the list
                            var items = [];
                            items = ui.item.sortable.sourceModel;
                            var todoDraggedItem = ui.item.sortable.model;

                            console.log(todoDraggedItem);
                            if (todoDraggedItem) {
                                var draggedIndex = items.indexOf(todoDraggedItem);
                                var droppedIndex = ui.item.sortable.dropindex;

                                if (draggedIndex != items.length) {
                                    if (droppedIndex != items.length) {
                                        items.move(draggedIndex, ui.item.sortable.dropindex);

                                        console.log(draggedIndex);
                                        console.log(ui.item.sortable.dropindex);

                                        // Cancel the sort (let ng-repeat do the sort for us)
                                        // Don't cancel if this is the received list because it has
                                        // already been canceled in the other list, and trying to cancel
                                        // here will mess up the DOM.
                                        element.sortable('cancel');

                                        //Save the exchanged todo items to chrome storage
                                        var todoStorage = angular.element(document.body).injector().get('todoStorage');
                                        todoStorage.data = items;
                                        todoStorage.sync();
                                    } else if (droppedIndex == items.length) {
                                        items.move(draggedIndex, (items.length - 1));

                                        console.log(draggedIndex);
                                        console.log(items.length - 1);

                                        // Cancel the sort (let ng-repeat do the sort for us)
                                        // Don't cancel if this is the received list because it has
                                        // already been canceled in the other list, and trying to cancel
                                        // here will mess up the DOM.
                                        element.sortable('cancel');

                                        //Save the exchanged todo items to chrome storage
                                        var todoStorage = angular.element(document.body).injector().get('todoStorage');
                                        todoStorage.data = items;
                                        todoStorage.sync();
                                    }
                                } else {
                                    e.preventDefault();
                                }
                            }
                        }

                        // Put the nodes back exactly the way they started (this is very
                        // important because ng-repeat uses comment elements to delineate
                        // the start and stop of repeat sections and sortable doesn't
                        // respect their order (even if we cancel, the order of the
                        // comments are still messed up).
                        if (hasSortingHelper(element, ui) && !ui.item.sortable.received &&
                            element.sortable('option', 'appendTo') === 'parent') {
                            // restore all the savedNodes except .ui-sortable-helper element
                            // (which is placed last). That way it will be garbage collected.
                            savedNodes = savedNodes.not(savedNodes.last());
                        }
                        savedNodes.appendTo(element);

                        //Reload exchanged data
                        angular.element(document.body).scope().todoStorage.GetDataForDragDrop().then(function () {
                            console.log('Drag and Drop success');
                        })

                        // If this is the target connected list then
                        // it's safe to clear the restored nodes since:
                        // update is currently running and
                        // stop is not called for the target list.
                        if (ui.item.sortable.received) {
                            savedNodes = null;
                        }

                        // If received is true (an item was dropped in from another list)
                        // then we add the new item to this list otherwise wait until the
                        // stop event where we will know if it was a sort or item was
                        // moved here from another list
                        if (ui.item.sortable.received && !ui.item.sortable.isCanceled()) {
                            scope.$apply(function () {
                                ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0,
                                    ui.item.sortable.moved);
                            });
                        }
                    };

                    callbacks.stop = function (e, ui) {
                        // If the received flag hasn't be set on the item, this is a
                        // normal sort, if dropindex is set, the item was moved, so move
                        // the items in the list.
                        if (!ui.item.sortable.received &&
                            ('dropindex' in ui.item.sortable) &&
                            !ui.item.sortable.isCanceled()) {

                            scope.$apply(function () {
                                ngModel.$modelValue.splice(
                                    ui.item.sortable.dropindex, 0,
                                    ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]);
                            });
                        } else {
                            // if the item was not moved, then restore the elements
                            // so that the ngRepeat's comment are correct.
                            if ((!('dropindex' in ui.item.sortable) || ui.item.sortable.isCanceled()) &&
                                !hasSortingHelper(element, ui)) {
                                savedNodes.appendTo(element);
                            }
                        }

                        // It's now safe to clear the savedNodes
                        // since stop is the last callback.
                        savedNodes = null;
                    };

                    callbacks.receive = function (e, ui) {
                        // An item was dropped here from another list, set a flag on the
                        // item.
                        ui.item.sortable.received = true;
                    };

                    callbacks.remove = function (e, ui) {
                        // Workaround for a problem observed in nested connected lists.
                        // There should be an 'update' event before 'remove' when moving
                        // elements. If the event did not fire, cancel sorting.
                        if (!('dropindex' in ui.item.sortable)) {
                            element.sortable('cancel');
                            ui.item.sortable.cancel();
                        }

                        // Remove the item from this list's model and copy data into item,
                        // so the next list can retrive it
                        if (!ui.item.sortable.isCanceled()) {
                            scope.$apply(function () {
                                ui.item.sortable.moved = ngModel.$modelValue.splice(
                                    ui.item.sortable.index, 1)[0];
                            });
                        }
                    };

                    wrappers.helper = function (inner) {
                        if (inner && typeof inner === 'function') {
                            return function (e, item) {
                                var innerResult = inner(e, item);
                                item.sortable._isCustomHelperUsed = item !== innerResult;
                                return innerResult;
                            };
                        }
                        return inner;
                    };

                    scope.$watch(attrs.uiSortable, function (newVal /*, oldVal*/ ) {
                        // ensure that the jquery-ui-sortable widget instance
                        // is still bound to the directive's element
                        if (!!element.data('ui-sortable')) {
                            angular.forEach(newVal, function (value, key) {
                                // if it's a custom option of the directive,
                                // handle it approprietly
                                if (key in directiveOpts) {
                                    if (key === 'ui-floating' && (value === false || value === true)) {
                                        element.data('ui-sortable').floating = value;
                                    }

                                    opts[key] = value;
                                    return;
                                }

                                if (callbacks[key]) {
                                    if (key === 'stop') {
                                        // call apply after stop
                                        value = combineCallbacks(
                                            value,
                                            function () {
                                                scope.$apply();
                                            });

                                        value = combineCallbacks(value, afterStop);
                                    }
                                    // wrap the callback
                                    value = combineCallbacks(callbacks[key], value);
                                } else if (wrappers[key]) {
                                    value = wrappers[key](value);
                                }

                                opts[key] = value;
                                element.sortable('option', key, value);
                            });
                        }
                    }, true);

                    angular.forEach(callbacks, function (value, key) {
                        opts[key] = combineCallbacks(value, opts[key]);
                        if (key === 'stop') {
                            opts[key] = combineCallbacks(opts[key], afterStop);
                        }
                    });

                } else {
                    $log.info('ui.sortable: ngModel not provided!', element);
                }

                // Create sortable
                element.sortable(opts);
            }
        };
                }
                ]);