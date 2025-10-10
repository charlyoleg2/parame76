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
	degToRad,
	radToDeg,
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
		pSectionSeparator('Side options'),
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
		pNumber('Ra', 'degree', 30, 10, 80, 0.5), // 50 + 23.5 = 73.5 that's very steep!
		pNumber('Rt', '%', 50, 0, 100, 1),
		pNumber('ReS', 'mm', 500, 1, 5000, 1),
		pNumber('ReN', 'mm', 500, 1, 5000, 1),
		pSectionSeparator('plank-4 plank-7'),
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
		pNumber('H7', 'mm', 60, 0, 200, 1),
		pSectionSeparator('plank-5'),
		pNumber('W5a', 'mm', 200, 1, 1000, 1),
		pNumber('W5bs', 'mm', 0, 1, 1000, 1),
		pNumber('D5', 'mm', 20, 0, 200, 1),
		pDropdown('top_opt', ['shifted', 'aligned']),
		pSectionSeparator('plank-6'),
		pNumber('W6', 'mm', 100, 1, 1000, 1),
		pNumber('H6', 'mm', 100, 1, 1000, 1),
		pDropdown('peak6', ['peak', 'square'])
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
		H7: 'abri_triangle.svg',
		W5a: 'abri_triangle.svg',
		W5bs: 'abri_plank5b.svg',
		D5: 'abri_triangle.svg',
		top_opt: 'abri_top_opt_shifted.svg',
		W6: 'abri_top_opt_aligned.svg',
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
		// minimum Ja
		const H32 = param.H3 / 2;
		const W42 = param.W4 / 2;
		const Ra = degToRad(param.Ra);
		const pi = Math.PI;
		const pi2 = pi / 2;
		function JaMin(iRa: number): number {
			const rMin = H32 + W42 / Math.cos(iRa - pi2) + H32 / Math.tan(iRa);
			return rMin;
		}
		// RdSouth
		const laIn = la - 2 * param.W1a;
		const laSouth = (laIn * param.Rt) / 100;
		const laNorth = laIn - laSouth;
		const laSide = param.Ja - H32 + param.W1a;
		const W47 = W42 - param.P41 + param.H7;
		const Xsouth = laSouth + laSide;
		const RdSouth1 = Xsouth / Math.cos(Ra) + W47 * Math.tan(Ra);
		const RdSouth = RdSouth1 + param.ReS;
		// RdNorth
		const hypS2 = RdSouth1 ** 2 + W47 ** 2;
		const Ytop2 = hypS2 - Xsouth ** 2;
		const Ytop = Math.sqrt(Ytop2);
		const Xnorth = laNorth + laSide;
		const hypN2 = Ytop2 + Xnorth ** 2;
		const hypN = Math.sqrt(hypN2);
		const RdNorth1 = Math.sqrt(hypN2 - W47 ** 2);
		const RdNorth = RdNorth1 + param.ReN;
		// RaNorth
		const aT1 = Math.atan2(W47, RdSouth1);
		const aT2 = Math.atan2(Xsouth, Ytop);
		const aT3 = Math.atan2(Xnorth, Ytop);
		const aT4 = Math.atan2(W47, hypN);
		const aTop = aT1 + aT2 + aT3 + aT4;
		const RaNorth = pi - Ra - aTop;
		// p1Sx, p1Sy
		const p1Sx = W42 * Math.cos(Ra - pi2);
		const p1Sy = W42 * Math.sin(Ra - pi2);
		// p2Sx, p2Sy
		const R4 = param.D4 / 2;
		const p2Sy = H32 + R4;
		const p2Sx = p2Sy / Math.tan(Ra);
		// p1Nx, p1Ny
		const p1Nx = W42 * Math.cos(-pi2 - RaNorth);
		const p1Ny = W42 * Math.sin(-pi2 - RaNorth);
		// p2Nx, p2Ny
		const p2Ny = p2Sy;
		const p2Nx = -p2Ny / Math.tan(RaNorth);
		// pTopx, pTopy
		const pTopx = param.W1a + laSouth;
		const pTopy = H123 - H32 + Ytop;
		// topYmid, topYlow, topXlow
		const aMid = -RaNorth - aTop / 2;
		const topD1 = (param.H7 - param.P41) / Math.sin(aTop / 2);
		const topD2 = param.W4 / Math.sin(aTop / 2);
		const topYmid = (topD1 + topD2 / 2) * Math.sin(aMid);
		const topYlow = (topD1 + topD2) * Math.sin(aMid);
		const topXlow = (topD1 + topD2) * Math.cos(aMid);
		// pl5Sx, pl5Sy, pl5Nx, pl5Ny
		const pl5Sx = param.W5a / 2;
		const pl5Sy = pl5Sx * Math.tan(Ra);
		const pl5Nx = param.W5a / 2;
		const pl5Ny = pl5Nx * Math.tan(RaNorth);
		// ptPl5x0, ptPl5y0, pl5Nl
		const ptPl5x0 = pTopx + topXlow - pl5Sx;
		const ptPl5y2 = pTopy + topYlow - pl5Ny;
		const ptPl5y0 = H123;
		const pl5Nl = ptPl5y2 - ptPl5y0;
		const R5 = param.D5 / 2;
		// W62, pl6Sy, pl6Ny, ptPl6x0, ptPl6y0
		const W62 = param.W6 / 2;
		const pl6Sy = W62 * Math.tan(Ra);
		const pl6Ny = W62 * Math.tan(RaNorth);
		const ptPl6x0 = pTopx - W62;
		const ptPl6y0 = pTopy + topYmid;
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
		if (param.Ja < JaMin(Ra)) {
			throw `err191: South Ja ${ffix(param.Ja)} must be bigger than JaMin ${ffix(JaMin(Ra))} mm`;
		}
		if (param.Ja < JaMin(RaNorth)) {
			throw `err234: North Ja ${ffix(param.Ja)} must be bigger than JaMin ${ffix(JaMin(RaNorth))} mm`;
		}
		// step-6 : any logs
		rGeome.logstr += `Inner size X: ${ffix(lbInner)} Y: ${ffix(laInner)} m, S: ${ffix(lbInner * laInner)} m2\n`;
		rGeome.logstr += `Wall size X: ${ffix(lbWall)} Y: ${ffix(laWall)} m, S: ${ffix(lbWall * laWall)} m2\n`;
		rGeome.logstr += `Roof size X: ${ffix(lbRoof)} Y: ${ffix(laRoof)} m, S: ${ffix(lbRoof * laRoof)} m2\n`;
		rGeome.logstr += `Pole Horizontal B (W-E): W: ${ffix(param.W2)} H: ${ffix(param.H2)} L: ${ffix(lbPole)} mm x${param.Na * 2}\n`;
		rGeome.logstr += `Pole Horizontal A (N-S): W: ${ffix(param.W3)} H: ${ffix(param.H3)} L: ${ffix(laPole)} mm x${param.Nb * 2}\n`;
		rGeome.logstr += `Pole Vertical: W1a: ${ffix(param.W1a)} W1b: ${ffix(param.W1b)} H: ${ffix(H123)} mm x${param.Na * param.Nb}\n`;
		rGeome.logstr += `Top position: laSouth: ${ffix(laSouth)} laNorth: ${ffix(laNorth)} Ytop ${ffix(Ytop)} mm\n`;
		rGeome.logstr += `Roof south: RdSouth1: ${ffix(RdSouth1)} RdSouth: ${ffix(RdSouth)} mm\n`;
		rGeome.logstr += `Roof north: RdNorth1: ${ffix(RdNorth1)} RdNorth: ${ffix(RdNorth)} mm RaNorth ${ffix(radToDeg(RaNorth))} degree\n`;
		rGeome.logstr += `Top angle: ${ffix(radToDeg(aTop))} degree\n`;
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
		function ctrPlank5(ix: number, iy: number): tContour {
			const rCtr = contour(ix, iy)
				.addSegStrokeR(param.W5a, 0)
				.addSegStrokeR(0, pl5Nl)
				.addSegStrokeR(-pl5Nx, pl5Ny)
				.addSegStrokeR(-pl5Sx, -pl5Sy)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlank6(ix: number, iy: number): tContour {
			const ctrPeak = contour(ix, iy)
				.addSegStrokeR(param.W6, 0)
				.addSegStrokeR(0, -topYmid - pl6Ny)
				.addSegStrokeR(-W62, pl6Ny)
				.addSegStrokeR(-W62, -pl6Sy)
				.closeSegStroke();
			const ctrSquare = ctrRectangle(ix, iy, param.W6, param.H6);
			const rCtr = param.peak6 ? ctrSquare : ctrPeak;
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
		const p0Sx = -param.Ja + H32;
		const p0Sy = D3H;
		figEast.addSecond(contourCircle(p0Sx, p0Sy, R4));
		figEast.addSecond(contourCircle(p0Sx + p2Sx, p0Sy + p2Sy, R4));
		figEast.addSecond(
			ctrRectangle(0, 0, RdSouth1, W42 + W47)
				.rotate(0, 0, Ra)
				.translate(p0Sx + p1Sx, p0Sy + p1Sy)
		);
		figEast.addSecond(
			ctrRectangle(0, 0, RdSouth1, 2 * W42)
				.rotate(0, 0, Ra)
				.translate(p0Sx + p1Sx, p0Sy + p1Sy)
		);
		figEast.addSecond(
			ctrRectangle(0, 0, param.ReS, 2 * W42)
				.rotate(0, 0, Ra + pi)
				.translate(p0Sx - p1Sx, p0Sy - p1Sy)
		);
		//const ctrTriS = contour(p0Sx, p0Sy)
		//	.addSegStrokeR(Xsouth, 0)
		//	.addSegStrokeR(0, Ytop)
		//	.closeSegStroke();
		//figEast.addSecond(ctrTriS);
		const p0Nx = la + param.Ja - H32;
		const p0Ny = D3H;
		figEast.addSecond(contourCircle(p0Nx, p0Ny, R4));
		figEast.addSecond(contourCircle(p0Nx + p2Nx, p0Ny + p2Ny, R4));
		figEast.addSecond(
			ctrRectangle(0, -W42 - W47, RdNorth1, W42 + W47)
				.rotate(0, 0, pi - RaNorth)
				.translate(p0Nx + p1Nx, p0Ny + p1Ny)
		);
		figEast.addSecond(
			ctrRectangle(0, -2 * W42, RdNorth1, 2 * W42)
				.rotate(0, 0, pi - RaNorth)
				.translate(p0Nx + p1Nx, p0Ny + p1Ny)
		);
		figEast.addSecond(
			ctrRectangle(0, 0, param.ReN, 2 * W42)
				.rotate(0, 0, -RaNorth)
				.translate(p0Nx + p1Nx, p0Ny + p1Ny)
		);
		//const ctrTriN = contour(p0Nx, p0Ny)
		//	.addSegStrokeR(-Xnorth, 0)
		//	.addSegStrokeR(0, Ytop)
		//	.closeSegStroke();
		//figEast.addSecond(ctrTriN);
		//const ctrTriN2 = contour(p0Nx, p0Ny, 'green')
		//	.addSegStrokeRP(pi2 - RaNorth, W47)
		//	.addSegStrokeRP(pi - RaNorth, RdNorth1)
		//	.closeSegStroke();
		//figEast.addSecond(ctrTriN2);
		figEast.addSecond(ctrPlank5(ptPl5x0, ptPl5y0));
		figEast.addSecond(contourCircle(ptPl5x0 + pl5Sx, ptPl5y0 - H32, R5));
		figEast.addSecond(contourCircle(ptPl5x0 + pl5Sx, ptPl5y0 + R5, R5));
		figEast.addSecond(ctrPlank6(ptPl6x0, ptPl6y0));
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
