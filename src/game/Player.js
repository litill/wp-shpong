export default class Player {
    constructor( name, color, screen, position_name, input, size, move_speed, sprite ) {
        this.name = name;
        this.color = color;
        this.scr = screen;
        this.input = input;
        this.position = { x: 0, y: 0 };
        this.size = size || { w: 100, h: 20};
        this.center = { x: 0, y: 0 };
        this.velocity = 0.0;
        this.position_name = position_name;
        this.position_sign = 0;
        this.points = 0;
        this.debug = { x: 0, y: 0 };
		this.move_speed = move_speed;
		this.sprite = sprite;
		this.paddle_shift_y = 32;
        this.SetInitialPosition( position_name );

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

    SetDebug( x, y ) {
        // console.log("X: ", x, " Y: ", y);
        this.debug.x = x;
        this.debug.y = y;
    }

    Draw() {

		this.scr.ctx.drawImage( this.sprite.bitmap, this.position.x, this.position.y, this.size.w, this.size.h );

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

    HandleInput( dt, et ) {
        if ( this.input.PressingLeft() ) {
            this.velocity = -1.5;
        } else if ( this.input.PressingRight() ) {
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
