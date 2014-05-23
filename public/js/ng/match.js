/**
 * This is the Game controller.
 * Supports the clock,
 * the cards
 */
app.controller('GameController', function GameController($scope, $http) {

	$scope.title = "The match game";
	//Single match and characters array
	$scope.chs = [];
	$scope.time = 120;
	$scope.tries = 0;
	var interval = false;
	var tape = 9641;
	
	$scope.user = {
		name: 'Daniel',
		email: 'daniel.martinez@yuxipacific.com'
	};
	
	//The selected peer
	$scope.peer = [];
	$scope.peerIdx = [];
	
	$scope.messages = [];
	
	pSc = function(code, hide) {
		if (hide) {
			return String.fromCharCode(tape);
		} else {
			return String.fromCharCode(code);
		}
	};

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
		if ($scope.chs[idx].status == 'done'){
			return;
		}
		
		$scope.chs[idx].status = 'selected';
		$scope.peer.push($scope.chs[idx]);
		$scope.peerIdx.push(idx);
		
		//Prevent double click?
		console.log($scope.peer.length);
		if($scope.peer.length == 2 ){
			$scope.tries++;
			
			console.log($scope.peer[0].code == $scope.peer[1].code)
			if ($scope.peer[0].code == $scope.peer[1].code){
				$scope.chs[$scope.peerIdx[0]].status == 'done';
				$scope.chs[$scope.peerIdx[1]].status == 'done';
			}else{
				$scope.chs[$scope.peerIdx[0]].status == '';
				$scope.chs[$scope.peerIdx[1]].status == '';
				$scope.peer = [];
				$scope.peerIdx = [];
			}
		}
		
		if($scope.peer.length > 2 ){
			$scope.peer = [];
			$scope.peerIdx = [];
		}
	};
	
	//Thanks to edymerchk
	$scope.shuffle = function(o) {
		for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
	
	$scope.start = function(){
		var sa = _.range(10033, 10057);
		var sb = _.range(10033, 10057);
		var sc = [];
	  var idx = 0;
		for (var c in sa) {
			sc[idx] = {idx: c, value: pSc(sa[c]), done: false, status: '',code: sa[c]};
			idx++;
		}
		
		for (var c in sb) {
			sc[idx] = {idx: c, value: pSc(sb[c]), done: false, status: '',code: sb[c]};
			idx++;
		}
		
		//Double single match
		$scope.chs = $scope.shuffle(sc);
		//$scope.chs = $scope.shuffle(sm);
	
		$scope.clock();
	};
  

});
