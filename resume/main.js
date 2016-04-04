'use strict'

window.onload = function () {
  let iframe = document.getElementById('resumeFrame')
  iframe.width = document.querySelector('.wrapper').clientWidth
  iframe.height = 0
}

$('#resumeFrame').load(function () {
    $(this).height($(this).contents().height());
});
