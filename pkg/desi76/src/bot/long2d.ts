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
	partName: 'long2d',
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
		pNumber('A5', 'degree', 90, 0, 180, 1),
		pNumber('W6', 'mm', 10, 0, 1000, 1),
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
		D1: 'long2d_top.svg',
		D2: 'long2d_side.svg',
		L3: 'long2d_top.svg',
		L4: 'long2d_top.svg',
		W5: 'long2d_top.svg',
		Nac: 'long2d_top.svg',
		R34: 'long2d_top.svg',
		A5: 'long2d_top.svg',
		W6: 'long2d_top.svg',
		T3: 'long2d_top.svg',
		T4: 'long2d_top.svg',
		H1: 'long2d_top.svg',
		H2: 'long2d_top.svg',
		H3: 'long2d_top.svg',
		W8: 'long2d_top.svg',
		H8: 'long2d_top.svg',
		D8: 'long2d_top.svg'
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
	const figBack = figure();
	const figT3 = figure();
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
		const H23 = param.H2 + param.H3;
		const H123 = param.H1 + H23;
		const pi2 = Math.PI / 2;
		const Y4 = param.L4 + param.T3 * Math.tan((pi2 - a2) / 2);
		const X5 = param.W5 * Math.cos(a5);
		const Y5 = param.W5 * Math.sin(a5);
		const W7 = param.Nac === 0 ? param.W5 : param.W6 + 2 * X5;
		const X8 = (W7 - param.W8) / 2;
		const Y8 = (param.H1 - param.H8) / 2;
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
			rGeome.logstr += `angle between holders: ${ffix(radToDeg(2 * a5))}\n`;
		}
		rGeome.logstr += `W7 ${ffix(W7)}\n`;
		// step-7 : drawing of the figures
		// sub-functions
		const p21 = point(W52, L432).translatePolar(-pi2 + a2, R2);
		const p22 = point(W52, L432).translatePolar(-pi2 - a2, R2);
		const p21i = point(W52, L432).translatePolar(-pi2 + a2, R2 - param.T3);
		const p22i = point(W52, L432).translatePolar(-pi2 - a2, R2 - param.T3);
		function ctrSingle(iT3nPlate: number) {
			const rCtr = contour(0, 0);
			if (iT3nPlate === 1) {
				rCtr.addSegStrokeA(param.T3, 0)
					.addSegStrokeA(param.T3, Y4)
					.addCornerRounded(param.R34)
					.addSegStrokeA(p22i.cx, p22i.cy)
					.addPointA(W52, L432 + R2 - param.T3)
					.addPointA(p21i.cx, p21i.cy)
					.addSegArc2()
					.addSegStrokeA(2 * W52 - param.T3, Y4)
					.addCornerRounded(param.R34)
					.addSegStrokeA(2 * W52 - param.T3, 0);
			}
			rCtr.addSegStrokeA(2 * W52, 0)
				.addSegStrokeA(2 * W52, param.L4)
				.addCornerRounded(param.R34)
				.addSegStrokeA(p21.cx, p21.cy)
				.addPointA(W52, L432 + R2)
				.addPointA(p22.cx, p22.cy)
				.addSegArc2()
				.addSegStrokeA(0, param.L4)
				.addCornerRounded(param.R34)
				.closeSegStroke();
			return rCtr;
		}
		const p30 = point(X5 / 2, param.L4 + Y5 / 2).translatePolar(a5 + pi2, param.L3 + R2);
		const p31 = p30.translatePolar(a5 - pi2 + a2, R2);
		const p32 = p30.translatePolar(a5 + pi2, R2);
		const p33 = p30.translatePolar(a5 - pi2 - a2, R2);
		const p31i = p30.translatePolar(a5 - pi2 + a2, R2 - param.T3);
		const p32i = p30.translatePolar(a5 + pi2, R2 - param.T3);
		const p33i = p30.translatePolar(a5 - pi2 - a2, R2 - param.T3);
		const p40 = point(W7 - X5 / 2, param.L4 + Y5 / 2).translatePolar(pi2 - a5, param.L3 + R2);
		const p41 = p40.translatePolar(-a5 - pi2 + a2, R2);
		const p42 = p40.translatePolar(-a5 + pi2, R2);
		const p43 = p40.translatePolar(-a5 - pi2 - a2, R2);
		const p41i = p40.translatePolar(-a5 - pi2 + a2, R2 - param.T3);
		const p42i = p40.translatePolar(-a5 + pi2, R2 - param.T3);
		const p43i = p40.translatePolar(-a5 - pi2 - a2, R2 - param.T3);
		const Y41 = param.L4 + param.T3 * Math.tan((a5 + (pi2 - a2)) / 2);
		const Y42 = param.L4 + Y5 - param.T3;
		const Y43 = Y42;
		const Y44 = Y41;
		const a42 = pi2 - a5 + (pi2 - a2);
		const X42 = X5 - param.T3 * Math.tan(a42 / 2);
		const X43 = W7 - X42;
		function ctrDouble(iT3nPlate: number) {
			const rCtr = contour(0, 0);
			if (iT3nPlate === 1) {
				rCtr.addSegStrokeA(param.T3, 0)
					.addSegStrokeA(param.T3, Y41)
					.addCornerRounded(param.R34)
					.addSegStrokeA(p33i.cx, p33i.cy)
					.addPointA(p32i.cx, p32i.cy)
					.addPointA(p31i.cx, p31i.cy)
					.addSegArc2()
					.addSegStrokeA(X42, Y42)
					.addCornerRounded(param.R34)
					.addSegStrokeA(X43, Y43)
					.addCornerRounded(param.R34)
					.addSegStrokeA(p43i.cx, p43i.cy)
					.addPointA(p42i.cx, p42i.cy)
					.addPointA(p41i.cx, p41i.cy)
					.addSegArc2()
					.addSegStrokeA(W7 - param.T3, Y44)
					.addCornerRounded(param.R34)
					.addSegStrokeA(W7 - param.T3, 0);
			}
			rCtr.addSegStrokeA(W7, 0)
				.addSegStrokeA(W7, param.L4)
				.addCornerRounded(param.R34)
				.addSegStrokeA(p41.cx, p41.cy)
				.addPointA(p42.cx, p42.cy)
				.addPointA(p43.cx, p43.cy)
				.addSegArc2()
				.addSegStrokeA(W7 - X5, param.L4 + Y5)
				.addCornerRounded(param.R34)
				.addSegStrokeA(X5, param.L4 + Y5)
				.addCornerRounded(param.R34)
				.addSegStrokeA(p31.cx, p31.cy)
				.addPointA(p32.cx, p32.cy)
				.addPointA(p33.cx, p33.cy)
				.addSegArc2()
				.addSegStrokeA(0, param.L4)
				.addCornerRounded(param.R34)
				.closeSegStroke();
			return rCtr;
		}
		// figPlate
		if (param.Nac === 0) {
			figPlate.addMainOI([ctrSingle(0), contourCircle(W52, L432, R1)]);
		} else {
			figPlate.addMainOI([
				ctrDouble(0),
				contourCircle(p30.cx, p30.cy, R1),
				contourCircle(p40.cx, p40.cy, R1)
			]);
		}
		figPlate.addSecond(ctrRectangle(0, 0, W7, param.T4));
		figPlate.addSecond(ctrRectangle(X8 - R8, 0, 2 * R8, param.T4));
		figPlate.addSecond(ctrRectangle(W7 - X8 - R8, 0, 2 * R8, param.T4));
		// figBack
		figBack.addMainOI([
			ctrRectangle(0, H23, W7, param.H1),
			contourCircle(X8, H23 + Y8, R8),
			contourCircle(W7 - X8, H23 + Y8, R8),
			contourCircle(X8, H123 - Y8, R8),
			contourCircle(W7 - X8, H123 - Y8, R8)
		]);
		if (param.Nac === 0) {
			figBack.addSecond(ctrRectangle(W52 - R1, 0, 2 * R1, H23));
			figBack.addSecond(ctrRectangle(W52 - R2, 0, 2 * R2, H23));
			figBack.addSecond(ctrRectangle(W52 - R1, H123, 2 * R1, H23));
			figBack.addSecond(ctrRectangle(W52 - R2, H123, 2 * R2, H23));
		} else {
			figBack.addSecond(ctrRectangle(p30.cx - R1, 0, 2 * R1, H23));
			figBack.addSecond(ctrRectangle(p30.cx - R2, 0, 2 * R2, H23));
			figBack.addSecond(ctrRectangle(p40.cx - R1, 0, 2 * R1, H23));
			figBack.addSecond(ctrRectangle(p40.cx - R2, 0, 2 * R2, H23));
			figBack.addSecond(ctrRectangle(p30.cx - R1, H123, 2 * R1, H23));
			figBack.addSecond(ctrRectangle(p30.cx - R2, H123, 2 * R2, H23));
			figBack.addSecond(ctrRectangle(p40.cx - R1, H123, 2 * R1, H23));
			figBack.addSecond(ctrRectangle(p40.cx - R2, H123, 2 * R2, H23));
		}
		// figT3
		if (param.Nac === 0) {
			figT3.addMainO(ctrSingle(1));
			figT3.addMainOI([
				contourCircle(W52, L432, R1 + param.T3),
				contourCircle(W52, L432, R1)
			]);
		} else {
			figT3.addMainO(ctrDouble(1));
			figT3.addMainOI([
				contourCircle(p30.cx, p30.cy, R1 + param.T3),
				contourCircle(p30.cx, p30.cy, R1)
			]);
			figT3.addMainOI([
				contourCircle(p40.cx, p40.cy, R1 + param.T3),
				contourCircle(p40.cx, p40.cy, R1)
			]);
		}
		figT3.mergeFigure(figPlate, true);
		// final figure list
		rGeome.fig = {
			facePlate: figPlate,
			faceBack: figBack,
			faceT3: figT3
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
				translate: [0, 0, H123 + param.H2]
			});
			lUnion.push(`subpax_${designName}_t35`);
		}
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
					face: `${designName}_faceBack`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.T4,
					rotate: [pi2, 0, 0],
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
		rGeome.logstr += 'Plan2D drawn successfully!\n';
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
