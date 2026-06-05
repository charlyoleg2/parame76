// long2d.ts
// A long arm with many legs moving in one 2D-plan

// step-1 : import from geometrix
import type {
	//Contour,
	//tContour,
	//tOuterInner,
	tParamDef,
	tParamVal,
	tGeom,
	tExtrude,
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
	//contour,
	//contourCircle,
	//ctrRectangle,
	figure,
	//degToRad,
	//radToDeg,
	//pointCoord,
	ffix,
	pNumber,
	pCheckbox,
	//pDropdown,
	pSectionSeparator,
	initGeom,
	EExtrude,
	EBVolume
} from 'geometrix';
//import { triAPiPi, triAArA, triALArLL, triLALrL, triALLrL, triALLrLAA, triLLLrA, triLLLrAAA } from 'triangule';
//import { scaraDef } from './scara';
//import { scarabaseDef } from './scarabase';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
const pDef: tParamDef = {
	// partName is used in URL. Choose a name without slash, backslash and space.
	partName: 'long2d',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('NB', 'leg', 3, 1, 10, 1),
		pNumber('LA', 'L-factor', 1, 0.1, 10, 0.1),
		pNumber('LB', 'L-add', 0, -10, 10, 0.1),
		pNumber('DA', 'D-factor', 1, 0.1, 10, 0.1),
		pNumber('DB', 'D-add', 0, -10, 10, 0.1),
		pNumber('HA', 'L-factor', 1, 0.1, 10, 0.1),
		pNumber('HB', 'L-add', 0, -10, 10, 0.1),
		pSectionSeparator('Ending parameters'),
		pNumber('EL', 'mm', 100, 1, 1000, 1),
		pNumber('ED2', 'mm', 60, 1, 1000, 1),
		pNumber('EH1', 'mm', 50, 1, 1000, 1),
		pSectionSeparator('Constant parameters'),
		pNumber('EH2', 'mm', 10, 1, 1000, 1),
		pNumber('EH3', 'mm', 10, 0, 1000, 1),
		pNumber('ED1', 'mm', 20, 1, 1000, 1),
		pNumber('T1', 'mm', 5, 1, 100, 1),
		pNumber('T3', 'mm', 3, 1, 100, 1),
		pNumber('E1', 'mm', 0, -10, 10, 0.1),
		pNumber('E2', 'mm', 0, -10, 10, 0.1),
		pNumber('E3', 'mm', 0, -10, 10, 0.1),
		pSectionSeparator('Base'),
		pNumber('L3', 'mm', 30, 0, 1000, 1),
		pNumber('L4', 'mm', 20, 1, 100, 1),
		pNumber('W5', 'mm', 40, 1, 1000, 1),
		pNumber('R34', 'mm', 2, 0, 10, 0.1),
		pNumber('T4', 'mm', 10, 1, 100, 1),
		pSectionSeparator('Base back'),
		pNumber('W8', 'mm', 20, 1, 1000, 1),
		pNumber('H8', 'mm', 30, 1, 1000, 1),
		pNumber('D8', 'mm', 5, 1, 1000, 1),
		pSectionSeparator('Angles'),
		pNumber('PA1', 'degree', 0, -120, 120, 1),
		pNumber('PA2', 'degree', 0, -120, 120, 1),
		pNumber('PA3', 'degree', 0, -120, 120, 1),
		pNumber('PA4', 'degree', 0, -120, 120, 1),
		pNumber('PA5', 'degree', 0, -120, 120, 1),
		pNumber('PA6', 'degree', 0, -120, 120, 1),
		pNumber('PA7', 'degree', 0, -120, 120, 1),
		pNumber('PA8', 'degree', 0, -120, 120, 1),
		pNumber('PA9', 'degree', 0, -120, 120, 1),
		pNumber('PA10', 'degree', 0, -120, 120, 1),
		pSectionSeparator('Enable parts for 3D'),
		pCheckbox('D3E0', true),
		pCheckbox('D3E1', true),
		pCheckbox('D3E2', true),
		pCheckbox('D3E3', true),
		pCheckbox('D3E4', true),
		pCheckbox('D3E5', true),
		pCheckbox('D3E6', true),
		pCheckbox('D3E7', true),
		pCheckbox('D3E8', true),
		pCheckbox('D3E9', true),
		pCheckbox('D3E10', true)
	],
	paramSvg: {
		NB: 'long2d_top.svg',
		LA: 'long2d_top.svg',
		LB: 'long2d_top.svg',
		DA: 'long2d_top.svg',
		DB: 'long2d_top.svg',
		HA: 'long2d_side.svg',
		HB: 'long2d_side.svg',
		EL: 'long2d_top.svg',
		ED2: 'long2d_top.svg',
		EH1: 'long2d_side.svg',
		EH2: 'long2d_side.svg',
		EH3: 'long2d_side.svg',
		ED1: 'long2d_top.svg',
		T1: 'long2d_joint.svg',
		T3: 'long2d_top.svg',
		E1: 'long2d_side.svg',
		E2: 'long2d_joint.svg',
		E3: 'long2d_joint.svg',
		L3: 'long2d_top.svg',
		L4: 'long2d_top.svg',
		W5: 'long2d_top.svg',
		R34: 'long2d_top.svg',
		T4: 'long2d_top.svg',
		W8: 'long2d_back.svg',
		H8: 'long2d_back.svg',
		D8: 'long2d_back.svg',
		PA1: 'long2d_top.svg',
		PA2: 'long2d_top.svg',
		PA3: 'long2d_top.svg',
		PA4: 'long2d_top.svg',
		PA5: 'long2d_top.svg',
		PA6: 'long2d_top.svg',
		PA7: 'long2d_top.svg',
		PA8: 'long2d_top.svg',
		PA9: 'long2d_top.svg',
		PA10: 'long2d_top.svg',
		D3E0: 'long2d_top.svg',
		D3E1: 'long2d_top.svg',
		D3E2: 'long2d_top.svg',
		D3E3: 'long2d_top.svg',
		D3E4: 'long2d_top.svg',
		D3E5: 'long2d_top.svg',
		D3E6: 'long2d_top.svg',
		D3E7: 'long2d_top.svg',
		D3E8: 'long2d_top.svg',
		D3E9: 'long2d_top.svg',
		D3E10: 'long2d_top.svg'
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
	const figSide = figure();
	const figBack = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const ER1 = param.ED1 / 2;
		const ER2 = param.ED2 / 2;
		const R8 = param.D8 / 2;
		const PA: number[] = [
			param.PA1,
			param.PA2,
			param.PA3,
			param.PA4,
			param.PA5,
			param.PA6,
			param.PA7,
			param.PA8,
			param.PA9,
			param.PA10
		];
		const BL: number[] = Array(param.NB).fill(param.EL);
		const BD1: number[] = Array(param.NB + 1).fill(param.ED1);
		const BD2: number[] = Array(param.NB + 1).fill(param.ED2);
		const BH1: number[] = Array(param.NB + 1).fill(param.EH1);
		for (let ii = param.NB - 2; ii >= 0; ii--) {
			BL[ii] = BL[ii + 1] * param.LA + param.LB;
		}
		for (let ii = param.NB - 1; ii >= 0; ii--) {
			BD1[ii] = BD1[ii + 1] * param.DA + param.DB;
			BD2[ii] = BD2[ii + 1] * param.DA + param.DB;
			BH1[ii] = BH1[ii + 1] * param.HA + param.HB + 2 * (param.EH2 + param.E1);
		}
		//const BR1 = BD1.map((aD1: number) => aD1 / 2);
		const BR2 = BD2.map((aD1: number) => aD1 / 2);
		const CH1 = BH1[0];
		const BLtot = BL.reduce((acc: number, val: number) => acc + val, 0);
		const Ltot = param.L4 + param.L3 + BR2[0] + BLtot + BR2[param.NB];
		const Htot = CH1 + 2 * (param.EH2 + param.EH3);
		const lastOrientation = PA.reduce((acc: number, val: number) => acc + val, 0);
		const X8 = (param.W5 - param.W8) / 2;
		const Y8 = (CH1 - param.H8) / 2;
		// step-5 : checks on the parameter values
		if (ER2 < ER1 + 2 * param.T3) {
			throw `err192: ED2 ${ffix(2 * ER2)} is too small compare to ED1 ${ffix(2 * ER1)} and T3 ${ffix(param.T3)}`;
		}
		if (X8 < R8) {
			throw `err195: W5 ${ffix(param.W5)} is too small compare to D8 ${ffix(2 * R8)} and W8 ${ffix(param.W8)}`;
		}
		if (Y8 < R8) {
			throw `err198: H1 ${ffix(CH1)} is too small compare to D8 ${ffix(2 * R8)} and H8 ${ffix(param.H8)}`;
		}
		// warnings
		if (param.H3 === 0) {
			rGeome.logstr += 'warn125: Warning H3 is zero\n';
		}
		// step-6 : any logs
		rGeome.logstr += `length ${ffix(Ltot)}  height ${ffix(Htot)}  lastOrientation ${ffix(lastOrientation)}\n`;
		for (let ii = 0; ii < param.NB; ii++) {
			rGeome.logstr += `leg-${ii + 1} : BL ${ffix(BL[ii])}, D12 ${ffix(BD2[ii])}, D22 ${ffix(BD2[ii + 1])},`;
			rGeome.logstr += ` BH1 ${ffix(BH1[ii + 1])}\n`;
		}
		// step-7 : drawing of the figures
		// sub-functions
		// figTop
		// figSide
		// figBack
		// final figure list
		rGeome.fig = {
			faceTop: figTop,
			faceSide: figSide,
			faceBack: figBack
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		const lExtrudes: tExtrude[] = [];
		const lUnion: string[] = [];
		if (param.H3 > 0) {
			lExtrudes.push({
				outName: `subpax_${designName}_t31`,
				face: `${designName}_faceT3`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H3,
				rotate: [0, 0, 0],
				translate: [0, 0, 0]
			});
			lUnion.push(`subpax_${designName}_t31`);
			lExtrudes.push({
				outName: `subpax_${designName}_t35`,
				face: `${designName}_faceT3`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H3,
				rotate: [0, 0, 0],
				translate: [0, 0, param.EH2]
			});
			lUnion.push(`subpax_${designName}_t35`);
		}
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_plate2`,
					face: `${designName}_facePlate`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.EH2,
					rotate: [0, 0, 0],
					translate: [0, 0, param.EH3]
				},
				{
					outName: `subpax_${designName}_plate4`,
					face: `${designName}_facePlate`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.EH2,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_back`,
					face: `${designName}_faceBack`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.T4,
					rotate: [0, 0, 0],
					translate: [0, param.T4, 0]
				},
				...lExtrudes
			],
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: [
						`subpax_${designName}_plate2`,
						`subpax_${designName}_plate4`,
						`subpax_${designName}_back`,
						...lUnion
					]
				}
			]
		};
		// step-9 : optional sub-design parameter export
		// sub-design
		rGeome.sub = {};
		// step-10 : final log message
		// finalize
		rGeome.logstr += 'Long2D drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const long2dDef: tPageDef = {
	pTitle: 'long2d',
	pDescription: 'A long arm with many legs moving in one 2D-plan',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { long2dDef };
