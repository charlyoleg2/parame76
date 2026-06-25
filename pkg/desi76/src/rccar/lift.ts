// lift.ts
// the holder of pivot of rc-car

import type {
	//tContour,
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
	figure,
	//degToRad,
	//radToDeg,
	//ffix,
	pNumber,
	//pCheckbox,
	//pDropdown,
	pSectionSeparator,
	EExtrude,
	EBVolume,
	initGeom
} from 'geometrix';

const pDef: tParamDef = {
	partName: 'lift',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('D1', 'mm', 60, 1, 1000, 1),
		pNumber('D2', 'mm', 100, 1, 1000, 1),
		pNumber('T1', 'mm', 5, 1, 100, 1),
		pNumber('T2', 'mm', 2, 1, 100, 1),
		pNumber('A1', 'degree', 120, 1, 200, 1),
		pSectionSeparator('top details'),
		pNumber('S1', 'mm', 0, 0, 500, 1),
		pNumber('T3', 'mm', 6, 1, 100, 1),
		pNumber('S2min', 'mm', 20, 1, 500, 1),
		pNumber('R1', 'mm', 2, 0, 100, 1),
		pNumber('R2', 'mm', 2, 0, 100, 1),
		pNumber('T4', 'mm', 3, 1, 100, 1),
		pNumber('T5', 'mm', 10, 1, 100, 1),
		pNumber('T6', 'mm', 3, 1, 100, 1),
		pNumber('T7', 'mm', 10, 1, 100, 1),
		pSectionSeparator('side'),
		pNumber('H1', 'mm', 100, 1, 1000, 1),
		pNumber('H2', 'mm', 3, 1, 100, 1),
		pNumber('H3', 'mm', 20, 1, 100, 1),
		pNumber('H4', 'mm', 20, 1, 100, 1),
		pNumber('LD1', 'mm', 20, 1, 500, 1),
		pNumber('LD2', 'mm', 50, 1, 500, 1),
		pNumber('LX1', 'mm', 26, 1, 500, 1),
		pNumber('LY1', 'mm', 5, 0, 500, 1),
		pNumber('LX2', 'mm', 0, 0, 500, 1),
		pNumber('LY2', 'mm', 0, 0, 500, 1),
		pNumber('LR2', 'mm', 10, 0, 500, 1),
		pNumber('MD1', 'mm', 20, 1, 500, 1),
		pNumber('MD2', 'mm', 50, 1, 500, 1),
		pNumber('MX1', 'mm', 26, 1, 500, 1),
		pNumber('MY1', 'mm', 5, 0, 500, 1),
		pNumber('MY2', 'mm', 50, 0, 500, 1),
		pNumber('MY3', 'mm', 5, 0, 500, 1)
	],
	paramSvg: {
		D1: 'lift_top1.svg',
		D2: 'lift_top1.svg',
		T1: 'lift_top1.svg',
		T2: 'lift_top1.svg',
		A1: 'lift_top1.svg',
		S1: 'lift_top1.svg',
		T3: 'lift_top1.svg',
		S2min: 'lift_top2.svg',
		R1: 'lift_top1.svg',
		R2: 'lift_top1.svg',
		T4: 'lift_top1.svg',
		T5: 'lift_top1.svg',
		T6: 'lift_back.svg',
		T7: 'lift_back.svg',
		H1: 'lift_side1.svg',
		H2: 'lift_side1.svg',
		H3: 'lift_side1.svg',
		H4: 'lift_side1.svg',
		LD1: 'lift_side1.svg',
		LD2: 'lift_side1.svg',
		LX1: 'lift_side1.svg',
		LY1: 'lift_side1.svg',
		LX2: 'lift_side1.svg',
		LY2: 'lift_side1.svg',
		LR2: 'lift_side1.svg',
		MD1: 'lift_side2.svg',
		MD2: 'lift_side2.svg',
		MX1: 'lift_side2.svg',
		MY1: 'lift_side2.svg',
		MY2: 'lift_side2.svg',
		MY3: 'lift_side2.svg'
	},
	sim: {
		tMax: 180,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

function pGeom(t: number, param: tParamVal, suffix = ''): tGeom {
	const rGeome = initGeom(pDef.partName + suffix);
	const figFace = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// figFace
		const face1: tOuterInner = [];
		const ctrPoleFace = contour(-param.H1 / 2, -param.H2 / 2)
			.addCornerRounded(0)
			.addSegStrokeA(param.H1 / 2, -param.H2 / 2)
			.addSegStrokeA(param.H1 / 2, param.H2 / 2)
			.addCornerRounded(0)
			.addSegStrokeA(-param.H1 / 2, param.H2 / 2)
			.closeSegStroke();
		face1.push(ctrPoleFace);
		face1.push(contourCircle(0, 0, 10));
		figFace.addMainOI(face1);
		// final figure list
		rGeome.fig = {
			faceVoila: figFace
		};
		// volume
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_top`,
					face: `${designName}_faceVoila`,
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
		rGeome.logstr += 'lift drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

const liftDef: tPageDef = {
	pTitle: 'lift',
	pDescription: 'the holder of pivot of rc-car',
	pDef: pDef,
	pGeom: pGeom
};

export { liftDef };
