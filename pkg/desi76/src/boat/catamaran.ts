// catamaran.ts
// a box

// step-1 : import from geometrix
import type {
	tContour,
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
	//degToRad,
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
	// partName is used in URL. Choose a name without slash, backslash and space.
	partName: 'catamaran',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('W1', 'mm', 200, 10, 1000, 1),
		pNumber('W2', 'mm', 100, 10, 1000, 1),
		pNumber('W3p', '%', 10, 1, 99, 1),
		pNumber('L1', 'mm', 300, 1, 1000, 1),
		pNumber('L2', 'mm', 150, 1, 1000, 1),
		pNumber('L3', 'mm', 200, 1, 1000, 1),
		pSectionSeparator('others'),
		pNumber('H1', 'mm', 120, 1, 1000, 1),
		pNumber('H2', 'mm', 40, 1, 1000, 1),
		pNumber('H3', 'mm', 100, 1, 1000, 1),
		pNumber('T1', 'mm', 2, 0.1, 20, 0.1),
		pNumber('T2', 'mm', 5, 0.1, 30, 0.1),
		pNumber('R21', 'mm', 1, 0, 500, 1),
		pNumber('R22', 'mm', 3, 0, 500, 1),
		pSectionSeparator('details'),
		pNumber('D1', 'mm', 50, 1, 500, 1),
		pNumber('D4', 'mm', 40, 1, 500, 1),
		pNumber('L4', 'mm', 40, 1, 500, 1)
	],
	paramSvg: {
		W1: 'catamaran_top.svg',
		W2: 'catamaran_top.svg',
		W3p: 'catamaran_top.svg',
		L1: 'catamaran_top.svg',
		L2: 'catamaran_top.svg',
		L3: 'catamaran_top.svg',
		H1: 'catamaran_side.svg',
		H2: 'catamaran_side.svg',
		H3: 'catamaran_side.svg',
		T1: 'catamaran_front.svg',
		T2: 'catamaran_top.svg',
		R21: 'catamaran_top.svg',
		R22: 'catamaran_top.svg',
		D1: 'catamaran_front.svg',
		D4: 'catamaran_top.svg',
		L4: 'catamaran_top.svg'
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
	const figFloatBase = figure();
	const figFloatWall = figure();
	const figCabineBase = figure();
	const figCabineWall = figure();
	const figCabineEnv = figure();
	const figVault = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const pi = Math.PI;
		const pi2 = pi / 2;
		const W212 = param.W1 + 2 * param.W2;
		const L212 = param.L1 + 2 * param.L2;
		const R1 = param.D1 / 2;
		const R4 = param.D4 / 2;
		const W3p = param.W3p / 100.0;
		const T1 = param.T1;
		const T2 = param.T2;
		const L1 = param.L1;
		const L2 = param.L2;
		const L3 = param.L3;
		const W1 = param.W1;
		const W2 = param.W2;
		const W2b = W2 - 2 * T1;
		const floatLength = L212 + 2 * L3;
		const aEnv = Math.atan2(param.H3, L2);
		const a2 = pi2 - aEnv;
		const a3 = a2 / 2;
		const Y3 = T1 * Math.tan(a3);
		const LH3 = Math.sqrt(L2 ** 2 + param.H3 ** 2);
		// step-5 : checks on the parameter values
		if (param.L4 < R4) {
			throw `err089: L4 ${param.L4} is too small compare to D4 ${param.D4}`;
		}
		if (W1 < 2 * (R1 + R4)) {
			throw `err109: W1 ${W1} is too small compare to D1 ${param.D1} and D4 ${param.D4}`;
		}
		// step-6 : any logs
		rGeome.logstr += `cabine surface ${ffix(W212 * L212)} mm2\n`;
		rGeome.logstr += `float length ${ffix(floatLength)}, width W212 ${ffix(W212)} mm\n`;
		// step-7 : drawing of the figures
		// sub-functions
		function makeCtrFloat(
			x0: number,
			y0: number,
			dx1: number,
			dy1: number,
			px2: number,
			dy2: number,
			cr: number
		): tContour {
			const dx2 = dx1 * px2;
			const dx2b = dx1 - dx2;
			const rCtr = contour(x0, y0)
				.addPointR(dx2, -dy2)
				//.addSegStroke()
				.addSegArc3(-pi2, true)
				.addCornerRounded(cr)
				.addPointR(dx2b, dy2)
				//.addSegStroke()
				.addSegArc3(-pi2, false)
				.addSegStrokeR(0, dy1)
				.addPointR(-dx2b, dy2)
				//.addSegStroke()
				.addSegArc3(pi2, true)
				.addCornerRounded(cr)
				.addPointR(-dx2, -dy2)
				//.addSegStroke()
				.addSegArc3(pi2, false)
				.closeSegStroke();
			return rCtr;
		}
		function makeCtrU(x0: number, y0: number, iw: number, ih: number): tContour {
			const rCtr = contour(x0, y0)
				.addSegStrokeR(iw, 0)
				.addSegStrokeR(0, ih)
				.addSegStrokeR(-T1, 0)
				.addSegStrokeR(0, -ih + T1)
				.addSegStrokeR(-iw + 2 * T1, 0)
				.addSegStrokeR(0, ih - T1)
				.addSegStrokeR(-T1, 0)
				.closeSegStroke();
			return rCtr;
		}
		function makeCtrCabEnv(x0: number, Sx: number): tContour {
			const rCtr = contour(x0, param.H1)
				.addSegStrokeR(Sx * T1, 0)
				.addSegStrokeR(0, param.H2 - Y3)
				.addSegStrokeRP(pi2 - Sx * a2, LH3 - Y3)
				.addSegStrokeRP(pi2 - Sx * (a2 - pi2), T1)
				.addSegStrokeRP(pi2 - Sx * (a2 + pi), LH3)
				.closeSegStroke();
			return rCtr;
		}
		function makeCtrVault(x0: number, Sx: number): tContour {
			const rCtr = contour(x0, param.H1 - R1)
				.addPointR(Sx * R1, R1)
				.addSegArc(R1, false, Sx < 0 ? true : false)
				.addSegStrokeR(0, T1)
				.addSegStrokeR(-Sx * (T1 + R1), 0)
				.addSegStrokeR(0, -T1 - R1)
				.closeSegStroke();
			return rCtr;
		}
		// figFloatWall
		const ctrFloatExt1 = makeCtrFloat(0, L3, W2, L212, 1 - W3p, L3, param.R21);
		const ctrFloatInt1 = makeCtrFloat(T1, L3, W2b, L212, 1 - W3p, L3 - T2, param.R22);
		const ctrFloatExt2 = makeCtrFloat(W2 + W1, L3, W2, L212, W3p, L3, param.R21);
		const ctrFloatInt2 = makeCtrFloat(W2 + W1 + T1, L3, W2b, L212, W3p, L3 - T2, param.R22);
		figFloatWall.addMainOI([ctrFloatExt1, ctrFloatInt1]);
		figFloatWall.addMainOI([ctrFloatExt2, ctrFloatInt2]);
		// figFloatBase
		figFloatBase.addMainO(ctrFloatExt1);
		figFloatBase.addMainO(ctrFloatExt2);
		// figCabineBase
		const ctrCabineBase = ctrRectangle(0, param.L3, W212, L212);
		const ctrCabineBaseHole = contourCircle(W212 / 2, L3 + T1 + param.L4, R4);
		figCabineBase.addMainOI([ctrCabineBase, ctrCabineBaseHole]);
		figCabineBase.mergeFigure(figFloatWall, true);
		figCabineBase.addSecond(ctrRectangle(W2, param.L3, R1, L212));
		figCabineBase.addSecond(ctrRectangle(W2 + W1 - R1, param.L3, R1, L212));
		figFloatWall.addSecond(ctrCabineBase);
		figFloatWall.addSecond(ctrCabineBaseHole);
		figFloatBase.addSecond(ctrCabineBase);
		figFloatBase.addSecond(ctrCabineBaseHole);
		// figCabineWall
		const ctrCabineWall = contour(L3, param.H1)
			.addSegStrokeR(L212, 0)
			.addSegStrokeR(0, param.H2)
			.addSegStrokeR(-L2, param.H3)
			.addSegStrokeR(-L1, 0)
			.addSegStrokeR(-L2, -param.H3)
			.closeSegStroke();
		figCabineWall.addMainO(ctrCabineWall);
		figCabineWall.addSecond(ctrRectangle(0, 0, floatLength, param.H1));
		figCabineWall.addSecond(ctrRectangle(L3, param.H1 - R1, L212, R1));
		figCabineWall.addSecond(ctrRectangle(L3, param.H1, L212, T1));
		// figCabineEnv
		figCabineEnv.addMainO(makeCtrCabEnv(L3, 1));
		figCabineEnv.addMainO(makeCtrCabEnv(L3 + L212, -1));
		figCabineEnv.mergeFigure(figCabineWall, true);
		// figVault
		figVault.addMainO(makeCtrVault(W2, 1));
		figVault.addMainO(makeCtrVault(W2 + W1, -1));
		figVault.addSecond(makeCtrU(0, 0, W2, param.H1));
		figVault.addSecond(makeCtrU(W2 + W1, 0, W2, param.H1));
		figVault.addSecond(makeCtrU(0, param.H1, W212, param.H2 + param.H3));
		// final figure list
		rGeome.fig = {
			faceFloatWall: figFloatWall,
			faceFloatBase: figFloatBase,
			faceCabineBase: figCabineBase,
			faceCabineWall: figCabineWall,
			faceCabineEnv: figCabineEnv,
			faceVault: figVault
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_floatB`,
					face: `${designName}_faceFloatBase`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: T1,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_floatW`,
					face: `${designName}_faceFloatWall`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H1,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_cabineB`,
					face: `${designName}_faceCabineBase`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: T1,
					rotate: [0, 0, 0],
					translate: [0, 0, param.H1]
				},
				{
					outName: `subpax_${designName}_cabineW1`,
					face: `${designName}_faceCabineWall`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: T1,
					rotate: [pi2, 0, pi2],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_cabineW2`,
					face: `${designName}_faceCabineWall`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: T1,
					rotate: [pi2, 0, pi2],
					translate: [W212 - T1, 0, 0]
				},
				{
					outName: `subpax_${designName}_cabineEnv`,
					face: `${designName}_faceCabineEnv`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: W212,
					rotate: [pi2, 0, pi2],
					translate: [0, 0, 0]
				},
				{
					outName: `subpax_${designName}_vault`,
					face: `${designName}_faceVault`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: L212,
					rotate: [pi2, 0, 0],
					translate: [0, L212 + L3, 0]
				}
			],
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: [
						`subpax_${designName}_floatB`,
						`subpax_${designName}_floatW`,
						`subpax_${designName}_cabineB`,
						`subpax_${designName}_cabineW1`,
						`subpax_${designName}_cabineW2`,
						`subpax_${designName}_cabineEnv`,
						`subpax_${designName}_vault`
					]
				}
			]
		};
		// step-9 : optional sub-design parameter export
		// sub-design
		rGeome.sub = {};
		// step-10 : final log message
		// finalize
		rGeome.logstr += 'catamaran drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const catamaranDef: tPageDef = {
	pTitle: 'catamaran',
	pDescription: 'A box',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { catamaranDef };
