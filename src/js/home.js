import '../main.js';


import pdf from './pdf/index';
import './draw/index';

console.log(pdf);

layui.use(['layer'], function () {
  let layer = layui.layer;
  layer.msg('hello world!');
});

var url = '/assets/doc/hello.pdf';

// var pdfData = atob(
//     'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
//     'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
//     'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
//     'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
//     'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
//     'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
//     'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
//     'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
//     'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
//     'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
//     'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
//     'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
//     'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');

PDFJS.workerSrc = '/assets/js/pdf.worker.js';

var pdfDoc = null,
  pageNum = 1,
  pageRendering = false,
  pageNumPending = null,
  scale = 0.8,
  canvas = $('#pdf_canvas')[0],
  ctx = canvas.getContext('2d');

var draw_canvas = $('#draw_canvas')[0];

function renderPage(num) {
  pageRendering = true;

  pdfDoc.getPage(num).then(function (page) {

    console.log('Page loaded------》', page);

    scale = 540 / page.view[3];

    var viewport = page.getViewport(scale);
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    draw_canvas.height = canvas.height;
    draw_canvas.width = canvas.width;

    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    var renderTask = page.render(renderContext);
    renderTask.then(function () {
      pageRendering = false;
      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });

  $('#page_num').text(num);
}

function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}


function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}

$("#opts").on('click', '#prev', onPrevPage);

function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}

$("#opts").on('click', '#next', onNextPage);

PDFJS.getDocument(url).then(function (pdfDoc_) {
  pdfDoc = pdfDoc_;
  $('#page_count').text(pdfDoc.numPages);

  renderPage(pageNum);
});