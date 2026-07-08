// pivot.ts
// the motor-wheel block of rc-car

// step-1 : import from geometrix
import type {
	tContour,
	//tOuterInner,
	tParamDef,
	tParamVal,
	tGeom,
	//DesignParam,
	//tInherit,
	tExtrude,
	//tSubInst,
	//tSubDesign
	//Transform2d,
	//Transform3d,
	tPageDef
} from 'geometrix';
import {
	//designParam,
	//checkGeom,
	//prefixLog,
	//point,
	//Point,
	//ShapePoint,
	contour,
	contourCircle,
	//ctrRectangle,
	figure,
	//degToRad,
	radToDeg,
	ffix,
	pNumber,
	pCheckbox,
	//pDropdown,
	pSectionSeparator,
	EExtrude,
	EBVolume,
	initGeom
} from 'geometrix';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
const pDef: tParamDef = {
	partName: 'pivot',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('D1', 'mm', 60, 1, 1000, 1),
		pNumber('D2', 'mm', 100, 1, 1000, 1),
		pNumber('T1', 'mm', 5, 1, 100, 1),
		pNumber('T2', 'mm', 2, 1, 100, 1),
		pNumber('W4', 'mm', 100, 1, 1000, 1),
		pSectionSeparator('top details'),
		pNumber('S1', 'mm', 2, 0, 500, 1),
		pNumber('S2min', 'mm', 20, 1, 500, 1),
		pNumber('S3', 'mm', 40, 1, 1000, 1),
		pCheckbox('hollowTop', true),
		pNumber('RR2', 'mm', 2, 0, 100, 1),
		pNumber('A2', 'degree', 100, 0, 200, 1),
		pSectionSeparator('side'),
		pNumber('T3a', 'mm', 2, 1, 100, 1),
		pNumber('T3b', 'mm', 4, 1, 100, 1),
		pNumber('T4a', 'mm', 2, 1, 100, 1),
		pNumber('T4b', 'mm', 4, 1, 100, 1),
		pNumber('T5a', 'mm', 2, 1, 100, 1),
		pNumber('T5b', 'mm', 4, 1, 100, 1),
		pNumber('S5a', 'mm', 10, 1, 500, 1),
		pNumber('S5b', 'mm', 80, 1, 500, 1),
		pNumber('RR5', 'mm', 5, 0, 100, 1),
		pSectionSeparator('heigths'),
		pNumber('H11', 'mm', 3, 1, 100, 1),
		pNumber('H12', 'mm', 3, 1, 1000, 1),
		pNumber('H13', 'mm', 80, 1, 1000, 1),
		pNumber('H14', 'mm', 3, 1, 1000, 1),
		pNumber('H15', 'mm', 3, 1, 100, 1),
		pNumber('H2', 'mm', 40, 1, 500, 1),
		pNumber('H31', 'mm', 3, 1, 100, 1),
		pNumber('H32', 'mm', 30, 1, 500, 1),
		pNumber('H33', 'mm', 30, 1, 500, 1),
		pNumber('H34', 'mm', 0, 0, 500, 1),
		pNumber('H35', 'mm', 60, 1, 1000, 1),
		pNumber('H36', 'mm', 30, 1, 1000, 1)
	],
	paramSvg: {
		D1: 'pivot_plate.svg',
		D2: 'pivot_plate.svg',
		T1: 'pivot_plate.svg',
		T2: 'pivot_plate.svg',
		W4: 'pivot_plate.svg',
		S1: 'pivot_plate.svg',
		S2min: 'pivot_plate.svg',
		S3: 'pivot_plate.svg',
		hollowTop: 'pivot_plate.svg',
		RR2: 'pivot_plate.svg',
		A2: 'pivot_wall.svg',
		T3a: 'pivot_plate.svg',
		T3b: 'pivot_plate.svg',
		T4a: 'pivot_plate.svg',
		T4b: 'pivot_plate.svg',
		T5a: 'pivot_side_x.svg',
		T5b: 'pivot_side_x.svg',
		S5a: 'pivot_side_x.svg',
		S5b: 'pivot_side_x.svg',
		RR5: 'pivot_side_x.svg',
		H11: 'pivot_side_x.svg',
		H12: 'pivot_side_x.svg',
		H13: 'pivot_side_x.svg',
		H14: 'pivot_side_x.svg',
		H15: 'pivot_side_x.svg',
		H2: 'pivot_side_x.svg',
		H31: 'pivot_side_x.svg',
		H32: 'pivot_side_x.svg',
		H33: 'pivot_side_x.svg',
		H34: 'pivot_side_x.svg',
		H35: 'pivot_side_x.svg',
		H36: 'pivot_side_x.svg'
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
	const figTopPlate1 = figure();
	const figTopPlate2 = figure();
	const figTopWall1 = figure();
	const figTopWall2 = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const R1 = param.D1 / 2;
		const R2 = param.D2 / 2;
		const pi2 = Math.PI / 2;
		//const epsilon = 0.01;
		const Lextra = param.S1 + param.T3a + param.T3b + param.S3 + param.T4a + param.T4b;
		const X9 = R2 + Lextra;
		const Y9 = param.W4 / 2;
		const R9 = Math.sqrt(X9 ** 2 + Y9 ** 2);
		const R8 = R2 + param.S2min;
		const outline1Mode = R9 < R8 ? 1 : 2;
		if (R8 < Y9) {
			throw `err107: W4 ${ffix(param.W4)} is too large compare to S2min ${ffix(param.S2min)} and D2 ${ffix(param.D2)}`;
		}
		const X8 = Math.sqrt(R8 ** 2 - Y9 ** 2);
		const X8b = outline1Mode === 2 ? X8 : X9;
		const a12 = Math.atan2(Y9, X8b);
		const X7 = R2 * Math.cos(a12);
		const Y7 = R2 * Math.sin(a12);
		//const T2min = param.T4b * Math.tan(Math.atan(Y9 / X9));
		const T2min = (param.T4b * Y9) / X9;
		const a8i = pi2 - a12 / 2;
		const X8i = X8 + param.T2 * Math.tan(pi2 - a8i);
		const Y8i = Y9 - param.T2;
		const outline2Mode = X8i < X9 ? 2 : 1;
		const Y9i = outline2Mode === 2 ? Y9 - param.T2 : Y9 - param.T2 / Math.cos(a12);
		const a7i = a12 - Math.atan2(param.T2, R2);
		if (a7i < 0) {
			throw `err157: T2 ${ffix(param.T2)} is too large compare to A1 ${ffix(radToDeg(2 * a12))}`;
		}
		const R2i = R2 - param.T2;
		const X7i = R2i * Math.cos(a7i);
		const Y7i = R2i * Math.sin(a7i);
		const H1tot = param.H11 + param.H12 + param.H13 + param.H14 + param.H15;
		const H3tot = param.H31 + param.H32 + param.H33 + param.H34 + param.H35 + param.H36;
		const Htot = H1tot + param.H2 + H3tot;
		const Lreturn = param.T5a + param.T5b + 2 * param.S5a + param.S5b + param.T4a + param.T4b;
		const Lend = R2 + Lextra - Lreturn;
		// step-5 : checks on the parameter values
		if (R2 < R1 + param.T1 + param.T2) {
			throw `err230: D2 ${ffix(2 * R2)} is too small compare to D1 ${ffix(2 * R1)}, T1 ${ffix(param.T1)} and T2 ${ffix(param.T2)}`;
		}
		if (param.T2 < T2min) {
			throw `err233: T2 ${ffix(param.T2)} is too small compare to T2min ${ffix(T2min)}, T4b ${ffix(param.T4b)}, A1 ${ffix(radToDeg(2 * a12))}`;
		}
		// step-6 : any logs
		rGeome.logstr += `Lextra ${ffix(Lextra)}  Rmax ${ffix(R9)}  Dmax ${ffix(2 * R9)} mm\n`;
		rGeome.logstr += `Lreturn ${ffix(Lreturn)}  Lend ${ffix(Lend)} mm\n`;
		rGeome.logstr += `H1tot ${ffix(H1tot)}  H3tot ${ffix(H3tot)}  Htot ${ffix(Htot)} mm\n`;
		rGeome.logstr += `A1 ${ffix(radToDeg(2 * a12))} degree, T2min ${ffix(T2min)}\n`;
		rGeome.logstr += `outline1Mode ${outline1Mode}\n`;
		// step-7 : drawing of the figures
		// figTopPlate1
		function ctrPlate(plateId: number): tContour {
			const rCtr = contour(X9, Y9);
			if (outline1Mode === 2) {
				rCtr.addSegStrokeA(X8, Y9).addCornerRounded(param.RR2);
			}
			rCtr.addSegStrokeA(X7, Y7)
				.addCornerRounded(param.RR2)
				.addPointA(-R2, 0)
				.addPointA(X7, -Y7)
				.addSegArc2()
				.addCornerRounded(param.RR2);
			if (outline1Mode === 2) {
				rCtr.addSegStrokeA(X8, -Y9).addCornerRounded(param.RR2);
			}
			rCtr.addSegStrokeA(X9, -Y9);
			if (plateId === 2) {
				rCtr.addSegStrokeR(0, param.T2)
					.addSegStrokeR(-param.T4b, 0)
					.addSegStrokeR(0, 2 * (Y9 - param.T2))
					.addSegStrokeR(param.T4b, 0);
			}
			rCtr.closeSegStroke();
			return rCtr;
		}
		figTopPlate1.addMainOI([ctrPlate(1), contourCircle(0, 0, R1)]);
		figTopPlate1.addSecond(contourCircle(0, 0, R9));
		// figTopPlate2
		figTopPlate2.addMainOI([ctrPlate(2), contourCircle(0, 0, R1)]);
		figTopPlate2.addSecond(contourCircle(0, 0, R9));
		// figTopWall1
		const ctrWall1 = contour(X9, Y9);
		if (outline1Mode === 2) {
			ctrWall1.addSegStrokeA(X8, Y9).addCornerRounded(param.RR2);
		}
		ctrWall1
			.addSegStrokeA(X7, Y7)
			.addCornerRounded(param.RR2)
			.addPointA(-R2, 0)
			.addPointA(X7, -Y7)
			.addSegArc2()
			.addCornerRounded(param.RR2);
		if (outline1Mode === 2) {
			ctrWall1.addSegStrokeA(X8, -Y9).addCornerRounded(param.RR2);
		}
		ctrWall1.addSegStrokeA(X9, -Y9).addSegStrokeA(X9, -Y9i);
		if (outline2Mode === 2) {
			ctrWall1.addSegStrokeA(X8i, -Y8i).addCornerRounded(param.RR2);
		}
		ctrWall1
			.addSegStrokeA(X7i, -Y7i)
			.addCornerRounded(param.RR2)
			.addPointA(-R2i, 0)
			.addPointA(X7i, Y7i)
			.addSegArc2()
			.addCornerRounded(param.RR2);
		if (outline2Mode === 2) {
			ctrWall1.addSegStrokeA(X8i, Y8i).addCornerRounded(param.RR2);
		}
		ctrWall1.addSegStrokeA(X9, Y9i).closeSegStroke();
		figTopWall1.addMainO(ctrWall1);
		figTopWall1.addSecond(contourCircle(0, 0, R9));
		// figTopWall2
		figTopWall2.addSecond(contourCircle(0, 0, R9));
		// final figure list
		rGeome.fig = {
			faceTopPlate1: figTopPlate1,
			faceTopPlate2: figTopPlate2,
			faceTopWall1: figTopWall1,
			faceTopWall2: figTopWall2
		};
		// step-8 : recipes of the 3D construction
		// volume
		const designName = rGeome.partName;
		//const partInherit: tInherit[] = [];
		const partExtrude: tExtrude[] = [];
		const partList: string[] = [];
		if (param.H3 > 0) {
			const eName = `subpax_${designName}_end1`;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceTopEnd`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H3,
				rotate: [0, 0, 0],
				translate: [0, 0, 0]
			});
			partList.push(eName);
		}
		rGeome.vol = {
			//inherits: partInherit,
			extrudes: partExtrude,
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: partList
				}
			]
		};
		// step-9 : optional sub-design parameter export
		// sub-design
		rGeome.sub = {};
		// step-10 : final log message
		// finalize
		rGeome.logstr += 'pivot drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const pivotDef: tPageDef = {
	pTitle: 'pivot',
	pDescription: 'the motor-wheel block of rc-car',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { pivotDef };
