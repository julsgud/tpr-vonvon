export const pickCreature = (index) => {
	let o = {};

	switch(index) {
		case 0:
			o.name = 'joto';
			o.code = 'v1493051207';
			o.objectCount = 2;
			o.object1code = 'v1493688917';
			o.object1 = 'joto_ojos';
			o.object2code = 'v1493688917';
			o.object2 = 'joto_boca';
			break;
		case 1:
			o.name = 'queena';
			o.code = 'v1493051209';
			o.objectCount = 3;
			o.object1code = 'v1493688916';
			o.object1 = 'queena_ojo';
			o.object2code = 'v1493688916';
			o.object2 = 'queena_nariz';
		break;
		case 2:
			o.name = 'rey';
			o.code = 'v1493051207';
			o.objectCount = 2;
			o.object1code = 'v1493688916';
			o.object1 = 'rey_lentes';
			o.object2code = 'v1493688916';
			o.object2 = 'rey_espada';
		break;
		case 3:
			o.name = 'as';
			o.code = 'v1493051206';
			o.objectCount = 3;
			o.object1code = 'v1493688916';
			o.object1 = 'az_ojo';
			o.object2code = 'v1493688917';
			o.object2 = 'az_patineta';
		break;
		case 4:
			o.name = 'joker';
			o.code = 'v1493051209';
			o.objectCount = 3;
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
				size = (face.eyeDistance + face.eyeDistance*.90).toFixed(0);
				if (face.roll < 0) {
					rotation = face.roll + -3;
					if (rotation < 0) rotation = 360 - face.roll + 3;
					url = 'https://res.cloudinary.com/julsgc/image/upload/a_hflip,c_scale,q_100,w_' + size + '/a_' + rotation + '/' + creature.object1code + '/' + creature.object1 + '.png';
				} else {
					rotation = face.roll + -3;

					url = url = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + size + '/a_' + rotation + '/' + creature.object1code + '/' + creature.object1 + '.png';
				}
			} else {
					size = (face.width*.90).toFixed(0);
				if (face.roll < 0) {
					rotation = face.roll + -9;
					url = 'https://res.cloudinary.com/julsgc/image/upload/a_hflip,c_scale,q_100,w_' + size + '/a_' + rotation + '/' + creature.object2code + '/' + creature.object2 + '.png';
				} else {
					rotation = face.roll + 10;
					url = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + size + '/a_' + rotation + '/' + creature.object2code + '/' + creature.object2 + '.png';
				}
			}
		break;
		case 'queena':
			if (objectIndex === 0) {
				size = (face.width*.60).toFixed(0);
				rotation = face.roll + -3;
				if (rotation < 0) rotation = 360 + face.roll + 3;
				url = url = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + size + '/a_' + rotation + '/' + creature.object1code + '/' + creature.object1 + '.png';
			} else if (objectIndex === 1) {
				size = (face.width*.60).toFixed(0);
				rotation = face.roll + -3;
				if (rotation < 0) rotation = 360 + face.roll + 3;
				url = 'https://res.cloudinary.com/julsgc/image/upload/a_hflip,c_scale,q_100,w_' + size + '/a_' + rotation + '/' + creature.object1code + '/' + creature.object1 + '.png';
			} else {
				size = (face.height*.22).toFixed(0);
				if (face.roll < 0) {
					rotation = 12;
					rotation += Math.abs(face.roll);
					if (face.pitch != 0) rotation = 12;
					url = 'https://res.cloudinary.com/julsgc/image/upload/a_hflip,c_scale,q_100,w_' + size + '/a_' + rotation + '/' + creature.object2code + '/' + creature.object2 + '.png';
				} else {
					rotation = -12;
					rotation -= Math.abs(face.roll);
					url = 'https://res.cloudinary.com/julsgc/image/upload/c_scale,q_100,w_' + size + '/a_' + rotation + '/' + creature.object2code + '/' + creature.object2 + '.png';
				}
			}
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

export const getCreatureDescription = (creature, gender) => {
	let str = '';

	switch(creature.name) {
		case 'joto':
			if (gender == 'male') {
				str = 'Para ti solo hay una palabra que te describe: “loquillo”. Eres un “loquillo” porque en un restorán con refresco de refill, nunca puedes escoger un solo sabor. Solo hasta que tu bebida agarra tonalidades rosáceas es cuando puedes ir a sentarte y disfrutar orgulloso de tu creación gaseosa. Eres un “loquillo” porque aprendiste (o aprenderás) a andar en patineta a los 28 años. Una vez te pintaste el pelo de verde y te fuiste a una fiesta pensando en que eras el más chido del lugar. Aunque muy probablemente no lo hayas sido, lo importante es el espíritu, y eso es lo que te caracterizará por el resto de tus días: tienes alma de loquillo.';
			} else {
				str = 'Para ti solo hay una palabra que te describe: “loquilla”. Eres una “loquilla” porque en un restorán con refresco de refill, nunca puedes escoger un solo sabor. Solo hasta que tu bebida agarra tonalidades rosáceas es cuando puedes ir a sentarte y disfrutar orgullosa de tu creación gaseosa. Eres una “loquilla” porque aprendiste (o aprenderás) a andar en patineta a los 28 años. Una vez te pintaste el pelo de verde y te fuiste a una fiesta pensando en que eras la más chida del lugar. Aunque muy probablemente no lo hayas sido, lo importante es el espíritu, y eso es lo que te caracterizará por el resto de tus días: tienes alma de loquilla.';
			}
		break;
		case 'queena':
			if (gender == 'male') {
				str = 'Tú eres un tipo raro y lo sabes. Eres de los que, de niño, en el arenero encontrabas lombrices, y además de presumirlas, te las comías y le decías frescamente a tu amigo “sabe a pollo” (y aún lo piensas). Pero no todo es miel (o lombrices?) sobre hojuelas. Tus amigos te ven raro cuando te ven desayunando milanesa y Coca Cola. Tu novia no entiende por qué tu color favorito es el verde pistache. En el fondo, tú sabes que eres más normal de lo que aparentas. Es más, hasta eres cool. Sigue siendo así, pequeño insecto extraño.';
			} else {
				str = 'Tú eres una chica rara y lo sabes. Eres de las que, de niña, en el arenero encontrabas lombrices, y además de presumirlas, te las comías y le decías frescamente a tu amiga “sabe a pollo” (y aún lo piensas). Pero no todo es miel (o lombrices?) sobre hojuelas. Tus amigos te ven raro cuando te ven desayunando milanesa y Coca Cola. Tu novio no entiende por qué tu color favorito es el verde pistache. En el fondo, tú sabes que eres más normal de lo que aparentas. Es más, hasta eres cool. Sigue siendo así, pequeño insecto extraño.';
			}
		break;
		case 'rey':
			if (gender == 'male') {
				str = 'Eres el más malote de todos. No es que hayas decidido serlo, sino que los azares del destino y la situación en la que te puso la vida te forjó como tal. Por esa razón siempre escoges a Bowser en Mario Kart y le partes el hocico a todos. Te identificas con Shrek, no sólo porque tienes un amigo Burro, sino porque sabes que eres como una cebolla. Algo incomprendido, pero debajo de muchas capas, eres un tipo sensible.';
			} else {
				str = 'Eres la más malota de todas. No es que hayas decidido serlo, sino que los azares del destino y la situación en la que te puso la vida te forjó como tal. Por esa razón siempre escoges a Bowser en Mario Kart y le partes el hocico a todos. Te identificas con Shrek, no sólo porque tienes un amigo Burro, sino porque sabes que eres como una cebolla. Algo incomprendida, pero debajo de muchas capas, eres una chica sensible.';
			}
		break;
		case 'as':
			if (gender == 'male') {
				str = 'Tú eres, sin duda alguna, el romántico empedernido de tus amigos. Tu descripción de una película perfecta es la fusión de “10 cosas que odio de ti” con Miss Simpatía y/o Frozen. Eres un Belieber hecho y derecho, y aunque su show pasado haya estado horrible, vas a volver a estar en primera fila listo para gritar a todo pulmón cada una de sus rolas. Para ti el amor siempre gana, y esa es la razón por la que eres una persona tan chida para ser amigo.';
			} else {
				str = 'Tú eres, sin duda alguna, la romántica empedernida de tus amigos. Tu descripción de una película perfecta es la fusión de “10 cosas que odio de ti” con Miss Simpatía y/o Frozen. Eres un Belieber hecho y derecho, y aunque su show pasado haya estado horrible, vas a volver a estar en primera fila listo para gritar a todo pulmón cada una de sus rolas. Para ti el amor siempre gana, y esa es la razón por la que eres una persona tan chida para ser amiga.';
			}
		break;
		case 'joker':
			if (gender == 'male') {
				str = 'También conocido como “el ajonjolí de todos los moles”, tú nunca te pierdes un evento, por más insignificante que sea. Pero tienes tal suerte, que aunque seas adicto a estar en todos lados, te pasa todo lo terrible. Una vez te rompiste el diente con una cerveza. Otra vez te subiste al escenario y te aventaste al público, pero nadie te cachó. Y la lista de eventos desafortunados continúa sin fin. Por esa razón tus amigos saben que eres un gran elemento para compartir unas buenas carcajadas.';
			} else {
				str = 'También conocida como “el ajonjolí de todos los moles”, tú nunca te pierdes un evento, por más insignificante que sea. Pero tienes tal suerte, que aunque seas adicta a estar en todos lados, te pasa todo lo terrible. Una vez te rompiste el diente con una cerveza. Otra vez te subiste al escenario y te aventaste al público, pero nadie te cachó. Y la lista de eventos desafortunados continúa sin fin. Por esa razón tus amigos saben que eres un gran elemento para compartir unas buenas carcajadas.';
			}
		break;
	}

	return str;
}