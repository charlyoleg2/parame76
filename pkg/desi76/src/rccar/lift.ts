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
	ctrRectangle,
	figure,
	degToRad,
	radToDeg,
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
		//const LR1 = param.LD1 / 2;
		const LR2 = param.LD2 / 2;
		//const MR1 = param.MD1 / 2;
		const MR2 = param.MD2 / 2;
		const pi2 = Math.PI / 2;
		const epsilon = 0.01;
		const a12 = degToRad(param.A1) / 2;
		const a12b1 = Math.atan2(R2, R2 + param.S1);
		const a12b2 = pi2 - Math.acos(R2 / (R2 + param.S2min));
		const W72a = Math.tan(a12) * (R2 + param.S1);
		const W72c = Math.sin(a12) * (R2 + param.S2min);
		const CY = param.T3 + param.S1 + R2;
		const AX = Math.sin(a12) * R2;
		const AY = CY - Math.cos(a12) * R2;
		let outlineMode = 1; // 1, 2 or 3
		let W72 = W72a;
		let BY = param.T3;
		if (a12 > a12b1) {
			if (a12 < a12b2) {
				outlineMode = 2;
				W72 = R2;
				BY = CY - R2 / Math.tan(a12);
			} else {
				outlineMode = 3;
				W72 = W72c;
				BY = CY - Math.cos(a12) * (R2 + param.S2min);
			}
		}
		const BX = W72;
		const LY = param.LX1 + LR2;
		const MY = param.MX1 + MR2;
		const T45 = param.T4 + param.T5;
		const T445 = 2 * param.T4 + param.T5;
		const T6672 = param.T6 + param.T7 / 2;
		// step-5 : checks on the parameter values
		if (R2 < R1 + param.T1 + param.T2) {
			throw `err230: D2 ${ffix(2 * R2)} is too small compare to D1 ${ffix(2 * R1)}, T1 ${ffix(param.T1)} and T2 ${ffix(param.T2)}`;
		}
		const lB = Math.sqrt(BX ** 2 + (BY - CY) ** 2);
		if (lB < R2 + param.S2min - epsilon) {
			throw `err250: lB ${ffix(lB)} is too small compare to (D2)R2 ${ffix(R2)} and S2min ${ffix(param.S2min)}`;
		}
		if (BY < param.T3) {
			throw `err270: S1 ${ffix(param.S1)} is too small compare to S2min ${ffix(param.S2min)}`;
		}
		if (param.LX2 > LY) {
			throw `err168: LX2 ${ffix(param.LX2)} is too large compare to LX1 ${ffix(param.LX1)} and LD2 ${ffix(2 * LR2)}`;
		}
		if (2 * W72 < 2 * T445 + 2 * T6672) {
			throw `err171: W7 ${ffix(2 * W72)} is too small compare to T4 ${ffix(param.T4)}, T5, T6, T7`;
		}
		// step-6 : any logs
		rGeome.logstr += `W7 ${ffix(2 * W72)} mm  outline-mode ${outlineMode}\n`;
		rGeome.logstr += `A1 bounds  b1 ${ffix(radToDeg(2 * a12b1))}  b2 ${ffix(radToDeg(2 * a12b2))} degree\n`;
		// step-7 : drawing of the figures
		// figTopPlate
		const ctrTopPlate = contour(-W72, 0)
			//.addCornerRounded(param.R2)
			.addSegStrokeA(W72, 0)
			//.addCornerRounded(param.R2)
			.addSegStrokeA(BX, BY)
			.addCornerRounded(param.R2)
			.addSegStrokeA(AX, AY)
			.addCornerRounded(param.R2)
			.addPointA(0, CY + R2)
			.addPointA(-AX, AY)
			.addSegArc2()
			.addCornerRounded(param.R2)
			.addSegStrokeA(-BX, BY)
			.addCornerRounded(param.R2)
			.closeSegStroke();
		figTopPlate.addMainOI([ctrTopPlate, contourCircle(0, CY, R1)]);
		figTopPlate.addSecond(ctrRectangle(-W72, -LY, param.T4, LY));
		figTopPlate.addSecond(ctrRectangle(-W72 + T45, -LY, param.T4, LY));
		figTopPlate.addSecond(ctrRectangle(W72 - T445, -LY, param.T4, LY));
		figTopPlate.addSecond(ctrRectangle(W72 - param.T4, -LY, param.T4, LY));
		figTopPlate.addSecond(ctrRectangle(-T6672, -MY, param.T6, MY));
		figTopPlate.addSecond(ctrRectangle(T6672 - param.T6, -MY, param.T6, MY));
		// figTopEnd
		// figTopBack
		const ctrTopBack = contour(-W72, 0)
			.addSegStrokeA(W72, 0)
			.addSegStrokeA(W72, param.T3)
			.addCornerRounded(param.R2)
			.addSegStrokeA(-W72, param.T3)
			.addCornerRounded(param.R2)
			.closeSegStroke();
		figTopPlate.addMainO(ctrTopPlate);
		figTopBack.mergeFigure(figTopPlate, true);
		// figTopPlate again
		//figTopPlate.addSecond(ctrRectangle(-W72, 0, 2 * W72, param.T3));
		figTopPlate.addSecond(ctrTopBack);
		figTopPlate.addSecond(contourCircle(0, CY, R2));
		figTopPlate.addSecond(contourCircle(0, CY, R2 + param.S2min));
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
