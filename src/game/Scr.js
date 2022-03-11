const Scr = {
	w: 0,
	h: 0,
	ratio: 0.4,
	container_el: null,
	canvas_el: null,
	canvas_bg_el: null,
	ctx: null,
	ctx_bg: null
};

/**
 *
 * @param container_el
 * @param width
 * @param height
 * @constructor
 */
const InitScreen = ( container_el, width, height ) => {
	Scr.container_el = container_el;
	Scr.w = width;
	Scr.h = height;

	/**
	 * Create main canvas and context used to display the game.
	 */
	Scr.canvas_el = document.createElement( 'canvas' );
	Scr.canvas_el.setAttribute( 'id', "shpong-game-canvas");
	Scr.container_el.appendChild( Scr.canvas_el );

	Scr.canvas_el.setAttribute('width', Scr.w );
	Scr.canvas_el.setAttribute('height', Scr.h );
	Scr.ctx = Scr.canvas_el.getContext("2d" );

	/**
	 * Create additional canvas and context for background rendering.
	 */
	Scr.canvas_bg_el = document.createElement( 'canvas' );
	Scr.canvas_bg_el.setAttribute('width', Scr.w );
	Scr.canvas_bg_el.setAttribute('height', Scr.h );
	Scr.ctx_bg = Scr.canvas_bg_el.getContext( '2d' );
}

export { Scr, InitScreen };
