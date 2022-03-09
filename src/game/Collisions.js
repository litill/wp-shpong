const Deg2Rad = ( degrees ) => {
    return degrees * ( Math.PI / 180 );
}

const Rad2Deg = (rad) => {
    return rad * ( 180 / Math.PI );
}

/**
 * Get angle from ball to screen center
 */
export const GetPointAngleToScreenCenter = ( x, y, scr ) => {
    return Math.atan2(
        y - scr.h / 2,
        x - scr.w / 2
    );
}

/**
 * Get angle from ball to player's paddle
 */
export const GetAngleBallToPlayer = ( ball, player ) => {
    return Math.atan2(
        ball.center.y - player.center.y,
        ball.center.x - ( player.center.x )
    );
}

/**
 * Check collision between a ball and Left/Right wall
 */
const CheckCollisionWalls = ( ball, scr ) => {
    if ( ball.position.x < 16 || ball.position.x > scr.w - ball.size.w - 1 - 16 ) {
        ball.velocity.x = -1 * ball.velocity.x;

        if ( ball.position.x < 16 ) {
            ball.position.x = 16;
        }

        if ( ball.position.x > scr.w - ball.size.w - 1 - 16 ) {
            ball.position.x = scr.w - 1 - ball.size.w - 16;
        }
    }
}

/**
 * Checks if a ball fell off the playfield (top / bottom wall)
 */
const CheckCollisionOut = ( ball, scr, players ) => {
    /**
     * Top wall
     **/
    if ( ball.position.y < 32) {
		players[0].AddPoint();
        ball.SetInitialPosition();
        ball.SetInitialVelocity();
    }

    /**
     * Bottom wall
     **/
    if ( ball.position.y > scr.h - ball.size.h - 1 - 32 ) {
		players[1].AddPoint();
        ball.SetInitialPosition();
        ball.SetInitialVelocity();
    }
}


const CheckCollisionPlayerTop = ( ball, player ) => {
    if ( DidHitThePlayerTop( ball, player ) ) {
        ball.velocity.y = -1 * ball.velocity.y;
        ball.position.y = ball.position.y + 1;
        const angle_part = Math.cos( GetAngleBallToPlayer( ball, player ) ) * 0.3;
        const player_velocity_part = player.velocity * 0.7;
        ball.velocity.x = angle_part + player_velocity_part;
    }
}

const CheckCollisionPlayerBottom = ( ball, player ) => {
    if ( DidHitThePlayerBottom( ball, player ) ) {
        ball.velocity.y = -1 * ball.velocity.y;
        ball.position.y = ball.position.y - 1;
        // ball.position.y = player.position.y -  ball.size.h - 1;
        const angle_part_x = Math.cos( GetAngleBallToPlayer( ball, player ) ) * 0.3;
        const player_velocity_part = player.velocity * 0.7;
        ball.velocity.x = angle_part_x + player_velocity_part;
    }
}

const DidHitThePlayerBottom = ( ball, player ) => {
    return ball.velocity.y > 0 && ball.position.x >= player.position.x &&
        ball.position.x + ball.size.w <= player.position.x + player.size.w &&
        ball.position.y + ball.size.h >= player.position.y;
}

const DidHitThePlayerTop = ( ball, player ) => {
    return ball.position.x >= player.position.x &&
        ball.position.x + ball.size.w <= player.position.x + player.size.w &&
        ball.position.y < player.position.y + player.size.h;
}

const CheckCollisionPlayers = ( ball, players ) => {
    players.forEach( ( player ) => {
        if ( player.position_name === "bottom" ) {
            CheckCollisionPlayerBottom ( ball, player );
        }

        if ( player.position_name === "top" ) {
            CheckCollisionPlayerTop( ball, player );
        }
    });
}

export const WillBallCollideWithWall = ( ball ) => {
    if ( ball.velocity.y >= 0) {
        return {
            collision: false,
            x: null,
            y: null,
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
    const denom = ( x1 - x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 - x4 );
    if ( denom === 0 ) {
        return {
            collision: false,
            x: null,
            y: null,
        };
    }
    const t = ( ( x1 - x3 ) * ( y3 - y4 ) - ( y1 - y3 ) * ( x3 - x4 ) ) / denom;
    const u = -1 * ( ( x1 - x3 ) * ( y1 - y2 ) - ( y1 - y3 ) * ( x1 - x2 ) ) / denom;

    if ( t > 0 && t < 1 && u > 0 ) {
        return {
            collision: true,
            x: x1 + t * ( x2 - x1 ),
            y: y1 + t * ( y2 - y1 ),
        };
    }

    return {
        collision: false,
        x: null,
        y: null,
    };
}

export const CheckCollisions = ( ball, players, scr, dt ) => {
	CheckCollisionOut( ball, scr, players );
	CheckCollisionWalls( ball, scr );
	CheckCollisionPlayers( ball, players );
};
