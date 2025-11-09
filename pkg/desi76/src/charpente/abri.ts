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
		pNumber('dbX', 'mm', 500, 1, 2000, 1),
		pNumber('dbY', 'mm', 1000, 1, 2000, 1),
		pNumber('dbP', 'mm', 50, 1, 200, 1),
		pNumber('dbPe', 'mm', 0, 0, 20, 0.1),
		pNumber('dbD', 'mm', 20, 1, 200, 1),
		pNumber('dbE', 'mm', 50, 1, 500, 1),
		pNumber('daW', 'mm', 100, 1, 500, 1),
		pNumber('daX', 'mm', 500, 1, 2000, 1),
		pNumber('daY', 'mm', 1000, 1, 2000, 1),
		pNumber('daP', 'mm', 50, 1, 200, 1),
		pNumber('daPe', 'mm', 0, 0, 20, 0.1),
		pNumber('daD', 'mm', 20, 1, 200, 1),
		pNumber('daE', 'mm', 50, 1, 500, 1),
		pNumber('dtW', 'mm', 100, 1, 500, 1),
		pNumber('dtX', 'mm', 1000, 1, 2000, 1),
		pNumber('dtY', 'mm', 1000, 1, 2000, 1),
		pNumber('dtP', 'mm', 50, 1, 200, 1),
		pNumber('dtPe', 'mm', 0, 0, 20, 0.1),
		pNumber('dtQ', 'mm', 20, 1, 200, 1),
		pNumber('dtQe', 'mm', 0, 0, 20, 0.1),
		pNumber('dtF', 'mm', 800, 1, 4000, 1),
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
		pCheckbox('d3PlankDiagTop', false),
		pCheckbox('d3PlankDiagA', false),
		pCheckbox('d3PlankDiagB', false),
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
		H3: 'abri_south_bSplit_off.svg',
		bSplit: 'abri_south_bSplit.svg',
		aSplit: 'abri_east_P1234.svg',
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
		dbPe: 'abri_diagonal_b.svg',
		dbD: 'abri_diagonal_b.svg',
		dbE: 'abri_diagonal_b.svg',
		daW: 'abri_diagonal_a.svg',
		daX: 'abri_diagonal_a.svg',
		daY: 'abri_diagonal_a.svg',
		daP: 'abri_diagonal_a.svg',
		daPe: 'abri_diagonal_a.svg',
		daD: 'abri_diagonal_a.svg',
		daE: 'abri_diagonal_a.svg',
		dtW: 'abri_diagonal_top.svg',
		dtX: 'abri_diagonal_top.svg',
		dtY: 'abri_diagonal_top.svg',
		dtP: 'abri_diagonal_top.svg',
		dtPe: 'abri_diagonal_top.svg',
		dtQ: 'abri_diagonal_top.svg',
		dtQe: 'abri_diagonal_top.svg',
		dtF: 'abri_base.svg',
		d3Plank1: 'abri_3d_export.svg',
		d3Plank1West: 'abri_south_P2P3.svg',
		d3Plank1East: 'abri_south_P2P3.svg',
		d3Plank1SN: 'abri_east_P1234.svg',
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
		d3PlankDiagTop: 'abri_3d_export.svg',
		d3PlankDiagA: 'abri_3d_export.svg',
		d3PlankDiagB: 'abri_3d_export.svg',
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
	const figPlank2EE = figure();
	const figPlank2Slot = figure();
	const figPlank2Short = figure();
	const figPlank3EE = figure();
	const figPlank3S = figure();
	const figPlank3M = figure();
	const figPlank3N = figure();
	const figPlank4S = figure();
	const figPlank4N = figure();
	const figPlank5a = figure();
	const figPlank5b = figure();
	const figPlank6b = figure();
	const figPlank6c = figure();
	const figPlank7c = figure();
	const figPlank8S = figure();
	const figPlank8N = figure();
	const figPlankDiagTop = figure();
	const figPlankDiagA = figure();
	const figPlankDiagB = figure();
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
		const W1b2 = param.W1b / 2;
		const H12c = param.H1 + param.H2 * (param.bSplit ? 2 : 1);
		const H123c = H12c + param.H3;
		const H22 = param.H2 / 2;
		const D2H = param.H1 + H22;
		const D3H = H12c + param.H3 / 2;
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
		const H741 = param.H7 - param.P41;
		const Ra = degToRad(param.Ra);
		const pi = Math.PI;
		const pi2 = pi / 2;
		//const pi4 = pi2 / 2;
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
		// p4Sx, p4Sy
		const p4Sx = param.ReS * Math.cos(Ra + pi);
		const p4Sy = param.ReS * Math.sin(Ra + pi);
		// p1Nx, p1Ny
		const p1Nx = W42 * Math.cos(-pi2 - RaNorth);
		const p1Ny = W42 * Math.sin(-pi2 - RaNorth);
		// p2Nx, p2Ny
		const p2Ny = p2Sy;
		const p2Nx = -p2Ny / Math.tan(RaNorth);
		// p3Nx, p3Ny
		const p3Nx = W441 * Math.cos(pi2 - RaNorth) + param.ReN * Math.cos(RaNorth);
		const p3Ny = W441 * Math.sin(pi2 - RaNorth) - param.ReN * Math.sin(RaNorth);
		// p4Nx, p4Ny
		const p4Nx = param.ReN * Math.cos(-RaNorth);
		const p4Ny = param.ReN * Math.sin(-RaNorth);
		// pTopx, pTopy
		const pTopx = param.W1a + laSouth;
		const H2c = param.bSplit === 1 ? param.H2 : 0;
		const pTopy = H123 + H2c - H32 + Ytop;
		// topYmid, topYlow, topXlow
		const aMid = -RaNorth - aTop / 2;
		const topD1 = (param.H7 - param.P41) / Math.sin(aTop / 2);
		const topD2 = param.W4 / Math.sin(aTop / 2);
		const topYmid = (topD1 + topD2 / 2) * Math.sin(aMid);
		const topXmid = (topD1 + topD2 / 2) * Math.cos(aMid);
		const topYlow = (topD1 + topD2) * Math.sin(aMid);
		const topXlow = (topD1 + topD2) * Math.cos(aMid);
		const lp5p6 = Math.abs((topD2 / 2) * Math.sin(aMid));
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
		// ptPl5y0, pl5Nl
		const ptPl5y2 = pTopy + topYlow;
		const l81y = param.H3arc + (param.aSplit ? param.H3s : 0);
		const H3c = (param.H3 + param.H3s) / 2;
		const ptPl5y0 = H123 + H2c + l81y;
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
		const ptPl5x00 = param.top_opt ? pTopx - W52 : pTopx + topXlow - W52;
		// W62, pl6Sy, pl6Ny, ptPl6x0, ptPl6y0
		const W62 = param.W6 / 2;
		const pl6Sy = W62 * Math.tan(Ra);
		const pl6Ny = W62 * Math.tan(RaNorth);
		const ptPl6x0 = pTopx - W62;
		const ptPl6y0 = pTopy + topYmid;
		// l4qS3, l4qN3
		const l4qS3 = Math.sqrt(pl6Sy ** 2 + W62 ** 2) + H741 * Math.tan(Ra);
		const l4qN3 = Math.sqrt(pl6Ny ** 2 + W62 ** 2) + H741 * Math.tan(RaNorth);
		// n7S, n7N
		const notch7W = param.S4 + param.S4e;
		const step7 = param.S4 + param.Q4;
		const SQ4Init = param.S4 + param.Q4Init;
		const n7S = Math.floor((RdSouth - SQ4Init - l4qS3) / step7) + 1 - param.dropLastS;
		const n7N = Math.floor((RdNorth - SQ4Init - l4qN3) / step7) + 1 - param.dropLastN;
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
		// pl5Lbottom, l8S4, l8N4, l5l
		const pl5botMin = param.aSplit ? param.H3s : param.H3;
		const pl5Lbottom = Math.max(Math.max(l8N3, l8S3) + param.G5Min, pl5botMin);
		const l8S4 = pl5Lbottom - l8S3;
		const l8N4 = pl5Lbottom - l8N3;
		const l5l = l8N4 + l8N33 + l8N32;
		const l5W = param.W1b + 2 * (param.W5bs - param.U1);
		// pl3Sx0, pl3Mx0, pl3Nx0, pl3S, pl3M, pl3N
		const pl3Sx0 = -param.JaSouth;
		const pl3S = param.JaSouth + 2 * param.W1a + param.KaSouth + param.W2 - param.V1;
		const pl3Mx0 = param.W1a + param.KaSouth - param.W2 + param.V1;
		const pl3M = 2 * (param.W1a + param.W2 - param.V1) + param.La;
		const pl3Nx0 = 2 * param.W1a + param.KaSouth + param.La - param.W2 + param.V1;
		const pl3N = param.W2 - param.V1 + 2 * param.W1a + param.KaNorth + param.JaNorth;
		// d3Plank1SN
		const d3P1P1234 = 1 + param.d3Plank1SN;
		const d3P1P23 = d3P1P1234 === 2 || d3P1P1234 === 3 ? true : false;
		// pl3Nx, pl3Ny, pl3Sx, pl3Sy
		const pl3Nz1 = W441 / Math.cos(RaNorth);
		const pl3Nz2 = H32 - pl3Nz1;
		const pl3Nz3 = pl3Nz2 / Math.tan(RaNorth);
		const pl3Nx = Math.max(H32 + pl3Nz3, 1);
		const pl3Ny = Math.min(pl3Nx * Math.tan(RaNorth), 2 * H32 - 1);
		const pl3Sz1 = W441 / Math.cos(Ra);
		const pl3Sz2 = H32 - pl3Sz1;
		const pl3Sz3 = pl3Sz2 / Math.tan(Ra);
		const pl3Sx = Math.max(H32 + pl3Sz3, 1);
		const pl3Sy = Math.min(pl3Sx * Math.tan(Ra), 2 * H32 - 1);
		// pl6b
		const pl6Qe = param.dtQe;
		const pl6Qe2 = pl6Qe / 2;
		const pl6bL = lb + 2 * (param.dtF - param.U1);
		const pl6bH = param.dtQ - topYmid;
		const pl6da = Math.atan2(param.dtX, param.dtY);
		const pl6Q21 = param.dtQ * Math.tan(pl6da);
		const pl6Q22 = param.dtW / Math.cos(pl6da);
		const pl6Q23 = pl6Q22 - pl6Q21;
		const pl6Q1 = param.W1b - 2 * param.U1 + pl6Qe;
		const pl6Q2 = param.dtX + param.W5bs + pl6Q21 - pl6Qe;
		const pl6Q3 = pl6Q23 + pl6Qe;
		const pl6Q4 = param.Lb + 2 * (param.U1 - pl6Q2 - pl6Q3) - pl6Qe;
		// pldt
		const pldtPe = param.dtPe;
		const pldtPe2 = pldtPe / 2;
		const pldtP1 = param.dtP / Math.tan(pl6da);
		const pldtP2 = param.dtW / Math.sin(pl6da);
		const pldtP3 = pldtP2 - pldtP1 + pldtPe;
		// plda
		const daR = param.daD / 2;
		const pldaPe = param.daPe;
		const pldaPe2 = pldaPe / 2;
		const pldaA = Math.atan2(param.daX, param.daY);
		const pldaX = param.daX + param.daW / (2 * Math.cos(pldaA)) + H32 * Math.tan(pldaA);
		const pldaP1 = param.daP / Math.tan(pldaA);
		const pldaP2 = param.daW / Math.sin(pldaA);
		const pldaP3 = pldaP2 - pldaP1;
		// pldb
		const dbR = param.dbD / 2;
		const pldbPe = param.dbPe;
		const pldbPe2 = pldbPe / 2;
		const pldbA = Math.atan2(param.dbX, param.dbY);
		const pldbX = param.dbX + param.dbW / (2 * Math.cos(pldbA)) + H22 * Math.tan(pldbA);
		const pldbP1 = param.dbP / Math.tan(pldbA);
		const pldbP2 = param.dbW / Math.sin(pldbA);
		const pldbP3 = pldbP2 - pldbP1;
		// Extrude thickness
		const pl4W = param.W1b - 2 * param.U1;
		const pl5aW = pl4W + 2 * param.W5bs;
		const pl5bW = param.W5a;
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
		function ctrPlank1a(ix: number, iy: number, iP1234: number): tContour {
			const H3sc = (iP1234 === 2 || iP1234 === 3) && param.aSplit === 1 ? param.H3s : 0;
			const H2s = param.bSplit === 1 ? param.H2 : 0;
			const H2H3c = H2H3 + H2s;
			let sideN = iP1234 === 4 ? 2 : 0;
			let sideS = iP1234 === 1 ? 2 : 0;
			if (param.aSplit === 1 && iP1234 === 2) {
				sideN = 1;
			}
			if (param.aSplit === 1 && iP1234 === 3) {
				sideS = 1;
			}
			const hh0 = param.H2 + H2s;
			const hh1 = hh0 + (param.aSplit === 1 ? param.H3 : 0);
			const h3Lo = param.daY + pldaP1 - pldaPe2 - hh0;
			const h3Hi = param.daY + pldaP1 - pldaPe2 - hh1;
			const h2 = pldaP3 + pldaPe;
			const h1Lo = param.H1 - h2 - h3Lo;
			const h1Hi = param.H1 - h2 - h3Hi;
			const rCtr = contour(ix, iy);
			if (sideN === 2) {
				rCtr.addSegStrokeR(param.H1, 0);
			} else if (sideN === 1) {
				rCtr.addSegStrokeR(h1Hi, 0)
					.addSegStrokeR(0, param.daP)
					.addSegStrokeR(h2, 0)
					.addSegStrokeR(0, -param.daP)
					.addSegStrokeR(h3Hi, 0);
			} else {
				rCtr.addSegStrokeR(h1Lo, 0)
					.addSegStrokeR(0, param.daP)
					.addSegStrokeR(h2, 0)
					.addSegStrokeR(0, -param.daP)
					.addSegStrokeR(h3Lo, 0);
			}
			rCtr.addSegStrokeR(0, param.V1)
				.addSegStrokeR(H2H3c + H3sc, 0)
				.addSegStrokeR(0, W1a2V1)
				.addSegStrokeR(-H2H3c - H3sc, 0)
				.addSegStrokeR(0, param.V1);
			if (sideS === 2) {
				rCtr.addSegStrokeR(-param.H1, 0);
			} else if (sideS === 1) {
				rCtr.addSegStrokeR(-h3Hi, 0)
					.addSegStrokeR(0, -param.daP)
					.addSegStrokeR(-h2, 0)
					.addSegStrokeR(0, param.daP)
					.addSegStrokeR(-h1Hi, 0);
			} else {
				rCtr.addSegStrokeR(-h3Lo, 0)
					.addSegStrokeR(0, -param.daP)
					.addSegStrokeR(-h2, 0)
					.addSegStrokeR(0, param.daP)
					.addSegStrokeR(-h1Lo, 0);
			}
			rCtr.closeSegStroke();
			return rCtr;
		}
		function ctrPlank1aPlaced(ix: number, iy: number, iP1234: number): tContour {
			const rCtr = ctrPlank1a(ix, iy - param.W1a, iP1234).rotate(ix, iy, pi2);
			return rCtr;
		}
		function ctrPlank1b(
			ix: number,
			iy: number,
			iSideW: number,
			iSideE: number,
			iP1234: number
		): tContour {
			const H3sc = (iP1234 === 2 || iP1234 === 3) && param.aSplit === 1 ? param.H3s : 0;
			const H3c2 = param.H3 + H3sc;
			const H2sc = param.bSplit === 1 ? param.H2 : 0;
			const H1H2sc = H1H2 + H2sc;
			const h3Lo = param.dbY + pldbP1 - pldbPe2 + param.H2 + H2sc;
			const h3Hi = param.dbY + pldbP1 - pldbPe2 + H2sc;
			const h2 = pldbP3 + pldbPe;
			const h1Lo = H1H2sc - h2 - h3Lo;
			const h1Hi = H1H2sc - h2 - h3Hi;
			const rCtr = contour(ix, iy);
			if (iSideE === 2) {
				rCtr.addSegStrokeR(H1H2sc, 0);
			} else if (iSideE === 1) {
				rCtr.addSegStrokeR(h1Hi, 0)
					.addSegStrokeR(0, param.dbP)
					.addSegStrokeR(h2, 0)
					.addSegStrokeR(0, -param.dbP)
					.addSegStrokeR(h3Hi, 0);
			} else {
				rCtr.addSegStrokeR(h1Lo, 0)
					.addSegStrokeR(0, param.dbP)
					.addSegStrokeR(h2, 0)
					.addSegStrokeR(0, -param.dbP)
					.addSegStrokeR(h3Lo, 0);
			}
			rCtr.addSegStrokeR(0, param.U1)
				.addSegStrokeR(H3c2, 0)
				.addSegStrokeR(0, W1b2U1)
				.addSegStrokeR(-H3c2, 0)
				.addSegStrokeR(0, param.U1);
			if (iSideW === 2) {
				rCtr.addSegStrokeR(-H1H2sc, 0);
			} else if (iSideW === 1) {
				rCtr.addSegStrokeR(-h3Hi, 0)
					.addSegStrokeR(0, -param.dbP)
					.addSegStrokeR(-h2, 0)
					.addSegStrokeR(0, param.dbP)
					.addSegStrokeR(-h1Hi, 0);
			} else {
				rCtr.addSegStrokeR(-h3Lo, 0)
					.addSegStrokeR(0, -param.dbP)
					.addSegStrokeR(-h2, 0)
					.addSegStrokeR(0, param.dbP)
					.addSegStrokeR(-h1Lo, 0);
			}
			rCtr.closeSegStroke();
			return rCtr;
		}
		function ctrPlank1bPlaced(
			ix: number,
			iy: number,
			iSideW: number,
			iSideE: number,
			iP1234: number
		): tContour {
			const rCtr = ctrPlank1b(ix, iy - param.W1b, iSideW, iSideE, iP1234).rotate(ix, iy, pi2);
			return rCtr;
		}
		function ctrPlank2EE(ix: number, iy: number): tContour {
			const rCtr = ctrRectangle(ix, iy, pl2Lb, param.H2);
			return rCtr;
		}
		function ctrPlank2Slot(ix: number, iy: number): tContour {
			const rCtr = ctrRectangle(ix, iy, param.Lb + 2 * (param.W1b + W3U1), param.H2);
			return rCtr;
		}
		function ctrPlank2Short(ix: number, iy: number): tContour {
			const rCtr = ctrRectangle(ix, iy, param.W1b + 2 * W3U1, param.H2);
			return rCtr;
		}
		function ctrPlank3EE(ix: number, iy: number): tContour {
			let rCtr = contour(ix, iy)
				.addSegStrokeR(pl3La, 0)
				.addSegStrokeR(0, param.H3 - pl3Ny)
				.addSegStrokeR(-pl3Nx, pl3Ny)
				.addSegStrokeR(-pl3La + pl3Nx + pl3Sx, 0)
				.addSegStrokeR(-pl3Sx, -pl3Sy)
				.closeSegStroke();
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
					.addSegStrokeR(0, param.H3s - pl3Ny)
					.addSegStrokeR(-pl3Nx, pl3Ny)
					.addSegStrokeR(-lN2 + param.W2 + pl3Nx, 0)
					.addPointR(-pl3x4 - param.W2, param.H3arc)
					.addSegArc3(0, false)
					.addPointR(-pl3x2 - param.W2, -param.H3arc)
					.addSegArc3(pi, true)
					.addSegStrokeR(-lS2 + param.W2 + pl3Sx, 0)
					.addSegStrokeR(-pl3Sx, -pl3Sy)
					.closeSegStroke();
			}
			return rCtr;
		}
		function ctrPlank3S(ix: number, iy: number): tContour {
			const rCtr = contour(ix, iy)
				.addSegStrokeR(pl3S, 0)
				.addSegStrokeR(0, param.H3)
				.addSegStrokeR(-pl3S + pl3Sx, 0)
				.addSegStrokeR(-pl3Sx, -pl3Sy)
				.closeSegStroke();
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
			const rCtr = contour(ix, iy)
				.addSegStrokeR(pl3N, 0)
				.addSegStrokeR(0, param.H3 - pl3Ny)
				.addSegStrokeR(-pl3Nx, pl3Ny)
				.addSegStrokeR(-pl3N + pl3Nx, 0)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlank4S(ix: number, iy: number): tContour {
			const l4x0 = param.B4 / Math.sin(Ra);
			const l4y0 = param.B4 / Math.cos(Ra);
			const l3x0 = H32 + H32 / Math.tan(Ra) + W42 / Math.sin(Ra);
			const l3x1 = param.JaSouth + param.W1a + laSouth + topXlow - W52 - l3x0;
			const l4x2 = l3x1 * Math.cos(Ra) + l81y * Math.sin(Ra);
			const l4x1 = W42 / Math.tan(Ra) + H32 / Math.sin(Ra);
			const l4x3 = param.ReS - l4x0 + l4x1 + l4x2 - param.W8 - param.S4e2 / 2;
			const l4x4 = param.W8 + param.S4e2;
			const l4x5 = RdSouth - l4x0 - l4x3 - l4x4;
			const l4a1 = pi2 - aTop / 2;
			const l4x6 = H741 * Math.tan(l4a1);
			const l4x7 = param.W4 * Math.tan(l4a1);
			const l4x8 = l4x5 - l4x6 - l4x7;
			//const l4q1 = (param.W4 / 2 + H741) / param.W4;
			const l4q2 = Math.sqrt(l4x7 ** 2 + param.W4 ** 2) / 2;
			const l4a2 = aTop / 2;
			const l4y1 = -topYmid - pl6Sy;
			const l4y2 = H741 / Math.cos(Ra);
			const l4q4 = RdSouth - l4qS3 - param.Q4Init - param.S4 - (n7S - 1) * step7;
			const rCtr = contour(ix, iy + l4y0)
				.addSegStrokeR(l4x0, -l4y0)
				.addSegStrokeR(l4x3, 0)
				.addSegStrokeR(0, param.P42)
				.addSegStrokeR(l4x4, 0)
				.addSegStrokeR(0, -param.P42)
				.addSegStrokeR(l4x8, 0)
				.addSegStrokeRP(l4a2, l4q2)
				.addSegStrokeRP(pi - Ra, topXmid + W62)
				.addSegStrokeRP(pi2 - Ra, l4y1 - l4y2)
				//.addSegStrokeR(l4qS3 - RdSouth, 0)
				.addSegStrokeR(-l4q4 + param.S4e / 2, 0);
			for (let ii = 0; ii < n7S - 1; ii++) {
				rCtr.addSegStrokeR(0, -param.P41)
					.addSegStrokeR(-notch7W, 0)
					.addSegStrokeR(0, param.P41)
					.addSegStrokeR(-param.Q4 + param.S4e, 0);
			}
			rCtr.addSegStrokeR(0, -param.P41)
				.addSegStrokeR(-notch7W, 0)
				.addSegStrokeR(0, param.P41)
				.addSegStrokeR(-param.Q4Init + param.S4e / 2, 0)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlank4Splaced(ix: number, iy: number): tContour {
			const rCtr = ctrPlank4S(ix, iy).rotate(ix, iy, Ra);
			return rCtr;
		}
		function ctrPlank4N(ix: number, iy: number): tContour {
			const l4x0 = param.B4 / Math.sin(RaNorth);
			const l4y0 = param.B4 / Math.cos(RaNorth);
			const l3x0 = H32 + H32 / Math.tan(RaNorth) + W42 / Math.sin(RaNorth);
			const l3x1 = param.JaNorth + param.W1a + laNorth - topXlow - W52 - l3x0;
			const l4x2 = l3x1 * Math.cos(RaNorth) + l81y * Math.sin(RaNorth);
			const l4x1 = W42 / Math.tan(RaNorth) + H32 / Math.sin(RaNorth);
			const l4x3 = param.ReN - l4x0 + l4x1 + l4x2 - param.W8 - param.S4e2 / 2;
			const l4x4 = param.W8 + param.S4e2;
			const l4x5 = RdNorth - l4x0 - l4x3 - l4x4;
			const l4a1 = pi2 - aTop / 2;
			const l4x6 = H741 * Math.tan(l4a1);
			const l4x7 = param.W4 * Math.tan(l4a1);
			const l4x8 = l4x5 - l4x6 - l4x7;
			const l4x9 = l4x6 + l4x7;
			//const l4q1 = (param.W4 / 2 + H741) / param.W4;
			//const l4q2 = Math.sqrt(l4x7 ** 2 + param.W4 ** 2) / 2;
			//const l4a2 = aTop / 2;
			const l4y1 = -topYmid - pl6Ny;
			const l4y2 = H741 / Math.cos(RaNorth);
			const l4q4 = RdNorth - l4qN3 - param.Q4Init - param.S4 - (n7N - 1) * step7;
			const rCtr = contour(ix + l4x9, iy)
				.addSegStrokeR(l4x8, 0)
				.addSegStrokeR(0, param.P42)
				.addSegStrokeR(l4x4, 0)
				.addSegStrokeR(0, -param.P42)
				.addSegStrokeR(l4x3, 0)
				.addSegStrokeR(l4x0, l4y0)
				.addSegStrokeR(0, param.W4 - l4y0)
				.addSegStrokeR(-param.Q4Init + param.S4e / 2, 0)
				.addSegStrokeR(0, -param.P41)
				.addSegStrokeR(-notch7W, 0)
				.addSegStrokeR(0, param.P41);
			for (let ii = 0; ii < n7N - 1; ii++) {
				rCtr.addSegStrokeR(-param.Q4 + param.S4e, 0)
					.addSegStrokeR(0, -param.P41)
					.addSegStrokeR(-notch7W, 0)
					.addSegStrokeR(0, param.P41);
			}
			rCtr.addSegStrokeR(-l4q4 + param.S4e / 2, 0)
				.addSegStrokeRP(-pi2 + RaNorth, l4y1 - l4y2)
				.addSegStrokeRP(pi + RaNorth, W62 - topXmid)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlank4Nplaced(ix: number, iy: number): tContour {
			const rCtr = ctrPlank4N(ix - RdNorth, iy).rotate(ix, iy, -RaNorth);
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
		function ctrPlank5b(ix: number, iy: number): tContour {
			//const l8h = Math.max(pl5Nl2 + Math.abs(pl5yM), pl5Nl + pl5Ny);
			const l8h = pl5Nl + pl5Ny;
			const lx1 = l8h + lp5p6 - param.dtQ - param.dtY - pldtP2 - pldtPe2;
			const lx2 = l8h - lx1 - pldtP3;
			const rCtr = contour(ix, iy + param.W5bs)
				.addSegStrokeR(l5l, 0)
				.addSegStrokeR(0, -param.W5bs)
				//.addSegStrokeR(l8h, 0)
				.addSegStrokeR(lx1, 0)
				.addSegStrokeR(0, param.dtP)
				.addSegStrokeR(pldtP3, 0)
				.addSegStrokeR(0, -param.dtP)
				.addSegStrokeR(lx2, 0)
				.addSegStrokeR(0, l5W)
				//.addSegStrokeR(-l8h, 0)
				.addSegStrokeR(-lx2, 0)
				.addSegStrokeR(0, -param.dtP)
				.addSegStrokeR(-pldtP3, 0)
				.addSegStrokeR(0, param.dtP)
				.addSegStrokeR(-lx1, 0)
				.addSegStrokeR(0, -param.W5bs)
				.addSegStrokeR(-l5l, 0)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlank5bPlaced(ix: number, iy: number): tContour {
			const rCtr = ctrPlank5b(ix - l5l, iy - l5W / 2).rotate(ix, iy, pi2);
			return rCtr;
		}
		function ctrPlank6b(ix: number, iy: number): tContour {
			const rCtr = contour(ix, iy)
				.addSegStrokeR(param.dtF - pl6Qe2, 0)
				.addSegStrokeR(0, param.dtQ)
				.addSegStrokeR(pl6Q1, 0);
			for (let ii = 0; ii < param.Nb1 - 1; ii++) {
				rCtr.addSegStrokeR(0, -param.dtQ)
					.addSegStrokeR(pl6Q2, 0)
					.addSegStrokeR(0, param.dtQ)
					.addSegStrokeR(pl6Q3, 0)
					.addSegStrokeR(0, -param.dtQ)
					.addSegStrokeR(pl6Q4, 0)
					.addSegStrokeR(0, param.dtQ)
					.addSegStrokeR(pl6Q3, 0)
					.addSegStrokeR(0, -param.dtQ)
					.addSegStrokeR(pl6Q2, 0)
					.addSegStrokeR(0, param.dtQ)
					.addSegStrokeR(pl6Q1, 0);
			}
			rCtr.addSegStrokeR(0, -param.dtQ)
				.addSegStrokeR(param.dtF - pl6Qe2, 0)
				.addSegStrokeR(0, pl6bH)
				.addSegStrokeR(-pl6bL, 0)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlank6c(ix: number, iy: number): tContour {
			const ctrPeak = contour(ix, iy)
				.addSegStrokeR(param.W6, 0)
				.addSegStrokeR(0, param.dtQ - topYmid - pl6Ny)
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
		function ctrPlankDiagTop(ix: number, iy: number, ik: number): tContour {
			const pdtx2 = Math.sqrt((param.dtY + pldtP2) ** 2 + (param.dtX + pl6Q22) ** 2);
			const pdtx3 = Math.sqrt(param.dtX ** 2 + param.dtY ** 2);
			const pdty1 = ik === 1 ? 0 : param.dtW;
			const pdty2 = param.dtP * Math.cos(pl6da);
			const rCtr = contour(ix, iy + pdty1 + ik * pdty2)
				.addSegStrokeRP(ik * (-pi2 + pl6da), param.dtP)
				.addSegStrokeR(pdtx2, 0)
				.addSegStrokeRP(ik * pl6da, param.dtQ)
				.addSegStrokeRP(ik * (pi2 + pl6da), pl6Q23)
				.addSegStrokeRP(ik * (pi + pl6da), param.dtQ)
				.addSegStrokeRP(ik * (pi2 + pl6da), pl6Q21)
				.addSegStrokeR(-pdtx3, 0)
				.addSegStrokeRP(ik * (pi + pl6da), pldtP1)
				.addSegStrokeRP(ik * (pi2 + pl6da), param.dtP)
				//.addSegStrokeRP(ik * (pi + pl6da), pldtP3)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlankDiagTopPlaced(ix: number, iy: number, ia: number, ik: number): tContour {
			const pdtx4 = pldtP2 * Math.cos(pl6da) + param.dtP * Math.sin(pl6da);
			const aa0 = pi2 - ik * ia;
			const pdty4 = ik === 1 ? param.dtW : 0;
			const rCtr = ctrPlankDiagTop(ix - pdtx4, iy - pdty4, ik).rotate(ix, iy, aa0);
			return rCtr;
		}
		function ctrPlankDiagA(ix: number, iy: number, ik: number): tContour {
			const pdty1 = ik === 1 ? 0 : param.daW;
			const pdtx2 = param.daE + param.H3 / (2 * Math.cos(pldaA));
			const pdtx3 = (param.daW / 2) * Math.tan(pldaA);
			const pdtx4 = Math.sqrt(param.daX ** 2 + param.daY ** 2);
			const pdtx5 = pdtx2 + pdtx3 + pdtx4;
			const pdtx6 = param.daW / Math.tan(pldaA);
			const pdtx7 = pdtx5 + pdtx6;
			const rCtr = contour(ix, iy + pdty1)
				.addSegStrokeR(pdtx5, 0)
				.addSegStrokeRP(ik * pldaA, pldaP1)
				.addSegStrokeRP(ik * (pldaA - pi2), param.daP)
				.addSegStrokeRP(ik * pldaA, pldaP3)
				.addSegStrokeRP(ik * (pldaA + pi2), param.daP)
				.addSegStrokeR(-pdtx7, 0)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlankDiagAplaced(ix: number, iy: number, ia: number, ik: number): tContour {
			const aa0 = -pi2 - ik * ia;
			const rCtr = ctrPlankDiagA(ix - param.daE, iy - param.daW / 2, ik).rotate(ix, iy, aa0);
			return rCtr;
		}
		function ctrPlankDiagB(ix: number, iy: number, ik: number): tContour {
			const pdty1 = ik === 1 ? 0 : param.dbW;
			const pdtx2 = param.dbE + param.H2 / (2 * Math.cos(pldbA));
			const pdtx3 = (param.dbW / 2) * Math.tan(pldbA);
			const pdtx4 = Math.sqrt(param.dbX ** 2 + param.dbY ** 2);
			const pdtx5 = pdtx2 + pdtx3 + pdtx4;
			const pdtx6 = param.dbW / Math.tan(pldbA);
			const pdtx7 = pdtx5 + pdtx6;
			const rCtr = contour(ix, iy + pdty1)
				.addSegStrokeR(pdtx5, 0)
				.addSegStrokeRP(ik * pldbA, pldbP1)
				.addSegStrokeRP(ik * (pldbA - pi2), param.dbP)
				.addSegStrokeRP(ik * pldbA, pldbP3)
				.addSegStrokeRP(ik * (pldbA + pi2), param.dbP)
				.addSegStrokeR(-pdtx7, 0)
				.closeSegStroke();
			return rCtr;
		}
		function ctrPlankDiagBplaced(ix: number, iy: number, ia: number, ik: number): tContour {
			const aa0 = -pi2 - ik * ia;
			const rCtr = ctrPlankDiagB(ix - param.dbE, iy - param.dbW / 2, ik).rotate(ix, iy, aa0);
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
			const westLoHiPre = param.bSplit === 1 ? ii % 2 : 0;
			const westLoHi = ii === 0 ? 2 : westLoHiPre;
			const eastLoHiPre = param.bSplit === 1 ? 1 - (ii % 2) : 0;
			const eastLoHi = ii === param.Nb1 - 1 ? 2 : eastLoHiPre;
			const ctrSouth: tOuterInner = [ctrPlank1bPlaced(ix, 0, westLoHi, eastLoHi, 1)];
			if (R2 > 0) {
				ctrSouth.push(contourCircle(ix + W1a2, D2H, R2));
				if (param.bSplit === 1) {
					ctrSouth.push(contourCircle(ix + W1a2, D2H + param.H2, R2));
				}
			}
			figSouth.addMainOI(ctrSouth);
			figSouth.addSecond(ctrRectangle(ix - W3U1, H1H2 + H2c, param.W3, param.H3));
			figSouth.addSecond(ctrRectangle(ix + W1bU1, H1H2 + H2c, param.W3, param.H3));
			figSouth.addSecond(ctrPlank5bPlaced(ix + W1b2, ptPl5y0));
		}
		if (param.bSplit === 1) {
			for (let ii = 0; ii < param.Nb1 - 1; ii++) {
				const H2alt = ii % 2 === 0 ? param.H2 : 0;
				figSouth.addSecond(ctrPlank2Slot(-W3U1 + ii * stepX, param.H1 + H2alt));
			}
		} else {
			figSouth.addSecond(ctrPlank2EE(-W3U1, param.H1));
		}
		figSouth.addSecond(ctrPlank6b(param.U1 - param.dtF, ptPl6y0 - param.dtQ));
		for (let ii = 0; ii < param.Nb1 - 1; ii++) {
			const ix = ii * stepX + W1b2 + l5W / 2;
			const yy0 = ptPl6y0 - param.dtQ - param.dtY;
			figSouth.addSecond(ctrPlankDiagTopPlaced(ix, yy0, pl6da, 1));
		}
		for (let ii = 1; ii < param.Nb1; ii++) {
			const ix = ii * stepX + W1b2 - l5W / 2;
			const yy0 = ptPl6y0 - param.dtQ - param.dtY;
			figSouth.addSecond(ctrPlankDiagTopPlaced(ix, yy0, pl6da, -1));
		}
		for (let ii = 0; ii < param.Nb1 - 1; ii++) {
			const ix = ii * stepX + param.W1b + pldbX;
			const yy1 = ii % 2 === 0 && param.bSplit === 1 ? param.H2 : 0;
			const yy2 = param.H1 + H22 + yy1;
			figSouth.addSecond(ctrPlankDiagBplaced(ix, yy2, pldbA, 1));
			figSouth.addSecond(contourCircle(ix, yy2, dbR));
		}
		for (let ii = 1; ii < param.Nb1; ii++) {
			const ix = ii * stepX - pldbX;
			const yy1 = ii % 2 === 1 && param.bSplit === 1 ? param.H2 : 0;
			const yy2 = param.H1 + H22 + yy1;
			figSouth.addSecond(ctrPlankDiagBplaced(ix, yy2, pldbA, -1));
			figSouth.addSecond(contourCircle(ix, yy2, dbR));
		}
		// figEast
		for (const [idx, ix] of aPos.entries()) {
			let p1234 = idx + 1 === Na ? 4 : 1 + idx;
			if (Na === 3 && param.SecondPoleNorth === 1 && idx === 1) {
				p1234 = 3;
			}
			const ctrEast: tOuterInner = [ctrPlank1aPlaced(ix, 0, p1234)];
			if (R3 > 0) {
				ctrEast.push(contourCircle(ix + W1a2, D3H, R3));
				if ((idx === 1 || idx === 2) && param.aSplit === 1) {
					ctrEast.push(contourCircle(ix + W1a2, D3H + H3c, R3));
				}
			}
			figEast.addMainOI(ctrEast);
			figEast.addSecond(ctrRectangle(ix - W2V1, param.H1, param.W2, param.H2));
			figEast.addSecond(ctrRectangle(ix + W1aV1, param.H1, param.W2, param.H2));
			if (param.bSplit === 1) {
				figEast.addSecond(ctrRectangle(ix - W2V1, H1H2, param.W2, param.H2));
				figEast.addSecond(ctrRectangle(ix + W1aV1, H1H2, param.W2, param.H2));
			}
		}
		if (param.aSplit === 1) {
			figEast.addSecond(ctrPlank3S(pl3Sx0, H1H2 + H2c));
			figEast.addSecond(ctrPlank3M(pl3Mx0, H123 + H2c));
			figEast.addSecond(ctrPlank3N(pl3Nx0, H1H2 + H2c));
		} else {
			figEast.addSecond(ctrPlank3EE(pl3Sx0, H1H2 + H2c));
		}
		for (const [idx, ix] of aPos.entries()) {
			const H1H2c = H1H2 + H2c + H32;
			const H3ac = param.aSplit === 1 ? param.H3 : 0;
			if (idx < Na - 1) {
				const H1H2cc = idx === 1 ? H1H2c + H3ac : H1H2c;
				figEast.addSecond(ctrPlankDiagAplaced(ix + param.W1a + pldaX, H1H2cc, pldaA, 1));
				figEast.addSecond(contourCircle(ix + param.W1a + pldaX, H1H2cc, daR));
			}
			if (idx > 0) {
				const H1H2cc = idx === 2 ? H1H2c + H3ac : H1H2c;
				figEast.addSecond(ctrPlankDiagAplaced(ix - pldaX, H1H2cc, pldaA, -1));
				figEast.addSecond(contourCircle(ix - pldaX, H1H2cc, daR));
			}
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
		//figEast.addSecond(
		//	ctrRectangle(0, 0, RdSouth1, 2 * W42)
		//		.rotate(0, 0, Ra)
		//		.translate(p0Sx + p1Sx, p0Sy + p1Sy)
		//);
		//figEast.addSecond(
		//	ctrRectangle(0, 0, param.ReS, 2 * W42)
		//		.rotate(0, 0, Ra + pi)
		//		.translate(p0Sx - p1Sx, p0Sy - p1Sy)
		//);
		figEast.addSecond(ctrPlank4Splaced(p0Sx + p1Sx + p4Sx, p0Sy + p1Sy + p4Sy));
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
		//figEast.addSecond(
		//	ctrRectangle(0, -2 * W42, RdNorth1, 2 * W42)
		//		.rotate(0, 0, pi - RaNorth)
		//		.translate(p0Nx + p1Nx, p0Ny + p1Ny)
		//);
		//figEast.addSecond(
		//	ctrRectangle(0, 0, param.ReN, 2 * W42)
		//		.rotate(0, 0, -RaNorth)
		//		.translate(p0Nx + p1Nx, p0Ny + p1Ny)
		//);
		figEast.addSecond(ctrPlank4Nplaced(p0Nx + p1Nx + p4Nx, p0Ny + p1Ny + p4Ny));
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
		figEast.addSecond(ctrPlank6c(ptPl6x0, ptPl6y0 - param.dtQ));
		figEast.addSecond(ctrRectangle(ptPl6x0, ptPl6y0 - param.dtQ, param.W6, param.dtQ));
		for (let ii = 0; ii < n7S; ii++) {
			const ll = param.Q4Init + ii * step7;
			const ipt = point(p0Sx + p3Sx, p0Sy + p3Sy).translatePolar(Ra, ll);
			const iCtr = ctrRectangle(0, 0, param.S4, param.H7).rotate(0, 0, Ra);
			figEast.addSecond(iCtr.translate(ipt.cx, ipt.cy));
		}
		for (let ii = 0; ii < n7N; ii++) {
			const aa = pi - RaNorth;
			const ll = param.Q4Init + ii * step7;
			const ipt = point(p0Nx + p3Nx, p0Ny + p3Ny).translatePolar(aa, ll);
			const iCtr = ctrRectangle(0, -param.H7, param.S4, param.H7).rotate(0, 0, aa);
			figEast.addSecond(iCtr.translate(ipt.cx, ipt.cy));
		}
		figEast.addSecond(ctrPlank8Splaced(ptPl5x00, ptPl5y0, Ra - pi2));
		figEast.addSecond(ctrPlank8Nplaced(ptPl5x00 + 2 * W52, ptPl5y0, pi2 - RaNorth));
		// figPlank1a
		const ctrPl1a: tOuterInner = [ctrPlank1a(0, 0, d3P1P1234)];
		if (R3 > 0) {
			ctrPl1a.push(contourCircle(H12c + param.H3 / 2, W1a2, R3));
			if (param.aSplit === 1 && d3P1P23) {
				ctrPl1a.push(contourCircle(H123c + param.H3s / 2, W1a2, R3));
			}
		}
		figPlank1a.addMainOI(ctrPl1a);
		if (R2 > 0) {
			const D2H2 = D2H + param.H2;
			figPlank1a.addSecond(ctrRectangle(D2H - R2, -W2V1, 2 * R2, W1a2V1 + 2 * param.W2));
			if (param.bSplit === 1) {
				figPlank1a.addSecond(ctrRectangle(D2H2 - R2, -W2V1, 2 * R2, W1a2V1 + 2 * param.W2));
			}
		}
		figPlank1a.addSecond(ctrRectangle(param.H1, -W2V1, param.H2, param.W2));
		figPlank1a.addSecond(ctrRectangle(param.H1, W1aV1, param.H2, param.W2));
		if (param.bSplit === 1) {
			figPlank1a.addSecond(ctrRectangle(H1H2, -W2V1, param.H2, param.W2));
			figPlank1a.addSecond(ctrRectangle(H1H2, W1aV1, param.H2, param.W2));
		}
		// figPlank1b
		const ctrPl1b: tOuterInner = [
			ctrPlank1b(0, 0, param.d3Plank1West, param.d3Plank1East, d3P1P1234)
		];
		if (R2 > 0) {
			ctrPl1b.push(contourCircle(D2H, W1b2, R2));
			if (param.bSplit === 1) {
				ctrPl1b.push(contourCircle(D2H + param.H2, W1b2, R2));
			}
		}
		figPlank1b.addMainOI(ctrPl1b);
		if (R3 > 0) {
			figPlank1b.addSecond(ctrRectangle(D3H - R3, -W3U1, 2 * R3, W1b2U1 + 2 * param.W3));
		}
		figPlank1b.addSecond(ctrRectangle(H12c, -W3U1, param.H3, param.W3));
		figPlank1b.addSecond(ctrRectangle(H12c, W1bU1, param.H3, param.W3));
		// figPlank2EE
		const ctrPl2EE: tOuterInner = [ctrPlank2EE(0, 0)];
		if (R2 > 0) {
			for (let ii = 0; ii < param.Nb1; ii++) {
				const ix = W1b2 + W3U1 + ii * stepX;
				ctrPl2EE.push(contourCircle(ix, H22, R2));
			}
		}
		if (dbR > 0) {
			for (let ii = 0; ii < param.Nb1 - 1; ii++) {
				const ix = ii * stepX + W3U1 + param.W1b + pldbX;
				ctrPl2EE.push(contourCircle(ix, H22, dbR));
			}
			for (let ii = 1; ii < param.Nb1; ii++) {
				const ix = W3U1 + ii * stepX - pldbX;
				ctrPl2EE.push(contourCircle(ix, H22, dbR));
			}
		}
		figPlank2EE.addMainOI(ctrPl2EE);
		// figPlank2Slot
		figPlank2Slot.addMainO(ctrPlank2Slot(0, 0));
		const ctrPl2Slot: tOuterInner = [ctrPlank2Slot(0, 0)];
		if (R2 > 0) {
			for (let ii = 0; ii < 2; ii++) {
				const ix = W1b2 + W3U1 + ii * stepX;
				ctrPl2Slot.push(contourCircle(ix, H22, R2));
			}
		}
		if (dbR > 0) {
			ctrPl2Slot.push(contourCircle(W3U1 + param.W1b + pldbX, H22, dbR));
			ctrPl2Slot.push(contourCircle(W3U1 + stepX - pldbX, H22, dbR));
		}
		figPlank2Slot.addMainOI(ctrPl2Slot);
		// figPlank2Short
		const ctrPl2Short: tOuterInner = [ctrPlank2Short(0, 0)];
		if (R2 > 0) {
			ctrPl2Short.push(contourCircle(W1b2 + W3U1, H22, R2));
		}
		figPlank2Short.addMainOI(ctrPl2Short);
		// figPlank3EE
		const ctrPl3EE: tOuterInner = [ctrPlank3EE(0, 0)];
		if (R3 > 0) {
			let ix = param.JaSouth + W1a2;
			ctrPl3EE.push(contourCircle(ix, H32, R3));
			ix += pl3S1;
			if (pl3S1 > 0) {
				ctrPl3EE.push(contourCircle(ix, H32, R3));
			}
			ix += param.La + param.W1a;
			ctrPl3EE.push(contourCircle(ix, H32, R3));
			ix += pl3N1;
			if (pl3N1 > 0) {
				ctrPl3EE.push(contourCircle(ix, H32, R3));
			}
		}
		if (R4 > 0) {
			ctrPl3EE.push(contourCircle(H32, H32, R4));
			ctrPl3EE.push(contourCircle(pl3La - H32, H32, R4));
		}
		if (R5 > 0) {
			const tx = param.JaSouth + param.W1a + laSouth;
			ctrPl3EE.push(contourCircle(tx, param.H3arc + H32, R5));
		}
		if (daR > 0) {
			for (const [idx, ix] of aPos.entries()) {
				const iix = param.JaSouth + ix;
				if (idx < Na - 1) {
					ctrPl3EE.push(contourCircle(iix + param.W1a + pldaX, H32, daR));
				}
				if (idx > 0) {
					ctrPl3EE.push(contourCircle(iix - pldaX, H32, daR));
				}
			}
		}
		figPlank3EE.addMainOI(ctrPl3EE);
		// figPlank3S
		const ctrPl3S: tOuterInner = [ctrPlank3S(0, 0)];
		if (R3 > 0) {
			let ix = param.JaSouth + W1a2;
			ctrPl3S.push(contourCircle(ix, H32, R3));
			ix += param.KaSouth + param.W1a;
			ctrPl3S.push(contourCircle(ix, H32, R3));
		}
		if (R4 > 0) {
			ctrPl3S.push(contourCircle(H32, H32, R4));
		}
		if (daR > 0) {
			const xx0 = param.JaSouth + param.W1a;
			ctrPl3S.push(contourCircle(xx0 + pldaX, H32, daR));
			ctrPl3S.push(contourCircle(xx0 + param.KaSouth - pldaX, H32, daR));
		}
		figPlank3S.addMainOI(ctrPl3S);
		// figPlank3M
		const ctrPl3M: tOuterInner = [ctrPlank3M(0, 0)];
		if (R3 > 0) {
			let ix = W1a2 + W2V1;
			ctrPl3M.push(contourCircle(ix, H32, R3));
			ix += param.La + param.W1a;
			ctrPl3M.push(contourCircle(ix, H32, R3));
		}
		if (R5 > 0) {
			const tx = param.W2 + W1aV1 + laSouth - pl3S1;
			ctrPl3M.push(contourCircle(tx, param.H3arc + H32, R5));
		}
		if (daR > 0) {
			const xx0 = W2V1 + param.W1a;
			ctrPl3M.push(contourCircle(xx0 + pldaX, H32, daR));
			ctrPl3M.push(contourCircle(xx0 + param.La - pldaX, H32, daR));
		}
		figPlank3M.addMainOI(ctrPl3M);
		// figPlank3N
		const ctrPl3N: tOuterInner = [ctrPlank3N(0, 0)];
		if (R3 > 0) {
			let ix = W1a2 + W2V1;
			ctrPl3N.push(contourCircle(ix, H32, R3));
			ix += param.KaNorth + param.W1a;
			ctrPl3N.push(contourCircle(ix, H32, R3));
		}
		if (R4 > 0) {
			ctrPl3N.push(contourCircle(pl3N - H32, H32, R4));
		}
		if (daR > 0) {
			const xx0 = W2V1 + param.W1a;
			ctrPl3N.push(contourCircle(xx0 + pldaX, H32, daR));
			ctrPl3N.push(contourCircle(xx0 + param.KaNorth - pldaX, H32, daR));
		}
		figPlank3N.addMainOI(ctrPl3N);
		// figPlank4S
		const ctrPl4S: tOuterInner = [ctrPlank4S(0, 0)];
		if (R4 > 0) {
			ctrPl4S.push(contourCircle(param.ReS, W42, R4));
			const tx = (H32 + R4) / Math.sin(Ra);
			ctrPl4S.push(contourCircle(param.ReS + tx, W42, R4));
		}
		figPlank4S.addMainOI(ctrPl4S);
		// figPlank4N
		const ctrPl4N: tOuterInner = [ctrPlank4N(0, 0)];
		if (R4 > 0) {
			ctrPl4N.push(contourCircle(RdNorth1, W42, R4));
			const tx = (H32 + R4) / Math.sin(RaNorth);
			ctrPl4N.push(contourCircle(RdNorth1 - tx, W42, R4));
		}
		figPlank4N.addMainOI(ctrPl4N);
		// figPlank5a
		const ctrPl5a: tOuterInner = [ctrPlank5a(0, 0)];
		if (R5 > 0) {
			const ix = l5l - (param.aSplit === 1 ? param.H3s : param.H3) / 2;
			ctrPl5a.push(contourCircle(ix, param.W5a / 2, R5));
			ctrPl5a.push(contourCircle(l5l + R5, param.W5a / 2, R5));
		}
		figPlank5a.addMainOI(ctrPl5a);
		// figPlank5b
		figPlank5b.addMainO(ctrPlank5b(0, 0));
		// figPlank6b
		figPlank6b.addMainO(ctrPlank6b(0, 0));
		// figPlank6c
		figPlank6c.addMainO(ctrPlank6c(0, 0));
		figPlank6c.addSecond(ctrRectangle(0, 0, param.W6, param.dtQ));
		// figPlank7c
		// figPlank8S
		figPlank8S.addMainO(ctrPlank8S(0, 0));
		// figPlank8N
		figPlank8N.addMainO(ctrPlank8N(0, 0));
		// figPlankDiagTop
		figPlankDiagTop.addMainO(ctrPlankDiagTop(0, 0, 1));
		// figPlankDiagA
		figPlankDiagA.addMainOI([
			ctrPlankDiagA(0, 0, 1),
			contourCircle(param.daE, param.daW / 2, daR)
		]);
		// figPlankDiagB
		figPlankDiagB.addMainOI([
			ctrPlankDiagB(0, 0, 1),
			contourCircle(param.dbE, param.dbW / 2, dbR)
		]);
		// final figure list
		rGeome.fig = {
			faceEast: figEast,
			faceBase: figBase,
			faceSouth: figSouth,
			facePlank1a: figPlank1a,
			facePlank1b: figPlank1b,
			facePlank2EE: figPlank2EE,
			facePlank2Slot: figPlank2Slot,
			facePlank2Short: figPlank2Short,
			facePlank3EE: figPlank3EE,
			facePlank3S: figPlank3S,
			facePlank3M: figPlank3M,
			facePlank3N: figPlank3N,
			facePlank4S: figPlank4S,
			facePlank4N: figPlank4N,
			facePlank5a: figPlank5a,
			facePlank5b: figPlank5b,
			facePlank6b: figPlank6b,
			facePlank6c: figPlank6c,
			facePlank7c: figPlank7c,
			facePlank8S: figPlank8S,
			facePlank8N: figPlank8N,
			facePlankDiagTop: figPlankDiagTop,
			facePlankDiagA: figPlankDiagA,
			facePlankDiagB: figPlankDiagB
		};
		// volume
		const designName = rGeome.partName;
		const exportList: string[] = [];
		if (param.d3Plank1) {
			exportList.push(`pax_${designName}_pl1`);
		}
		if (param.d3Plank2EE) {
			exportList.push(`subpax_${designName}_pl2ee`);
		}
		if (param.d3Plank2Slot) {
			exportList.push(`subpax_${designName}_pl2slot`);
		}
		if (param.d3Plank2short) {
			exportList.push(`subpax_${designName}_pl2short`);
		}
		if (param.d3Plank3EE) {
			exportList.push(`subpax_${designName}_pl3ee`);
		}
		if (param.d3Plank3S) {
			exportList.push(`subpax_${designName}_pl3s`);
		}
		if (param.d3Plank3M) {
			exportList.push(`subpax_${designName}_pl3m`);
		}
		if (param.d3Plank3N) {
			exportList.push(`subpax_${designName}_pl3n`);
		}
		if (param.d3Plank4S) {
			exportList.push(`subpax_${designName}_pl4s`);
		}
		if (param.d3Plank4N) {
			exportList.push(`subpax_${designName}_pl4n`);
		}
		if (param.d3Plank5) {
			exportList.push(`pax_${designName}_pl5`);
		}
		if (param.d3Plank6) {
			exportList.push(`pax_${designName}_pl6`);
		}
		if (param.d3Plank7) {
			exportList.push(`subpax_${designName}_pl7`);
		}
		if (param.d3Plank8S) {
			exportList.push(`subpax_${designName}_pl8s`);
		}
		if (param.d3Plank8N) {
			exportList.push(`subpax_${designName}_pl8n`);
		}
		if (param.d3PlankDiagTop) {
			exportList.push(`subpax_${designName}_pldt`);
		}
		if (param.d3PlankDiagA) {
			exportList.push(`subpax_${designName}_plda`);
		}
		if (param.d3PlankDiagB) {
			exportList.push(`subpax_${designName}_pldb`);
		}
		if (param.d3Assembly) {
			exportList.push(`pax_${designName}_assembly`);
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
					translate: [0, param.W1a, 0]
				},
				{
					outName: `subpax_${designName}_pl2ee`,
					face: `${designName}_facePlank2EE`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W2,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl2slot`,
					face: `${designName}_facePlank2Slot`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W2,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl2short`,
					face: `${designName}_facePlank2Short`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W2,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl3ee`,
					face: `${designName}_facePlank3EE`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W3,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl3s`,
					face: `${designName}_facePlank3S`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W3,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl3m`,
					face: `${designName}_facePlank3M`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W3,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl3n`,
					face: `${designName}_facePlank3N`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W3,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl4s`,
					face: `${designName}_facePlank4S`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: pl4W,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl4n`,
					face: `${designName}_facePlank4N`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: pl4W,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl5a`,
					face: `${designName}_facePlank5a`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: pl5aW,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl5b`,
					face: `${designName}_facePlank5b`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: pl5bW,
					rotate: [pi2, 0, 0],
					translate: [0, pl5bW, 0]
				},
				{
					outName: `subpax_${designName}_pl6b`,
					face: `${designName}_facePlank6b`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W6,
					rotate: [pi2, 0, 0],
					translate: [0, param.W6, 0]
				},
				{
					outName: `subpax_${designName}_pl6c`,
					face: `${designName}_facePlank6c`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: pl6bL,
					rotate: [pi2, 0, -pi2],
					translate: [pl6bL, param.W6, 0]
				},
				{
					outName: `subpax_${designName}_pl7`,
					face: `${designName}_facePlank7c`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: pl6bL,
					rotate: [pi2, 0, 0],
					translate: [0, pl6bL, 0]
				},
				{
					outName: `subpax_${designName}_pl8s`,
					face: `${designName}_facePlank8S`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: pl4W,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pl8n`,
					face: `${designName}_facePlank8N`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: pl4W,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pldt`,
					face: `${designName}_facePlankDiagTop`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W6,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_plda`,
					face: `${designName}_facePlankDiagA`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: W1b2U1,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_pldb`,
					face: `${designName}_facePlankDiagB`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: W1a2V1,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				}
			],
			volumes: [
				{
					outName: `pax_${designName}_pl1`,
					boolMethod: EBVolume.eIntersection,
					inList: [`subpax_${designName}_pl1a`, `subpax_${designName}_pl1b`]
				},
				{
					outName: `pax_${designName}_pl5`,
					boolMethod: EBVolume.eIntersection,
					inList: [`subpax_${designName}_pl5a`, `subpax_${designName}_pl5b`]
				},
				{
					outName: `pax_${designName}_pl6`,
					boolMethod: EBVolume.eIntersection,
					inList: [`subpax_${designName}_pl6b`, `subpax_${designName}_pl6c`]
				},
				{
					outName: `pax_${designName}_assembly`,
					boolMethod: EBVolume.eUnion,
					inList: [`pax_${designName}_pl1`, `pax_${designName}_pl6`]
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
