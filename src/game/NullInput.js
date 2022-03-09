export default class NullInput {
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
