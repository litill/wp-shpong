import Game from './game/Game';

const pong = async () => {
	const container_el = document.querySelector( '.shpong-game-container' );
	const game = new Game( container_el, 640, 288 );
	await game.Setup();
	game.Loop();
}

window.addEventListener('DOMContentLoaded', () => { pong() } );
