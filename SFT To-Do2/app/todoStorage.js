angular.module('app').service('todoStorage', function ($q) {
    var _this = this;
    this.data = [];

    this.findAll = function (callback) {
        chrome.storage.sync.get('syncData', function (keys) {
            if (keys.syncData != null && keys.syncData != "{}") {
                console.log('KeyData ' + keys.syncData);
                var chData = JSON.parse(keys.syncData) || {};
                if (chData.hasOwnProperty("tasks")) {
                    console.log(chData);
                    _this.data = (typeof chData.tasks=="object"?chData.tasks:JSON.parse(chData.tasks));
                    console.log(_this.data);
                    for (var i = 0; i < _this.data.length; i++) {
                        _this.data[i]['id'] = i + 1;
                    }

                }
                else
                {
                    _this.data = [];
                }
                //getItem from localStorage
                console.log(_this.data);
                callback(_this.data);
            }
            else
            {
                console.log("calling")
                _this.data = [];
                callback(_this.data);
            }
        });
    }

    this.GetDataForDragDrop = function () {
        var deferred = $q.defer();
        chrome.storage.sync.get('syncData', function (keys) {
            if (keys.syncData != null) {
                var chData = JSON.parse(keys.syncData) || {};
                if (chData.hasOwnProperty("tasks")) {
                    _this.data = (typeof chData.tasks=="object"?chData.tasks:JSON.parse(chData.tasks));
                    console.log(_this.data);
                    for (var i = 0; i < _this.data.length; i++) {
                        _this.data[i]['id'] = i + 1;
                    }

                }
                console.log(_this.data);
                deferred.resolve(_this.data);

            } else {
                deferred.reject(null);
            }
        });
        return deferred.promise;
    }

    function sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    this.sync = function () {

        //Save to localStorage
        localStorage["tasks"] = JSON.stringify(this.data);
        chrome.storage.sync.set({
            syncData: JSON.stringify({ tasks: this.data })
        }, function () {
            console.log('Data is stored in Chrome storage');
        });
    }

    this.add = function (newContent, defaultPriority) {
        var id = this.data.length + 1;
        var newId = CreateID(this.data, id);

        var todo = {
            id: newId,
            text: newContent,
            completed: false,
            priority: defaultPriority,
            prevPriority: '',
            createdAt: new Date()
        };
        this.data.push(todo);
        this.sync();
        console.log(this.data);
    }

    function CreateID(array, id) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                id = id + 1;
                CreateID(array, id);
            }
        }
        return id;
    }

    this.edit = function (todoEdit, index) {
        if (index !== -1) {
            todoEdit.editing = false;
            this.data[index] = todoEdit;
        }
        this.sync();
    }

    this.AssignPriority = function (priorityValue, todo) {
        todo.priority = priorityValue;
        var index = this.data.indexOf(todo);
        if (index !== -1) {
            this.data[index] = todo;
        }
        this.sync();
    }

    this.remove = function (todo) {
        this.data.splice(this.data.indexOf(todo), 1);
        this.sync();
    }

    this.removeAll = function () {
        this.data = [];
        this.sync();
    }
});