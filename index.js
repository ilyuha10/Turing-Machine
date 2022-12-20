var $ = require("jquery");

var _ = require("underscore");
var tl = require("turing-lang");
var arrvis = require("./arr-vis");



var machine = tl.parse('');

var TAPE_LEFT = -10;
var TAPE_Right = 10;

tp = new arrvis.ArrayVisualizer($('#test'), TAPE_Right - TAPE_LEFT + 1, 0);

tp.onClick(function(i){

  var val = prompt(i + TAPE_LEFT);
  if(val) {
    machine.tape.write(i + TAPE_LEFT, val);
  }
  UpdateTape();
});

$('#btnParse').click(function () {
  tp.selectElementAt(-TAPE_LEFT);
  machine = tl.parse(getTxtTransText());
  console.log(machine);

  UpdateTape();
  enableControls();

  machine.on('step', function(inf) {
    UpdateTape();
    dvLog("Wrote: " + inf.writtenSymbol + " Moved To State " + inf.state);
    console.log(inf);
    tp.selectElementAt(inf.headPosition + TAPE_LEFT);
  });

  machine.on('error', function(e) {
    dvLog(e.error);
    console.error(e);
  });

});

$('#btnRun').click(function() {
  machine.run(1500);
});

$('#btnStep').click(function() {
  machine.running = true;
  machine.step();
});

$('#btnFinish').click(function() {
  machine.run(0);
});

function getSortedTape(machine, from, to) {
  var mp = machine.tape.readBulk(from,to);
  keys = _.map(_.keys(mp), function(item) {
    return parseInt(item);
  });
  var keys = _.sortBy(keys, function (key) {
    return key;
  });
  return _.map(keys, function(k) { return mp[k] + "" });
}





var transOldVal = "";
$("#txtTrans").on("change keyup paste", function() {
    var currentVal = $(this).val();
    if(currentVal == transOldVal) {
        return;
    }
    transOldVal = currentVal;
    disableControls();
});


function dvLog(txt) {
  $('#logdv').append('<div class="dvrow">' + txt + '</div>')
}

function UpdateTape() {
  var arr = getSortedTape(machine, TAPE_LEFT, TAPE_Right);
  tp.updateArray(arr);
}

function getTxtTransText() {
   return $('#txtTrans').val();
}

function disableControls() {
  $('#btnParse').removeClass('disabled');
  $('.btnCtrl').addClass('disabled');
}

function enableControls() {
  $('#btnParse').addClass('disabled');
  $('.btnCtrl').removeClass('disabled');
}