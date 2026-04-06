// cuisine.ts
// A cuisine under the roof

// step-1 : import from geometrix
import type {
	//Contour,
	//tContour,
	//tOuterInner,
	tParamDef,
	tParamVal,
	tGeom,
	//tExtrude,
	tPageDef
	//tSubInst
	//tSubDesign
} from 'geometrix';
import {
	//designParam,
	//checkGeom,
	//prefixLog,
	//point,
	//Point,
	//ShapePoint,
	//line,
	//vector,
	contour,
	//contourCircle,
	//ctrRectangle,
	figure,
	degToRad,
	radToDeg,
	//pointCoord,
	ffix,
	pNumber,
	//pCheckbox,
	//pDropdown,
	pSectionSeparator,
	initGeom,
	EExtrude,
	EBVolume
} from 'geometrix';
//import { triAPiPi, triAArA, triALArLL, triLALrL, triALLrL, triALLrLAA, triLLLrA, triLLLrAAA } from 'triangule';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
const pDef: tParamDef = {
	// partName is used in URL. Choose a name without slash, backslash and space.
	partName: 'cuisine',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('AX', 'cm', 274, 200, 600, 1),
		pNumber('AY', 'cm', 210, 100, 500, 1),
		pNumber('BY', 'cm', 100, 50, 500, 1),
		pNumber('CX', 'cm', 400, 50, 800, 1),
		pSectionSeparator('Window'),
		pNumber('WW', 'cm', 94, 40, 200, 1),
		pSectionSeparator('Roof'),
		pNumber('MW', 'cm', 10, 5, 50, 1),
		pNumber('eMH', 'cm', 85, 5, 50, 1),
		pNumber('eRA', 'degree', 45, 10, 85, 1),
		pNumber('eRW', 'cm', 250, 100, 500, 1),
		pNumber('nMH', 'cm', 85, 5, 50, 1),
		pNumber('nRA', 'degree', 45, 10, 85, 1),
		pNumber('nRW', 'cm', 200, 100, 500, 1)
	],
	paramSvg: {
		AX: 'cuisine_top.svg',
		AY: 'cuisine_top.svg',
		BY: 'cuisine_top.svg',
		CX: 'cuisine_top.svg',
		WW: 'cuisine_door.svg',
		MW: 'cuisine_roof.svg',
		eMH: 'cuisine_roof.svg',
		eRA: 'cuisine_roof.svg',
		eRW: 'cuisine_roof.svg',
		nMH: 'cuisine_roof.svg',
		nRA: 'cuisine_roof.svg',
		nRW: 'cuisine_roof.svg'
	},
	sim: {
		tMax: 100,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

// step-3 : definition of the function that creates from the parameter-values the figures and construct the 3D
function pGeom(t: number, param: tParamVal, suffix = ''): tGeom {
	const rGeome = initGeom(pDef.partName + suffix);
	const figTop = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const aRe = degToRad(param.eRA);
		const aRn = degToRad(param.nRA);
		const lX = param.AX + param.CX;
		const lY = param.AY + param.BY;
		// step-5 : checks on the parameter values
		if (lX < 0) {
			throw `err099: sign of lX ${ffix(lX)} must be positive`;
		}
		// step-6 : any logs
		rGeome.logstr += `lX ${ffix(lX)}  lY ${ffix(lY)}\n`;
		rGeome.logstr += `East side: roof-angle ${ffix(radToDeg(aRe))}\n`;
		rGeome.logstr += `North side: roof-angle ${ffix(radToDeg(aRn))}\n`;
		// step-7 : drawing of the figures
		// fig1
		const ctrBase = contour(0, 0)
			.addSegStrokeR(lX, 0)
			.addSegStrokeR(0, lY)
			.addSegStrokeR(-lX, 0)
			.closeSegStroke();
		figTop.addMainO(ctrBase);
		// final figure list
		rGeome.fig = {
			faceTop: figTop
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_top`,
					face: `${designName}_faceTop`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.MW,
					rotate: [0, 0, 0],
					translate: [0, 0, -param.MW]
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
		// step-9 : optional sub-design parameter export
		// sub-design
		rGeome.sub = {};
		// step-10 : final log message
		// finalize
		rGeome.logstr += 'Cuisine drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const cuisineDef: tPageDef = {
	pTitle: 'cuisine',
	pDescription: 'A cuisine under the roof',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { cuisineDef };
