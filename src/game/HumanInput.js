import { GamepadListener } from 'gamepad.js';

const DEFAULT_GAMEPAD_MAPPING = new Map();
DEFAULT_GAMEPAD_MAPPING.set( 'left', 14 );
DEFAULT_GAMEPAD_MAPPING.set( 'right', 15 );

export default class HumanInput {

    constructor( controller = 'keyboard' ) {
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
        switch ( this.controller ) {
            case 'keyboard':
                this.AttachKeyBoardControls();
                break;
            case 'joypad':
                this.AttachJoypadControls();
                break;
        }
    }

    AttachJoypadControls() {
        this.joypad = new GamepadListener({
            analog: false,
        });

        this.joypad.start();

        this.joypad.on( 'gamepad:button', this.HandleJoyPadEvent );
    }

    HandleJoyPadEvent(e) {
        switch ( e.detail.button ) {
            case DEFAULT_GAMEPAD_MAPPING.get('left'):
                if ( e.detail.pressed ) {
                    this.SetLeft();
                } else {
                    this.UnsetLeft();
                }
                break;
            case DEFAULT_GAMEPAD_MAPPING.get('right'):
                if ( e.detail.pressed ) {
                    this.SetRight();
                } else {
                    this.UnsetRight();
                }
                break;
        }
    }

    AttachKeyBoardControls() {
        document.addEventListener("keydown", (e) => {
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

        document.addEventListener("keyup", (e) => {
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
            pressed : true,
            time: this.perf.now()
        };
    }

    UnsetLeft() {
        this.keys.left = {
            pressed : false,
            time: 0
        };
    }

    SetRight() {
        this.keys.right = {
            pressed : true,
            time: this.perf.now()
        };
    }

    UnsetRight() {
        this.keys.right = {
            pressed : false,
            time: 0
        };
    }

    PressingLeft() {
        return this.keys.left.pressed && this.keys.left.time > this.keys.right.time;
    }

    PressingRight() {
        return (
            this.keys.right.pressed && this.keys.right.time > this.keys.left.time
        );
    }
}
