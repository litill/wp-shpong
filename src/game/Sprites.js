const Sprites = {
	spritesheet: null,
};

const LoadSpriteSheet = async ( spritesheet_file ) => {
	return new Promise( (resolve, reject) => {
		const img = new Image();
		img.onload = () => { resolve( img ); };
		img.onerror = () => { reject( 'Image loading fail' ) }
		img.src = spritesheet_file;
	});
}

const CreateSprite = async ( x, y, w, h, repetition = 'repeat' ) => {
	const tile_size = 16;
	const xx = x * tile_size;
	const yy = y * tile_size;

	const bitmap = await createImageBitmap( spritesheet, xx, yy, w, h );

	return {
		bitmap: bitmap,
		pattern: SCR.ctx.createPattern( bitmap, repetition )
	}
}

/**
 *
 * @param mapping
 * @returns {Promise<void>}
 * @constructor
 */
const CreateSprites = async ( mapping ) => {
	// await CreateSprite(8, 2, 16, 16);

}


const CreateTopPlayerSprite = async () => {

}

const CreateBottomPlayerSprite = async () => {

}

export { Sprites, LoadSpriteSheet, CreateSprite };
