/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game/Game.js":
/*!**************************!*\
  !*** ./src/game/Game.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Game; }
/* harmony export */ });
/* harmony import */ var _Scr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Scr */ "./src/game/Scr.js");
/* harmony import */ var _Sprites__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Sprites */ "./src/game/Sprites.js");


class Game {
  /**
   *
   * @param container_el
   * @param width
   * @param height
   */
  constructor(container_el, width, height) {
    (0,_Scr__WEBPACK_IMPORTED_MODULE_0__.InitScreen)(container_el, width, height);
  }

  async Setup() {
    const a = await new Promise(resolve => {
      resolve('yeah');
    });
  }

  Loop() {
    setInterval(() => {
      console.log('looping');
      console.log(_Scr__WEBPACK_IMPORTED_MODULE_0__.Scr.w);
    }, 1000);
  }

}

/***/ }),

/***/ "./src/game/Scr.js":
/*!*************************!*\
  !*** ./src/game/Scr.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InitScreen": function() { return /* binding */ InitScreen; },
/* harmony export */   "Scr": function() { return /* binding */ Scr; }
/* harmony export */ });
const Scr = {
  w: 0,
  h: 0,
  ratio: 0.4,
  container_el: null,
  canvas_el: null,
  canvas_bg_el: null,
  ctx: null,
  ctx_bg: null
};
/**
 *
 * @param container_el
 * @param width
 * @param height
 * @constructor
 */

const InitScreen = (container_el, width, height) => {
  Scr.container_el = container_el;
  Scr.w = width;
  Scr.h = height;
  /**
   * Create main canvas and context used to display the game.
   */

  Scr.canvas_el = document.createElement('canvas');
  Scr.canvas_el.setAttribute('id', "shpong-game-canvas");
  Scr.container_el.appendChild(Scr.canvas_el);
  Scr.canvas_el.setAttribute('width', Scr.w);
  Scr.canvas_el.setAttribute('height', Scr.h);
  Scr.ctx = Scr.canvas_el.getContext("2d");
  /**
   * Create additional canvas and context for background rendering.
   */

  Scr.canvas_bg_el = document.createElement('canvas');
  Scr.canvas_bg_el.setAttribute('width', Scr.w);
  Scr.canvas_bg_el.setAttribute('height', Scr.h);
  Scr.ctx_bg = Scr.canvas_bg_el.getContext('2d');
};



/***/ }),

/***/ "./src/game/Sprites.js":
/*!*****************************!*\
  !*** ./src/game/Sprites.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoadSpriteSheet": function() { return /* binding */ LoadSpriteSheet; },
/* harmony export */   "Sprites": function() { return /* binding */ Sprites; }
/* harmony export */ });
const Sprites = {
  spritesheet: null
};

const LoadSpriteSheet = async spritesheet_file => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      reject('Image loading fail');
    };

    img.src = spritesheet_file;
  });
};

const CreateTopPlayerSprite = async () => {};

const CreateBottomPlayerSprite = async () => {};



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game/Game */ "./src/game/Game.js");


const pong = async () => {
  const container_el = document.querySelector('.shpong-game-container');
  const game = new _game_Game__WEBPACK_IMPORTED_MODULE_0__["default"](container_el, 640, 288);
  await game.Setup();
  game.Loop();
};

window.addEventListener('DOMContentLoaded', () => {
  pong();
});
}();
/******/ })()
;
//# sourceMappingURL=view.js.map