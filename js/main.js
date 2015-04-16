var sampleApp = angular.module('sampleApp', []);

sampleApp.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on(attr.focusOn, function(e) {
          elem[0].focus();
      });
   };
});

sampleApp.directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
});

sampleApp.controller('TimesheetsController', function($scope){
  $scope.items = [{ }];
});

sampleApp.controller('TimesheetController', function($scope){
  $scope.item = { projectId: 2, project: 'two', subprojectId: 0, subproject: ''};
});

sampleApp.controller('FixedDropDownController', function($scope){
  // controller for fixed frop downs where the initial value and drop down list is
  // provided in initialization
});

sampleApp.controller('SubProjectController', function($scope){
  
});

sampleApp.controller('ProjectController', function($scope, $http, $controller){
  $controller('DropDownController', { $scope: $scope });
  
  var parentOnLoad = $scope.onLoad;
  $scope.onLoad = function(){
    parentOnLoad();
    $scope.selectItem($scope.item.projectId, $scope.item.project);
  };
  
  $scope.loadList = function(callback){
    $http.get('api/projects.json').success(function(data){
      callback(data);
    });
  };
  
  $scope.selectedValueChanged = function(id, text){
    $scope.item.projectId = id;
    $scope.item.project = text;
  };
  
  // functions to override
  // getData(filter);
  
});

sampleApp.controller('DropDownController', function ($scope, $http) {
  $scope.items = [];
  $scope.dropdownitem = { id: 0, text: ""};
  $scope.listVisible = false;
  $scope.listHover = false;
  $scope.groupby = "";
  
  var scope = $scope;
  
  $scope.onLoad = function(){
    // empty
  };
  
  $scope.loadList = function(callback){
    var data = [];
    callback(data);
  };
  
  $scope.$watchGroup(['listVisible', 'listHover'], function(newValues, oldValues, scope) {
    if(oldValues[0] === false && oldValues[1] === false && $scope.items.length === 0) {
      // load the list
      $scope.items = [];
      $scope.loadList(function(data){
        angular.forEach(data, function(value, key) {
          this.push({ id : value.id, name: value.name, active: $scope.dropdownitem.id == value.id});
        }, $scope.items);
      });
    }
  });
  
  $scope.$watch('item.text', function(newValue, oldValue){
    console.log(newValue + ', ' + oldValue);
    $scope.searchForMatch();
  });
  
  $scope.selectedValueChanged = function(id, text){
    
  };
  
  $scope.onFocus = function(){
    console.log('focus');
    $scope.listVisible = true;
  };
  
  $scope.onBlur = function(){
    console.log('blur');
    $scope.listVisible = false;
    if (!$scope.listHover) {
      for (i = 0; i < $scope.items.length; i++) {
        // make sure the selected item is valid
        if ($scope.items[i].active === true) {
          $scope.selectedValueChanged($scope.items[i].id, $scope.items[i].name);
        }
      }
    }
  };
  
  $scope.onHover = function(){
    $scope.listHover = true;
  };
  
  $scope.onLeave = function(){
    $scope.listHover = false;
  };
  
  $scope.showList = function(){
    return $scope.listHover || $scope.listVisible;
  };
  
  $scope.onKeyDown = function(ev){
    console.log(ev.keyCode);
    if(ev.keyCode == 40){
      // down
      if($scope.listVisible === false) {
        $scope.listVisible =true;
      } else {
        // select the next active item
        $scope.selectNextItem();
      }
    } else if (ev.keyCode == 38){
      // up
      if($scope.listVisible === false){
        $scope.listVisible = true;
      } else {
        $scope.selectPreviousItem();
      }
    } else if (ev.keyCode == 37){
      // left
      if($scope.listVisible === false){
        $scope.listVisible = true;
      }
    } else if (ev.keyCode == 39){
      // right
      if($scope.listVisible === false){
        $scope.listVisible = true;
      }
    } else if (ev.keyCode == 27){
      // escape
      if($scope.listVisible === true){
        $scope.listVisible = false;
      }
    } else if (ev.keyCode == 9 || ev.keyCode == 13){
      // tab or enter
      $scope.selectActiveItem();
    } else if (ev.keyCode == 17){
      // ctrl + n for new
    } else {
      $scope.listVisible = true;
     // $scope.searchForMatch();
    }
    
  };
  
  $scope.onKeyUp = function(ev){
    if(ev.keyCode == 40){
      // down
    } else if (ev.keyCode == 38){
      // up
    } else if (ev.keyCode == 37){
      // left
    } else if (ev.keyCode == 39){
      // right
    } else if (ev.keyCode == 27){
      // escape
    } else if (ev.keyCode == 9 || ev.keyCode == 13){
      // tab or enter
    } else if (ev.keyCode == 17){
      // ctrl + n for new
    } else {
      $scope.searchForMatch();
    }
    
  };
  
  $scope.selectNextItem = function(){
    var found = false;
    for (i = 0; i < $scope.items.length; i++)  {
      if ($scope.items[i].active === true) {
        found = true;
        if(i < $scope.items.length - 1) {
          $scope.items[i].active = false;
          $scope.items[i + 1].active = true;
          $scope.dropdownitem.text = $scope.items[i + 1].name;
          $scope.dropdownitem.id = $scope.items[i + 1].id;
          break;
        }
      }
    }
    if (!found && $scope.items.length > 0){
      $scope.items[0].active = true;
      $scope.dropdownitem.text = $scope.items[0].name;
      $scope.dropdownitem.id = $scope.items[0].id;
    }
  };
  
  $scope.selectPreviousItem = function(){
    for (i = 0; i < $scope.items.length; i++) {
      if ($scope.items[i].active === true) {
        if(i > 0) {
          $scope.items[i].active = false;
          $scope.items[i - 1].active = true;
          $scope.dropdownitem.text = $scope.items[i - 1].name;
          $scope.dropdownitem.id = $scope.items[i - 1].id;
        }
      }
    }
  };
  
  $scope.itemClicked = function(name){
    for (i = 0; i < $scope.items.length; i++) {
      if ($scope.items[i].name == name) {
        $scope.items[i].active = true;
        $scope.dropdownitem.text = $scope.items[i].name;
        $scope.dropdownitem.id = $scope.items[i].id;
      }else {
        $scope.items[i].active = false;
      }
    }
    console.log('item clicked');
    $scope.selectActiveItem();
    $scope.listHover = false;
    $scope.listVisible = false;
    $scope.$broadcast('newItemAdded');
  };
  
  $scope.selectItem = function(id, text) {
    $scope.dropdownitem.id = id;
    $scope.dropdownitem.text = text;
    $scope.selectedValueChanged(id, text);
  };
  
  $scope.searchForMatch = function(){
    var foundItem = false;
    //console.log($scope.dropdownitem.text);
    angular.forEach($scope.items, function(value, key) {
      if($scope.dropdownitem.text.length === 0 || foundItem === true) {
        value.active = false;
      } else if (value.name.toUpperCase().indexOf($scope.dropdownitem.text.toUpperCase()) === 0) {
        value.active = true;
        foundItem = true;
      } else {
        value.active = false;
      }
    });
    if (foundItem === false && $scope.length > 0) {
      angular.forEach($scope.items, function(value, key) {
        // contains
        if(foundItem === false && value.name.toUpperCase().indexOf($scope.dropdownitem.text.toUpperCase()) > 0) {
          value.active = true;
          foundItem = false;
        }
      });
    }
  };
  
  $scope.selectActiveItem = function(){
    // select the active item in the list or reset the text to blank
    var found = false;
    angular.forEach($scope.items, function(value, key) {
      if(value.active === true) {
        $scope.selectItem(value.id, value.name);
        found = true;
      } 
    });
    if(found === false) {
      $scope.selectItem(0, '');
    }
  };
});