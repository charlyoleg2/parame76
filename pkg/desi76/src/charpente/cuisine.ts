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
	ctrRectangle,
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
		pNumber('BY', 'cm', 130, 50, 500, 1),
		pNumber('CX', 'cm', 405, 50, 800, 1),
		pNumber('DPX', 'cm', 108, 50, 500, 1),
		pSectionSeparator('Window'),
		pNumber('WW', 'cm', 94, 40, 200, 1),
		pNumber('WH', 'cm', 90, 40, 200, 1),
		pNumber('WPH', 'cm', 120, 40, 200, 1),
		pNumber('WPX', 'cm', 130, 40, 400, 1),
		pNumber('WPY', 'cm', 270, 40, 400, 1),
		pSectionSeparator('Door'),
		pNumber('DW', 'cm', 76, 40, 200, 1),
		pNumber('DH', 'cm', 210, 180, 300, 1),
		pNumber('AMH', 'cm', 300, 100, 600, 1),
		pSectionSeparator('Roof'),
		pNumber('MW', 'cm', 10, 5, 50, 1),
		pNumber('eMH', 'cm', 90, 5, 200, 1),
		pNumber('eRA', 'degree', 45, 10, 85, 1),
		pNumber('eRW', 'cm', 250, 100, 500, 1),
		pNumber('nMH', 'cm', 90, 5, 200, 1),
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
		const lX = param.AX + param.CX + param.MW;
		const lY = param.AY + param.BY + param.MW;
		const lAZx = param.AX + param.MW - param.DPX - param.DW;
		const lR2e = (200 - param.eMH) / Math.tan(aRe);
		const lR2n = (200 - param.nMH) / Math.tan(aRn);
		const cWHtop = 30;
		// step-5 : checks on the parameter values
		if (lAZx < 0) {
			throw `err099: sign of lAZx ${ffix(lAZx)} must be positive`;
		}
		// step-6 : any logs
		rGeome.logstr += `lX ${ffix(lX)}  lY ${ffix(lY)}\n`;
		rGeome.logstr += `East side: roof-angle ${ffix(radToDeg(aRe))}, lR2e ${ffix(lR2e)}\n`;
		rGeome.logstr += `North side: roof-angle ${ffix(radToDeg(aRn))}, lR2n ${ffix(lR2n)}\n`;
		// step-7 : drawing of the figures
		// fig1
		const ctrBase = contour(0, 0)
			.addSegStrokeR(lX, 0)
			.addSegStrokeR(0, lY)
			.addSegStrokeR(-lX, 0)
			.closeSegStroke();
		const ctrArbeitZimmerS = contour(0, param.AY - param.MW)
			.addSegStrokeR(lAZx, 0)
			.addSegStrokeR(0, param.MW)
			.addSegStrokeR(-lAZx, 0)
			.closeSegStroke();
		const ctrArbeitZimmerN = contour(param.AX, 0)
			.addSegStrokeR(param.MW, 0)
			.addSegStrokeR(0, param.AY)
			.addSegStrokeR(-param.DPX, 0)
			.addSegStrokeR(0, -param.MW)
			.addSegStrokeR(param.DPX - param.MW, 0)
			.closeSegStroke();
		const ctrArbeitZimmerTop = contour(param.AX, 0)
			.addSegStrokeR(param.MW, 0)
			.addSegStrokeR(0, param.AY)
			.addSegStrokeR(-param.AX - param.MW, 0)
			.addSegStrokeR(0, -param.MW)
			.addSegStrokeR(param.AX, 0)
			.closeSegStroke();
		const ctr2M = contour(0, 0)
			.addSegStrokeR(lX, 0)
			.addSegStrokeR(0, lY)
			.addSegStrokeR(-lR2n, 0)
			.addSegStrokeR(0, -lY + lR2e)
			.addSegStrokeR(-lX + lR2n, 0)
			.closeSegStroke();
		figTop.addMainO(ctrBase);
		figTop.addSecond(ctrArbeitZimmerS);
		figTop.addSecond(ctrArbeitZimmerN);
		figTop.addSecond(ctrArbeitZimmerTop);
		figTop.addSecond(ctr2M);
		figTop.addSecond(ctrRectangle((param.AX - param.WW) / 2, 0, param.WW, cWHtop));
		figTop.addSecond(ctrRectangle(lX - param.WW - param.WPX, 0, param.WW, cWHtop));
		figTop.addSecond(ctrRectangle(lX - cWHtop, param.WPY, cWHtop, param.WW));
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
