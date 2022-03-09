import { GetAngleBallToPlayer } from './Collisions';

export default class AI {

    constructor( player_ref, balls, goals ) {
        this.player_ref = player_ref;
        this.active = true;
        this.balls = balls;
        this.goals = goals;
        this.current_target = null;
        this.current_target_distance = 0;
        this.current_target_angle = 0;
        this.wanted_velocity = 0.0;
        this.projected_fall_coords = { x: 0, y: 0 };
    }

    Activate() {
        this.active = true;
    }

    Deactivate() {
        this.active = false;
    }

    Toggle() {
        this.active = ! this.active;
    }

    Work( dt, et ) {
        if ( this.active ) {
            this.FindNearestTarget();
            this.SetControlsToTarget();
        }
    }

    SetControlsToTarget() {
        if ( !this.current_target ) {
            return;
        }

        this.current_target_angle = GetAngleBallToPlayer( this.current_target, this.player_ref );
        this.wanted_velocity = Math.cos( this.current_target_angle );

        if ( Math.abs( this.wanted_velocity ) > 0.44 ) {
            // this.player_ref.velocity = this.wanted_velocity;
            if ( Math.sign( this.wanted_velocity ) < 0 ) {
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
        if ( ! this.balls.length ) {
            return;
        }

        this.current_target_distance = 9999999;
        let target_index = 0;
		let ball_from_center = 0;

        for ( let i = 0; i < this.balls.length; i++ ) {
            const dist = this.GetBallDistance( this.balls[i] );
            const intersect = this.IsBallIntersectingTopWall( this.balls[i] );
            // console.log(intersect);

            if ( intersect.intersects === true ) {
                this.player_ref.SetDebug( intersect.x, intersect.y );
            }

            if ( dist < this.current_target_distance && this.balls[i].velocity.y < 0) {
				ball_from_center = this.player_ref.scr.h / 2 - this.balls[i].position.y;
				this.current_target_distance = dist;
				target_index = i;
            }
        }

        this.MaybeChangeTarget( this.balls[target_index], ball_from_center );
    }

    SetTargetToNone() {
        this.current_target = null;
    }

    MaybeChangeTarget( ball, ball_from_center ) {

        if ( this.current_target !== ball ) {
            this.current_target = ball;
        }
    }

    GetBallDistance( ball ) {
        return Math.sqrt(
            Math.pow( ball.position.x - this.player_ref.center.x, 2 ) +
            Math.pow( ball.position.y, 2 )
        );
    }

    IsBallIntersectingTopWall( ball, wall ) {
        const x1 = 0;
        const y1 = 0;
        const x2 = 639;
        const y2 = 0;
        const x3 = ball.position.x + ball.size.w / 2;
        const y3 = ball.position.y - ball.size.h / 2;
        const x4 = ball.position.x - ball.velocity.x + ball.size.w / 2;
        const y4 = ball.position.y - ball.velocity.y - ball.size.h / 2;
        const denom = ( x1 - x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 - x4 );
        if ( denom == 0 ) {
            return {
                intersects: false,
                x: null,
                y: null,
            };
        }
        const t = ( ( x1 - x3 ) * ( y3 - y4 ) - ( y1 - y3 ) * ( x3 - x4 ) ) / denom;
        const u = -1 * ( ( x1 - x3 ) * ( y1 - y2 ) - ( y1 - y3 ) * ( x1 - x2 ) ) / denom;

        if ( t > 0 && t < 1 && u > 0 ) {
            return {
                intersects: true,
                x: x1 + t * ( x2 - x1 ),
                y: y1 + t * ( y2 - y1 ),
            };
        }

        return {
            intersects: false,
            x: null,
            y: null,
        };
    }

}
