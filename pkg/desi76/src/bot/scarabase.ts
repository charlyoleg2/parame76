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
	//ctrRectangle,
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
		pNumber('L4', 'mm', 30, 0, 1000, 1),
		pNumber('W5', 'mm', 40, 1, 1000, 1),
		pDropdown('Nac', ['single', 'double']),
		pSectionSeparator('Plate details'),
		pNumber('R34', 'mm', 2, 0, 10, 0.1),
		pNumber('A5', 'degree', 45, 0, 90, 1),
		pNumber('W6', 'mm', 0, 0, 1000, 1),
		pSectionSeparator('Plate structure'),
		pNumber('T3', 'mm', 0, 0, 1000, 1)
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
		W6: 'scarabase_double.svg'
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
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const a5 = degToRad(param.A5) / 2;
		const R1 = param.D1 / 2;
		const R2 = param.D2 / 2;
		const W52 = param.W5 / 2;
		const L32 = param.L3 + R2;
		const a21 = Math.atan(W52 / L32);
		const L21 = Math.sqrt(W52 ** 2 + L32 ** 2);
		const a22 = Math.acos(R2 / L21);
		const a2 = a21 + a22;
		const L432 = param.L4 + param.L3 + R2;
		const Ltot = 2 * R2 + param.L3 + param.L4;
		const Htot = 0;
		const pi2 = Math.PI / 2;
		// step-5 : checks on the parameter values
		if (R2 < R1 + 2 * param.T3) {
			throw `err132: D2 ${ffix(2 * R2)} is too small compare to D1 ${ffix(2 * R1)} and T3 ${ffix(param.T3)}`;
		}
		// warnings
		if (param.T3 === 0) {
			rGeome.logstr += 'warn167: Warning H3 is zero\n';
		}
		// step-6 : any logs
		rGeome.logstr += `length ${ffix(Ltot)}  height ${ffix(Htot)}\n`;
		if (param.Nac === 1) {
			rGeome.logstr += `angle of double ${ffix(radToDeg(2 * a5))}\n`;
		}
		// step-7 : drawing of the figures
		// fig1
		const p21 = point(0, L432).translatePolar(-pi2 + a2, R2);
		const p22 = point(0, L432).translatePolar(-pi2 - a2, R2);
		// figPlate
		const ctrPlate = contour(-W52, 0)
			.addSegStrokeA(W52, 0)
			.addSegStrokeA(W52, param.L4)
			.addCornerRounded(param.R34)
			.addSegStrokeA(p21.cx, p21.cy)
			.addPointA(0, L432 + R2)
			.addPointA(p22.cx, p22.cy)
			.addSegArc2()
			.addSegStrokeA(-W52, param.L4)
			.addCornerRounded(param.R34)
			.closeSegStroke();
		figPlate.addMainOI([ctrPlate, contourCircle(0, L432, R1)]);
		// final figure list
		rGeome.fig = {
			facePlate: figPlate
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
					translate: [0, 0, 0]
				}
			],
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: [`subpax_${designName}_plate2`]
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
