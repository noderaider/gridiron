"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestFullscreen = requestFullscreen;
exports.exitFullscreen = exitFullscreen;
function requestFullscreen(element) {
  if (element.requestFullscreen) element.requestFullscreen();else if (element.mozRequestFullScreen) element.mozRequestFullScreen();else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();else if (element.msRequestFullscreen) element.msRequestFullscreen();
}

function exitFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen();else if (document.mozCancelFullScreen) document.mozCancelFullScreen();else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
}