import { Scr, InitScreen } from './Scr';
import { LoadSpriteSheet } from "./Sprites";

export default class Game {

	/**
	 *
	 * @param container_el
	 * @param width
	 * @param height
	 */
	constructor( container_el, width, height ) {
		InitScreen( container_el, width, height );
	}

	async Setup() {
		const a = await new Promise((resolve) => { resolve('yeah'); });
	}

	Loop() {
		setInterval( () => {
			console.log('looping');
			console.log(Scr.w);
		}, 1000 );
	}
}
