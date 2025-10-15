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
	//withinZeroPi,
	//withinPiPi,
	//ShapePoint,
	point,
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
		pNumber('Nb1', 'poleTriangles', 3, 2, 20, 1),
		//pNumber('Nb2', 'slotTriangles', 0, 0, 20, 1), // not yet implemented
		pNumber('Lb', 'mm', 3000, 10, 10000, 1),
		pNumber('La', 'mm', 3000, 10, 10000, 1),
		pCheckbox('SecondPoleNorth', false),
		pNumber('KaNorth', 'mm', 1000, 10, 10000, 1),
		pNumber('JaNorth', 'mm', 1000, 10, 10000, 1),
		pCheckbox('SecondPoleSouth', false),
		pNumber('KaSouth', 'mm', 1000, 10, 10000, 1),
		pNumber('JaSouth', 'mm', 1000, 10, 10000, 1),
		pSectionSeparator('West East Sides'),
		pNumber('Ra', 'degree', 30, 10, 80, 0.5), // 50 + 23.5 = 73.5 that's very steep!
		pNumber('Rt', '%', 50, 0, 100, 1),
		pNumber('ReS', 'mm', 500, 1, 5000, 1),
		pNumber('ReN', 'mm', 500, 1, 5000, 1),
		pNumber('H1', 'mm', 2500, 10, 5000, 1),
		pNumber('H2', 'mm', 300, 10, 1000, 1),
		pNumber('H3', 'mm', 300, 10, 1000, 1),
		pCheckbox('bSplit', false),
		pCheckbox('aSplit', false),
		pNumber('H3s', 'mm', 300, 10, 1000, 1),
		pNumber('H3arc', 'mm', 0, 0, 2000, 1),
		pSectionSeparator('plank-1'),
		pNumber('W1a', 'mm', 300, 10, 1000, 1),
		pNumber('W1b', 'mm', 300, 10, 1000, 1),
		pNumber('V1', 'mm', 40, 0, 1000, 1),
		pNumber('U1', 'mm', 40, 0, 1000, 1),
		pNumber('W2', 'mm', 150, 5, 1000, 1),
		pNumber('W3', 'mm', 150, 5, 1000, 1),
		pNumber('D2', 'mm', 20, 0, 200, 1),
		pNumber('D3', 'mm', 20, 0, 200, 1),
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
		pNumber('Q4Init', 'mm', 50, 0, 2000, 1),
		pNumber('dropLastN', 'notch', 0, 0, 10, 1),
		pNumber('dropLastS', 'notch', 0, 0, 10, 1),
		pNumber('H7', 'mm', 60, 0, 200, 1),
		pSectionSeparator('plank-5 plank-8'),
		pNumber('W5a', 'mm', 200, 1, 1000, 1),
		pNumber('W5bs', 'mm', 0, 0, 1000, 1),
		pNumber('D5', 'mm', 20, 0, 200, 1),
		pDropdown('top_opt', ['shifted', 'aligned']),
		pNumber('G5Min', 'mm', 200, 1, 1000, 1),
		pNumber('P5', 'mm', 20, 1, 200, 1),
		pNumber('W8', 'mm', 200, 1, 1000, 1),
		pSectionSeparator('plank-6'),
		pNumber('W6', 'mm', 100, 1, 1000, 1),
		pNumber('H6', 'mm', 100, 1, 1000, 1),
		pDropdown('peak6', ['peak', 'square']),
		pSectionSeparator('Diagonals'),
		pNumber('dbW', 'mm', 100, 1, 500, 1),
		pNumber('dbX', 'mm', 1000, 1, 2000, 1),
		pNumber('dbY', 'mm', 1000, 1, 2000, 1),
		pNumber('dbP', 'mm', 50, 1, 200, 1),
		pNumber('dbD', 'mm', 20, 1, 200, 1),
		pNumber('daW', 'mm', 100, 1, 500, 1),
		pNumber('daX', 'mm', 1000, 1, 2000, 1),
		pNumber('daY', 'mm', 1000, 1, 2000, 1),
		pNumber('daP', 'mm', 50, 1, 200, 1),
		pNumber('daD', 'mm', 20, 1, 200, 1),
		pNumber('dtW', 'mm', 100, 1, 500, 1),
		pNumber('dtX', 'mm', 1000, 1, 2000, 1),
		pNumber('dtY', 'mm', 1000, 1, 2000, 1),
		pNumber('dtP', 'mm', 50, 1, 200, 1),
		pNumber('dtQ', 'mm', 20, 1, 200, 1),
		pSectionSeparator('3D Export'),
		pCheckbox('d3Plank1', false),
		pDropdown('d3Plank1West', ['Low', 'High', 'End']),
		pDropdown('d3Plank1East', ['Low', 'High', 'End']),
		pDropdown('d3Plank1SN', ['P1', 'P2', 'P3', 'P4']),
		pCheckbox('d3Plank2EE', false),
		pCheckbox('d3Plank2Slot', false),
		pCheckbox('d3Plank2Short', false),
		pCheckbox('d3Plank3EE', false),
		pCheckbox('d3Plank3S', false),
		pCheckbox('d3Plank3M', false),
		pCheckbox('d3Plank3N', false),
		pCheckbox('d3Plank4S', false),
		pCheckbox('d3Plank4N', false),
		pCheckbox('d3Plank5', false),
		pCheckbox('d3Plank6', false),
		pCheckbox('d3Plank7', false),
		pCheckbox('d3Plank8S', false),
		pCheckbox('d3Plank8N', false),
		pCheckbox('d3Assembly', true)
	],
	paramSvg: {
		Nb1: 'abri_base.svg',
		//Nb2: 'abri_base.svg',
		Lb: 'abri_base.svg',
		La: 'abri_base.svg',
		SecondPoleNorth: 'abri_base.svg',
		KaNorth: 'abri_base.svg',
		SecondPoleSouth: 'abri_base.svg',
		KaSouth: 'abri_base.svg',
		JaNorth: 'abri_base.svg',
		JaSouth: 'abri_base.svg',
		Ra: 'abri_triangle.svg',
		Rt: 'abri_triangle.svg',
		ReS: 'abri_triangle.svg',
		ReN: 'abri_plank4.svg',
		H1: 'abri_beam_heights.svg',
		H2: 'abri_beam_heights.svg',
		H3: 'abri_beam_heights.svg',
		bSplit: 'abri_south_bSplit.svg',
		aSplit: 'abri_beam_heights.svg',
		H3s: 'abri_south_P2P3.svg',
		H3arc: 'abri_beam_heights.svg',
		W1a: 'abri_base.svg',
		W1b: 'abri_base.svg',
		V1: 'abri_base.svg',
		U1: 'abri_base.svg',
		W2: 'abri_base.svg',
		W3: 'abri_base.svg',
		D2: 'abri_base.svg',
		D3: 'abri_base.svg',
		W4: 'abri_plank4.svg',
		B4: 'abri_triangle.svg',
		D4: 'abri_plank4.svg',
		P41: 'abri_plank4.svg',
		P42: 'abri_plank4.svg',
		S4: 'abri_plank4.svg',
		S4e: 'abri_notch.svg',
		S4e2: 'abri_plank4.svg',
		Q4: 'abri_plank4.svg',
		Q4Init: 'abri_plank4.svg',
		dropLastN: 'abri_top_opt_shifted.svg',
		dropLastS: 'abri_top_opt_aligned.svg',
		H7: 'abri_triangle.svg',
		W5a: 'abri_triangle.svg',
		W5bs: 'abri_plank5b.svg',
		D5: 'abri_triangle.svg',
		top_opt: 'abri_top_opt_shifted.svg',
		G5Min: 'abri_triangle.svg',
		P5: 'abri_plank8.svg',
		W8: 'abri_triangle.svg',
		W6: 'abri_top_opt_aligned.svg',
		H6: 'abri_triangle.svg',
		peak6: 'abri_triangle.svg',
		dbW: 'abri_diagonal_b.svg',
		dbX: 'abri_diagonal_b.svg',
		dbY: 'abri_diagonal_b.svg',
		dbP: 'abri_diagonal_b.svg',
		dbD: 'abri_diagonal_b.svg',
		daW: 'abri_diagonal_a.svg',
		daX: 'abri_diagonal_a.svg',
		daY: 'abri_diagonal_a.svg',
		daP: 'abri_diagonal_a.svg',
		daD: 'abri_diagonal_a.svg',
		dtW: 'abri_diagonal_top.svg',
		dtX: 'abri_diagonal_top.svg',
		dtY: 'abri_diagonal_top.svg',
		dtP: 'abri_diagonal_top.svg',
		dtQ: 'abri_diagonal_top.svg',
		d3Plank1: 'abri_3d_export.svg',
		d3Plank1West: 'abri_3d_export.svg',
		d3Plank1East: 'abri_3d_export.svg',
		d3Plank1SN: 'abri_3d_export.svg',
		d3Plank2EE: 'abri_3d_export.svg',
		d3Plank2Slot: 'abri_3d_export.svg',
		d3Plank2Short: 'abri_3d_export.svg',
		d3Plank3One: 'abri_3d_export.svg',
		d3Plank3S: 'abri_3d_export.svg',
		d3Plank3M: 'abri_3d_export.svg',
		d3Plank3N: 'abri_3d_export.svg',
		d3Plank4S: 'abri_3d_export.svg',
		d3Plank4N: 'abri_3d_export.svg',
		d3Plank5: 'abri_3d_export.svg',
		d3Plank6: 'abri_3d_export.svg',
		d3Plank7: 'abri_3d_export.svg',
		d3Plank8S: 'abri_3d_export.svg',
		d3Plank8N: 'abri_3d_export.svg',
		d3Assembly: 'abri_3d_export.svg'
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
	const figPlank1a = figure();
	const figPlank1b = figure();
	const figPlank3One = figure();
	const figPlank3S = figure();
	const figPlank3M = figure();
	const figPlank3N = figure();
	const figPlank5a = figure();
	const figPlank5b = figure();
	const figPlank6c = figure();
	const figPlank8S = figure();
	const figPlank8N = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const H2H3 = param.H2 + param.H3;
		const W1a2V1 = param.W1a - 2 * param.V1;
		const W1b2U1 = param.W1b - 2 * param.U1;
		const aDist: number[] = [];
		if (param.SecondPoleSouth === 1) {
			aDist.push(param.KaSouth);
		}
		aDist.push(param.La);
		if (param.SecondPoleNorth === 1) {
			aDist.push(param.KaNorth);
		}
		const aPos: number[] = [0];
		let aDistAcc = 0;
		for (const iDist of aDist) {
			aDistAcc += iDist + param.W1a;
			aPos.push(aDistAcc);
		}
		const Na = aPos.length;
		const la = Na * param.W1a + aDist.reduce((acc, cur) => acc + cur, 0); // mm
		const lb = param.Nb1 * param.W1b + (param.Nb1 - 1) * param.Lb; // mm
		const lbWall = lb / 1000; // m
		const laWall = la / 1000; // m
		const lbInner = lbWall - (2 * param.W1b) / 1000;
		const laInner = laWall - (2 * param.W1a) / 1000;
		const lbRoof = lbWall;
		const laRoof = laWall + (param.JaSouth + param.JaNorth) / 1000;
		const stepX = param.W1b + param.Lb;
		const W1a2 = param.W1a / 2;
		const D2H = param.H1 + param.H2 / 2;
		const D3H = param.H1 + param.H2 + param.H3 / 2;
		const R2 = param.D2 / 2;
		const R3 = param.D3 / 2;
		const H1H2 = param.H1 + param.H2;
		const pl3La = la + param.JaSouth + param.JaNorth;
		const W3U1 = param.W3 - param.U1;
		const W2V1 = param.W2 - param.V1;
		const W1bU1 = param.W1b - param.U1;
		const W1aV1 = param.W1a - param.V1;
		const pl2Lb = lb + 2 * W3U1;
		const H123 = H1H2 + param.H3;
		const LaMin = 2 * (param.W3 - param.U1);
		const LbMin = 2 * (param.W2 - param.V1);
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
		const laSideS = param.JaSouth - H32 + param.W1a;
		const laSideN = param.JaNorth - H32 + param.W1a;
		const W47 = W42 - param.P41 + param.H7;
		const Xsouth = laSouth + laSideS;
		const RdSouth1 = Xsouth / Math.cos(Ra) + W47 * Math.tan(Ra);
		const RdSouth = RdSouth1 + param.ReS;
		// RdNorth
		const hypS2 = RdSouth1 ** 2 + W47 ** 2;
		const Ytop2 = hypS2 - Xsouth ** 2;
		const Ytop = Math.sqrt(Ytop2);
		const Xnorth = laNorth + laSideN;
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
		// p3Sx, p3Sy
		const W441 = W42 - param.P41;
		const p3Sx = W441 * Math.cos(pi2 + Ra) - param.ReS * Math.cos(Ra);
		const p3Sy = W441 * Math.sin(pi2 + Ra) - param.ReS * Math.sin(Ra);
		// p1Nx, p1Ny
		const p1Nx = W42 * Math.cos(-pi2 - RaNorth);
		const p1Ny = W42 * Math.sin(-pi2 - RaNorth);
		// p2Nx, p2Ny
		const p2Ny = p2Sy;
		const p2Nx = -p2Ny / Math.tan(RaNorth);
		// p3Nx, p3Ny
		const p3Nx = W441 * Math.cos(pi2 - RaNorth) + param.ReN * Math.cos(RaNorth);
		const p3Ny = W441 * Math.sin(pi2 - RaNorth) - param.ReN * Math.sin(RaNorth);
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
		// pl3S1, pl3N1, pl3x1, pl3x2, pl3x4
		const pl3S1 = param.SecondPoleSouth ? param.KaSouth + param.W1a : 0;
		const pl3N1 = param.SecondPoleNorth ? param.KaNorth + param.W1a : 0;
		const pl3x1 = param.W1a + 2 * (param.W2 - param.V1);
		const pl3x2 = laSouth - pl3S1 - param.W2 + param.V1;
		const pl3x4 = laNorth - pl3N1 - param.W2 + param.V1;
		// W52, pl5Sy, pl5Ny
		const W52 = param.W5a / 2;
		const pl5Sy = W52 * Math.tan(Ra);
		const pl5Ny = W52 * Math.tan(RaNorth);
		// ptPl5x0, ptPl5y0, pl5Nl
		const ptPl5x0 = pTopx + topXlow - W52;
		const ptPl5y2 = pTopy + topYlow;
		const l81y = param.H3arc + (param.aSplit ? param.H3s : 0);
		const ptPl5y0 = H123 + l81y;
		const pl5Nl = ptPl5y2 - pl5Ny - ptPl5y0;
		const pl5Sl = ptPl5y2 - pl5Sy - ptPl5y0;
		const R5 = param.D5 / 2;
		// pl5yN, pl5yM, pl5yS, pl5Nl2, ptPl5x00
		const pl5yN = W52 * Math.tan(RaNorth);
		const pl5yS = W52 * Math.tan(Ra);
		const pl5yMN = (W42 + W47) / Math.cos(RaNorth);
		const pl5yMS = (W42 + W47) / Math.cos(Ra);
		const pl5yM = pl5yMN - pl5yMS;
		const pl5Nl2 = Ytop - H32 - l81y - pl5yMN - pl5yN;
		const pl5Sl2 = Ytop - H32 - l81y - pl5yMS - pl5yS;
		const ptPl5x00 = param.top_opt ? pTopx - W52 : ptPl5x0;
		// W62, pl6Sy, pl6Ny, ptPl6x0, ptPl6y0
		const W62 = param.W6 / 2;
		const pl6Sy = W62 * Math.tan(Ra);
		const pl6Ny = W62 * Math.tan(RaNorth);
		const ptPl6x0 = pTopx - W62;
		const ptPl6y0 = pTopy + topYmid;
		// n7S, n7N
		const notch7W = param.S4 + param.S4e;
		const step7 = param.S4 + param.Q4;
		const n7S = Math.floor((RdSouth - param.S4 - param.Q4Init) / step7) + 1 - param.dropLastS;
		const n7N = Math.floor((RdNorth - param.S4 - param.Q4Init) / step7) + 1 - param.dropLastN;
		// l8S1, l8S2, l8S2, l8S32, l8S33
		const l82y = l81y + H32;
		const l8S1x = Xsouth - l82y / Math.tan(Ra) - W52 + (param.top_opt ? 0 : topXlow);
		const l8S1 = l8S1x * Math.sin(Ra) - W42 + param.P42;
		const l8S2 = param.W8 / Math.tan(Ra);
		const l8S3 = param.W8 / Math.sin(Ra);
		const l8S32 = param.P5 / Math.tan(Ra);
		const l8S33 = l8S3 - l8S32;
		// l8N1, l8N2, l8N2, l8N32, l8N33
		const l8N1x = Xnorth - l82y / Math.tan(RaNorth) - W52 - (param.top_opt ? 0 : topXlow);
		const l8N1 = l8N1x * Math.sin(RaNorth) - W42 + param.P42;
		const l8N2 = param.W8 / Math.tan(RaNorth);
		const l8N3 = param.W8 / Math.sin(RaNorth);
		const l8N32 = param.P5 / Math.tan(RaNorth);
		const l8N33 = l8N3 - l8N32;
		// pl5Lbottom, l8S4, l8N4
		const pl5botMin = param.aSplit ? param.H3s : param.H3;
		const pl5Lbottom = Math.max(Math.max(l8N3, l8S3) + param.G5Min, pl5botMin);
		const l8S4 = pl5Lbottom - l8S3;
		const l8N4 = pl5Lbottom - l8N3;
		// pl3Sx0, pl3Mx0, pl3Nx0, pl3S, pl3M, pl3N
		const pl3Sx0 = -param.JaSouth;
		const pl3S = param.JaSouth + 2 * param.W1a + param.KaSouth + param.W2 - param.V1;
		const pl3Mx0 = param.W1a + param.KaSouth - param.W2 + param.V1;
		const pl3M = 2 * (param.W1a + param.W2 - param.V1) + param.La;
		const pl3Nx0 = 2 * param.W1a + param.KaSouth + param.La - param.W2 + param.V1;
		const pl3N = param.W2 - param.V1 + 2 * param.W1a + param.KaNorth + param.JaNorth;
		// step-5 : checks on the parameter values
		if (param.aSplit === 1 && param.SecondPoleNorth + param.SecondPoleSouth < 2) {
			throw `err296: aSplit ${param.aSplit} is active but inactive SecondPoleNorth ${param.SecondPoleNorth} or SecondPoleSouth ${param.SecondPoleSouth}`;
		}
		if (W1a2V1 < 1) {
			throw `err096: W1a ${param.W1a} is too small compare to V1 ${param.V1} mm`;
		}
		if (W1b2U1 < 1) {
			throw `err099: W1b ${param.W1b} is too small compare to U1 ${param.U1} mm`;
		}
		if (param.JaSouth < JaMin(Ra)) {
			throw `err191: JaSouth ${ffix(param.JaSouth)} must be bigger than JaMin ${ffix(JaMin(Ra))} mm`;
		}
		if (param.JaNorth < JaMin(RaNorth)) {
			throw `err234: JaNorth ${ffix(param.JaNorth)} must be bigger than JaMin ${ffix(JaMin(RaNorth))} mm`;
		}
		if (param.P41 > W42 + R4) {
			throw `err287: P41 ${ffix(param.P41)} is too big compare to W4 ${ffix(param.W4)} and D4 ${ffix(param.D4)} mm`;
		}
		if (param.P41 > param.H7) {
			throw `err291: P41 ${ffix(param.P41)} is too big compare to H7 ${ffix(param.H7)} mm`;
		}
		if (param.Lb < LbMin) {
			throw `err318: Lb ${ffix(param.Lb)} is too small compare to LbMin ${ffix(LbMin)} mm`;
		}
		if (param.La < LaMin) {
			throw `err322: La ${ffix(param.La)} is too small compare to LaMin ${ffix(LaMin)} mm`;
		}
		if (param.KaNorth < LaMin) {
			throw `err325: KaNorth ${ffix(param.KaNorth)} is too small compare to LaMin ${ffix(LaMin)} mm`;
		}
		if (param.KaSouth < LaMin) {
			throw `err328: KaSouth ${ffix(param.KaSouth)} is too small compare to LaMin ${ffix(LaMin)} mm`;
		}
		// step-6 : any logs
		rGeome.logstr += `Inner size X: ${ffix(lbInner)} Y: ${ffix(laInner)} m, S: ${ffix(lbInner * laInner)} m2\n`;
		rGeome.logstr += `Wall size X: ${ffix(lbWall)} Y: ${ffix(laWall)} m, S: ${ffix(lbWall * laWall)} m2\n`;
		rGeome.logstr += `Roof size X: ${ffix(lbRoof)} Y: ${ffix(laRoof)} m, S: ${ffix(lbRoof * laRoof)} m2\n`;
		rGeome.logstr += `Pole Horizontal B (W-E): W: ${ffix(param.W2)} H: ${ffix(param.H2)} L: ${ffix(pl2Lb)} mm x${Na * 2}\n`;
		rGeome.logstr += `Pole Horizontal A (N-S): W: ${ffix(param.W3)} H: ${ffix(param.H3)} L: ${ffix(pl3La)} mm x${param.Nb1 * 2}\n`;
		rGeome.logstr += `Pole Vertical: W1a: ${ffix(param.W1a)} W1b: ${ffix(param.W1b)} H: ${ffix(H123)} mm x${Na * param.Nb1}\n`;
		rGeome.logstr += `Top position: laSouth: ${ffix(laSouth)} laNorth: ${ffix(laNorth)} Ytop ${ffix(Ytop)} mm\n`;
		rGeome.logstr += `Roof south: RdSouth1: ${ffix(RdSouth1)} RdSouth: ${ffix(RdSouth)} mm\n`;
		rGeome.logstr += `Roof north: RdNorth1: ${ffix(RdNorth1)} RdNorth: ${ffix(RdNorth)} mm RaNorth ${ffix(radToDeg(RaNorth))} degree\n`;
		rGeome.logstr += `Top angle: ${ffix(radToDeg(aTop))} degree\n`;
		// step-7 : drawing of the figures
		// sub-functions
		function ctrPlank1a(ix: number, iy: number): tContour {
			const rCtr = contour(ix, iy)
				.addSegStrokeR(param.H1, 0)
				.addSegStrokeR(0, param.V1)
				.addSegStrokeR(H2H3, 0)
				.addSegStrokeR(0, W1a2V1)
				.addSegStrokeR(-H2H3, 0)
				.addSegStrokeR(0, param.V1)
				.addSegStrokeR(-param.H1, 0)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlank1aPlaced(ix: number, iy: number): tContour {
			const rCtr = ctrPlank1a(ix, iy - param.W1a).rotate(ix, iy, pi2);
			return rCtr;
		}
		function ctrPlank1b(ix: number, iy: number): tContour {
			const rCtr = contour(ix, iy)
				.addSegStrokeR(H1H2, 0)
				.addSegStrokeR(0, param.U1)
				.addSegStrokeR(param.H3, 0)
				.addSegStrokeR(0, W1b2U1)
				.addSegStrokeR(-param.H3, 0)
				.addSegStrokeR(0, param.U1)
				.addSegStrokeR(-H1H2, 0)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlank1bPlaced(ix: number, iy: number): tContour {
			const rCtr = ctrPlank1b(ix, iy - param.W1b).rotate(ix, iy, pi2);
			return rCtr;
		}
		function ctrPlank3S(ix: number, iy: number): tContour {
			const rCtr = ctrRectangle(ix, iy, pl3S, param.H3);
			return rCtr;
		}
		function ctrPlank3M(ix: number, iy: number): tContour {
			let rCtr = ctrRectangle(ix, iy, pl3M, param.H3s);
			if (param.H3arc > 0) {
				rCtr = contour(ix, iy)
					.addSegStrokeR(pl3x1, 0)
					.addPointR(pl3x2, param.H3arc)
					.addSegArc3(pi, false)
					.addPointR(pl3x4, -param.H3arc)
					.addSegArc3(0, true)
					.addSegStrokeR(pl3x1, 0)
					.addSegStrokeR(0, param.H3s)
					.addSegStrokeR(-pl3x1 + param.W2, 0)
					.addPointR(-pl3x4 - param.W2, param.H3arc)
					.addSegArc3(0, false)
					.addPointR(-pl3x2 - param.W2, -param.H3arc)
					.addSegArc3(pi, true)
					.addSegStrokeR(-pl3x1 + param.W2, 0)
					.closeSegStroke();
			}
			return rCtr;
		}
		function ctrPlank3N(ix: number, iy: number): tContour {
			const rCtr = ctrRectangle(ix, iy, pl3N, param.H3);
			return rCtr;
		}
		function ctrPlank3One(ix: number, iy: number): tContour {
			let rCtr = ctrRectangle(ix, iy, pl3La, param.H3);
			if (param.H3arc > 0) {
				const lS2 = param.JaSouth + param.W1a + pl3S1 + param.W2 - param.V1;
				const lN2 = param.JaNorth + param.W1a + pl3N1 + param.W2 - param.V1;
				rCtr = contour(ix, iy)
					.addSegStrokeR(lS2, 0)
					.addPointR(pl3x2, param.H3arc)
					.addSegArc3(pi, false)
					.addPointR(pl3x4, -param.H3arc)
					.addSegArc3(0, true)
					.addSegStrokeR(lN2, 0)
					.addSegStrokeR(0, param.H3s)
					.addSegStrokeR(-lN2 + param.W2, 0)
					.addPointR(-pl3x4 - param.W2, param.H3arc)
					.addSegArc3(0, false)
					.addPointR(-pl3x2 - param.W2, -param.H3arc)
					.addSegArc3(pi, true)
					.addSegStrokeR(-lS2 + param.W2, 0)
					.closeSegStroke();
			}
			return rCtr;
		}
		function ctrPlank5a(ix: number, iy: number): tContour {
			const ctrShifted = contour(ix, iy)
				.addSegStrokeR(l8N4, 0)
				.addSegStrokeR(0, param.P5)
				.addSegStrokeR(l8N33, 0)
				.addSegStrokeR(0, -param.P5)
				.addSegStrokeR(l8N32 + pl5Nl, 0)
				.addSegStrokeR(pl5Ny, W52)
				.addSegStrokeR(-pl5Sy, W52)
				.addSegStrokeR(-pl5Sl - l8S32, 0)
				.addSegStrokeR(0, -param.P5)
				.addSegStrokeR(-l8S33, 0)
				.addSegStrokeR(0, param.P5)
				.addSegStrokeR(-l8S4, 0)
				.closeSegStroke();
			const ctrAligned = contour(ix, iy)
				.addSegStrokeR(l8N4, 0)
				.addSegStrokeR(0, param.P5)
				.addSegStrokeR(l8N33, 0)
				.addSegStrokeR(0, -param.P5)
				.addSegStrokeR(l8N32 + pl5Nl2, 0)
				.addSegStrokeR(pl5yN, W52)
				.addSegStrokeR(pl5yM, 0)
				.addSegStrokeR(-pl5yS, W52)
				.addSegStrokeR(-pl5Sl2 - l8S32, 0)
				.addSegStrokeR(0, -param.P5)
				.addSegStrokeR(-l8S33, 0)
				.addSegStrokeR(0, param.P5)
				.addSegStrokeR(-l8S4, 0)
				.closeSegStroke();
			const rCtr = param.top_opt ? ctrAligned : ctrShifted;
			return rCtr;
		}
		function ctrPlank5aPlaced(ix: number, iy: number): tContour {
			const rCtr = ctrPlank5a(ix - pl5Lbottom, iy - param.W5a).rotate(ix, iy, pi2);
			return rCtr;
		}
		function ctrPlank6c(ix: number, iy: number): tContour {
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
		function ctrPlank8S(ix: number, iy: number): tContour {
			const rCtr = contour(ix, iy)
				.addSegStrokeR(l8S1 + l8S2, 0)
				//.addSegStrokeR(-l8S2, param.W8)
				.addSegStrokeRP(pi2 - Ra, param.P5)
				.addSegStrokeRP(pi - Ra, l8S33)
				.addSegStrokeRP(-pi2 - Ra, param.P5)
				.addSegStrokeRP(pi - Ra, l8S32)
				.addSegStrokeR(-l8S1, 0)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlank8Splaced(ix: number, iy: number, ia: number): tContour {
			const rCtr = ctrPlank8S(ix - l8S1, iy - param.W8).rotate(ix, iy, ia);
			return rCtr;
		}
		function ctrPlank8N(ix: number, iy: number): tContour {
			const rCtr = contour(ix, iy)
				.addSegStrokeR(l8N1, 0)
				//.addSegStrokeR(l8N2, param.W8)
				.addSegStrokeRP(RaNorth, l8N32)
				.addSegStrokeRP(RaNorth - pi2, param.P5)
				.addSegStrokeRP(RaNorth, l8N33)
				.addSegStrokeRP(RaNorth + pi2, param.P5)
				.addSegStrokeR(-l8N1 - l8N2, 0)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlank8Nplaced(ix: number, iy: number, ia: number): tContour {
			const rCtr = ctrPlank8N(ix - l8N1, iy).rotate(ix, iy, pi + ia);
			return rCtr;
		}
		// figBase
		for (const yj of aPos) {
			for (let ii = 0; ii < param.Nb1; ii++) {
				figBase.addMainO(ctrRectangle(ii * stepX, yj, param.W1b, param.W1a));
				figBase.addSecond(ctrRectangle(-W3U1, yj + param.V1 - param.W2, pl2Lb, param.W2));
				figBase.addSecond(ctrRectangle(-W3U1, yj + W1aV1, pl2Lb, param.W2));
			}
		}
		for (let ii = 0; ii < param.Nb1; ii++) {
			figBase.addSecond(ctrRectangle(ii * stepX - W3U1, -param.JaSouth, param.W3, pl3La));
			figBase.addSecond(ctrRectangle(ii * stepX + W1bU1, -param.JaSouth, param.W3, pl3La));
		}
		// figSouth
		for (let ii = 0; ii < param.Nb1; ii++) {
			const ix = ii * stepX;
			const ctrSouth: tOuterInner = [ctrPlank1bPlaced(ix, 0)];
			if (R2 > 0) {
				ctrSouth.push(contourCircle(ix + W1a2, D2H, R2));
			}
			figSouth.addMainOI(ctrSouth);
			figSouth.addSecond(ctrRectangle(ix - W3U1, H1H2, param.W3, param.H3));
			figSouth.addSecond(ctrRectangle(ix + W1bU1, H1H2, param.W3, param.H3));
		}
		figSouth.addSecond(ctrRectangle(-W3U1, param.H1, pl2Lb, param.H2));
		// figEast
		for (const ix of aPos) {
			const ctrEast: tOuterInner = [ctrPlank1aPlaced(ix, 0)];
			if (R3 > 0) {
				ctrEast.push(contourCircle(ix + W1a2, D3H, R3));
			}
			figEast.addMainOI(ctrEast);
			figEast.addSecond(ctrRectangle(ix - W2V1, param.H1, param.W2, param.H2));
			figEast.addSecond(ctrRectangle(ix + W1aV1, param.H1, param.W2, param.H2));
		}
		if (param.aSplit) {
			figEast.addSecond(ctrPlank3S(pl3Sx0, H1H2));
			figEast.addSecond(ctrPlank3M(pl3Mx0, H123));
			figEast.addSecond(ctrPlank3N(pl3Nx0, H1H2));
		} else {
			figEast.addSecond(ctrPlank3One(pl3Sx0, H1H2));
		}
		const p0Sx = -param.JaSouth + H32;
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
		const p0Nx = la + param.JaNorth - H32;
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
		figEast.addSecond(ctrPlank5aPlaced(ptPl5x00, ptPl5y0));
		figEast.addSecond(contourCircle(ptPl5x00 + W52, ptPl5y0 - H32, R5));
		figEast.addSecond(contourCircle(ptPl5x00 + W52, ptPl5y0 + R5, R5));
		figEast.addSecond(ctrPlank6c(ptPl6x0, ptPl6y0));
		for (let ii = 0; ii < n7S; ii++) {
			const ll = param.Q4Init + ii * step7;
			const ipt = point(p0Sx + p3Sx, p0Sy + p3Sy).translatePolar(Ra, ll);
			const iCtr = ctrRectangle(0, 0, notch7W, param.H7).rotate(0, 0, Ra);
			figEast.addSecond(iCtr.translate(ipt.cx, ipt.cy));
		}
		for (let ii = 0; ii < n7N; ii++) {
			const aa = pi - RaNorth;
			const ll = param.Q4Init + ii * step7;
			const ipt = point(p0Nx + p3Nx, p0Ny + p3Ny).translatePolar(aa, ll);
			const iCtr = ctrRectangle(0, -param.H7, notch7W, param.H7).rotate(0, 0, aa);
			figEast.addSecond(iCtr.translate(ipt.cx, ipt.cy));
		}
		figEast.addSecond(ctrPlank8Splaced(ptPl5x00, ptPl5y0, Ra - pi2));
		figEast.addSecond(ctrPlank8Nplaced(ptPl5x00 + 2 * W52, ptPl5y0, pi2 - RaNorth));
		// figPlank1a
		const ctrPl1a: tOuterInner = [ctrPlank1a(0, 0)];
		if (R3 > 0) {
			ctrPl1a.push(contourCircle(D3H, W1a2, R3));
		}
		figPlank1a.addMainOI(ctrPl1a);
		if (R2 > 0) {
			figPlank1a.addSecond(ctrRectangle(D2H - R2, -W2V1, 2 * R2, W1a2V1 + 2 * param.W2));
		}
		figPlank1a.addSecond(ctrRectangle(param.H1, -W2V1, param.H2, param.W2));
		figPlank1a.addSecond(ctrRectangle(param.H1, W1aV1, param.H2, param.W2));
		// figPlank1b
		const ctrPl1b: tOuterInner = [ctrPlank1b(0, 0)];
		if (R2 > 0) {
			ctrPl1b.push(contourCircle(D2H, W1a2, R2));
		}
		figPlank1b.addMainOI(ctrPl1b);
		if (R3 > 0) {
			figPlank1b.addSecond(ctrRectangle(D3H - R3, -W3U1, 2 * R3, W1b2U1 + 2 * param.W3));
		}
		figPlank1b.addSecond(ctrRectangle(H1H2, -W3U1, param.H3, param.W3));
		figPlank1b.addSecond(ctrRectangle(H1H2, W1bU1, param.H3, param.W3));
		// figPlank3One
		figPlank3One.addMainO(ctrPlank3One(0, 0));
		// figPlank3S
		figPlank3S.addMainO(ctrPlank3S(0, 0));
		// figPlank3M
		figPlank3M.addMainO(ctrPlank3M(0, 0));
		// figPlank3N
		figPlank3N.addMainO(ctrPlank3N(0, 0));
		// figPlank5a
		figPlank5a.addMainO(ctrPlank5a(0, 0));
		// figPlank5b
		// figPlank6c
		figPlank6c.addMainO(ctrPlank6c(0, 0));
		// figPlank8S
		figPlank8S.addMainO(ctrPlank8S(0, 0));
		// figPlank8N
		figPlank8N.addMainO(ctrPlank8N(0, 0));
		// final figure list
		rGeome.fig = {
			faceEast: figEast,
			faceBase: figBase,
			faceSouth: figSouth,
			facePlank1a: figPlank1a,
			facePlank1b: figPlank1b,
			facePlank3One: figPlank3One,
			facePlank3S: figPlank3S,
			facePlank3M: figPlank3M,
			facePlank3N: figPlank3N,
			facePlank5a: figPlank5a,
			facePlank5b: figPlank5b,
			facePlank6c: figPlank6c,
			facePlank8S: figPlank8S,
			facePlank8N: figPlank8N
		};
		// volume
		const designName = rGeome.partName;
		const exportList: string[] = [];
		if (param.d3Plank1) {
			exportList.push(`pax_${designName}_pl1`);
		}
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_pl1a`,
					face: `${designName}_facePlank1a`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W1b,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl1b`,
					face: `${designName}_facePlank1b`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W1a,
					rotate: [pi2, 0, 0],
					translate: [0, param.W1b, 0]
				}
			],
			volumes: [
				{
					outName: `pax_${designName}_pl1`,
					boolMethod: EBVolume.eIntersection,
					inList: [`subpax_${designName}_pl1a`, `subpax_${designName}_pl1b`]
				},
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: exportList
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
