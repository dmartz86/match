/**
 * This is the Game controller.
 * Supports the clock,
 * the cards
 */
app.controller('GameController', function GameController($scope, $http) {

  //Code to string conversor.
  $scope.pSc = function(code, hide) {
    if (hide) {
      return String.fromCharCode(tape);
    } else {
      return String.fromCharCode(code);
    }
  };

  $scope.title = "The match game";
  //Single match and characters array
  $scope.chs = [];

  //Level options
  $scope.levelOptions = {
    'circular': {start: 10033, end: 10057},
    'arrows': {start: 8592, end: 8702},
    'ideographs': {start: 13312, end: 13711}
  }

  //Initial Data
  $scope.user = JSON.parse(localStorage.getItem('user')) || {name: 'User'};
  $scope.level = parseInt(localStorage.getItem('level')) || 1;
  $scope.firstTime = parseInt(localStorage.getItem('ft')) || true;
  $scope.stats = JSON.parse(localStorage.getItem('stats')) || [];
  $scope.theme = JSON.parse(localStorage.getItem('theme')) || $scope.levelOptions['circular'];
  //End Data

  $scope.help = [];
  $scope.help.push({icon: '?',name: 'Help',desc: 'This guide.'});
  $scope.help.push({icon: '',name: 'Settings',desc: 'Display name and stats.'});
  $scope.help.push({icon: '',name: 'Stop',desc: 'Stop the game. This reset the current level progress.'});
  $scope.help.push({icon: '',name: 'Play',desc: 'Start a game on current level.'});
  $scope.help.push({icon: $scope.pSc(10033) ,name: 'Theme: circular',desc: 'Display circular icons to play. 24 levels.'});
  $scope.help.push({icon: $scope.pSc(8592) ,name: 'Theme: arrows',desc: 'Display arrow icons to play. 110 levels.'});
  $scope.help.push({icon: $scope.pSc(13312) ,name: 'Theme: ideographs',desc: 'Display ideographs icons to play.399 levels.'});
  $scope.help.push({icon: '',name: 'Levels',desc: 'The levels number for this theme.'});
  $scope.help.push({icon: '',name: 'Passed',desc: 'How many levels you have passed on this session.'});
  $scope.help.push({icon: '',name: 'Match',desc: 'How many pairs of icons on this level you have match.'});
  $scope.help.push({icon: '',name: 'Time',desc: 'Time in miliseconds on current level.'});

  /*
   *Set range levels
   */
  $scope.setLevel = function(level){
    localStorage.setItem('theme', JSON.stringify(angular.copy(level)));
    $scope.START_RANGE = level.start;
    $scope.END_RANGE = level.end;
    $scope.MAX_LEVEL = level.end - level.start;
  }

  $scope.time = 0;
  $scope.tries = 0;
  $scope.wins = 0;
  $scope.loss = 0;
  $scope.done = false;
  var interval = false;
  var tape = 9641;

  //The selected peer
  $scope.peer = [];
  $scope.peerIdx = [];

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
      $scope.wins++;
      $scope.done = true;
      $scope.clearClock();

      $scope.stats.push({
        id: new Date().getTime(),
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
      $scope.saveData();
    }
  };

  $scope.clearClock = function() {
    if(interval){
      clearInterval(interval);
      $scope.time = 0;
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
  };

  $scope.addOne = function (idx){
    //Do not add twice and exclude done
    if($scope.chs[idx].status == 'selected' || $scope.chs[idx].status == 'done'){
      $scope.chs[$scope.peerIdx[0]].status = '';
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

  //Implementation of range
  range = function(a, b){
    var c = [];
    for(var i = a;  i<b; i++){
      c.push(i)
    }
    return c;
  };

  $scope.start = function(){
    $scope.done = false;
    $scope.chs = [];
    $scope.time = 0;
    $scope.reset();
    var sa = range($scope.START_RANGE, $scope.START_RANGE + $scope.level);
    var sb = range($scope.START_RANGE, $scope.START_RANGE + $scope.level);
    var sc = [];
    var idx = 0;
    for (var c in sa) {
      sc[idx] = {idx: c, value: $scope.pSc(sa[c]), done: false, status: '',code: sa[c]};
      idx++;
    }

    for (var c in sb) {
      sc[idx] = {idx: c, value: $scope.pSc(sb[c]), done: false, status: '',code: sb[c]};
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

  $scope.saveData = function (){
    localStorage.setItem('user', JSON.stringify(angular.copy($scope.user)));
    localStorage.setItem('level', angular.copy($scope.level));
    localStorage.setItem('stats', JSON.stringify(angular.copy($scope.stats)));
  }

  $scope.clearLocalStorage = function(){
    localStorage.clear();
    window.location.reload();
  }

  $scope.setLevel($scope.theme);

});
