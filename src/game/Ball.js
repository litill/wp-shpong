import { GetPointAngleToScreenCenter } from './Collisions';

export default class Ball {
    constructor( screen, color, size, move_speed, sprite, goals ) {
        this.scr = screen;
        this.position = { x: 0, y: 0 };
        this.shadow_center = {x: 0, y: 0};
        this.center = { x: 0, y: 0 };
        this.size = size || { w: 16, h: 16 };
        this.color = color;
        this.velocity = { x: 0, y: 0 };
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
            velocity = Math.sign( velocity ) * 0.4;
        }

        if (Math.abs(velocity) > 0.8) {
            velocity = Math.sign( velocity ) * 0.8;
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

        const angle_ball_to_center = GetPointAngleToScreenCenter( this.center.x, this.center.y, this.scr );
        this.shadow_center.x = this.center.x + ( Math.cos(angle_ball_to_center) * 10);
        this.shadow_center.y = this.center.y + ( Math.sin(angle_ball_to_center) * 10);
    }

    CalcPosition(dt, et) {
        this.position.x = this.position.x + this.velocity.x * dt * this.move_speed;
        this.position.y = this.position.y + this.velocity.y * dt * this.move_speed;
    }

    Draw() {

        this.scr.ctx.save();

        this.scr.ctx.beginPath();
        this.scr.ctx.arc( this.shadow_center.x, this.shadow_center.y, ( this.size.w / 2 ), 0, 2 * Math.PI, false );
        this.scr.ctx.fillStyle = 'rgba(100, 100, 100, 0.23)';
        this.scr.ctx.fill();
        this.scr.ctx.closePath();

        this.scr.ctx.beginPath();
        this.scr.ctx.arc( this.center.x, this.center.y, this.size.w / 2, 0, 2 * Math.PI, false );
        this.scr.ctx.fillStyle = this.sprite.pattern;
        this.scr.ctx.fill();
        this.scr.ctx.closePath();

        this.scr.ctx.restore();
    }

}
