/**
 * This is the Game controller.
 * Supports the clock,
 * the cards
 */
app.controller('GameController', function GameController($scope, $http) {

	$scope.title = "The match game";
	//Single match and characters array
	$scope.chs = [];
	$scope.level = 1;
	$scope.MAX_LEVEL = 24;
	$scope.START_RANGE = 10033;
	$scope.END_RANGE= 10057;
	$scope.time = 0;
	$scope.tries = 0;
	$scope.wins = 0;
	$scope.loss = 0;
  $scope.done = false;
	var interval = false;
	var tape = 9641;
	
	$scope.user = {
		name: 'User'
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
	  $scope.time = 0;
		interval = setInterval(function() {
			$scope.time++;
			$scope.$apply();
		}, 1);
	};
	
	$scope.checkIsDone = function (){
    var done = true;
	  for(var idx in $scope.chs){
	    if($scope.chs[idx].status != 'done'){
	      done = false;
	      break;  
	    };
	  };
	  
	  if (done){
	  	console.log('Win level ' + $scope.level + ' with time: ' + $scope.time +' ms');
	    $scope.wins++;
	    $scope.done = true;
	    $scope.clearClock();
	    
			$scope.messages.push({
				value : 'Win level ' + $scope.level + 'with time: ' + $scope.time + ' ms',
				time : $scope.time,
				level: $scope.level,
				tries: $scope.tries
			});
			
			if($scope.level != $scope.MAX_LEVEL){
	    	$scope.level++;
	    }

	    $scope.time = 0;
	    $scope.reset();
	  }
	};

	$scope.clearClock = function() {
		if(interval){
			clearInterval(interval);
		}
	};

	$scope.try = function(idx) {
		$scope.addOne(idx);
	
		if($scope.peer.length == 2 ){
			$scope.tries++;
			
			if ($scope.peer[0].code == $scope.peer[1].code){
				$scope.chs[$scope.peerIdx[0]].status = 'done';
				$scope.chs[$scope.peerIdx[1]].status = 'done';
				$scope.checkIsDone();
			}else{
				$scope.chs[$scope.peerIdx[0]].status = '';
				$scope.chs[$scope.peerIdx[1]].status = '';
				$scope.peer = [];
				$scope.peerIdx = [];
			}
			
			$scope.reset();
		}
	};
	
	$scope.reset = function(){
  	$scope.peer = [];
	  $scope.peerIdx = [];
	  $scope.time = 0;
	};
	
	$scope.addOne = function (idx){
	  //Do not add twice and exclude done
	  if($scope.chs[idx].status == 'selected' || $scope.chs[idx].status == 'done'){
            $scope.chs[$scope.peerIdx[0]].status == '';
	    return;
	  }
	  $scope.chs[idx].status = 'selected';
	  $scope.peer.push($scope.chs[idx]);
	  $scope.peerIdx.push(idx);	  
	};
	
	//Thanks to edymerchk
	$scope.shuffle = function(o) {
		for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
	
	$scope.start = function(){
		$scope.done = false;
		$scope.chs = [];
		$scope.reset();
		var sa = _.range($scope.START_RANGE, $scope.START_RANGE + $scope.level);
		var sb = _.range($scope.START_RANGE, $scope.START_RANGE + $scope.level);
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
	
	$scope.stop = function(){
	  $scope.reset();
	  $scope.clearClock();
	  $scope.chs = [];
	};

});
