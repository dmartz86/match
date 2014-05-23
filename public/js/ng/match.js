/**
 * This is the Game controller.
 * Supports the clock,
 * the cards
 */
app.controller('GameController', function GameController($scope, $http) {

	$scope.title = "The match game";
	//Single match and characters array
	$scope.chs = [];
	var sa = _.range(10033, 10057);
	var sb = _.range(10033, 10057);
	var sc = [];
	var tape = 9641;

	pSc = function(code, hide) {
		if (hide) {
			return String.fromCharCode(tape);
		} else {
			return String.fromCharCode(code);
		}
	};

	$scope.time = 120;
	var interval = false;
	$scope.clock = function() {
		interval = setInterval(function() {
			$scope.time--;
			$scope.$apply();
		}, 1000);
	};

	$scope.clearClock = function() {
		clearInterval(interval);
	};

	$scope.try = function(idx) {
		console.log(idx)
	};
	
	//Thanks to edymerchk
	$scope.shuffle = function(o) {
		for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
  
  var idx = 0;
	for (var c in sa) {
		sc[idx] = {idx: c, value: pSc(sa[c])};
		idx++;
	}
	
	for (var c in sb) {
		sc[idx] = {idx: c, value: pSc(sb[c])};
		idx++;
	}
	
	//Double single match
	$scope.chs = $scope.shuffle(sc);
	//$scope.chs = $scope.shuffle(sm);

	$scope.clock();
});
