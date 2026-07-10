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
	ctrRectangle,
	figure,
	degToRad,
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
		pNumber('D3', 'mm', 20, 1, 500, 1),
		pNumber('T1', 'mm', 5, 1, 100, 1),
		pNumber('T2', 'mm', 2, 1, 100, 1),
		pNumber('W4', 'mm', 80, 1, 1000, 1),
		pSectionSeparator('top details'),
		pNumber('S1', 'mm', 2, 0, 500, 1),
		pNumber('S2min', 'mm', 30, 1, 500, 1),
		pNumber('S3', 'mm', 40, 1, 1000, 1),
		pCheckbox('hollowTop', true),
		pNumber('RR2', 'mm', 2, 0, 100, 1),
		pNumber('RR3', 'mm', 5, 0, 100, 1),
		pNumber('A2', 'degree', 100, 0, 200, 1),
		pSectionSeparator('side'),
		pNumber('T3a', 'mm', 2, 1, 100, 1),
		pNumber('T3b', 'mm', 4, 0, 100, 1),
		pNumber('T4a', 'mm', 2, 1, 100, 1),
		pNumber('T4b', 'mm', 4, 0, 100, 1),
		pNumber('T5a', 'mm', 2, 1, 100, 1),
		pNumber('T5b', 'mm', 4, 0, 100, 1),
		pNumber('S5a', 'mm', 10, 1, 500, 1),
		pNumber('S5b', 'mm', 80, 1, 500, 1),
		pNumber('RR4', 'mm', 5, 0, 100, 1),
		pNumber('RR5', 'mm', 5, 0, 100, 1),
		pSectionSeparator('heigths'),
		pNumber('H11', 'mm', 3, 1, 100, 1),
		pNumber('H12', 'mm', 10, 1, 1000, 1),
		pNumber('H13', 'mm', 70, 1, 1000, 1),
		pNumber('H14', 'mm', 10, 1, 1000, 1),
		pNumber('H15', 'mm', 3, 1, 100, 1),
		pNumber('H2', 'mm', 40, 1, 500, 1),
		pNumber('H31', 'mm', 3, 1, 100, 1),
		pNumber('H32', 'mm', 30, 1, 500, 1),
		pNumber('H33', 'mm', 30, 1, 500, 1),
		pNumber('H34', 'mm', 0, 0, 500, 1),
		pNumber('H35', 'mm', 60, 1, 1000, 1),
		pNumber('H36', 'mm', 30, 1, 1000, 1),
		pSectionSeparator('relief'),
		pNumber('U31', 'mm', 2, 1, 100, 1),
		pNumber('U32', 'mm', 2, 1, 100, 1),
		pNumber('U33', 'mm', 2, 0, 100, 1),
		pNumber('RR31', 'mm', 2, 0, 100, 1),
		pNumber('U41', 'mm', 2, 1, 100, 1),
		pNumber('U42', 'mm', 2, 1, 100, 1),
		pNumber('U43', 'mm', 4, 1, 100, 1),
		pNumber('U51', 'mm', 2, 1, 100, 1),
		pNumber('U52', 'mm', 2, 1, 100, 1),
		pNumber('U53', 'mm', 4, 1, 100, 1)
	],
	paramSvg: {
		D1: 'pivot_plate.svg',
		D2: 'pivot_plate.svg',
		D3: 'pivot_side_y.svg',
		T1: 'pivot_plate.svg',
		T2: 'pivot_plate.svg',
		W4: 'pivot_plate.svg',
		S1: 'pivot_plate.svg',
		S2min: 'pivot_plate.svg',
		S3: 'pivot_plate.svg',
		hollowTop: 'pivot_plate.svg',
		RR2: 'pivot_plate.svg',
		RR3: 'pivot_plate.svg',
		A2: 'pivot_wall.svg',
		T3a: 'pivot_plate.svg',
		T3b: 'pivot_plate.svg',
		T4a: 'pivot_plate.svg',
		T4b: 'pivot_plate.svg',
		T5a: 'pivot_side_x.svg',
		T5b: 'pivot_side_x.svg',
		S5a: 'pivot_side_x.svg',
		S5b: 'pivot_side_x.svg',
		RR4: 'pivot_side_y.svg',
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
		H36: 'pivot_side_x.svg',
		U31: 'pivot_side_x.svg',
		U32: 'pivot_side_x.svg',
		U33: 'pivot_side_x.svg',
		RR31: 'pivot_side_x.svg',
		U41: 'pivot_side_x.svg',
		U42: 'pivot_side_x.svg',
		U43: 'pivot_side_x.svg',
		U51: 'pivot_side_x.svg',
		U52: 'pivot_side_x.svg',
		U53: 'pivot_side_x.svg'
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
	const figTopTube = figure();
	const figTopPlate3 = figure();
	const figSidePlate = figure();
	const figSideArc = figure();
	const figRelief3 = figure();
	const figRelief4 = figure();
	const figRelief5 = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const R1 = param.D1 / 2;
		const R2 = param.D2 / 2;
		const R3 = param.D3 / 2;
		const a22 = degToRad(param.A2) / 2;
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
		//const X8i = X8 + param.T2 * Math.cotan(a8i);
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
		const a6 = Math.PI - a22;
		const a6b = (a6 + a12) / 2;
		const holX1 = R2 + param.S1;
		const outline3Mode = X8 < holX1 ? 3 : outline1Mode;
		const holY1 = Math.min(Y9, holX1 * Math.tan(a12));
		const T22 = param.T2 / 2;
		const holX1i = holX1 + param.T3b + param.T3a;
		const holX2i = holX1i + param.S3;
		const outline4Mode = X8i < holX1i ? 3 : X8i < holX2i ? 2 : 1;
		function calcHolYi(ix: number): number {
			const yy = ix * Math.tan(a12) - param.T2 / Math.cos(a12);
			const ry = Math.min(yy, Y9i);
			return ry;
		}
		const holY1i = calcHolYi(holX1i);
		const holY2i = calcHolYi(holX2i);
		const H1432 = param.H12 + param.H13 + param.H14;
		const H1tot = param.H11 + H1432 + param.H15;
		const H3tot = param.H31 + param.H32 + param.H33 + param.H34 + param.H35 + param.H36;
		const Htot = H1tot + param.H2 + H3tot;
		const Lreturn = param.T5a + param.T5b + 2 * param.S5a + param.S5b + param.T4a + param.T4b;
		const Lend = R2 + Lextra - Lreturn;
		const Lplate3 = Lreturn - param.T4b - param.T5b;
		const H23 = param.H2 + H3tot;
		const a36a = Math.atan2(Y9, param.H35);
		const l36 = Math.sqrt(Y9 ** 2 + param.H35 ** 2);
		const a36b = Math.acos(param.H36 / l36);
		const a36 = pi2 - (a36a + a36b);
		const X36 = param.H36 * Math.cos(a36);
		const Y36 = param.H36 * Math.sin(a36);
		const U33p = Math.min(param.H15, param.H31) / 2;
		const U3h = param.H2 + 2 * U33p;
		const U3w = 2 * holY1;
		const U33 = param.U33 + U33p;
		// step-5 : checks on the parameter values
		if (R2 < R1 + param.T1 + param.T2) {
			throw `err230: D2 ${ffix(2 * R2)} is too small compare to D1 ${ffix(2 * R1)}, T1 ${ffix(param.T1)} and T2 ${ffix(param.T2)}`;
		}
		if (param.T2 < T2min) {
			throw `err233: T2 ${ffix(param.T2)} is too small compare to T2min ${ffix(T2min)}, T4b ${ffix(param.T4b)}, A1 ${ffix(radToDeg(2 * a12))}`;
		}
		if (param.H36 < R3 + param.U51 + param.U52) {
			throw `err236: D3 ${ffix(param.D3)} is too large compare to H36 ${ffix(param.H36)}`;
		}
		if (param.H36 < R3 + param.U41 + param.U42) {
			throw `err243: D3 ${ffix(param.D3)} is too large compare to H36 ${ffix(param.H36)}`;
		}
		if (param.U31 < T22) {
			throw `err248: U31 ${ffix(param.U31)} is too large compare to T2 ${ffix(param.T2)}`;
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
		const ctrHollow = contour(holX2i, holY2i).addCornerRounded(param.RR3);
		if (outline4Mode === 2) {
			ctrHollow.addSegStrokeA(X8i, Y8i).addCornerRounded(param.RR2);
		}
		ctrHollow
			.addSegStrokeA(holX1i, holY1i)
			.addCornerRounded(param.RR3)
			.addSegStrokeA(holX1i, -holY1i)
			.addCornerRounded(param.RR3);
		if (outline4Mode === 2) {
			ctrHollow.addSegStrokeA(X8i, -Y8i).addCornerRounded(param.RR2);
		}
		ctrHollow.addSegStrokeA(holX2i, -holY2i).addCornerRounded(param.RR3).closeSegStroke();
		const ctrsTopPlate1: tContour[] = [ctrPlate(1), contourCircle(0, 0, R1)];
		if (param.hollowTop === 1) {
			ctrsTopPlate1.push(ctrHollow);
		}
		figTopPlate1.addMainOI(ctrsTopPlate1);
		figTopPlate1.addSecond(contourCircle(0, 0, R8));
		figTopPlate1.addSecond(contourCircle(0, 0, R9));
		// figTopPlate2
		figTopPlate2.addMainOI([ctrPlate(2), contourCircle(0, 0, R1), ctrHollow]);
		figTopPlate2.addSecond(contourCircle(0, 0, R8));
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
		figTopWall1.addMainOI([contourCircle(0, 0, R1 + param.T1), contourCircle(0, 0, R1)]);
		figTopWall1.addSecond(contourCircle(0, 0, R8));
		figTopWall1.addSecond(contourCircle(0, 0, R9));
		// figTopWall2
		function ctrWall2(ay: number): tContour {
			const rCtr = contour(X9, ay * Y9);
			if (outline1Mode === 2) {
				rCtr.addSegStrokeA(X8, ay * Y9).addCornerRounded(param.RR2);
			}
			rCtr.addSegStrokeA(X7, ay * Y7)
				.addCornerRounded(param.RR2)
				.addPointAP(ay * a6b, R2)
				.addPointAP(ay * a6, R2)
				.addSegArc2()
				//.addCornerRounded(param.RR2)
				.addSegStrokeAP(ay * a6, R2i)
				//.addCornerRounded(param.RR2)
				.addPointAP(ay * a6b, R2i)
				.addPointA(X7i, ay * Y7i)
				.addSegArc2()
				.addCornerRounded(param.RR2);
			if (outline2Mode === 2) {
				rCtr.addSegStrokeA(X8i, ay * Y8i).addCornerRounded(param.RR2);
			}
			rCtr.addSegStrokeA(X9, ay * Y9i).closeSegStroke();
			return rCtr;
		}
		figTopWall2.addMainO(ctrWall2(1));
		figTopWall2.addMainO(ctrWall2(-1));
		figTopWall2.addMainOI([contourCircle(0, 0, R1 + param.T1), contourCircle(0, 0, R1)]);
		figTopWall2.addSecond(contourCircle(0, 0, R8));
		figTopWall2.addSecond(contourCircle(0, 0, R9));
		// figTopTube
		const ctrTopTube = contour(X9, Y9);
		if (outline3Mode === 2) {
			ctrTopTube.addSegStrokeA(X8, Y9).addCornerRounded(param.RR2);
		}
		ctrTopTube
			.addSegStrokeA(holX1, holY1)
			.addSegStrokeR(0, -T22)
			.addSegStrokeR(param.T3b, 0)
			.addSegStrokeR(0, -2 * (holY1 - T22))
			.addSegStrokeR(-param.T3b, 0)
			.addSegStrokeR(0, -T22);
		if (outline3Mode === 2) {
			ctrTopTube.addSegStrokeA(X8, -Y9).addCornerRounded(param.RR2);
		}
		ctrTopTube
			.addSegStrokeA(X9, -Y9)
			.addSegStrokeR(0, param.T2)
			.addSegStrokeR(-param.T4b, 0)
			.addSegStrokeR(0, 2 * (Y9 - param.T2))
			.addSegStrokeR(param.T4b, 0)
			.closeSegStroke();
		figTopTube.addMainOI([ctrTopTube, ctrHollow]);
		figTopTube.addSecond(contourCircle(0, 0, R8));
		figTopTube.addSecond(contourCircle(0, 0, R9));
		// figTopPlate3
		const ctrTopPlate3 = ctrRectangle(Lend + param.T5b, -Y9, Lplate3, 2 * Y9);
		figTopPlate3.addMainOI([ctrTopPlate3, ctrHollow]);
		figTopPlate3.addSecond(contourCircle(0, 0, R8));
		figTopPlate3.addSecond(contourCircle(0, 0, R9));
		// figSidePlate
		const ctrSidePlate = contour(-Y9, H3tot - param.H31)
			.addSegStrokeA(-Y9, param.H36 + param.H35)
			.addCornerRounded(param.RR4)
			.addSegStrokeA(-X36, param.H36 + Y36)
			.addPointA(0, 0)
			.addPointA(X36, param.H36 + Y36)
			.addSegArc2()
			.addSegStrokeA(Y9, param.H36 + param.H35)
			.addCornerRounded(param.RR4)
			.addSegStrokeA(Y9, H3tot - param.H31)
			.closeSegStroke();
		figSidePlate.addMainOI([ctrSidePlate, contourCircle(0, param.H36, R3)]);
		figSidePlate.addSecond(ctrRectangle(-Y9, H3tot - param.H31, param.W4, param.H31));
		figSidePlate.addSecond(ctrRectangle(-Y9, H3tot, param.W4, param.H2));
		figSidePlate.addSecond(ctrRectangle(-Y9, H23, param.W4, param.H15));
		figSidePlate.addSecond(ctrRectangle(-R2, H23, 2 * R2, H1tot));
		figSidePlate.addSecond(ctrRectangle(-Y9, H23 + param.H15, Y9 - Y9i, H1432));
		figSidePlate.addSecond(ctrRectangle(Y9i, H23 + param.H15, Y9 - Y9i, H1432));
		figSidePlate.addSecond(ctrRectangle(-Y9, H23 + param.H15 + H1432, param.W4, param.H11));
		const H3c = param.H36 + param.H35 + param.H34;
		figSidePlate.addSecond(ctrRectangle(-Y9, H3c, param.T2, param.H33));
		figSidePlate.addSecond(ctrRectangle(Y9 - param.T2, H3c, param.T2, param.H33));
		figSidePlate.addSecond(ctrRectangle(-Y9, H3c + param.H33, param.T2, param.H32));
		figSidePlate.addSecond(ctrRectangle(Y9 - param.T2, H3c + param.H33, param.T2, param.H32));
		// figSideArc
		const Xtube = R2 + param.S1 + param.T3b + param.T3a;
		const Htube = param.H31 + param.H2 + H1tot;
		const T4ab = param.T4a + param.T4b;
		const T5ab = param.T5a + param.T5b;
		const H3b = H3tot - param.H31;
		const ctrSideArc = contour(Lend + T5ab, H3c)
			.addSegStrokeR(param.S5a, param.H33)
			.addCornerRounded(param.RR5)
			.addSegStrokeR(param.S5b, 0)
			.addCornerRounded(param.RR5)
			.addSegStrokeR(param.S5a, -param.H33)
			.addSegStrokeR(0, param.H33 + param.H32)
			.addSegStrokeR(-2 * param.S5a - param.S5b, 0)
			.closeSegStroke();
		figSideArc.addMainO(ctrSideArc);
		figSideArc.addSecond(ctrRectangle(-R2, H23, 2 * R2 + Lextra, H1tot));
		figSideArc.addSecond(ctrRectangle(-R1, H23, 2 * R1, H1tot));
		figSideArc.addSecond(ctrRectangle(R2 + param.S1, H3tot, Lextra - param.S1, param.H2));
		figSideArc.addSecond(ctrRectangle(Lend, H3tot - param.H31, Lreturn, param.H31));
		figSideArc.addSecond(ctrRectangle(Xtube, H3tot - param.H31, param.S3, Htube));
		figSideArc.addSecond(ctrRectangle(Lend, 0, T5ab, H3b));
		figSideArc.addSecond(ctrRectangle(Xtube + param.S3, 0, T4ab, H3b));
		figSideArc.addSecond(ctrRectangle(Lend, param.H36 - R3, T5ab, 2 * R3));
		figSideArc.addSecond(ctrRectangle(Xtube + param.S3, param.H36 - R3, T4ab, 2 * R3));
		// figRelief3
		figRelief3.mergeFigure(figSidePlate, true);
		const ctrU3e = ctrRectangle(-holY1, H3tot - U33p, U3w, U3h);
		const xU3i = -holY1 + param.U32;
		const yU3i = H3tot - U33p + U33;
		const ctrU3i = ctrRectangle(xU3i, yU3i, U3w - 2 * param.U32, U3h - 2 * U33);
		figRelief3.addMainOI([ctrU3e, ctrU3i]);
		// figRelief4
		// figRelief5
		// final figure list
		rGeome.fig = {
			faceTopPlate1: figTopPlate1,
			faceTopPlate2: figTopPlate2,
			faceTopWall1: figTopWall1,
			faceTopWall2: figTopWall2,
			faceTopTube: figTopTube,
			faceTopPlate3: figTopPlate3,
			faceSidePlate: figSidePlate,
			faceSideArc: figSideArc,
			faceRelief3: figRelief3,
			faceRelief4: figRelief4,
			faceRelief5: figRelief5
		};
		// step-8 : recipes of the 3D construction
		// volume
		const designName = rGeome.partName;
		//const partInherit: tInherit[] = [];
		const partExtrude: tExtrude[] = [];
		const partList: string[] = [];
		if (param.H11 > 0) {
			const eName = `subpax_${designName}_plate1`;
			const HH = H23 + param.H15 + param.H14 + param.H13 + param.H12;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceTopPlate1`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H11,
				rotate: [0, 0, 0],
				translate: [0, 0, HH]
			});
			partList.push(eName);
		}
		if (param.H12 > 0) {
			const eName = `subpax_${designName}_wall11`;
			const HH = H23 + param.H15 + param.H14 + param.H13;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceTopWall1`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H12,
				rotate: [0, 0, 0],
				translate: [0, 0, HH]
			});
			partList.push(eName);
		}
		if (param.H13 > 0) {
			const eName = `subpax_${designName}_wall2`;
			const HH = H23 + param.H15 + param.H14;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceTopWall2`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H13,
				rotate: [0, 0, 0],
				translate: [0, 0, HH]
			});
			partList.push(eName);
		}
		if (param.H14 > 0) {
			const eName = `subpax_${designName}_wall12`;
			const HH = H23 + param.H15;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceTopWall1`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H14,
				rotate: [0, 0, 0],
				translate: [0, 0, HH]
			});
			partList.push(eName);
		}
		if (param.H15 > 0) {
			const eName = `subpax_${designName}_plate2`;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceTopPlate2`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H15,
				rotate: [0, 0, 0],
				translate: [0, 0, H23]
			});
			partList.push(eName);
		}
		if (param.H2 > 0) {
			const eName = `subpax_${designName}_tube`;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceTopTube`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H2,
				rotate: [0, 0, 0],
				translate: [0, 0, H3tot]
			});
			partList.push(eName);
		}
		if (param.H31 > 0) {
			const eName = `subpax_${designName}_plate3`;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceTopPlate3`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H31,
				rotate: [0, 0, 0],
				translate: [0, 0, H3tot - param.H31]
			});
			partList.push(eName);
		}
		if (param.T5a > 0) {
			const eName = `subpax_${designName}_sideplate5`;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceSidePlate`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.T5a,
				rotate: [pi2, 0, -pi2],
				translate: [param.T5a + Lend + param.T5b, 0, 0]
			});
			partList.push(eName);
		}
		if (param.T4a > 0) {
			const eName = `subpax_${designName}_sideplate4`;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceSidePlate`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.T4a,
				rotate: [pi2, 0, -pi2],
				translate: [param.T4a + Xtube + param.S3, 0, 0]
			});
			partList.push(eName);
		}
		if (param.T2 > 0) {
			const eName = `subpax_${designName}_sidearc1`;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceSideArc`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.T2,
				rotate: [pi2, 0, 0],
				translate: [0, param.T2 - Y9, 0]
			});
			partList.push(eName);
		}
		if (param.T2 > 0) {
			const eName = `subpax_${designName}_sidearc2`;
			partExtrude.push({
				outName: eName,
				face: `${designName}_faceSideArc`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.T2,
				rotate: [pi2, 0, 0],
				translate: [0, Y9, 0]
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
