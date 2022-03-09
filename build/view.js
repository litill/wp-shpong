/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game/AI.js":
/*!************************!*\
  !*** ./src/game/AI.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AI; }
/* harmony export */ });
/* harmony import */ var _Collisions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Collisions */ "./src/game/Collisions.js");

class AI {
  constructor(player_ref, balls, goals) {
    this.player_ref = player_ref;
    this.active = true;
    this.balls = balls;
    this.goals = goals;
    this.current_target = null;
    this.current_target_distance = 0;
    this.current_target_angle = 0;
    this.wanted_velocity = 0.0;
    this.projected_fall_coords = {
      x: 0,
      y: 0
    };
  }

  Activate() {
    this.active = true;
  }

  Deactivate() {
    this.active = false;
  }

  Toggle() {
    this.active = !this.active;
  }

  Work(dt, et) {
    if (this.active) {
      this.FindNearestTarget();
      this.SetControlsToTarget();
    }
  }

  SetControlsToTarget() {
    if (!this.current_target) {
      return;
    }

    this.current_target_angle = (0,_Collisions__WEBPACK_IMPORTED_MODULE_0__.GetAngleBallToPlayer)(this.current_target, this.player_ref);
    this.wanted_velocity = Math.cos(this.current_target_angle);

    if (Math.abs(this.wanted_velocity) > 0.44) {
      // this.player_ref.velocity = this.wanted_velocity;
      if (Math.sign(this.wanted_velocity) < 0) {
        this.player_ref.input.UnsetRight();
        this.player_ref.input.SetLeft();
      } else {
        this.player_ref.input.UnsetLeft();
        this.player_ref.input.SetRight();
      }
    } else {
      // this.player_ref.velocity = 0;
      this.player_ref.input.UnsetLeft();
      this.player_ref.input.UnsetRight();
    }
  }

  FindNearestTarget() {
    if (!this.balls.length) {
      return;
    }

    this.current_target_distance = 9999999;
    let target_index = 0;
    let ball_from_center = 0;

    for (let i = 0; i < this.balls.length; i++) {
      const dist = this.GetBallDistance(this.balls[i]);
      const intersect = this.IsBallIntersectingTopWall(this.balls[i]); // console.log(intersect);

      if (intersect.intersects === true) {
        this.player_ref.SetDebug(intersect.x, intersect.y);
      }

      if (dist < this.current_target_distance && this.balls[i].velocity.y < 0) {
        ball_from_center = this.player_ref.scr.h / 2 - this.balls[i].position.y;
        this.current_target_distance = dist;
        target_index = i;
      }
    }

    this.MaybeChangeTarget(this.balls[target_index], ball_from_center);
  }

  SetTargetToNone() {
    this.current_target = null;
  }

  MaybeChangeTarget(ball, ball_from_center) {
    if (this.current_target !== ball) {
      this.current_target = ball;
    }
  }

  GetBallDistance(ball) {
    return Math.sqrt(Math.pow(ball.position.x - this.player_ref.center.x, 2) + Math.pow(ball.position.y, 2));
  }

  IsBallIntersectingTopWall(ball, wall) {
    const x1 = 0;
    const y1 = 0;
    const x2 = 639;
    const y2 = 0;
    const x3 = ball.position.x + ball.size.w / 2;
    const y3 = ball.position.y - ball.size.h / 2;
    const x4 = ball.position.x - ball.velocity.x + ball.size.w / 2;
    const y4 = ball.position.y - ball.velocity.y - ball.size.h / 2;
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (denom == 0) {
      return {
        intersects: false,
        x: null,
        y: null
      };
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -1 * ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom;

    if (t > 0 && t < 1 && u > 0) {
      return {
        intersects: true,
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1)
      };
    }

    return {
      intersects: false,
      x: null,
      y: null
    };
  }

}

/***/ }),

/***/ "./src/game/Ball.js":
/*!**************************!*\
  !*** ./src/game/Ball.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Ball; }
/* harmony export */ });
/* harmony import */ var _Collisions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Collisions */ "./src/game/Collisions.js");

class Ball {
  constructor(screen, color, size, move_speed, sprite, goals) {
    this.scr = screen;
    this.position = {
      x: 0,
      y: 0
    };
    this.shadow_center = {
      x: 0,
      y: 0
    };
    this.center = {
      x: 0,
      y: 0
    };
    this.size = size || {
      w: 16,
      h: 16
    };
    this.color = color;
    this.velocity = {
      x: 0,
      y: 0
    };
    this.move_speed = move_speed;
    this.sprite = sprite;
    this.goals = goals;
    this.CalcPosition = this.CalcPosition.bind(this);
    this.SetInitialPosition();
    this.SetInitialVelocity();
  }

  SetInitialPosition() {
    this.position.x = this.scr.w / 2 - this.size.w / 2;
    this.position.y = this.scr.h / 2 - this.size.h / 2;
  }

  SetInitialVelocity() {
    this.velocity.y = this.GetRandomVelocity(); // this.GetRandomVelocity();

    this.velocity.x = this.GetRandomVelocity();
  }

  GetRandomVelocity() {
    let min = -1;
    let max = 1;
    let velocity = Math.random() * (max - min + 1) + min;

    while (velocity === 0) {
      velocity = Math.random() * (max - min + 1) + min;
    }

    if (Math.abs(velocity) < 0.4) {
      velocity = Math.sign(velocity) * 0.4;
    }

    if (Math.abs(velocity) > 0.8) {
      velocity = Math.sign(velocity) * 0.8;
    }

    return velocity;
  }

  Update(dt, et) {
    this.CalcPosition(dt, et);
    this.UpdateCenter();
  }

  UpdateCenter() {
    this.center.x = this.position.x + this.size.w / 2;
    this.center.y = this.position.y + this.size.h / 2;
    const angle_ball_to_center = (0,_Collisions__WEBPACK_IMPORTED_MODULE_0__.GetPointAngleToScreenCenter)(this.center.x, this.center.y, this.scr);
    this.shadow_center.x = this.center.x + Math.cos(angle_ball_to_center) * 10;
    this.shadow_center.y = this.center.y + Math.sin(angle_ball_to_center) * 10;
  }

  CalcPosition(dt, et) {
    this.position.x = this.position.x + this.velocity.x * dt * this.move_speed;
    this.position.y = this.position.y + this.velocity.y * dt * this.move_speed;
  }

  Draw() {
    this.scr.ctx.save();
    this.scr.ctx.beginPath();
    this.scr.ctx.arc(this.shadow_center.x, this.shadow_center.y, this.size.w / 2, 0, 2 * Math.PI, false);
    this.scr.ctx.fillStyle = 'rgba(100, 100, 100, 0.23)';
    this.scr.ctx.fill();
    this.scr.ctx.closePath();
    this.scr.ctx.beginPath();
    this.scr.ctx.arc(this.center.x, this.center.y, this.size.w / 2, 0, 2 * Math.PI, false);
    this.scr.ctx.fillStyle = this.sprite.pattern;
    this.scr.ctx.fill();
    this.scr.ctx.closePath();
    this.scr.ctx.restore();
  }

}

/***/ }),

/***/ "./src/game/Collisions.js":
/*!********************************!*\
  !*** ./src/game/Collisions.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CheckCollisions": function() { return /* binding */ CheckCollisions; },
/* harmony export */   "GetAngleBallToPlayer": function() { return /* binding */ GetAngleBallToPlayer; },
/* harmony export */   "GetPointAngleToScreenCenter": function() { return /* binding */ GetPointAngleToScreenCenter; },
/* harmony export */   "WillBallCollideWithWall": function() { return /* binding */ WillBallCollideWithWall; }
/* harmony export */ });
const Deg2Rad = degrees => {
  return degrees * (Math.PI / 180);
};

const Rad2Deg = rad => {
  return rad * (180 / Math.PI);
};
/**
 * Get angle from ball to screen center
 */


const GetPointAngleToScreenCenter = (x, y, scr) => {
  return Math.atan2(y - scr.h / 2, x - scr.w / 2);
};
/**
 * Get angle from ball to player's paddle
 */

const GetAngleBallToPlayer = (ball, player) => {
  return Math.atan2(ball.center.y - player.center.y, ball.center.x - player.center.x);
};
/**
 * Check collision between a ball and Left/Right wall
 */

const CheckCollisionWalls = (ball, scr) => {
  if (ball.position.x < 16 || ball.position.x > scr.w - ball.size.w - 1 - 16) {
    ball.velocity.x = -1 * ball.velocity.x;

    if (ball.position.x < 16) {
      ball.position.x = 16;
    }

    if (ball.position.x > scr.w - ball.size.w - 1 - 16) {
      ball.position.x = scr.w - 1 - ball.size.w - 16;
    }
  }
};
/**
 * Checks if a ball fell off the playfield (top / bottom wall)
 */


const CheckCollisionOut = (ball, scr, players) => {
  /**
   * Top wall
   **/
  if (ball.position.y < 32) {
    players[0].AddPoint();
    ball.SetInitialPosition();
    ball.SetInitialVelocity();
  }
  /**
   * Bottom wall
   **/


  if (ball.position.y > scr.h - ball.size.h - 1 - 32) {
    players[1].AddPoint();
    ball.SetInitialPosition();
    ball.SetInitialVelocity();
  }
};

const CheckCollisionPlayerTop = (ball, player) => {
  if (DidHitThePlayerTop(ball, player)) {
    ball.velocity.y = -1 * ball.velocity.y;
    ball.position.y = ball.position.y + 1;
    const angle_part = Math.cos(GetAngleBallToPlayer(ball, player)) * 0.3;
    const player_velocity_part = player.velocity * 0.7;
    ball.velocity.x = angle_part + player_velocity_part;
  }
};

const CheckCollisionPlayerBottom = (ball, player) => {
  if (DidHitThePlayerBottom(ball, player)) {
    ball.velocity.y = -1 * ball.velocity.y;
    ball.position.y = ball.position.y - 1; // ball.position.y = player.position.y -  ball.size.h - 1;

    const angle_part_x = Math.cos(GetAngleBallToPlayer(ball, player)) * 0.3;
    const player_velocity_part = player.velocity * 0.7;
    ball.velocity.x = angle_part_x + player_velocity_part;
  }
};

const DidHitThePlayerBottom = (ball, player) => {
  return ball.velocity.y > 0 && ball.position.x >= player.position.x && ball.position.x + ball.size.w <= player.position.x + player.size.w && ball.position.y + ball.size.h >= player.position.y;
};

const DidHitThePlayerTop = (ball, player) => {
  return ball.position.x >= player.position.x && ball.position.x + ball.size.w <= player.position.x + player.size.w && ball.position.y < player.position.y + player.size.h;
};

const CheckCollisionPlayers = (ball, players) => {
  players.forEach(player => {
    if (player.position_name === "bottom") {
      CheckCollisionPlayerBottom(ball, player);
    }

    if (player.position_name === "top") {
      CheckCollisionPlayerTop(ball, player);
    }
  });
};

const WillBallCollideWithWall = ball => {
  if (ball.velocity.y >= 0) {
    return {
      collision: false,
      x: null,
      y: null
    };
  }

  const x1 = 0;
  const y1 = 0;
  const x2 = 639;
  const y2 = 0;
  const x3 = ball.position.x + ball.size.w / 2;
  const y3 = ball.position.y - ball.size.h / 2;
  const x4 = ball.position.x - ball.velocity.x + ball.size.w / 2;
  const y4 = ball.position.y - ball.velocity.y - ball.size.h / 2;
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if (denom === 0) {
    return {
      collision: false,
      x: null,
      y: null
    };
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -1 * ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom;

  if (t > 0 && t < 1 && u > 0) {
    return {
      collision: true,
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1)
    };
  }

  return {
    collision: false,
    x: null,
    y: null
  };
};
const CheckCollisions = (ball, players, scr, dt) => {
  CheckCollisionOut(ball, scr, players);
  CheckCollisionWalls(ball, scr);
  CheckCollisionPlayers(ball, players);
};

/***/ }),

/***/ "./src/game/HumanInput.js":
/*!********************************!*\
  !*** ./src/game/HumanInput.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ HumanInput; }
/* harmony export */ });
/* harmony import */ var gamepad_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gamepad.js */ "./node_modules/gamepad.js/gamepad.js");
/* harmony import */ var gamepad_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(gamepad_js__WEBPACK_IMPORTED_MODULE_0__);

const DEFAULT_GAMEPAD_MAPPING = new Map();
DEFAULT_GAMEPAD_MAPPING.set('left', 14);
DEFAULT_GAMEPAD_MAPPING.set('right', 15);
class HumanInput {
  constructor() {
    let controller = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'keyboard';
    this.perf = window.performance;
    this.controller = controller;
    this.joypad = null;
    this.keys = {
      left: {
        pressed: false,
        time: 0
      },
      right: {
        pressed: false,
        time: 0
      }
    };
    this.HandleJoyPadEvent = this.HandleJoyPadEvent.bind(this);
    this.AttachMove();
  }

  AttachMove() {
    switch (this.controller) {
      case 'keyboard':
        this.AttachKeyBoardControls();
        break;

      case 'joypad':
        this.AttachJoypadControls();
        break;
    }
  }

  AttachJoypadControls() {
    this.joypad = new gamepad_js__WEBPACK_IMPORTED_MODULE_0__.GamepadListener({
      analog: false
    });
    this.joypad.start();
    this.joypad.on('gamepad:button', this.HandleJoyPadEvent);
  }

  HandleJoyPadEvent(e) {
    switch (e.detail.button) {
      case DEFAULT_GAMEPAD_MAPPING.get('left'):
        if (e.detail.pressed) {
          this.SetLeft();
        } else {
          this.UnsetLeft();
        }

        break;

      case DEFAULT_GAMEPAD_MAPPING.get('right'):
        if (e.detail.pressed) {
          this.SetRight();
        } else {
          this.UnsetRight();
        }

        break;
    }
  }

  AttachKeyBoardControls() {
    document.addEventListener("keydown", e => {
      switch (e.code) {
        case "ArrowLeft":
          this.SetLeft();
          break;

        case "ArrowRight":
          this.SetRight();
          break;

        default:
      }
    });
    document.addEventListener("keyup", e => {
      switch (e.code) {
        case "ArrowLeft":
          this.UnsetLeft();
          break;

        case "ArrowRight":
          this.UnsetRight();
          break;

        default:
      }
    });
  }

  SetLeft() {
    this.keys.left = {
      pressed: true,
      time: this.perf.now()
    };
  }

  UnsetLeft() {
    this.keys.left = {
      pressed: false,
      time: 0
    };
  }

  SetRight() {
    this.keys.right = {
      pressed: true,
      time: this.perf.now()
    };
  }

  UnsetRight() {
    this.keys.right = {
      pressed: false,
      time: 0
    };
  }

  PressingLeft() {
    return this.keys.left.pressed && this.keys.left.time > this.keys.right.time;
  }

  PressingRight() {
    return this.keys.right.pressed && this.keys.right.time > this.keys.left.time;
  }

}

/***/ }),

/***/ "./src/game/NullInput.js":
/*!*******************************!*\
  !*** ./src/game/NullInput.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ NullInput; }
/* harmony export */ });
class NullInput {
  constructor() {
    this.perf = window.performance;
    this.keys = {
      left: {
        pressed: false,
        time: 0
      },
      right: {
        pressed: false,
        time: 0
      }
    };
  }

  SetLeft() {
    this.keys.left = {
      pressed: true,
      time: this.perf.now()
    };
  }

  UnsetLeft() {
    this.keys.left = {
      pressed: false,
      time: 0
    };
  }

  SetRight() {
    this.keys.right = {
      pressed: true,
      time: this.perf.now()
    };
  }

  UnsetRight() {
    this.keys.right = {
      pressed: false,
      time: 0
    };
  }

  PressingLeft() {
    return this.keys.left.pressed && this.keys.left.time > this.keys.right.time;
  }

  PressingRight() {
    return this.keys.right.pressed && this.keys.right.time > this.keys.left.time;
  }

}

/***/ }),

/***/ "./src/game/Player.js":
/*!****************************!*\
  !*** ./src/game/Player.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Player; }
/* harmony export */ });
class Player {
  constructor(name, color, screen, position_name, input, size, move_speed, sprite) {
    this.name = name;
    this.color = color;
    this.scr = screen;
    this.input = input;
    this.position = {
      x: 0,
      y: 0
    };
    this.size = size || {
      w: 100,
      h: 20
    };
    this.center = {
      x: 0,
      y: 0
    };
    this.velocity = 0.0;
    this.position_name = position_name;
    this.position_sign = 0;
    this.points = 0;
    this.debug = {
      x: 0,
      y: 0
    };
    this.move_speed = move_speed;
    this.sprite = sprite;
    this.paddle_shift_y = 32;
    this.SetInitialPosition(position_name);
    this.SetDebug = this.SetDebug.bind(this);
  }

  Update(dt, et) {
    this.position.x += this.velocity * dt * this.move_speed;

    if (this.position.x < 16) {
      this.position.x = 16;
    } else if (this.position.x + this.size.w > this.scr.w - 1 - 16) {
      this.position.x = this.scr.w - 1 - this.size.w - 16;
    }

    this.UpdateCenter();
  }

  SetDebug(x, y) {
    // console.log("X: ", x, " Y: ", y);
    this.debug.x = x;
    this.debug.y = y;
  }

  Draw() {
    this.scr.ctx.drawImage(this.sprite.bitmap, this.position.x, this.position.y, this.size.w, this.size.h);
    /** Debug where the ball should fall */
    // if ( this.position_name == 'top' ) {
    // this.scr.ctx.save();
    // this.scr.ctx.beginPath();
    // this.scr.ctx.arc( this.debug.x, this.debug.y, 10, 0, 2 * Math.PI, false );
    // this.scr.ctx.closePath();
    // this.scr.ctx.fillStyle = 'red';
    // this.scr.ctx.fill();
    // this.scr.ctx.restore();
    // }
  }

  UpdateCenter() {
    this.center.x = this.position.x + this.size.w / 2;
    this.center.y = this.position.y + this.size.h * this.position_sign;
  }

  AddPoint() {
    this.points++;
    console.log(this.points);
  }

  HandleInput(dt, et) {
    if (this.input.PressingLeft()) {
      this.velocity = -1.5;
    } else if (this.input.PressingRight()) {
      this.velocity = 1.5;
    } else {
      this.velocity = 0;
    }
  }

  SetInitialPosition(pos) {
    switch (pos) {
      case "top":
        this.position.y = this.paddle_shift_y;
        this.position.x = this.scr.w / 2 - this.size.w / 2;
        this.position_sign = 1;
        break;

      case "bottom":
        this.position.y = this.scr.h - this.size.h - this.paddle_shift_y - 1;
        this.position.x = this.scr.w / 2 - this.size.w / 2;
        this.position_sign = -1;
        break;

      default:
    }
  }

}

/***/ }),

/***/ "./node_modules/gamepad.js/gamepad.js":
/*!********************************************!*\
  !*** ./node_modules/gamepad.js/gamepad.js ***!
  \********************************************/
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,(function(){return(()=>{var t={944:function(t){t.exports=(()=>{"use strict";var t={d:(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=i(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return u=t.done,t},e:function(t){s=!0,a=t},f:function(){try{u||null==n.return||n.return()}finally{if(s)throw a}}}}function o(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=t&&("undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"]);if(null!=n){var r,o,i=[],a=!0,u=!1;try{for(n=n.call(t);!(a=(r=n.next()).done)&&(i.push(r.value),!e||i.length!==e);a=!0);}catch(t){u=!0,o=t}finally{try{a||null==n.return||n.return()}finally{if(u)throw o}}return i}}(t,e)||i(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(t,e){if(t){if("string"==typeof t)return a(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(t,e):void 0}}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function u(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}t.d(e,{default:()=>s});var s=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];u(this,t),this.allowExtra=e,this.defaults=new Map,this.types=new Map,this.optional=new Set,this.required=new Set}var e;return(e=[{key:"setDefaults",value:function(t){var e=this;return Object.entries(t).forEach((function(t){var n=o(t,2),r=n[0],i=n[1];return e.defaults.set(r,i)})),this}},{key:"setTypes",value:function(t){var e=this;return Object.entries(t).forEach((function(t){var n=o(t,2),r=n[0],i=n[1];return e.types.set(r,i)})),this}},{key:"setOptional",value:function(t){var e=this;return t.forEach((function(t){return e.optional.add(t)})),this}},{key:"setRequired",value:function(t){var e=this;return t.forEach((function(t){return e.required.add(t)})),this}},{key:"resolve",value:function(t){var e=Object.assign(this.getDefaults(),t);return this.validate(e),e}},{key:"getDefaults",value:function(){var t,e={},n=r(this.defaults);try{for(n.s();!(t=n.n()).done;){var i=o(t.value,2),a=i[0],u=i[1];e[a]=u}}catch(t){n.e(t)}finally{n.f()}return e}},{key:"validate",value:function(t){for(var e in t){if(!this.optionExists(e))throw new Error('Unkown option "'.concat(e,'".'));this.checkType(e,t[e])}var n,o=r(this.required.values());try{for(o.s();!(n=o.n()).done;){var i=n.value;if(void 0===t[i])throw new Error('Option "'.concat(i,'" is required.'))}}catch(t){o.e(t)}finally{o.f()}}},{key:"checkType",value:function(t,e){if(this.types.has(t)){var r=this.types.get(t),o=n(e);if(o!==r)throw new Error('Wrong value for option "'.concat(t,'". Expected type "').concat(r,'" but got "').concat(o,'".'))}}},{key:"optionExists",value:function(t){return!!this.allowExtra||this.defaults.has(t)||this.optional.has(t)||this.required.has(t)||this.types.has(t)}}])&&function(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}(t.prototype,e),t}();return e.default})()},162:function(t){t.exports=(()=>{"use strict";var t={d:(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};t.d(e,{default:()=>n});var n=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._events={},this.on=this.addEventListener,this.off=this.removeEventListener}var e;return(e=[{key:"emit",value:function(t,e){if(Object.prototype.hasOwnProperty.call(this._events,t))for(var n=this._events[t],r={type:t,detail:e},o=n.length,i=0;i<o;i++)this.handle(n[i],r)}},{key:"handle",value:function(t,e){t(e)}},{key:"addEventListener",value:function(t,e){Object.prototype.hasOwnProperty.call(this._events,t)||(this._events[t]=[]),this._events[t].indexOf(e)<0&&this._events[t].push(e)}},{key:"removeEventListener",value:function(t,e){if(Object.prototype.hasOwnProperty.call(this._events,t)){var n=this._events[t],r=n.indexOf(e);r>=0&&n.splice(r,1),0===n.length&&delete this._events[t]}}}])&&function(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}(t.prototype,e),t}();return e.default})()}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var i=e[r]={exports:{}};return t[r].call(i.exports,i,i.exports,n),i.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var r={};return(()=>{"use strict";n.r(r),n.d(r,{GamepadHandler:()=>d,GamepadListener:()=>x});var t=n(162),e=n.n(t),o=n(944),i=n.n(o);function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function u(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function c(t,e){return(c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t,e){return!e||"object"!==a(e)&&"function"!=typeof e?f(t):e}function f(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var d=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&c(t,e)}(d,t);var e,n,r,o,i,a=(o=d,i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,e=p(o);if(i){var n=p(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return l(this,t)});function d(t,e){var n,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return u(this,d),(n=a.call(this)).index=t,n.options=n.constructor.resolveOptions(r),n.sticks=new Array(e.axes.length/2).fill(null).map((function(){return[null,null]})),n.buttons=new Array(e.buttons.length).fill(null),n.updateStick=n.updateStick.bind(f(n)),n.updateButton=n.updateButton.bind(f(n)),n}return e=d,r=[{key:"resolveOptions",value:function(t){var e=void 0!==t.stick,n=void 0!==t.button,r={stick:this.optionResolver.resolve(e?t.stick:n?{}:t),button:this.optionResolver.resolve(n?t.button:e?{}:t)};return r.stick.deadZone=Math.max(Math.min(r.stick.deadZone,1),0),r.button.deadZone=Math.max(Math.min(r.button.deadZone,1),0),r.stick.precision=r.stick.precision?Math.pow(10,r.stick.precision):0,r.button.precision=r.button.precision?Math.pow(10,r.button.precision):0,r}}],(n=[{key:"update",value:function(t){for(var e=0,n=this.sticks.length,r=0;r<n;r++)for(var o=0;o<2;o++)this.updateStick(t,r,o,t.axes[e++]);var i=this.buttons.length;for(e=0;e<i;e++)this.updateButton(t,t.buttons[e],e)}},{key:"updateStick",value:function(t,e,n,r){var o=this.options.stick,i=o.deadZone,a=o.analog,u=o.precision;i&&r<i&&r>-i&&(r=0),a?u&&(r=Math.round(r*u)/u):r=r>0?1:r<0?-1:0,this.sticks[e][n]!==r&&(this.sticks[e][n]=r,this.emit("axis",{gamepad:t,stick:e,axis:n,value:r,index:this.index}))}},{key:"updateButton",value:function(t,e,n){var r=this.options.button,o=r.deadZone,i=r.analog,a=r.precision,u=e.value,s=e.pressed,c=u;o&&e.value<o&&e.value>-o&&(c=0),i?a&&(c=Math.round(c*a)/a):c=s?1:0,this.buttons[n]!==c&&(this.buttons[n]=c,this.emit("button",{gamepad:t,button:n,pressed:s,value:c,index:this.index}))}}])&&s(e.prototype,n),r&&s(e,r),d}(e());function h(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}d.optionResolver=(new(i())).setDefaults({analog:!0,deadZone:0,precision:0}).setTypes({analog:"boolean",deadZone:"number",precision:"number"});var y=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.callback=e,this.frame=null,this.update=this.update.bind(this)}var e,n;return e=t,(n=[{key:"setCallback",value:function(t){this.callback=t}},{key:"start",value:function(){this.frame||(this.frame=window.requestAnimationFrame(this.update))}},{key:"stop",value:function(){this.frame&&(window.cancelAnimationFrame(this.frame),this.frame=null)}},{key:"update",value:function(){this.frame=window.requestAnimationFrame(this.update),this.callback()}}])&&h(e.prototype,n),t}();function v(t){return(v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function b(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function m(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function g(t,e){return(g=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function w(t,e){return!e||"object"!==v(e)&&"function"!=typeof e?k(t):e}function k(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function O(t){return(O=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var x=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&g(t,e)}(a,t);var e,n,r,o,i=(r=a,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,e=O(r);if(o){var n=O(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return w(this,t)});function a(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(b(this,a),t=i.call(this),"function"!=typeof navigator.getGamepads)throw new Error("This browser does not support gamepad API.");return t.options=e,t.onAxis=t.onAxis.bind(k(t)),t.update=t.update.bind(k(t)),t.start=t.start.bind(k(t)),t.stop=t.stop.bind(k(t)),t.discover=t.discover.bind(k(t)),t.onButton=t.onButton.bind(k(t)),t.handlers=new Array(4).fill(null),t.loop=new y(t.update),window.addEventListener("error",t.stop),t}return e=a,(n=[{key:"start",value:function(){this.loop.start()}},{key:"stop",value:function(){this.loop.stop()}},{key:"update",value:function(){var t=navigator.getGamepads();this.discover(t[0],0),this.discover(t[1],1),this.discover(t[2],2),this.discover(t[3],3)}},{key:"discover",value:function(t,e){t?(this.handlers[e]||this.registerHandler(e,t),this.handlers[e].update(t)):this.handlers[e]&&this.removeGamepad(e)}},{key:"registerHandler",value:function(t,e){if(this.handlers[t])throw new Error("Gamepad #".concat(t," is already registered."));var n=new d(t,e,this.options);this.handlers[t]=n,n.addEventListener("axis",this.onAxis),n.addEventListener("button",this.onButton),this.emit("gamepad:connected",{index:t,gamepad:e}),this.emit("gamepad:".concat(t,":connected"),{index:t,gamepad:e})}},{key:"removeGamepad",value:function(t){if(!this.handlers[t])throw new Error("Gamepad #".concat(t," is not registered."));this.handlers[t].removeEventListener("axis",this.onAxis),this.handlers[t].removeEventListener("button",this.onButton),this.handlers[t]=null,this.emit("gamepad:disconnected",{index:t}),this.emit("gamepad:".concat(t,":disconnected"),{index:t})}},{key:"onAxis",value:function(t){var e=t.detail.index;this.emit("gamepad:axis",t.detail),this.emit("gamepad:".concat(e,":axis"),t.detail),this.emit("gamepad:".concat(e,":axis:").concat(t.detail.axis),t.detail)}},{key:"onButton",value:function(t){var e=t.detail.index;this.emit("gamepad:button",t.detail),this.emit("gamepad:".concat(e,":button"),t.detail),this.emit("gamepad:".concat(e,":button:").concat(t.detail.button),t.detail)}}])&&m(e.prototype,n),a}(e())})(),r})()}));

/***/ }),

/***/ "./src/game/game-style.css":
/*!*********************************!*\
  !*** ./src/game/game-style.css ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_game_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game/game-style.css */ "./src/game/game-style.css");
/* harmony import */ var _game_Player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game/Player.js */ "./src/game/Player.js");
/* harmony import */ var _game_HumanInput_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game/HumanInput.js */ "./src/game/HumanInput.js");
/* harmony import */ var _game_NullInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./game/NullInput */ "./src/game/NullInput.js");
/* harmony import */ var _game_AI__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./game/AI */ "./src/game/AI.js");
/* harmony import */ var _game_Ball_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./game/Ball.js */ "./src/game/Ball.js");
/* harmony import */ var _game_Collisions_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./game/Collisions.js */ "./src/game/Collisions.js");







const NR_BALLS = 1;
const BALLS_COLORS = ['orange', 'lightgreen', 'lightblue'];
window.addEventListener('DOMContentLoaded', () => {
  const SCR = {
    w: 0,
    h: 0,
    ratio: 0.4,
    container_el: null,
    canvas_el: null,
    ctx: null,
    ctx_bg: null
  };
  let prev_timestamp = 0;
  let dt = 0;
  let et = 0;
  let spritesheet = null;
  let bg_bitmap = null;
  let sprites = {};
  let start = 0;
  let balls = [];
  let players = [];
  let goals = {};
  let ai,
      ai2 = null;
  let players_count = 0;

  const LoadSpritesheet = async spritesheet_file => {
    return new Promise(resolve => {
      const img = new Image();

      img.onload = () => {
        resolve(img);
      };

      img.src = spritesheet_file;
    }, reject => {
      console.log('AHH.. Spritesheet not loaded!');
      console.log(reject);
    });
  };

  const CreateCanvas = () => {
    SCR.w = 640;
    SCR.h = 288;
    SCR.container_el = document.querySelector('.shpong-game-container');
    SCR.canvas_el = document.createElement('canvas');
    SCR.canvas_el.setAttribute('id', "shpong-game-canvas");
    SCR.container_el.appendChild(SCR.canvas_el);
    SCR.canvas_el.setAttribute('width', SCR.w);
    SCR.canvas_el.setAttribute('height', SCR.h);
    SCR.ctx = SCR.canvas_el.getContext("2d");
    SCR.canvas_bg_el = document.createElement('canvas');
    SCR.canvas_bg_el.setAttribute('width', SCR.w);
    SCR.canvas_bg_el.setAttribute('height', SCR.h);
    SCR.ctx_bg = SCR.canvas_bg_el.getContext('2d');
  };

  const AddGoals = () => {
    goals.top = {
      x: 0,
      y: 0,
      xx: SCR.w - 1,
      yy: 0
    };
    goals.bottom = {
      x: 0,
      y: SCR.h - 1,
      xx: SCR.w - 1,
      yy: SCR.h - 1
    };
    goals.left = {
      x: 0,
      y: 0,
      xx: 0,
      yy: SCR.h - 1
    };
    goals.right = {
      x: SCR.w - 1,
      y: 0,
      xx: SCR.w - 1,
      yy: SCR.h - 1
    };
  };

  const GetPlayerSpeed = function () {
    let slower = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (slower) {
      return Math.round(SCR.w / 3) - Math.round(SCR.w / 15);
    }

    return Math.round(SCR.w / 3);
  };

  const GetBallSpeed = () => {
    return Math.round(SCR.h / 1.5);
  };

  const GetPlayerSize = () => {
    return {
      w: Math.round(SCR.w / 8),
      h: Math.max(Math.round(SCR.h / 16), 16)
    };
  };

  const GetPlayerSprite = idx => {
    if (idx == 0) {
      return sprites.player;
    }

    return sprites.player_top;
  };

  const GetBallSize = () => {
    return {
      w: Math.round(SCR.w / 48),
      h: Math.round(SCR.w / 48)
    };
  };

  const AddBalls = () => {
    for (let i = 0; i < NR_BALLS; i++) {
      balls.push(new _game_Ball_js__WEBPACK_IMPORTED_MODULE_5__["default"](SCR, BALLS_COLORS[i], GetBallSize(), GetBallSpeed(), sprites.ball, goals));
    }
  };

  const AddPlayers = () => {
    players.push(new _game_Player_js__WEBPACK_IMPORTED_MODULE_1__["default"]("Greg", "purple", SCR, "bottom", new _game_HumanInput_js__WEBPACK_IMPORTED_MODULE_2__["default"]('joypad'), GetPlayerSize(), GetPlayerSpeed(), GetPlayerSprite(players.length)));
    players.push(new _game_Player_js__WEBPACK_IMPORTED_MODULE_1__["default"]("WP Shpong", "gray", SCR, "top", new _game_NullInput__WEBPACK_IMPORTED_MODULE_3__["default"](), GetPlayerSize(), GetPlayerSpeed(true), GetPlayerSprite(players.length)));
    players_count = players.length;
  };

  const Loop = timestamp => {
    window.requestAnimationFrame(Loop);
    SetTimeStamps(timestamp);
    ai.Work(dt, et); // ai2.Work( dt, et );

    HandlePlayersInputs(dt, et);
    Update(dt, et);
    ActOnCollisions(dt, et);
    Draw();
  };

  const SetTimeStamps = timestamp => {
    dt = (timestamp - prev_timestamp) / 1000;
    prev_timestamp = timestamp;
    et = timestamp - start;
  };

  const HandlePlayersInputs = () => {
    for (let i = 0; i < players_count; i++) {
      players[i].HandleInput();
    }
  };

  const Update = (dt, et) => {
    for (let i = 0; i < players_count; i++) {
      players[i].Update(dt, et);
    }

    for (let i = 0; i < NR_BALLS; i++) {
      balls[i].Update(dt, et);
    }
  };

  const ActOnCollisions = (dt, et) => {
    for (let i = 0; i < NR_BALLS; i++) {
      (0,_game_Collisions_js__WEBPACK_IMPORTED_MODULE_6__.CheckCollisions)(balls[i], players, SCR, dt);
    }
  };

  const CreateBgBitmap = async () => {
    for (let j = 1; j < SCR.h / 16 - 1; j++) {
      for (let i = 1; i < SCR.w / 16 - 1; i++) {
        SCR.ctx_bg.drawImage(sprites.grass1.bitmap, i * 16, j * 16, 16, 16);

        if (i > 1 && i < SCR.w / 16 - 2 && j > 1 && j < SCR.h / 16 - 2) {
          const should = Math.floor(Math.random() * 100);

          if (should < 4 || should > 96) {
            const idx = Math.floor(Math.random() * sprites.bushes.length);
            SCR.ctx_bg.drawImage(sprites.bushes[idx].bitmap, i * 16, j * 16, 16, 16);
          }
        }
      }
    }

    SCR.ctx_bg.drawImage(sprites.grass_wall_tl.bitmap, 0, 0, 16, 16);
    SCR.ctx_bg.drawImage(sprites.grass_wall_tr.bitmap, SCR.w - 16 - 1, 0, 16, 16);
    SCR.ctx_bg.drawImage(sprites.grass_wall_bl.bitmap, 0, SCR.h - 16 - 1, 16, 16);
    SCR.ctx_bg.drawImage(sprites.grass_wall_br.bitmap, SCR.w - 16 - 1, SCR.h - 16 - 1, 16, 16);

    for (let i = 0; i < SCR.w / 16 - 2; i++) {
      SCR.ctx_bg.drawImage(sprites.grass_wall_t.bitmap, (i + 1) * 16, 0, 16, 16);
      SCR.ctx_bg.drawImage(sprites.grass_wall_b.bitmap, (i + 1) * 16, SCR.h - 16 - 1, 16, 16);
    }

    for (let j = 0; j < SCR.h / 16 - 2; j++) {
      SCR.ctx_bg.drawImage(sprites.grass_wall_ml.bitmap, 0, (j + 1) * 16, 16, 16);
      SCR.ctx_bg.drawImage(sprites.grass_wall_mr.bitmap, SCR.w - 16 - 1, (j + 1) * 16, 16, 16);
    }

    bg_bitmap = await createImageBitmap(SCR.canvas_bg_el);
  };

  const DrawPoints = () => {
    SCR.ctx.save();
    SCR.ctx.fillStyle = 'white';
    SCR.ctx.font = '6px "Press Start 2P"';
    SCR.ctx.fillText(players[0].name.toUpperCase() + ': ' + players[0].points, 20, 28);
    SCR.ctx.fillText(players[1].name.toUpperCase() + ': ' + players[1].points, 20, 38);
    SCR.ctx.restore();
  };

  const DrawBg = () => {
    SCR.ctx.drawImage(bg_bitmap, 0, 0, SCR.w, SCR.h);
  };

  const Draw = () => {
    SCR.ctx.clearRect(0, 0, SCR.w, SCR.h);
    DrawBg();

    for (let i = 0; i < NR_BALLS; i++) {
      balls[i].Draw();
    }

    for (let i = 0; i < players_count; i++) {
      players[i].Draw();
    }

    DrawPoints();
  };

  const SetupAI = () => {
    ai = new _game_AI__WEBPACK_IMPORTED_MODULE_4__["default"](players[1], balls, goals); // ai2 = new AI( players[0], balls, goals );
  };

  const CreateSprite = async function (x, y, w, h) {
    let repetition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'repeat';
    const tile_size = 16;
    const xx = x * tile_size;
    const yy = y * tile_size;
    const bitmap = await createImageBitmap(spritesheet, xx, yy, w, h);
    return {
      bitmap: bitmap,
      pattern: SCR.ctx.createPattern(bitmap, repetition)
    };
  };

  const SetupSprites = async () => {
    // sprites.grass1 = await CreateSprite(8, 2, 16, 16);
    sprites.grass1 = await CreateSprite(8, 2, 16, 16);
    const x_start = 19;
    const y_start = 0;
    sprites.grass_wall_tl = await CreateSprite(x_start, y_start, 16, 16);
    sprites.grass_wall_t = await CreateSprite(x_start + 1, y_start, 16, 16);
    sprites.grass_wall_tr = await CreateSprite(x_start + 2, y_start, 16, 16);
    sprites.grass_wall_ml = await CreateSprite(x_start, y_start + 1, 16, 16);
    sprites.grass_wall_m = await CreateSprite(x_start + 1, y_start + 1, 16, 16);
    sprites.grass_wall_mr = await CreateSprite(x_start + 2, y_start + 1, 16, 16);
    sprites.grass_wall_bl = await CreateSprite(x_start, y_start + 2, 16, 16);
    sprites.grass_wall_b = await CreateSprite(x_start + 1, y_start + 2, 16, 16);
    sprites.grass_wall_br = await CreateSprite(x_start + 2, y_start + 2, 16, 16);
    sprites.bushes = [];
    sprites.bushes.push(await CreateSprite(10, 11, 16, 16));
    sprites.bushes.push(await CreateSprite(11, 11, 16, 16));
    sprites.bushes.push(await CreateSprite(12, 11, 16, 16));
    sprites.bushes.push(await CreateSprite(13, 11, 16, 16));
    sprites.bushes.push(await CreateSprite(13, 13, 16, 16));
    sprites.bushes.push(await CreateSprite(12, 13, 16, 16));
    sprites.ball = await CreateSprite(5, 4, 16, 16);
    sprites.player_top = await CreateSprite(10, 4, 16 * 3, 16);
    sprites.player = await CreateSprite(10, 6, 16 * 3, 16);
  };

  const pong = async () => {
    CreateCanvas();
    spritesheet = await LoadSpritesheet(`${wp_shpong.assets_dir}/GRASS.png`);
    await SetupSprites();
    await CreateBgBitmap();
    AddGoals();
    AddPlayers();
    AddBalls();
    SetupAI();
    Loop(0);
  };

  pong();
});
}();
/******/ })()
;
//# sourceMappingURL=view.js.map