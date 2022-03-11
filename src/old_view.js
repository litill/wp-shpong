import css from "./game/game-style.css";
import Player from "./game/Player.js";
import HumanInput from "./game/HumanInput.js";
import NullInput from "./game/NullInput";
import AI from "./game/AI";
import Ball from "./game/Ball.js";
import { CheckCollisions } from "./game/Collisions.js";

const NR_BALLS = 1;
const BALLS_COLORS = [ 'orange', 'lightgreen', 'lightblue' ];

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
	let ai, ai2 = null;
	let players_count = 0;

	const LoadSpritesheet = async ( spritesheet_file ) => {
		return new Promise( resolve => {
			const img = new Image();
			img.onload = () => { resolve( img ); };
			img.src = spritesheet_file;
		}, reject => {
			console.log('AHH.. Spritesheet not loaded!');
			console.log( reject );
		});
	}

	const CreateCanvas = () => {
		SCR.w = 640;
		SCR.h = 288;

		SCR.container_el = document.querySelector('.shpong-game-container');
		SCR.canvas_el = document.createElement( 'canvas' );
		SCR.canvas_el.setAttribute( 'id', "shpong-game-canvas");
		SCR.container_el.appendChild( SCR.canvas_el );

		SCR.canvas_el.setAttribute('width', SCR.w );
		SCR.canvas_el.setAttribute('height', SCR.h );
		SCR.ctx = SCR.canvas_el.getContext("2d" );

		SCR.canvas_bg_el = document.createElement( 'canvas' );
		SCR.canvas_bg_el.setAttribute('width', SCR.w );
		SCR.canvas_bg_el.setAttribute('height', SCR.h );
		SCR.ctx_bg = SCR.canvas_bg_el.getContext( '2d' );
	}

	const AddGoals = () => {
		goals.top = { x: 0, y: 0, xx: SCR.w - 1, yy: 0 };
		goals.bottom = { x: 0, y: SCR.h - 1, xx: SCR.w - 1, yy: SCR.h - 1};
		goals.left = { x: 0, y: 0, xx: 0, yy: SCR.h - 1 };
		goals.right = { x: SCR.w - 1, y: 0, xx: SCR.w - 1, yy: SCR.h - 1 };
	}

	const GetPlayerSpeed = ( slower = false ) => {
		if ( slower ) {
			return Math.round( SCR.w / 3 ) - Math.round(SCR.w / 15 );
		}
		return Math.round( SCR.w / 3 );
	}

	const GetBallSpeed = () => {
		return Math.round( SCR.h / 1.5 );
	}

	const GetPlayerSize = () => {
		return {
			w: Math.round( SCR.w / 8 ),
			h: Math.max( Math.round( SCR.h / 16 ), 16)
		}
	}

	const GetPlayerSprite = ( idx ) => {
		if (idx == 0) {
			return sprites.player;
		}
		return sprites.player_top;
	}

	const GetBallSize = () => {
		return {
			w: Math.round( SCR.w / 48 ),
			h: Math.round( SCR.w / 48 ),
		}
	}

	const AddBalls = () => {
		for ( let i = 0; i < NR_BALLS; i++ ) {
			balls.push( new Ball( SCR, BALLS_COLORS[i], GetBallSize(), GetBallSpeed(), sprites.ball, goals ) );
		}
	}

	const AddPlayers = () => {
		players.push( new Player(
			"Greg",
			"purple",
			SCR,
			"bottom",
			new HumanInput( 'joypad' ),
			GetPlayerSize(),
			GetPlayerSpeed(),
			GetPlayerSprite( players.length )
		));

		players.push( new Player(
			"WP Shpong",
			"gray",
			SCR,
			"top",
			new NullInput(),
			GetPlayerSize(),
			GetPlayerSpeed( true ),
			GetPlayerSprite( players.length )
		));

		players_count = players.length;
	}

	const Loop = ( timestamp ) => {
		window.requestAnimationFrame(Loop);
		SetTimeStamps( timestamp );
		ai.Work( dt, et );
		// ai2.Work( dt, et );
		HandlePlayersInputs( dt, et );
		Update( dt, et );
		ActOnCollisions( dt, et );
		Draw();
	};

	const SetTimeStamps = (timestamp) => {
		dt = (timestamp - prev_timestamp) / 1000;
		prev_timestamp = timestamp;
		et = timestamp - start;
	};

	const HandlePlayersInputs = () => {
		for ( let i = 0; i < players_count; i++ ) {
			players[i].HandleInput();
		}
	};

	const Update = ( dt, et ) => {
		for ( let i = 0; i < players_count; i++ ) {
			players[i].Update( dt, et );
		}

		for ( let i = 0; i < NR_BALLS; i++ ) {
			balls[i].Update( dt, et );
		}
	};

	const ActOnCollisions = ( dt, et ) => {
		for ( let i = 0; i < NR_BALLS; i++ ) {
			CheckCollisions( balls[i], players, SCR, dt );
		}
	}

	const CreateBgBitmap = async () => {

		for ( let j = 1; j < SCR.h / 16 - 1; j++ ) {
			for ( let i = 1; i < SCR.w / 16 - 1; i++ ) {
				SCR.ctx_bg.drawImage( sprites.grass1.bitmap, i * 16, j * 16, 16, 16 );

				if ( i > 1 && i < SCR.w / 16 - 2 && j > 1 && j < SCR.h / 16 - 2 ) {
					const should = Math.floor( Math.random() * 100 );
					if ( should < 4 || should > 96 ) {
						const idx = Math.floor( Math.random() * sprites.bushes.length );
						SCR.ctx_bg.drawImage( (sprites.bushes[ idx ]).bitmap, i * 16, j * 16, 16, 16 );
					}
				}
			}
		}

		SCR.ctx_bg.drawImage( sprites.grass_wall_tl.bitmap, 0, 0, 16, 16 );
		SCR.ctx_bg.drawImage( sprites.grass_wall_tr.bitmap, SCR.w - 16 - 1, 0, 16, 16 );
		SCR.ctx_bg.drawImage( sprites.grass_wall_bl.bitmap, 0, SCR.h - 16 - 1, 16, 16 );
		SCR.ctx_bg.drawImage( sprites.grass_wall_br.bitmap, SCR.w - 16 - 1, SCR.h - 16 - 1, 16, 16 );

		for ( let i = 0; i < ( SCR.w / 16 ) - 2; i++ ) {
			SCR.ctx_bg.drawImage( sprites.grass_wall_t.bitmap, (i + 1)  * 16, 0, 16, 16 );
			SCR.ctx_bg.drawImage( sprites.grass_wall_b.bitmap, (i + 1)  * 16, SCR.h - 16 - 1, 16, 16 );
		}
		for ( let j = 0; j < ( SCR.h / 16 ) - 2; j ++ ) {
			SCR.ctx_bg.drawImage( sprites.grass_wall_ml.bitmap, 0, (j + 1)  * 16, 16, 16 );
			SCR.ctx_bg.drawImage( sprites.grass_wall_mr.bitmap, SCR.w - 16 - 1, (j + 1)  * 16, 16, 16 );
		}

		bg_bitmap = await createImageBitmap( SCR.canvas_bg_el );

	}

	const DrawPoints = () => {

		SCR.ctx.save();
		SCR.ctx.fillStyle = 'white';
		SCR.ctx.font = '6px "Press Start 2P"';
		SCR.ctx.fillText(players[0].name.toUpperCase() + ': ' + players[0].points, 20 , 28);
		SCR.ctx.fillText(players[1].name.toUpperCase() + ': ' + players[1].points, 20 , 38);
		SCR.ctx.restore();
	}

	const DrawBg = () => {
		SCR.ctx.drawImage( bg_bitmap, 0, 0, SCR.w, SCR.h );
	}

	const Draw = () => {
		SCR.ctx.clearRect(0, 0, SCR.w, SCR.h );
		DrawBg();

		for (let i = 0;i < NR_BALLS; i++) {
			balls[i].Draw();
		}

		for ( let i = 0; i < players_count; i++ ) {
			players[i].Draw();
		}

		DrawPoints();
	};

	const SetupAI = () => {
		ai = new AI( players[1], balls, goals );
		// ai2 = new AI( players[0], balls, goals );
	}


	const pong = async () => {
		CreateCanvas();
		spritesheet = await LoadSpritesheet( `${wp_shpong.assets_dir}/GRASS.png` );
		await CreateSprites();
		await CreateBgBitmap();
		AddGoals();
		AddPlayers();
		AddBalls();
		SetupAI();
		Loop( 0 );
	};

	pong();
});




