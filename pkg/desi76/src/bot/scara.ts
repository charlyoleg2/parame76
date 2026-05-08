// scara.ts
// A leg of a scara robot

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
	point,
	//Point,
	//ShapePoint,
	//line,
	//vector,
	contour,
	contourCircle,
	//ctrRectangle,
	figure,
	//degToRad,
	//radToDeg,
	//pointCoord,
	ffix,
	pNumber,
	//pCheckbox,
	pDropdown,
	pSectionSeparator,
	initGeom,
	EExtrude,
	EBVolume
} from 'geometrix';
//import { triAPiPi, triAArA, triALArLL, triLALrL, triALLrL, triALLrLAA, triLLLrA, triLLLrAAA } from 'triangule';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
const pDef: tParamDef = {
	// partName is used in URL. Choose a name without slash, backslash and space.
	partName: 'scara',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('L1', 'mm', 200, 1, 2000, 1),
		pNumber('D11', 'mm', 20, 1, 1000, 1),
		pNumber('D12', 'mm', 60, 1, 1000, 1),
		pNumber('D21', 'mm', 10, 1, 1000, 1),
		pNumber('D22', 'mm', 40, 1, 1000, 1),
		pDropdown('firstEnd', ['intern', 'extern']),
		pDropdown('secondEnd', ['extern', 'intern']),
		pSectionSeparator('Internal details'),
		pNumber('A1', 'degree', 90, 0, 180, 1),
		pNumber('T1', 'mm', 2, 0.1, 100, 0.1),
		pNumber('T2', 'mm', 2, 0.1, 100, 0.1),
		pNumber('S2', 'mm', 30, 1, 1000, 1),
		pNumber('R1i', 'mm', 2, 0, 100, 0.5),
		pNumber('R1e', 'mm', 0.5, 0, 100, 0.1),
		pSectionSeparator('External details'),
		pNumber('N2', 'legs', 3, 0, 10, 1),
		pNumber('S1', 'mm', 40, 1, 1000, 1),
		pNumber('T3', 'mm', 2, 0.1, 100, 0.1),
		pNumber('R2i', 'mm', 2, 0, 100, 0.5),
		pNumber('R2e', 'mm', 0.5, 0, 100, 0.1),
		pSectionSeparator('Heights'),
		pNumber('H1', 'mm', 50, 1, 1000, 1),
		pNumber('H2', 'mm', 2, 0.1, 200, 0.1),
		pNumber('H3', 'mm', 5, 1, 200, 1),
		pNumber('H4', 'mm', 0, 0, 200, 0.1)
	],
	paramSvg: {
		L1: 'scara_top.svg',
		D11: 'scara_top.svg',
		D12: 'scara_top.svg',
		D21: 'scara_top.svg',
		D22: 'scara_top.svg',
		firstEnd: 'scara_ends.svg',
		secondEnd: 'scara_ends.svg',
		A1: 'scara_top.svg',
		T1: 'scara_top.svg',
		T2: 'scara_top.svg',
		S2: 'scara_top.svg',
		R1i: 'scara_top.svg',
		R1e: 'scara_top.svg',
		N2: 'scara_top.svg',
		S1: 'scara_top.svg',
		T3: 'scara_top.svg',
		R2i: 'scara_top.svg',
		R2e: 'scara_top.svg',
		H1: 'scara_side.svg',
		H2: 'scara_side.svg',
		H3: 'scara_side.svg',
		H4: 'scara_side.svg'
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
	const figPlate = figure();
	const figIntern = figure();
	const figExtern = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		//const a1 = degToRad(param.A1);
		const R11 = param.D11 / 2;
		const R12 = param.D12 / 2;
		const R21 = param.D21 / 2;
		const R22 = param.D22 / 2;
		const X2 = R12 + param.L1;
		const Ltot = X2 + R22;
		const Htot1 = param.H1 + 2 * (param.H2 + param.H4);
		const Htot2 = param.H1 + 2 * (param.H2 + param.H3);
		const aIncli = Math.atan2(R22 - R12, param.L1);
		const R91 = R11 + param.T3;
		const R92 = R21 + param.T3;
		const a91 = Math.asin(param.T3 / (2 * R91));
		const a92 = Math.asin(param.T3 / (2 * R92));
		const pi2 = Math.PI / 2;
		const aP1 = pi2 + aIncli;
		// step-5 : checks on the parameter values
		if (param.L1 < R12 + R22) {
			throw `err095: L1 ${ffix(param.L1)} is too small compare to D12 ${ffix(2 * R12)} and D22 ${ffix(2 * R22)}`;
		}
		if (R12 < R11 + 2 * param.T3) {
			throw `err132: D12 ${ffix(2 * R12)} is too small compare to D11 ${ffix(2 * R11)} and T3 ${ffix(param.T3)}`;
		}
		if (R22 < R21 + 2 * param.T3) {
			throw `err135: D22 ${ffix(2 * R22)} is too small compare to D21 ${ffix(2 * R21)} and T3 ${ffix(param.T3)}`;
		}
		if (R12 < R11 + param.T1 + param.T2) {
			throw `err142: D12 ${ffix(2 * R12)} is too small compare to T1 ${ffix(param.T1)} and T2 ${ffix(param.T2)}`;
		}
		if (R22 < R21 + param.T1 + param.T2) {
			throw `err145: D22 ${ffix(2 * R22)} is too small compare to T1 ${ffix(param.T1)} and T2 ${ffix(param.T2)}`;
		}
		// step-6 : any logs
		rGeome.logstr += `length ${ffix(Ltot)}  height-1 ${ffix(Htot1)}  height-2 ${ffix(Htot2)}\n`;
		// step-7 : drawing of the figures
		// fig1
		const p1 = point(R12, 0).translatePolar(aP1, R12);
		const p6 = point(X2, 0).translatePolar(aP1, R22);
		const p12 = point(R12, 0).translatePolar(aP1, R12 - param.T3);
		const p62 = point(X2, 0).translatePolar(aP1, R22 - param.T3);
		const p91 = point(R12, 0).translatePolar(a91, R91);
		const p92 = point(X2, 0).translatePolar(Math.PI - a92, R92);
		// figPlate
		const ctrPlate = contour(p1.cx, p1.cy)
			.addPointA(0, 0)
			.addPointA(p1.cx, -p1.cy)
			.addSegArc2()
			.addSegStrokeA(p6.cx, -p6.cy)
			.addPointA(Ltot, 0)
			.addPointA(p6.cx, p6.cy)
			.addSegArc2()
			.closeSegStroke();
		figPlate.addMainOI([ctrPlate, contourCircle(R12, 0, R11), contourCircle(X2, 0, R21)]);
		// figExtern
		const ctrE2 = contour(p12.cx, p12.cy)
			.addPointA(param.T3, 0)
			.addPointA(p12.cx, -p12.cy)
			.addSegArc2()
			.addSegStrokeA(p62.cx, -p62.cy)
			.addPointA(Ltot - param.T3, 0)
			.addPointA(p62.cx, p62.cy)
			.addSegArc2()
			.closeSegStroke();
		figExtern.addMainOI([ctrPlate, ctrE2]);
		const ctrE3 = contour(p91.cx, p91.cy)
			.addCornerRounded(param.R2i)
			.addPointA(R12 - R91, 0)
			.addPointA(p91.cx, -p91.cy)
			.addSegArc2()
			.addCornerRounded(param.R2i)
			.addSegStrokeA(p92.cx, -p92.cy)
			.addCornerRounded(param.R2i)
			.addPointA(X2 + R92, 0)
			.addPointA(p92.cx, p92.cy)
			.addSegArc2()
			.addCornerRounded(param.R2i)
			.closeSegStroke();
		figExtern.addMainOI([ctrE3, contourCircle(R12, 0, R11), contourCircle(X2, 0, R21)]);
		// figIntern
		figIntern.addMainOI([contourCircle(R12, 0, R11 + param.T1), contourCircle(R12, 0, R11)]);
		figIntern.addMainOI([contourCircle(X2, 0, R21 + param.T1), contourCircle(X2, 0, R21)]);
		figIntern.mergeFigure(figPlate, true);
		// final figure list
		rGeome.fig = {
			facePlate: figPlate,
			faceIntern: figIntern,
			faceExtern: figExtern
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_ext1`,
					face: `${designName}_faceExtern`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H3,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_plate2`,
					face: `${designName}_facePlate`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H2,
					rotate: [0, 0, 0],
					translate: [0, 0, param.H3]
				},
				{
					outName: `subpax_${designName}_int3`,
					face: `${designName}_faceIntern`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H1,
					rotate: [0, 0, 0],
					translate: [0, 0, param.H3 + param.H2]
				},
				{
					outName: `subpax_${designName}_plate4`,
					face: `${designName}_facePlate`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H2,
					rotate: [0, 0, 0],
					translate: [0, 0, param.H3 + param.H2 + param.H1]
				},
				{
					outName: `subpax_${designName}_ext5`,
					face: `${designName}_faceExtern`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H3,
					rotate: [0, 0, 0],
					translate: [0, 0, param.H3 + 2 * param.H2 + param.H1]
				}
			],
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: [
						`subpax_${designName}_ext1`,
						`subpax_${designName}_plate2`,
						`subpax_${designName}_int3`,
						`subpax_${designName}_plate4`,
						`subpax_${designName}_ext5`
					]
				}
			]
		};
		// step-9 : optional sub-design parameter export
		// sub-design
		rGeome.sub = {};
		// step-10 : final log message
		// finalize
		rGeome.logstr += 'Scara drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const scaraDef: tPageDef = {
	pTitle: 'scara',
	pDescription: 'A scara leg',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { scaraDef };
