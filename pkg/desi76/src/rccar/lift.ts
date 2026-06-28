// lift.ts
// the holder of pivot of rc-car

// step-1 : import from geometrix
import type {
	//tContour,
	//tOuterInner,
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
	degToRad,
	//radToDeg,
	ffix,
	pNumber,
	//pCheckbox,
	//pDropdown,
	pSectionSeparator,
	EExtrude,
	EBVolume,
	initGeom
} from 'geometrix';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
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

// step-3 : definition of the function that creates from the parameter-values the figures and construct the 3D
function pGeom(t: number, param: tParamVal, suffix = ''): tGeom {
	const rGeome = initGeom(pDef.partName + suffix);
	const figTopPlate = figure();
	const figTopEnd = figure();
	const figTopBack = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const R1 = param.D1 / 2;
		const R2 = param.D2 / 2;
		const a12 = degToRad(param.A1) / 2;
		const W72a = Math.sin(a12) * (R2 + param.S2min);
		const W72b = R2;
		const W72c = Math.tan(a12) * (R2 + param.S1);
		let outlineMode = 1; // 1, 2 or 3
		let W72 = W72a;
		if (W72b < W72a) {
			if (W72b < W72c) {
				outlineMode = 3;
				W72 = W72c;
			} else {
				outlineMode = 2;
				W72 = W72b;
			}
		}
		const CY = param.T3 + param.S1 + R2;
		// step-5 : checks on the parameter values
		if (R2 < R1 + param.T1 + param.T2) {
			throw `err230: D2 ${ffix(2 * R2)} is too small compare to D1 ${ffix(2 * R1)}, T1 ${ffix(param.T1)} and T2 ${ffix(param.T2)}`;
		}
		// step-6 : any logs
		rGeome.logstr += `W7 ${ffix(2 * W72)}  outline-mode ${ffix(outlineMode)}\n`;
		// step-7 : drawing of the figures
		// figTopPlate
		const ctrTopPlate = contour(-W72, 0)
			//.addCornerRounded(param.R2)
			.addSegStrokeA(W72, 0)
			//.addCornerRounded(param.R2)
			.addSegStrokeA(W72, param.T3)
			.addSegStrokeA(R2, CY)
			.addPointA(0, CY + R2)
			.addPointA(-R2, CY)
			.addSegArc2()
			.addSegStrokeA(-W72, param.T3)
			.closeSegStroke();
		figTopPlate.addMainOI([ctrTopPlate, contourCircle(0, CY, R1)]);
		figTopPlate.addSecond(contourCircle(0, CY, R2));
		// final figure list
		rGeome.fig = {
			faceTopPlate: figTopPlate,
			faceTopEnd: figTopEnd,
			faceTopBack: figTopBack
		};
		// step-8 : recipes of the 3D construction
		// volume
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_top`,
					face: `${designName}_faceTopPlate`,
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
		// step-9 : optional sub-design parameter export
		// sub-design
		rGeome.sub = {};
		// step-10 : final log message
		// finalize
		rGeome.logstr += 'lift drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const liftDef: tPageDef = {
	pTitle: 'lift',
	pDescription: 'the holder of pivot of rc-car',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { liftDef };
