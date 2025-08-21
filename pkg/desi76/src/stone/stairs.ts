// stairs.ts
// an helicoidal stairs

import type {
	Point,
	//tContour,
	//tOuterInner,
	tParamDef,
	tParamVal,
	tGeom,
	tPageDef
	//tExtrude
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
	//ctrRectangle,
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
		pNumber('Nn', 'stair', 20, 1, 200, 1),
		pNumber('Nd', 'stair', 40, 2, 200, 1),
		pNumber('D1', 'mm', 5000, 1000, 50000, 1),
		pNumber('Wi1', 'mm', 1000, 1, 10000, 1),
		pNumber('We1', 'mm', 1000, 1, 10000, 1),
		pNumber('Wi2', 'mm', 2000, 1, 10000, 1),
		pNumber('We2', 'mm', 2000, 1, 10000, 1),
		pSectionSeparator('Details'),
		pDropdown('border', ['arc', 'straight']),
		pNumber('H1', 'mm', 20, 10, 500, 1),
		pNumber('Wc', 'mm', 20, 10, 500, 1),
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
		const Rid = Wid / Math.sin(aStair2);
		const Red = Wed / Math.sin(aStair2);
		const p0 = point(0, 0);
		const a0 = pi2 + aStair2;
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
		// step-6 : any logs
		rGeome.logstr += `Stair angle ${ffix(radToDeg(2 * aStair2))} degree\n`;
		rGeome.logstr += `Stairs angle ${ffix(param.Nn / param.Nd)} turn\n`;
		// sub-function
		function spiral(r0: number, wc: number, rd: number, idx: number): [Point, Point, Point] {
			const ab = idx * 2 * aStair2;
			const aa = ab + a0;
			const rr = r0 + idx * wc;
			const pc = point(rd, 0).rotate(p0, aa);
			const rp1 = pc.translatePolar(ab, rr);
			const rp2 = pc.translatePolar(ab + aStair2, rr);
			const rp3 = pc.translatePolar(ab + 2 * aStair2, rr);
			return [rp1, rp2, rp3];
		}
		// figTop
		const ctrCircleRef = contourCircle(0, 0, R1);
		const ctrCircleSpiralI = contourCircle(0, 0, Rid);
		const ctrCircleSpiralE = contourCircle(0, 0, Red);
		figTop.addSecond(ctrCircleRef);
		figTop.addSecond(ctrCircleSpiralI);
		figTop.addSecond(ctrCircleSpiralE);
		for (let ii = 0; ii < param.Nn; ii++) {
			const [pi1, pi2, pi3] = spiral(R1 - param.Wi1, -Wid, Rid, ii);
			const [pe1, pe2, pe3] = spiral(R1 + param.We1, Wed, Red, ii);
			const iCtr = contour(pe1.cx, pe1.cy);
			if (param.border === 0) {
				iCtr.addPointA(pe2.cx, pe2.cy).addPointA(pe3.cx, pe3.cy).addSegArc2();
			} else {
				iCtr.addSegStrokeA(pe3.cx, pe3.cy);
			}
			iCtr.addSegStrokeA(pi3.cx, pi3.cy);
			if (param.border === 0) {
				iCtr.addPointA(pi2.cx, pi2.cy).addPointA(pi1.cx, pi1.cy).addSegArc2();
			} else {
				iCtr.addSegStrokeA(pi1.cx, pi1.cy);
			}
			iCtr.closeSegStroke();
			figTop.addMainO(iCtr);
		}
		// figBorderI
		// figBorderE
		// final figure list
		rGeome.fig = {
			faceTop: figTop,
			faceBorderI: figBorderI,
			faceBorderE: figBorderE
		};
		// volume
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_top`,
					face: `${designName}_faceCylinder`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H1,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				}
			],
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: [`subpax_${designName}_top`]
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
