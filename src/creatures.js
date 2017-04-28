export const pickCreature = (index) => {
	let o = {};

	switch(index) {
		case 0:
			o.name = 'joto';
			o.code = 'v1493051207';
			o.object1 = 'joto_ojos';
			o.object2 = 'joto_boca';
			break;
		case 1:
			o.name = 'queena';
			o.code = 'v1493051209';
			o.object1 = 'queena_ojos';
			o.object2 = 'queena_nariz';
		break;
		case 2:
			o.name = 'rey';
			o.code = 'v1493051207';
			o.object1 = 'rey_lentes';
			o.object2 = 'rey_espada';
		break;
		case 3:
			o.name = 'az';
			o.code = 'v1493051206';
			o.object1 = 'az_ojo';
			o.object2 = 'az_patineta';
		break;
		case 4:
			o.name = 'joker';
			o.code = 'v1493051209';
			o.object1 = 'joker_ojos';
			o.object2 = 'joker_boca';
		break;
	}

	return o;
};

export const getCreatureUrl = (size, code, name) => {
	if (name == 'rey') {
		return 'https://res.cloudinary.com/julsgc/image/upload/a_hflip,c_scale,q_100,w_' + size + '/' + code + '/' + name + '.png';
	} else {
		return 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + size + '/' + code + '/' + name + '.png';
	}
};

export const getCreatureHelpers = (name, srcWidth, srcHeight, frameX, frameY, frameWidth, frameHeight) => {
	let s = {};

	switch(name) {
		case 'joto':
			s.x = (srcWidth-frameWidth)/2.7;
			s.w = frameWidth*1.22;
			s.h = frameHeight*1.22;
			s.y = -(frameHeight - s.w)/3;

			s.frameX = frameX;
			s.frameY = frameY;
			s.frameWidth = frameWidth;
			s.frameHeight = frameHeight;
		break;
		case 'queena':
			s.x = (srcWidth-frameWidth)/1.8;
			s.w = frameWidth*1.15;
			s.h = frameHeight*1.15;
			s.y = -(frameHeight - s.w)/5;

			s.frameX = frameX;
			s.frameY = frameY;
			s.frameWidth = frameWidth;
			s.frameHeight = frameHeight;
		break;
		case 'rey':
			s.x = (srcWidth-frameWidth)/2.3;
			s.w = frameWidth*1.15;
			s.h = frameHeight*1.15;
			s.y = -(frameHeight - s.w)/4.7;

			s.frameX = frameX;
			s.frameY = frameY;
			s.frameWidth = frameWidth;
			s.frameHeight = frameHeight;
		break;
		case 'az':
			s.x = (srcWidth-frameWidth)/6.1;
			s.w = frameWidth*1.42;
			s.h = frameHeight*1.42;
			s.y = -(frameHeight - s.w)/1.5;

			s.frameX = frameX;
			s.frameY = frameY;
			s.frameWidth = frameWidth;
			s.frameHeight = frameHeight;
		break;
		case 'joker':
			s.x = (srcWidth-frameWidth)/2.2;
			s.w = frameWidth*1.12;
			s.h = frameHeight*1.12;
			s.y = -(frameHeight - s.w)/4.7;

			s.frameX = frameX;
			s.frameY = frameY;
			s.frameWidth = frameWidth;
			s.frameHeight = frameHeight;

		break;
	}

	return s;
};