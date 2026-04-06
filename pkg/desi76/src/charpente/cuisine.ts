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
		pNumber('CAX', 'cm', 100, 1, 200, 1),
		pSectionSeparator('Ground'),
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
		CAX: 'cuisine_elements.svg',
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
	const figTopSubDoor = figure();
	const figTopSupDoor = figure();
	const figRoofEast = figure();
	const figRoofNorth = figure();
	const figWindow = figure();
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
		const hRe = param.eRW * Math.tan(aRe);
		const hRn = param.nRW * Math.tan(aRn);
		const lWindowCut = Math.max(param.eRW, param.nRW) + param.MW;
		const wPx1 = (param.AX - param.WW) / 2;
		const wPx2 = lX - param.WW - param.WPX;
		const wPy3 = param.WPY;
		const pi2 = Math.PI / 2;
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
		figTop.addSecond(ctrRectangle(wPx1, 0, param.WW, cWHtop));
		figTop.addSecond(ctrRectangle(wPx2, 0, param.WW, cWHtop));
		figTop.addSecond(ctrRectangle(lX - cWHtop, param.WPY, cWHtop, param.WW));
		figTopSubDoor.addMainO(ctrArbeitZimmerS);
		figTopSubDoor.addMainO(ctrArbeitZimmerN);
		figTopSupDoor.addMainO(ctrArbeitZimmerTop);
		const ctrRe = contour(0, 0)
			.addSegStrokeR(param.MW, 0)
			.addSegStrokeR(0, param.eMH)
			.addSegStrokeR(param.eRW, hRe)
			.addSegStrokeR(0, param.MW)
			.addSegStrokeR(-param.eRW, -hRe)
			.addSegStrokeR(-param.MW, 0)
			.closeSegStroke();
		figRoofEast.addMainO(ctrRe);
		const ctrRn = contour(0, 0)
			.addSegStrokeR(param.MW, 0)
			.addSegStrokeR(0, param.nMH)
			.addSegStrokeR(param.nRW, hRn)
			.addSegStrokeR(0, param.MW)
			.addSegStrokeR(-param.nRW, -hRn)
			.addSegStrokeR(-param.MW, 0)
			.closeSegStroke();
		figRoofNorth.addMainO(ctrRn);
		figWindow.addMainO(ctrRectangle(0, param.WPH, param.WW, param.WH));
		// final figure list
		rGeome.fig = {
			faceTop: figTop,
			faceTopSub: figTopSubDoor,
			faceTopSup: figTopSupDoor,
			faceRoofEast: figRoofEast,
			faceRoofNorth: figRoofNorth,
			faceWindow: figWindow
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
				},
				{
					outName: `subpax_${designName}_azSub`,
					face: `${designName}_faceTopSub`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.DH,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_azSup`,
					face: `${designName}_faceTopSup`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.AMH - param.DH,
					rotate: [0, 0, 0],
					translate: [0, 0, param.DH]
				},
				{
					outName: `subpax_${designName}_roofE`,
					face: `${designName}_faceRoofEast`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: lX,
					rotate: [pi2, 0, pi2],
					translate: [0, -param.MW, 0]
				},
				{
					outName: `subpax_${designName}_roofN`,
					face: `${designName}_faceRoofNorth`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: lY,
					rotate: [pi2, 0, 2 * pi2],
					translate: [lX + param.MW, 0, 0]
				},
				{
					outName: `subpax_${designName}_w1`,
					face: `${designName}_faceWindow`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: lWindowCut,
					rotate: [pi2, 0, 0],
					translate: [wPx1, lWindowCut - param.MW, 0]
				},
				{
					outName: `subpax_${designName}_w2`,
					face: `${designName}_faceWindow`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: lWindowCut,
					rotate: [pi2, 0, 0],
					translate: [wPx2, lWindowCut - param.MW, 0]
				},
				{
					outName: `subpax_${designName}_w3`,
					face: `${designName}_faceWindow`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: lWindowCut,
					rotate: [pi2, 0, pi2],
					translate: [lX + param.MW - lWindowCut, wPy3, 0]
				}
			],
			volumes: [
				{
					outName: `ipax_${designName}_add1`,
					boolMethod: EBVolume.eUnion,
					inList: [
						`subpax_${designName}_top`,
						`subpax_${designName}_azSub`,
						`subpax_${designName}_azSup`
					]
				},
				{
					outName: `ipax_${designName}_add2`,
					boolMethod: EBVolume.eUnion,
					inList: [`subpax_${designName}_roofE`, `subpax_${designName}_roofN`]
				},
				{
					outName: `ipax_${designName}_cut`,
					boolMethod: EBVolume.eUnion,
					inList: [
						`subpax_${designName}_w1`,
						`subpax_${designName}_w2`,
						`subpax_${designName}_w3`
					]
				},
				{
					outName: `ipax_${designName}_roof`,
					boolMethod: EBVolume.eSubstraction,
					inList: [`ipax_${designName}_add2`, `ipax_${designName}_cut`]
				},
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: [`ipax_${designName}_add1`, `ipax_${designName}_roof`]
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
