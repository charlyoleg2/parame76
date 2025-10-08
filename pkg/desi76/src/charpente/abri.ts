// abri.ts
// A shelter made out of wood beam for supporting photovoltaic panels

import type {
	tContour,
	tOuterInner,
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
	pDropdown,
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
		pNumber('D3', 'mm', 20, 0, 200, 1),
		pSectionSeparator('slope'),
		pNumber('Ra', 'degree', 45 - 23.5, 10, 80, 0.5),
		pNumber('Rt', '%', 50, 10, 90, 1),
		pNumber('ReS', 'mm', 500, 1, 5000, 1),
		pNumber('ReN', 'mm', 500, 1, 5000, 1),
		pSectionSeparator('plank-4'),
		pNumber('W4', 'mm', 200, 1, 1000, 1),
		pNumber('B4', 'mm', 100, 0, 1000, 1),
		pNumber('D4', 'mm', 20, 0, 200, 1),
		pNumber('P41', 'mm', 20, 0, 200, 1),
		pNumber('P42', 'mm', 20, 0, 200, 1),
		pNumber('S4', 'mm', 60, 0, 200, 1),
		pNumber('S4e', 'mm', 0, 0, 20, 0.1),
		pNumber('S4e2', 'mm', 0, 0, 20, 0.1),
		pNumber('Q4', 'mm', 500, 0, 2000, 1),
		pNumber('Q4Min', 'mm', 500, 0, 2000, 1),
		pSectionSeparator('plank-5'),
		pNumber('W5a', 'mm', 200, 1, 1000, 1),
		pNumber('W5bs', 'mm', 0, 1, 1000, 1),
		pNumber('D5', 'mm', 20, 0, 200, 1),
		pSectionSeparator('plank-6'),
		pNumber('W6', 'mm', 100, 1, 1000, 1),
		pNumber('H6', 'mm', 100, 1, 1000, 1),
		pDropdown('peak6', ['square', 'peak'])
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
		D3: 'abri_base.svg',
		Ra: 'abri_triangle.svg',
		Rt: 'abri_triangle.svg',
		ReS: 'abri_triangle.svg',
		ReN: 'abri_plank4.svg',
		W4: 'abri_plank4.svg',
		B4: 'abri_triangle.svg',
		D4: 'abri_plank4.svg',
		P41: 'abri_plank4.svg',
		P42: 'abri_plank4.svg',
		S4: 'abri_plank4.svg',
		S4e: 'abri_notch.svg',
		S4e2: 'abri_plank4.svg',
		Q4: 'abri_plank4.svg',
		Q4Min: 'abri_plank4.svg',
		W5a: 'abri_triangle.svg',
		W5bs: 'abri_plank5b.svg',
		D5: 'abri_triangle.svg',
		W6: 'abri_triangle.svg',
		H6: 'abri_triangle.svg',
		peak6: 'abri_triangle.svg'
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
	const figSouth = figure();
	const figEast = figure();
	const figPoleSouth = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const H2H3 = param.H2 + param.H3;
		const W1a2V1 = param.W1a - 2 * param.V1;
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
		const D2H = param.H1 + param.H2 / 2;
		const D3H = param.H1 + param.H2 + param.H3 / 2;
		const R2 = param.D2 / 2;
		const R3 = param.D3 / 2;
		const H1H2R2 = param.H1 + param.H2 / 2 - R2;
		const H1H2 = param.H1 + param.H2;
		const laPole = la + 2 * param.Ja;
		const W3U1 = param.W3 - param.U1;
		const W2V1 = param.W2 - param.V1;
		const W1bU1 = param.W1b - param.U1;
		const W1aV1 = param.W1a - param.V1;
		const lbPole = lb + 2 * W3U1;
		const H123 = H1H2 + param.H3;
		// step-5 : checks on the parameter values
		if (W1a2V1 < 1) {
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
		rGeome.logstr += `Pole Horizontal B (W-E): W: ${ffix(param.W2)} H: ${ffix(param.H2)} L: ${ffix(lbPole)} mm x${param.Na * 2}\n`;
		rGeome.logstr += `Pole Horizontal A (N-S): W: ${ffix(param.W3)} H: ${ffix(param.H3)} L: ${ffix(laPole)} mm x${param.Nb * 2}\n`;
		rGeome.logstr += `Pole Vertical: W1a: ${ffix(param.W1a)} W1b: ${ffix(param.W1b)} H: ${ffix(H123)} mm x${param.Na * param.Nb}\n`;
		// step-7 : drawing of the figures
		// sub-functions
		function ctrPole(ix: number, iy: number, ih23: number): tContour {
			const rCtr = contour(ix, 0)
				.addSegStrokeR(param.W1b, 0)
				.addSegStrokeR(0, H123 - ih23)
				.addSegStrokeR(-param.U1, 0)
				.addSegStrokeR(0, ih23)
				.addSegStrokeR(-W1b2U1, 0)
				.addSegStrokeR(0, -ih23)
				.addSegStrokeR(-param.U1, 0)
				.closeSegStroke();
			return rCtr;
		}
		// figBase
		let yj = 0;
		const posA: number[] = [];
		for (let jj = 0; jj < param.Na; jj++) {
			posA.push(yj);
			for (let ii = 0; ii < param.Nb; ii++) {
				figBase.addMainO(ctrRectangle(ii * stepX, yj, param.W1b, param.W1a));
				figBase.addSecond(ctrRectangle(-W3U1, yj + param.V1 - param.W2, lbPole, param.W2));
				figBase.addSecond(ctrRectangle(-W3U1, yj + W1aV1, lbPole, param.W2));
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
			figBase.addSecond(ctrRectangle(ii * stepX - W3U1, -param.Ja, param.W3, laPole));
			figBase.addSecond(ctrRectangle(ii * stepX + W1bU1, -param.Ja, param.W3, laPole));
		}
		// figSouth
		for (let ii = 0; ii < param.Nb; ii++) {
			const ix = ii * stepX;
			const ctrSouth: tOuterInner = [ctrPole(ix, 0, param.H3)];
			if (R2 > 0) {
				ctrSouth.push(contourCircle(ix + W1a2, D2H, R2));
			}
			figSouth.addMainOI(ctrSouth);
			figSouth.addSecond(ctrRectangle(ix - W3U1, H1H2, param.W3, param.H3));
			figSouth.addSecond(ctrRectangle(ix + W1bU1, H1H2, param.W3, param.H3));
		}
		figSouth.addSecond(ctrRectangle(-W3U1, param.H1, lbPole, param.H2));
		// figEast
		for (const ix of posA) {
			const ctrEast: tOuterInner = [ctrPole(ix, 0, H2H3)];
			if (R3 > 0) {
				ctrEast.push(contourCircle(ix + W1a2, D3H, R3));
			}
			figEast.addMainOI(ctrEast);
			figEast.addSecond(ctrRectangle(ix - W2V1, param.H1, param.W2, param.H2));
			figEast.addSecond(ctrRectangle(ix + W1aV1, param.H1, param.W2, param.H2));
		}
		figEast.addSecond(ctrRectangle(-param.Ja, H1H2, laPole, param.H3));
		// figPoleSouth
		const ctrPoleSouth: tOuterInner = [ctrPole(0, 0, H2H3)];
		if (R3 > 0) {
			ctrPoleSouth.push(contourCircle(W1a2, D3H, R3));
		}
		figPoleSouth.addMainOI(ctrPoleSouth);
		if (R2 > 0) {
			figPoleSouth.addSecond(ctrRectangle(-W2V1, H1H2R2, W1a2V1 + 2 * param.W2, 2 * R2));
		}
		figPoleSouth.addSecond(ctrRectangle(param.V1, H1H2, W1a2V1, param.H3));
		figPoleSouth.addSecond(ctrRectangle(-W2V1, param.H1, param.W2, param.H2));
		figPoleSouth.addSecond(ctrRectangle(W1aV1, param.H1, param.W2, param.H2));
		// final figure list
		rGeome.fig = {
			faceBase: figBase,
			faceSouth: figSouth,
			faceEast: figEast,
			facePoleSouth: figPoleSouth
		};
		// volume
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_top`,
					face: `${designName}_facePoleSouth`,
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
