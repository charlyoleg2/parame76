// scarabase.ts
// The base of a Scara robot

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
	ctrRectangle,
	figure,
	degToRad,
	radToDeg,
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
	partName: 'scarabase',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('D1', 'mm', 20, 1, 1000, 1),
		pNumber('D2', 'mm', 60, 1, 1000, 1),
		pNumber('L3', 'mm', 30, 0, 1000, 1),
		pNumber('L4', 'mm', 20, 1, 100, 1),
		pNumber('W5', 'mm', 40, 1, 1000, 1),
		pDropdown('Nac', ['single', 'double']),
		pSectionSeparator('Plate details'),
		pNumber('R34', 'mm', 2, 0, 10, 0.1),
		pNumber('A5', 'degree', 45, 0, 90, 1),
		pNumber('W6', 'mm', 0, 0, 1000, 1),
		pNumber('T3', 'mm', 3, 1, 100, 1),
		pNumber('T4', 'mm', 10, 1, 100, 1),
		pSectionSeparator('Heights and back'),
		pNumber('H1', 'mm', 50, 1, 1000, 1),
		pNumber('H2', 'mm', 10, 1, 1000, 1),
		pNumber('H3', 'mm', 10, 0, 1000, 1),
		pNumber('W8', 'mm', 20, 1, 1000, 1),
		pNumber('H8', 'mm', 30, 1, 1000, 1),
		pNumber('D8', 'mm', 5, 1, 1000, 1)
	],
	paramSvg: {
		D1: 'scarabase_single.svg',
		D2: 'scarabase_single.svg',
		L3: 'scarabase_single.svg',
		L4: 'scarabase_single.svg',
		W5: 'scarabase_single.svg',
		Nac: 'scarabase_double.svg',
		R34: 'scarabase_single.svg',
		A5: 'scarabase_double.svg',
		W6: 'scarabase_double.svg',
		T3: 'scarabase_single.svg',
		T4: 'scarabase_single.svg',
		H1: 'scarabase_heights.svg',
		H2: 'scarabase_heights.svg',
		H3: 'scarabase_heights.svg',
		W8: 'scarabase_heights.svg',
		H8: 'scarabase_heights.svg',
		D8: 'scarabase_heights.svg'
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
	const figHeights = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const a5 = degToRad(param.A5) / 2;
		const R1 = param.D1 / 2;
		const R2 = param.D2 / 2;
		const R8 = param.D8 / 2;
		const W52 = param.W5 / 2;
		const L32 = param.L3 + R2;
		const a21 = Math.atan(W52 / L32);
		const L21 = Math.sqrt(W52 ** 2 + L32 ** 2);
		const a22 = Math.acos(R2 / L21);
		const a2 = a21 + a22;
		const L432 = param.L4 + param.L3 + R2;
		const Ltot = 2 * R2 + param.L3 + param.L4;
		const Htot = param.H1 + 2 * (param.H2 + param.H3);
		const X8 = (param.W5 - param.W8) / 2;
		const Y8 = (param.H1 - param.H8) / 2;
		const H23 = param.H2 + param.H3;
		const H123 = param.H1 + H23;
		const pi2 = Math.PI / 2;
		// step-5 : checks on the parameter values
		if (R2 < R1 + 2 * param.T3) {
			throw `err132: D2 ${ffix(2 * R2)} is too small compare to D1 ${ffix(2 * R1)} and T3 ${ffix(param.T3)}`;
		}
		if (X8 < R8) {
			throw `err124: W5 ${ffix(2 * W52)} is too small compare to D8 ${ffix(2 * R8)} and W8 ${ffix(param.W8)}`;
		}
		if (Y8 < R8) {
			throw `err127: H1 ${ffix(param.H1)} is too small compare to D8 ${ffix(2 * R8)} and H8 ${ffix(param.H8)}`;
		}
		// warnings
		if (param.H3 === 0) {
			rGeome.logstr += 'warn125: Warning H3 is zero\n';
		}
		// step-6 : any logs
		rGeome.logstr += `length ${ffix(Ltot)}  height ${ffix(Htot)}\n`;
		if (param.Nac === 1) {
			rGeome.logstr += `angle of double ${ffix(radToDeg(2 * a5))}\n`;
		}
		// step-7 : drawing of the figures
		// fig1
		const p21 = point(W52, L432).translatePolar(-pi2 + a2, R2);
		const p22 = point(W52, L432).translatePolar(-pi2 - a2, R2);
		// figPlate
		const ctrPlate = contour(0, 0)
			.addSegStrokeA(2 * W52, 0)
			.addSegStrokeA(2 * W52, param.L4)
			.addCornerRounded(param.R34)
			.addSegStrokeA(p21.cx, p21.cy)
			.addPointA(W52, L432 + R2)
			.addPointA(p22.cx, p22.cy)
			.addSegArc2()
			.addSegStrokeA(0, param.L4)
			.addCornerRounded(param.R34)
			.closeSegStroke();
		figPlate.addMainOI([ctrPlate, contourCircle(W52, L432, R1)]);
		figPlate.addSecond(ctrRectangle(0, 0, param.W5, param.T4));
		// figHeights
		figHeights.addMainOI([
			ctrRectangle(0, H23, param.W5, param.H1),
			contourCircle(X8, H23 + Y8, R8),
			contourCircle(2 * W52 - X8, H23 + Y8, R8),
			contourCircle(X8, H123 - Y8, R8),
			contourCircle(2 * W52 - X8, H123 - Y8, R8)
		]);
		figHeights.addSecond(ctrRectangle(W52 - R1, 0, 2 * R1, H23));
		figHeights.addSecond(ctrRectangle(W52 - R2, 0, 2 * R2, H23));
		figHeights.addSecond(ctrRectangle(W52 - R1, H123, 2 * R1, H23));
		figHeights.addSecond(ctrRectangle(W52 - R2, H123, 2 * R2, H23));
		// final figure list
		rGeome.fig = {
			facePlate: figPlate,
			faceHeights: figHeights
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_plate2`,
					face: `${designName}_facePlate`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H2,
					rotate: [0, 0, 0],
					translate: [0, 0, param.H3]
				},
				{
					outName: `subpax_${designName}_plate4`,
					face: `${designName}_facePlate`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H2,
					rotate: [0, 0, 0],
					translate: [0, 0, H123]
				},
				{
					outName: `subpax_${designName}_back`,
					face: `${designName}_faceHeights`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.T4,
					rotate: [pi2, 0, 0],
					translate: [0, param.T4, 0]
				}
			],
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: [
						`subpax_${designName}_plate2`,
						`subpax_${designName}_plate4`,
						`subpax_${designName}_back`
					]
				}
			]
		};
		// step-9 : optional sub-design parameter export
		// sub-design
		rGeome.sub = {};
		// step-10 : final log message
		// finalize
		rGeome.logstr += 'ScaraBase drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const scarabaseDef: tPageDef = {
	pTitle: 'scarabase',
	pDescription: 'The base of a Scara arm',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { scarabaseDef };
