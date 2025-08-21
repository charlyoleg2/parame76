// stairs.ts
// an helicoidal stairs

import type {
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
	//point,
	//contour,
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
		pNumber('Nd', 'stair', 40, 1, 200, 1),
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
		//const pi2 = pi / 2;
		const R1 = param.D1 / 2;
		const Wic = (param.Wi2 - param.Wi1) / param.Nn;
		const Wec = (param.We2 - param.We1) / param.Nn;
		const aStair2 = pi / param.Nd;
		const Rid = Wic / Math.sin(aStair2);
		const Red = Wec / Math.sin(aStair2);
		// step-5 : checks on the parameter values
		if (param.Wi2 < param.Wi1) {
			throw `err092: Wi2 ${param.Wi2} is too small compare to Wi1 ${param.Wi1}`;
		}
		if (param.We2 < param.We1) {
			throw `err095: We2 ${param.We2} is too small compare to We1 ${param.We1}`;
		}
		if (param.W < R1) {
			throw `err098: D1 ${param.D1} is too small compare to Wi2 ${param.Wi2}`;
		}
		// step-6 : any logs
		rGeome.logstr += `Stair angle ${ffix(radToDeg(2 * aStair2))} degree\n`;
		rGeome.logstr += `Stairs angle ${ffix(param.Nn / param.Nd)} turn\n`;
		// sub-function
		// figTop
		const ctrCircleRef = contourCircle(0, 0, R1);
		const ctrCircleSpiralI = contourCircle(0, 0, Rid);
		const ctrCircleSpiralE = contourCircle(0, 0, Red);
		figTop.addSecond(ctrCircleRef);
		figTop.addSecond(ctrCircleSpiralI);
		figTop.addSecond(ctrCircleSpiralE);
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
