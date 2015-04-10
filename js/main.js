var sampleApp = angular.module('sampleApp', []);

sampleApp.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on(attr.focusOn, function(e) {
          elem[0].focus();
      });
   };
});

sampleApp.controller('GridDataController', function($scope){
  
});

sampleApp.controller('GridDataController', function($scope){
  
});

sampleApp.controller('DropDownController', function ($scope) {
  $scope.items = [
    {'id': 1, 'name': 'Nexus S', 'active': true },
    {'id': 2, 'name': 'Motorola XOOM™ with Wi-Fi', 'active': false},
    {'id': 3, 'name': 'MOTOROLA XOOM™', 'active': false}
  ];
  
  $scope.id = 0;
  $scope.text = "";
  $scope.listVisible = false;
  $scope.listHover = false;
  
  $scope.onFocus = function(){
    console.log('focus');
    $scope.listVisible = true;
  };
  
  $scope.onBlur = function(){
    console.log('blur');
    $scope.listVisible = false;
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
      }
    } else if (ev.keyCode == 38){
      // up
    } else if (ev.keyCode == 37){
      // left
    } else if (ev.keyCode == 39){
      // right
    } else if (ev.keyCode == 27){
      // escape
      if($scope.listVisible === true){
        $scope.listVisible = false;
      }
    } else if (ev.keyCode == 9){
      // tab
    } else if (ev.keyCode == 17){
      // ctrl + n for new
    } 
    
  };
  
  $scope.itemClicked = function(name){
    console.log('item clicked');
    $scope.text = name;
    $scope.listHover = false;
    $scope.$broadcast('newItemAdded');
  };
});