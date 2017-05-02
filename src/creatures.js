export const pickCreature = (index) => {
	let o = {};

	switch(index) {
		case 0:
			o.name = 'joto';
			o.code = 'v1493051207';
			o.object1code = 'v1493688917';
			o.object1 = 'joto_ojos';
			o.object2code = 'v1493688917';
			o.object2 = 'joto_boca';
			break;
		case 1:
			o.name = 'queena';
			o.code = 'v1493051209';
			o.object1code = 'v1493688916';
			o.object1 = 'queena_ojos';
			o.object2code = 'v1493688916';
			o.object2 = 'queena_nariz';
		break;
		case 2:
			o.name = 'rey';
			o.code = 'v1493051207';
			o.object1code = 'v1493688916';
			o.object1 = 'rey_lentes';
			o.object2code = 'v1493688916';
			o.object2 = 'rey_espada';
		break;
		case 3:
			o.name = 'as';
			o.code = 'v1493051206';
			o.object1code = 'v1493688916';
			o.object1 = 'az_ojo';
			o.object2code = 'v1493688917';
			o.object2 = 'az_patineta';
		break;
		case 4:
			o.name = 'joker';
			o.code = 'v1493051209';
			o.object1code = 'v1493688915';
			o.object1 = 'joker_ojos';
			o.object2code = 'v1493688916';
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

export const getObjectUrl = (objectIndex, face, creature, frame) => {
	let url = '';
	let size, rotation;
	switch(creature.name) {
		case 'joto':
			if (objectIndex === 0) {
				size = (face.eyeDistance + face.eyeDistance*.85).toFixed(0);
				if (face.roll < 0) {
					url = 'https://res.cloudinary.com/julsgc/image/upload/a_hflip,c_scale,q_100,w_' + size + '/' + creature.object1code + '/' + creature.object1 + '.png';
				} else {
					url = url = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + size + '/' + creature.object1code + '/' + creature.object1 + '.png';
				}
			} else {
				if (face.roll < 0) {
					size = (face.width*.90).toFixed(0);
					rotation = face.roll + -9;
					url = 'https://res.cloudinary.com/julsgc/image/upload/a_hflip,c_scale,q_100,w_' + size + '/a_' + rotation+ '/' + creature.object2code + '/' + creature.object2 + '.png';
				} else {
					url = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + size + '/' + creature.object2code + '/' + creature.object2 + '.png';
				}
			}
		break;
		case 'queena':
			
		break;
		case 'rey':
			
		break;
		case 'as':
			
		break;
		case 'joker':
			
		break;
	}
	return url;
}

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
		case 'as':
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

export const getCreatureDescription = (creature, gender, pref) => {
	let str = '';

	switch(name) {
		case 'joto':
			if (gender == 'male') {

			} else {
				if (pref) {
					if (pref == 'male') {

					} else {

					}
				} 
			}
		break;
		case 'queena':
			
		break;
		case 'rey':
			
		break;
		case 'as':
			
		break;
		case 'joker':
			

		break;
	}

}