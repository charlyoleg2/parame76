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
	ctrRectangle,
	figure,
	//degToRad,
	//radToDeg,
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
		pNumber('W1', 'mm', 2000, 400, 10000, 1),
		pNumber('W2', 'mm', 4000, 400, 10000, 1),
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
		W1: 'stairs_top.svg',
		W2: 'stairs_top.svg',
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
	const figBorderL = figure();
	const figBorderS = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const R1 = param.D1 / 2;
		// step-5 : checks on the parameter values
		if (R1 < Ri) {
			throw `err071: D1 ${param.D1} is too small compare to Di ${param.Di}`;
		}
		// step-6 : any logs
		rGeome.logstr += `Surface ${ffix(surface)} mm2, volume ${ffix(volume)} mm3\n`;
		// sub-function
		// figCylinder
		const ctrCylinder = contourCircle(0, 0, R1);
		const ctrHole = contourCircle(0, 0, Ri);
		figCylinder.addMainOI([ctrCylinder, ctrHole]);
		// figHeight
		figHeight.addMainO(ctrRectangle(-R1, 0, 2 * R1, param.T1));
		figHeight.addSecond(ctrRectangle(-Ri, 0, 2 * Ri, param.T1));
		// final figure list
		rGeome.fig = {
			faceCylinder: figCylinder,
			faceHeight: figHeight
		};
		// volume
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_cyl`,
					face: `${designName}_faceCylinder`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.T1,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				}
			],
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: [`subpax_${designName}_cyl`]
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
