// var cvs = document.querySelector("canvas");
var cvs = $('#draw_canvas')[0];

var ctx = cvs.getContext("2d");
$('canvas').on("mousedown", function (ev) {

  var e = ev || window.event;

  var x = e.offsetX;
  var y = e.offsetY;
  cvs.oldPoint = {
    x: x - 1,
    y: y - 1,
  }
  console.log(x, y)
  drawLine(x, y);
  $('canvas').on("mousemove", move);
  $('canvas').on("mouseup", up);
})

function move(ev) {
  var e = ev || window.event;
  var x = e.offsetX;

  var y = e.offsetY;

  drawLine(x, y);

  cvs.oldPoint = {
    x: x,
    y: y,
  }
}

function up() {
  $('canvas').off("mousemove");
  $('canvas').off("mouseup");
}


function drawLine(x, y) {
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.moveTo(cvs.oldPoint.x, cvs.oldPoint.y);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.closePath();
};

$(".changeColor button").click(function () {
  if ($(this).data('func') == 'clear') {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    return false;
  }
  ctx.strokeStyle = $(this).css('backgroundColor');
});