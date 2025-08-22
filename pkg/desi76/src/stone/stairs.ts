// stairs.ts
// an helicoidal stairs

import type {
	Point,
	tContour,
	//tOuterInner,
	tFigures,
	tParamDef,
	tParamVal,
	tGeom,
	tPageDef,
	tExtrude
	//tVolume
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
	//degToRad,
	radToDeg,
	ffix,
	pNumber,
	//pCheckbox,
	pDropdown,
	pSectionSeparator,
	EExtrude,
	EBVolume,
	initGeom
} from 'geometrix';
//import { triLALrL, triALLrL, triLLLrA } from 'triangule';
//import { triALLrLAA } from 'triangule';

const pDef: tParamDef = {
	partName: 'stairs',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('Nn', 'stair', 25, 1, 200, 1),
		pNumber('Nd', 'stair', 20, 2, 200, 1),
		pNumber('D1', 'mm', 5000, 1000, 50000, 1),
		pNumber('Wi1', 'mm', 1000, 1, 10000, 1),
		pNumber('We1', 'mm', 1000, 1, 10000, 1),
		pNumber('Wi2', 'mm', 2000, 1, 10000, 1),
		pNumber('We2', 'mm', 2000, 1, 10000, 1),
		pSectionSeparator('Details'),
		pDropdown('spiral', ['ExtInt', 'Exterior', 'Interior']),
		pDropdown('border', ['arc', 'straight']),
		pNumber('H1', 'mm', 200, 10, 2000, 1),
		pNumber('Wc', 'mm', 200, 10, 2000, 1),
		pNumber('Nc', 'column', 6, 1, 100, 1)
	],
	paramSvg: {
		Nn: 'stairs_top.svg',
		Nd: 'stairs_top.svg',
		D1: 'stairs_top.svg',
		Wi1: 'stairs_top.svg',
		We1: 'stairs_top.svg',
		Wi2: 'stairs_top.svg',
		We2: 'stairs_top.svg',
		spiral: 'stairs_top.svg',
		border: 'stairs_top.svg',
		H1: 'stairs_height.svg',
		Wc: 'stairs_top.svg',
		Nc: 'stairs_height.svg'
	},
	sim: {
		tMax: 180,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

function pGeom(t: number, param: tParamVal, suffix = ''): tGeom {
	const rGeome = initGeom(pDef.partName + suffix);
	const figTop = figure();
	const figTopColumn = figure();
	const figBorderI = figure();
	const figBorderE = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const pi = Math.PI;
		const pi2 = pi / 2;
		const R1 = param.D1 / 2;
		const Wid = (param.Wi2 - param.Wi1) / param.Nn;
		const Wed = (param.We2 - param.We1) / param.Nn;
		const aStair2 = pi / param.Nd;
		const Rid = Wid / (2 * Math.sin(aStair2));
		const Red = Wed / (2 * Math.sin(aStair2));
		const p0 = point(0, 0);
		const a0 = pi2 + aStair2;
		const columnNb = Math.floor(param.Nn / param.Nc);
		// step-5 : checks on the parameter values
		if (param.Wi2 < param.Wi1) {
			throw `err092: Wi2 ${param.Wi2} is too small compare to Wi1 ${param.Wi1}`;
		}
		if (param.We2 < param.We1) {
			throw `err095: We2 ${param.We2} is too small compare to We1 ${param.We1}`;
		}
		if (R1 < param.Wi2) {
			throw `err098: D1 ${param.D1} is too small compare to Wi2 ${param.Wi2}`;
		}
		if (param.Wi1 < param.Wc) {
			throw `err110: Wi1 ${param.Wi1} is too small compare to Wc ${param.Wc}`;
		}
		if (param.We1 < param.Wc) {
			throw `err113: We1 ${param.We1} is too small compare to Wc ${param.Wc}`;
		}
		// step-6 : any logs
		rGeome.logstr += `Stair angle ${ffix(radToDeg(2 * aStair2))} degree\n`;
		rGeome.logstr += `Stairs angle ${ffix(param.Nn / param.Nd)} turn with ${columnNb} columns\n`;
		// sub-function
		function spiral(
			ir0: number,
			irr: number,
			ird: number,
			iwc: number,
			idx: number,
			iSign: number
		): [Point, Point, Point] {
			const ab = idx * 2 * aStair2;
			const cPi = iSign < 0 ? pi : 0;
			const aa = ab + a0 + cPi;
			const rr = ir0 + iSign * (idx * irr - iwc);
			const pc = point(ird, 0).rotate(p0, aa);
			const rp1 = pc.translatePolar(ab, rr);
			const rp2 = pc.translatePolar(ab + aStair2, rr);
			const rp3 = pc.translatePolar(ab + 2 * aStair2, rr);
			return [rp1, rp2, rp3];
		}
		function ctrStair(
			pi1: Point,
			pi2: Point,
			pi3: Point,
			pe1: Point,
			pe2: Point,
			pe3: Point
		): tContour {
			const rCtr = contour(pe1.cx, pe1.cy);
			if (param.border === 0) {
				rCtr.addPointA(pe2.cx, pe2.cy).addPointA(pe3.cx, pe3.cy).addSegArc2();
			} else {
				rCtr.addSegStrokeA(pe3.cx, pe3.cy);
			}
			rCtr.addSegStrokeA(pi3.cx, pi3.cy);
			if (param.border === 0) {
				rCtr.addPointA(pi2.cx, pi2.cy).addPointA(pi1.cx, pi1.cy).addSegArc2();
			} else {
				rCtr.addSegStrokeA(pi1.cx, pi1.cy);
			}
			rCtr.closeSegStroke();
			return rCtr;
		}
		// figTop
		const ctrCircleRef = contourCircle(0, 0, R1);
		const ctrCircleSpiralI = contourCircle(0, 0, Rid);
		const ctrCircleSpiralE = contourCircle(0, 0, Red);
		figTop.addSecond(ctrCircleRef);
		figTop.addSecond(ctrCircleSpiralI);
		figTop.addSecond(ctrCircleSpiralE);
		const ctrListStair: tContour[] = [];
		for (let ii = 0; ii < param.Nn; ii++) {
			const wEI = ii * (Wed + Wid) + param.We1 + param.Wi1;
			let [pi1, pi2, pi3] = spiral(R1 - param.Wi1, Wid, Rid, 0, ii, -1);
			let [pe1, pe2, pe3] = spiral(R1 + param.We1, Wed, Red, 0, ii, 1);
			if (param.spiral === 1) {
				[pi1, pi2, pi3] = spiral(R1 + param.We1, Wed, Red, wEI, ii, 1);
			}
			if (param.spiral === 2) {
				[pe1, pe2, pe3] = spiral(R1 - param.Wi1, Wid, Rid, wEI, ii, -1);
			}
			const iCtr = ctrStair(pi1, pi2, pi3, pe1, pe2, pe3);
			ctrListStair.push(iCtr);
			figTop.addMainO(iCtr);
		}
		// figTopColumn
		figTopColumn.mergeFigure(figTop, true);
		const ctrListColumnI: tContour[] = [];
		const ctrListColumnE: tContour[] = [];
		for (let ii = 0; ii < columnNb; ii++) {
			const ii2 = (ii + 1) * param.Nc - 1;
			const wEI = ii2 * (Wed + Wid) + param.We1 + param.Wi1;
			let [pi1, pi2, pi3] = spiral(R1 - param.Wi1, Wid, Rid, 0, ii2, -1);
			let [pi4, pi5, pi6] = spiral(R1 - param.Wi1, Wid, Rid, param.Wc, ii2, -1);
			let [pe1, pe2, pe3] = spiral(R1 + param.We1, Wed, Red, 0, ii2, 1);
			let [pe4, pe5, pe6] = spiral(R1 + param.We1, Wed, Red, param.Wc, ii2, 1);
			if (param.spiral === 1) {
				[pe4, pe5, pe6] = spiral(R1 + param.We1, Wed, Red, param.Wc, ii2, 1);
				[pi1, pi2, pi3] = spiral(R1 + param.We1, Wed, Red, wEI, ii2, 1);
				[pi4, pi5, pi6] = spiral(R1 + param.We1, Wed, Red, wEI - param.Wc, ii2, 1);
			}
			if (param.spiral === 2) {
				[pi4, pi5, pi6] = spiral(R1 - param.Wi1, Wid, Rid, param.Wc, ii2, -1);
				[pe1, pe2, pe3] = spiral(R1 - param.Wi1, Wid, Rid, wEI, ii2, -1);
				[pe4, pe5, pe6] = spiral(R1 - param.Wi1, Wid, Rid, wEI - param.Wc, ii2, -1);
			}
			const iCtrColumnI = ctrStair(pi1, pi2, pi3, pi4, pi5, pi6);
			const iCtrColumnE = ctrStair(pe1, pe2, pe3, pe4, pe5, pe6);
			ctrListColumnI.push(iCtrColumnI);
			ctrListColumnE.push(iCtrColumnE);
			figTopColumn.addMainO(iCtrColumnI);
			figTopColumn.addMainO(iCtrColumnE);
			figTop.addSecond(iCtrColumnI);
			figTop.addSecond(iCtrColumnE);
		}
		// figBorderI
		const colHeight: number[] = [];
		let xx = 0;
		for (let ii = 0; ii < param.Nn; ii++) {
			const lStair = (R1 - param.Wi1 - ii * Wid) * 2 * aStair2;
			const yy = ii * param.H1;
			figBorderI.addMainO(ctrRectangle(xx, yy, lStair, param.H1));
			if ((ii + 1) % param.Nc === 0 && yy > 0) {
				figBorderI.addMainO(ctrRectangle(xx, 0, lStair, yy));
				colHeight.push(yy);
			}
			xx += lStair;
		}
		// figBorderE
		figBorderE.mergeFigure(figBorderI, true);
		xx = 0;
		for (let ii = 0; ii < param.Nn; ii++) {
			const lStair = (R1 + param.We1 - ii * Wed) * 2 * aStair2;
			const yy = ii * param.H1;
			figBorderE.addMainO(ctrRectangle(xx, yy, lStair, param.H1));
			if ((ii + 1) % param.Nc === 0 && yy > 0) {
				figBorderE.addMainO(ctrRectangle(xx, 0, lStair, yy));
			}
			xx += lStair;
		}
		// one figure per stair and colmun
		const figListStair: tFigures = {};
		const figListCol: tFigures = {};
		const listVol: tExtrude[] = [];
		const listVolName: string[] = [];
		const designName = rGeome.partName;
		for (const [idx, elem] of ctrListStair.entries()) {
			const iFig = figure();
			iFig.addMainO(elem);
			const iStr = `Stair${idx.toString().padStart(4, '0')}`;
			const iFace = `face${iStr}`;
			figListStair[iFace] = iFig;
			listVol.push({
				outName: `subpax_${designName}_${iStr}`,
				face: `${designName}_${iFace}`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H1,
				rotate: [0, 0, 0],
				translate: [0, 0, idx * param.H1]
			});
			listVolName.push(`subpax_${designName}_${iStr}`);
		}
		for (const [idx, elem] of ctrListColumnI.entries()) {
			const iFig = figure();
			iFig.addMainO(elem);
			iFig.addMainO(ctrListColumnE[idx]);
			const iStr = `Col${idx.toString().padStart(4, '0')}`;
			const iFace = `face${iStr}`;
			figListStair[iFace] = iFig;
			listVol.push({
				outName: `subpax_${designName}_${iStr}`,
				face: `${designName}_${iFace}`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: colHeight[idx],
				rotate: [0, 0, 0],
				translate: [0, 0, 0]
			});
			listVolName.push(`subpax_${designName}_${iStr}`);
		}
		// final figure list
		rGeome.fig = {
			faceTop: figTop,
			faceTopColumn: figTopColumn,
			faceBorderI: figBorderI,
			faceBorderE: figBorderE,
			...figListStair,
			...figListCol
		};
		// volume
		rGeome.vol = {
			extrudes: listVol,
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: listVolName
				}
			]
		};
		// sub-design
		rGeome.sub = {};
		// finalize
		rGeome.logstr += 'stairs drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

const stairsDef: tPageDef = {
	pTitle: 'stairs',
	pDescription: 'an helicoidal stairs',
	pDef: pDef,
	pGeom: pGeom
};

export { stairsDef };
