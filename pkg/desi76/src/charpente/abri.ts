// abri.ts
// A shelter made out of wood beam for supporting photovoltaic panels

import type {
	//tContour,
	//tOuterInner,
	tParamDef,
	tParamVal,
	tGeom,
	tPageDef
	//tSubInst
	//tSubDesign
} from 'geometrix';
import {
	contour,
	contourCircle,
	ctrRectangle,
	figure,
	//degToRad,
	//radToDeg,
	ffix,
	pNumber,
	pCheckbox,
	//pDropdown,
	pSectionSeparator,
	EExtrude,
	EBVolume,
	initGeom
} from 'geometrix';

const pDef: tParamDef = {
	partName: 'abri',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('Na', 'pole', 2, 2, 20, 1),
		pNumber('Nb', 'pole', 3, 2, 20, 1),
		pNumber('Lb', 'mm', 3000, 500, 10000, 1),
		pNumber('La', 'mm', 3000, 500, 10000, 1),
		pNumber('Ka', 'mm', 1000, 0, 10000, 1),
		pNumber('Ja', 'mm', 1000, 0, 10000, 1),
		pSectionSeparator('Side optiions'),
		pCheckbox('SecondPoleNorth', false),
		pCheckbox('SecondPoleSouth', false),
		pSectionSeparator('pole heights'),
		pNumber('H1', 'mm', 2500, 1500, 5000, 1),
		pNumber('H2', 'mm', 300, 10, 1000, 1),
		pNumber('H3', 'mm', 300, 10, 1000, 1),
		pSectionSeparator('pole widths'),
		pNumber('W1a', 'mm', 300, 10, 1000, 1),
		pNumber('W1b', 'mm', 300, 10, 1000, 1),
		pNumber('V1', 'mm', 40, 0, 1000, 1),
		pNumber('U1', 'mm', 40, 0, 1000, 1),
		pNumber('W2', 'mm', 150, 5, 1000, 1),
		pNumber('W3', 'mm', 150, 5, 1000, 1),
		pSectionSeparator('pole holes'),
		pNumber('D2', 'mm', 20, 0, 200, 1),
		pNumber('D3', 'mm', 20, 0, 200, 1)
	],
	paramSvg: {
		Na: 'abri_base.svg',
		Nb: 'abri_base.svg',
		Lb: 'abri_base.svg',
		La: 'abri_base.svg',
		Ka: 'abri_base.svg',
		Ja: 'abri_base.svg',
		SecondPoleNorth: 'abri_base.svg',
		SecondPoleSouth: 'abri_base.svg',
		H1: 'abri_beam_heights.svg',
		H2: 'abri_beam_heights.svg',
		H3: 'abri_beam_heights.svg',
		W1a: 'abri_base.svg',
		W1b: 'abri_base.svg',
		V1: 'abri_base.svg',
		U1: 'abri_base.svg',
		W2: 'abri_base.svg',
		W3: 'abri_base.svg',
		D2: 'abri_base.svg',
		D3: 'abri_base.svg'
	},
	sim: {
		tMax: 180,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

function pGeom(t: number, param: tParamVal, suffix = ''): tGeom {
	const rGeome = initGeom(pDef.partName + suffix);
	const figBase = figure();
	const figPoleFace = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const H2H3 = param.H2 + param.H3;
		const W1aV1 = param.W1a - 2 * param.V1;
		const W1b2U1 = param.W1b - 2 * param.U1;
		const poleSecondNb = (param.SecondPoleNorth ? 1 : 0) + (param.SecondPoleSouth ? 1 : 0);
		const poleNbWEmin = 2 + poleSecondNb;
		const lb = param.Nb * param.W1b + (param.Nb - 1) * param.Lb; // mm
		const lbWall = lb / 1000; // m
		const laPre = param.Na * param.W1a + (param.Na - 1 - poleSecondNb) * param.La; // mm
		const la = laPre + poleSecondNb * param.Ka; // mm
		const laWall = la / 1000; // m
		const lbInner = lbWall - (2 * param.W1b) / 1000;
		const laInner = laWall - (2 * param.W1a) / 1000;
		const lbRoof = lbWall;
		const laRoof = laWall + (2 * param.Ja) / 1000;
		const stepX = param.W1b + param.Lb;
		const W1a2 = param.W1a / 2;
		const D3H = param.H1 + param.H2 + param.H3 / 2;
		const R3 = param.D3 / 2;
		const laJa = la + 2 * param.Ja;
		const W3U1 = param.W2 - param.U1;
		const W1bU1 = param.W1b - param.U1;
		// step-5 : checks on the parameter values
		if (W1aV1 < 1) {
			throw `err096: W1a ${param.W1a} is too small compare to V1 ${param.V1} mm`;
		}
		if (W1b2U1 < 1) {
			throw `err099: W1b ${param.W1b} is too small compare to U1 ${param.U1} mm`;
		}
		if (param.Na < poleNbWEmin) {
			throw `err103: Na ${param.Na} must be bigger than ${poleNbWEmin} poles`;
		}
		// step-6 : any logs
		rGeome.logstr += `Inner size X: ${ffix(lbInner)} Y: ${ffix(laInner)} m, S: ${ffix(lbInner * laInner)} m2\n`;
		rGeome.logstr += `Wall size X: ${ffix(lbWall)} Y: ${ffix(laWall)} m, S: ${ffix(lbWall * laWall)} m2\n`;
		rGeome.logstr += `Roof size X: ${ffix(lbRoof)} Y: ${ffix(laRoof)} m, S: ${ffix(lbRoof * laRoof)} m2\n`;
		// step-7 : drawing of the figures
		// sub-functions
		// figBase
		let yj = 0;
		for (let jj = 0; jj < param.Na; jj++) {
			for (let ii = 0; ii < param.Nb; ii++) {
				figBase.addMainO(ctrRectangle(ii * stepX, yj, param.W1b, param.W1a));
				figBase.addSecond(ctrRectangle(0, yj + param.V1 - param.W2, lb, param.W2));
				figBase.addSecond(ctrRectangle(0, yj + param.W1a - param.V1, lb, param.W2));
			}
			if (jj === 0) {
				yj += param.W1a + (param.SecondPoleSouth ? param.Ka : param.La);
			} else if (jj === param.Na - 2) {
				yj += param.W1a + (param.SecondPoleNorth ? param.Ka : param.La);
			} else {
				yj += param.W1a + param.La;
			}
		}
		for (let ii = 0; ii < param.Nb; ii++) {
			figBase.addSecond(ctrRectangle(ii * stepX - W3U1, -param.Ja, param.W3, laJa));
			figBase.addSecond(ctrRectangle(ii * stepX + W1bU1, -param.Ja, param.W3, laJa));
		}
		// figPoleFace
		const ctrPoleFace = contour(0, 0)
			.addSegStrokeR(param.W1a, 0)
			.addSegStrokeR(0, param.H1)
			.addSegStrokeR(-param.V1, 0)
			.addSegStrokeR(0, H2H3)
			.addSegStrokeR(-W1aV1, 0)
			.addSegStrokeR(0, -H2H3)
			.addSegStrokeR(-param.V1, 0)
			.closeSegStroke();
		figPoleFace.addMainOI([ctrPoleFace, contourCircle(W1a2, D3H, R3)]);
		// final figure list
		rGeome.fig = {
			faceBase: figBase,
			facePoleFace: figPoleFace
		};
		// volume
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_top`,
					face: `${designName}_facePoleFace`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: 10,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				}
			],
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eIdentity,
					inList: [`subpax_${designName}_top`]
				}
			]
		};
		// sub-design
		rGeome.sub = {};
		// finalize
		rGeome.logstr += 'abri drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

const abriDef: tPageDef = {
	pTitle: 'abri',
	pDescription: 'A shelter made out of wood beam for supporting photovoltaic panels',
	pDef: pDef,
	pGeom: pGeom
};

export { abriDef };
