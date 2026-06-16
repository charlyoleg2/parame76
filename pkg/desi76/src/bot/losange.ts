// losange.ts
// A losange geometry for a scara bot

// step-1 : import from geometrix
import type {
	//Contour,
	Figure,
	//tContour,
	//tOuterInner,
	tParamDef,
	tParamVal,
	tGeom,
	DesignParam,
	tInherit,
	tExtrude,
	tSubInst,
	//tSubDesign
	//Transform2d,
	Transform3d,
	tPageDef
} from 'geometrix';
import {
	designParam,
	checkGeom,
	prefixLog,
	point,
	Point,
	//ShapePoint,
	//line,
	//vector,
	//contour,
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
	//transform2d,
	transform3d,
	EExtrude,
	EBVolume
} from 'geometrix';
//import { triAPiPi, triAArA, triALArLL, triLALrL, triALLrL, triALLrLAA, triLLLrA, triLLLrAAA } from 'triangule';
import { triLLLrAAA } from 'triangule';
import { scaraDef } from './scara.ts';
import { scarabaseDef } from './scarabase.ts';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
const pDef: tParamDef = {
	// partName is used in URL. Choose a name without slash, backslash and space.
	partName: 'losange',
	params: [
		//pNumber(name, unit, init, min, max, step)
		//pNumber('L0', 'mm', 100, 1, 1000, 1),
		pNumber('LA1', 'mm', 200, 1, 1000, 1),
		pNumber('LA2', 'mm', 200, 1, 1000, 1),
		pNumber('LB1', 'mm', 200, 1, 1000, 1),
		pNumber('LB2', 'mm', 200, 1, 1000, 1),
		pSectionSeparator('Joint diameters'),
		pNumber('D0i', 'mm', 50, 1, 1000, 1),
		pNumber('D0e', 'mm', 90, 1, 1000, 1),
		pNumber('DAi', 'mm', 30, 1, 1000, 1),
		pNumber('DAe', 'mm', 70, 1, 1000, 1),
		pNumber('DBi', 'mm', 30, 1, 1000, 1),
		pNumber('DBe', 'mm', 70, 1, 1000, 1),
		pNumber('DEi', 'mm', 10, 1, 1000, 1),
		pNumber('DEe', 'mm', 30, 1, 1000, 1),
		pSectionSeparator('Wall thickness'),
		pNumber('T1', 'mm', 4, 1, 100, 1),
		pNumber('T3', 'mm', 3, 1, 100, 1),
		pNumber('S12', 'mm', 1, 0, 100, 1),
		pNumber('Ri', 'mm', 1, 0, 10, 0.1),
		pNumber('Re', 'mm', 0.4, 0, 10, 0.1),
		pNumber('E2', 'mm', 0.4, -10, 10, 0.1),
		pNumber('E3', 'mm', 0.7, -10, 10, 0.1),
		pSectionSeparator('Heights'),
		pNumber('EH1', 'mm', 50, 1, 1000, 1),
		pNumber('EH2', 'mm', 8, 1, 1000, 1),
		pNumber('EH3', 'mm', 15, 0, 1000, 1),
		pNumber('E1', 'mm', 0.5, -10, 10, 0.1),
		pSectionSeparator('Base'),
		pNumber('L3', 'mm', 30, 0, 1000, 1),
		pNumber('L4', 'mm', 20, 1, 100, 1),
		pNumber('A5', 'degree', 90, 0, 180, 1),
		pNumber('W5', 'mm', 40, 1, 1000, 1),
		pNumber('W6', 'mm', 10, 0, 1000, 1),
		pNumber('R34', 'mm', 2, 0, 10, 0.1),
		pNumber('T4', 'mm', 10, 1, 100, 1),
		pNumber('W8', 'mm', 20, 1, 1000, 1),
		pNumber('H8', 'mm', 30, 1, 1000, 1),
		pNumber('D8', 'mm', 5, 1, 1000, 1),
		pSectionSeparator('Assembly'),
		pDropdown('positionDriver', ['angle0', 'endXY']),
		pNumber('A0A', 'degree', 0, -120, 120, 1),
		pNumber('A0B', 'degree', 0, -120, 120, 1),
		pNumber('Ex', 'mm', 0, -1000, 1000, 1),
		pNumber('Ey', 'mm', 0, -1000, 1000, 1),
		pDropdown('output3D', [
			'assembly',
			'allParts',
			'allAxis',
			'base',
			'legA1',
			'legA2',
			'legB1',
			'legB2'
		])
	],
	paramSvg: {
		//L0: 'losange_top.svg',
		LA1: 'losange_top.svg',
		LA2: 'losange_top.svg',
		LB1: 'losange_top.svg',
		LB2: 'losange_top.svg',
		D0i: 'losange_top.svg',
		D0e: 'losange_top.svg',
		DAi: 'losange_top.svg',
		DAe: 'losange_top.svg',
		DBi: 'losange_top.svg',
		DBe: 'losange_top.svg',
		DEi: 'losange_top.svg',
		DEe: 'losange_top.svg',
		T1: 'losange_top.svg',
		T3: 'losange_top.svg',
		S12: 'losange_top.svg',
		Ri: 'losange_top.svg',
		Re: 'losange_top.svg',
		E2: 'losange_top.svg',
		E3: 'losange_top.svg',
		EH1: 'losange_top.svg',
		EH2: 'losange_top.svg',
		EH3: 'losange_top.svg',
		E1: 'losange_top.svg',
		L3: 'losange_top.svg',
		L4: 'losange_top.svg',
		A5: 'losange_top.svg',
		W5: 'losange_top.svg',
		W6: 'losange_top.svg',
		R34: 'losange_top.svg',
		T4: 'losange_top.svg',
		W8: 'losange_top.svg',
		H8: 'losange_top.svg',
		D8: 'losange_top.svg',
		positionDriver: 'losange_top.svg',
		A0A: 'losange_top.svg',
		A0B: 'losange_top.svg',
		Ex: 'losange_top.svg',
		Ey: 'losange_top.svg',
		output3D: 'losange_top.svg'
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
	const figAxis0 = figure();
	const figAxisA = figure();
	const figAxisB = figure();
	const figAxisE = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const legNb = 4;
		const axisNb = 5;
		const H22 = 2 * param.EH2 + param.E1;
		const H122 = param.EH1 + H22;
		const H124 = H122 + H22;
		// A1, A2, B1, B2
		const LR1e: number[] = [param.D0e / 2, param.DAe / 2, param.D0e / 2, param.DBe / 2];
		const LR1i: number[] = [param.D0i / 2, param.DAi / 2, param.D0i / 2, param.DBi / 2];
		const LR2e: number[] = [param.DAe / 2, param.DEe / 2, param.DBe / 2, param.DEe / 2];
		const LR2i: number[] = [param.DAi / 2, param.DEi / 2, param.DBi / 2, param.DEi / 2];
		const LL: number[] = [param.LA1, param.LA2, param.LB1, param.LB2];
		const LH: number[] = [H124, H122, H124, param.EH1];
		// 0, A, B, E
		const Lidx: string[] = ['0', 'A', 'B', 'E'];
		const ARee: number[] = [param.D0e / 2, param.DAe / 2, param.DBe / 2, param.DEe / 2];
		const ARe: number[] = [param.D0i / 2, param.DAi / 2, param.DBi / 2, param.DEi / 2];
		const ARi: number[] = ARe.map((iR) => iR - param.T1);
		const R8 = param.D8 / 2;
		const pi2 = Math.PI / 2;
		const Ltot = Math.min(LL[0] + LL[1], LL[2] + LL[3]);
		// axis heights
		const EH23 = 2 * (param.EH2 + param.EH3);
		const CH1 = H124 + H22;
		const cH41 = param.EH2 + param.E1 / 2;
		// 0A, A, E and 0B, B, E
		const axisHa: number[] = [CH1, LH[0], LH[1]];
		const axisHb: number[] = [CH1, LH[2], LH[3] + 2 * cH41]; // [CH1, LH[2], LH[1]]
		const LR1eA: number[] = [LR1e[0], LR1e[1], LR2e[1]];
		const LR1eB: number[] = [LR1e[2], LR1e[3], LR2e[3]];
		const LR1iA: number[] = [LR1i[0], LR1i[1], LR2i[1]];
		const LR1iB: number[] = [LR1i[2], LR1i[3], LR2i[3]];
		const Htot = axisHa[0] + EH23; // or Math.max(...axisHa, ...axisHb) + EH23
		// positions
		const LA: number[] = [pi2 + degToRad(param.A0A), 0, pi2 + degToRad(param.A0B), 0];
		const a5 = degToRad(param.A5) / 2;
		const W7 = 2 * param.W5 * Math.cos(a5) + param.W6;
		const X8 = (W7 - param.W8) / 2;
		const Y8 = (CH1 - param.H8) / 2;
		const pA0 = point(0, param.L4)
			.translatePolar(a5, param.W5 / 2)
			.translatePolar(a5 + pi2, param.L3 + LR1e[0]);
		const pB0 = point(W7, param.L4)
			.translatePolar(Math.PI - a5, param.W5 / 2)
			.translatePolar(pi2 - a5, param.L3 + LR1e[0]);
		const pA1 = pA0.translatePolar(LA[0], LL[0]);
		const pB1 = pB0.translatePolar(LA[2], LL[2]);
		const Lpt: Point[] = [pA0, pA1, pB0, pB1];
		const L0 = pA0.distanceToPoint(pB0);
		const lAB = pA1.distanceToPoint(pB1);
		const aAB = pA1.angleToPoint(pB1);
		const [ta31, ta12, ta23, tStr1] = triLLLrAAA(LL[1], lAB, LL[3]);
		LA[1] = aAB + ta12;
		LA[3] = Math.PI + aAB - ta23;
		const pA2 = pA1.translatePolar(LA[1], LL[1]);
		const pB2 = pB1.translatePolar(LA[3], LL[3]);
		if (pA2.distanceToPoint(pB2) > 0.1) {
			throw `err215: pA2 x ${ffix(pA2.cx)} y ${ffix(pA2.cy)} is too far from pB2 x ${ffix(pB2.cx)} y ${ffix(pB2.cy)}`;
		}
		//
		const fabStepX = 1.2 * Math.max(...LR1e, ...LR2e);
		const eX = pA2.cx;
		const eY = pA2.cy;
		const eA = pA2.angleOrig();
		const eL = pA2.distanceOrig();
		const aA2B2 = ta31;
		const a0A = 0;
		const a0B = 0;
		// step-5 : checks on the parameter values
		for (let ii = 0; ii < legNb; ii++) {
			if (LR1e[ii] < LR1i[ii] + 2 * param.T3) {
				throw `err197: idx ${ii} LR1e ${ffix(2 * LR1e[ii])} is too small compare to LR1i ${ffix(2 * LR1i[ii])} and T3 ${ffix(param.T3)}`;
			}
			if (LR2e[ii] < LR2i[ii] + 2 * param.T3) {
				throw `err200: idx ${ii} LR2e[ii] ${ffix(2 * LR2e[ii])} is too small compare to LR2i ${ffix(2 * LR2i[ii])} and T3 ${ffix(param.T3)}`;
			}
			if (LL[ii] < LR1e[ii] + LR2e[ii]) {
				throw `err203: idx ${ii} LL ${ffix(LL[ii])} is too small compare to LR1e ${ffix(LR1e[ii])} and LR2e ${ffix(LR2e[ii])}`;
			}
			if (ARi[ii] < 0) {
				throw `err206: idx ${ii} ARe ${ffix(2 * ARe[ii])} is too small compare to T1 ${ffix(param.T1)}`;
			}
		}
		if (X8 < R8) {
			throw `err195: W5 ${ffix(param.W5)} is too small compare to D8 ${ffix(2 * R8)} and W8 ${ffix(param.W8)}`;
		}
		if (Y8 < R8) {
			throw `err198: H1 ${ffix(CH1)} is too small compare to D8 ${ffix(2 * R8)} and H8 ${ffix(param.H8)}`;
		}
		// step-6 : any logs
		rGeome.logstr += tStr1;
		rGeome.logstr += `length ${ffix(Ltot)}  height ${ffix(Htot)}\n`;
		rGeome.logstr += `Position: X ${ffix(eX)}  Y ${ffix(eY)} mm\n`;
		rGeome.logstr += `Position: A ${ffix(radToDeg(eA))} degree  L ${ffix(eL)} mm\n`;
		rGeome.logstr += `L0 ${ffix(L0)} mm  aA2B2 ${ffix(radToDeg(aA2B2))} degree\n`;
		rGeome.logstr += `Angle0 A0A ${ffix(radToDeg(a0A))}  A0B ${ffix(radToDeg(a0B))} degree\n`;
		// step-7 : drawing of the figures
		// inherite
		// sub-scarabase
		const scarabaseParam = designParam(scarabaseDef.pDef, '');
		scarabaseParam.setVal('D1', 2 * LR1i[0] + param.E3);
		scarabaseParam.setVal('D2', 2 * LR1e[0]);
		scarabaseParam.setVal('L3', param.L3);
		scarabaseParam.setVal('L4', param.L4);
		scarabaseParam.setVal('W5', param.W5);
		scarabaseParam.setVal('Nac', 1); // double
		scarabaseParam.setVal('R34', param.R34);
		scarabaseParam.setVal('A5', param.A5);
		scarabaseParam.setVal('W6', param.W6);
		scarabaseParam.setVal('T3', param.T3);
		scarabaseParam.setVal('T4', param.T4);
		scarabaseParam.setVal('H1', CH1);
		scarabaseParam.setVal('H2', param.EH2);
		scarabaseParam.setVal('H3', param.EH3);
		scarabaseParam.setVal('W8', param.W8);
		scarabaseParam.setVal('H8', param.H8);
		scarabaseParam.setVal('D8', param.D8);
		const scarabaseGeom = scarabaseDef.pGeom(
			0,
			scarabaseParam.getParamVal(),
			scarabaseParam.getSuffix()
		);
		checkGeom(scarabaseGeom);
		rGeome.logstr += prefixLog(scarabaseGeom.logstr, scarabaseParam.getPartNameSuffix());
		// sub-scara
		const scaraLegParam: DesignParam[] = [];
		const scaraLegGeom: tGeom[] = [];
		for (let ii = 0; ii < legNb; ii++) {
			const iiParam = designParam(scaraDef.pDef, (ii + 1).toString());
			iiParam.setVal('L1', LL[ii]);
			iiParam.setVal('D11', 2 * LR1i[ii] + param.E2);
			iiParam.setVal('D12', 2 * LR1e[ii]);
			iiParam.setVal('D21', 2 * LR2i[ii] + (ii < 3 ? param.E3 : param.E2));
			iiParam.setVal('D22', 2 * LR2e[ii]);
			iiParam.setVal('firstEnd', 0);
			iiParam.setVal('secondEnd', ii < 3 ? 0 : 1);
			iiParam.setVal('A1', 90);
			iiParam.setVal('T1', param.T3);
			iiParam.setVal('T2', param.T3);
			iiParam.setVal('S2', LR2e[ii] + param.S12);
			iiParam.setVal('R1i', param.Ri);
			iiParam.setVal('R1e', param.Re);
			iiParam.setVal('iiEn', 1);
			iiParam.setVal('N2', 2);
			iiParam.setVal('S1', LR1e[ii] + param.S12);
			iiParam.setVal('T3', param.T3);
			iiParam.setVal('R2i', param.Ri);
			iiParam.setVal('R2e', param.Re);
			iiParam.setVal('H1', LH[ii]);
			iiParam.setVal('H2', param.EH2);
			iiParam.setVal('H3', param.EH3);
			iiParam.setVal('H41', ii < 3 ? 0 : cH41);
			iiParam.setVal('H42', 0);
			const iiGeom = scaraDef.pGeom(0, iiParam.getParamVal(), iiParam.getSuffix());
			checkGeom(iiGeom);
			rGeome.logstr += prefixLog(iiGeom.logstr, iiParam.getPartNameSuffix());
			scaraLegParam.push(iiParam);
			scaraLegGeom.push(iiGeom);
		}
		// sub-functions
		function figAxisCut(ix: number, iy: number, ire: number, ih: number): Figure {
			//rGeome.logstr += `dbg335 ix ${ffix(ix)}  iy ${ffix(iy)}  ire ${ffix(ire)}  ih ${ffix(ih)}\n`;
			const rFig = figure();
			rFig.addMainO(ctrRectangle(ix, iy, param.T1, ih));
			rFig.addMainO(ctrRectangle(ix + 2 * ire - param.T1, iy, param.T1, ih));
			return rFig;
		}
		// figTop
		figTop.mergeFigure(scarabaseGeom.fig.faceT3);
		const legT3d: Transform3d[] = [];
		const axisT3d4: Transform3d[] = [];
		for (let ii = 0; ii < legNb; ii++) {
			legT3d.push(
				transform3d()
					.addTranslation(-LR1e[ii], 0, 0)
					.addRotation(0, 0, LA[ii])
					.addTranslation(Lpt[ii].cx, Lpt[ii].cy, 0)
			);
			axisT3d4.push(
				transform3d().addRotation(0, 0, LA[ii]).addTranslation(Lpt[ii].cx, Lpt[ii].cy, 0)
			);
			figTop.mergeFigure(
				scaraLegGeom[ii].fig.faceExtern
					.translate(-LR1e[ii], 0)
					.rotate(0, 0, LA[ii])
					.translate(Lpt[ii].cx, Lpt[ii].cy)
			);
		}
		const axisT3dE = transform3d()
			.addRotation(0, 0, LA[2])
			.addTranslation(Lpt[2].cx, Lpt[2].cy, 0);
		const axisT3d6 = [axisT3d4[0], axisT3d4[1], axisT3dE, axisT3d4[2], axisT3d4[3], axisT3dE];
		// figSide
		const Yoffset = Htot * 1.5;
		const lineNb = 2;
		const axisPerLine = axisHa.length; // 3 or axisNb/2
		for (let jj = 0; jj < lineNb; jj++) {
			figSide.mergeFigure(scarabaseGeom.fig.faceSide.translate(0, jj * Yoffset));
			let posX = param.L4 + param.L3;
			let posY = jj * Yoffset;
			const jjAxisH = jj === 0 ? axisHa : axisHb;
			const jjLR1e = jj === 0 ? LR1eA : LR1eB;
			const jjLR1i = jj === 0 ? LR1iA : LR1iB;
			const jjLL = jj === 0 ? LL.slice(0, 2) : LL.slice(2, 4);
			for (let ii = 0; ii < axisPerLine; ii++) {
				if (ii > 0) {
					posX += jjLR1e[ii - 1] + jjLL[ii - 1] - jjLR1e[ii];
				}
				figSide.mergeFigure(
					figAxisCut(posX + jjLR1e[ii] - jjLR1i[ii], posY, jjLR1i[ii], jjAxisH[ii] + EH23)
				);
				const jji6 = ii + jj * axisPerLine;
				axisT3d6[jji6].addTranslation(0, 0, posY);
				posY += param.EH2 + param.E1 / 2;
				const posY2 = jji6 === 4 ? posY + cH41 : posY;
				if (ii < axisPerLine - 1) {
					const jji4 = ii + jj * (axisPerLine - 1); // 0..3
					legT3d[jji4].addTranslation(0, 0, posY2);
					figSide.mergeFigure(scaraLegGeom[jji4].fig.faceSide.translate(posX, posY2));
				}
			}
		}
		// additional check
		const checkZ2 = axisT3d6[2].getTranslation()[2];
		const checkZ5 = axisT3d6[5].getTranslation()[2];
		if (Math.abs(checkZ2 - checkZ5) > 0.001) {
			throw `err396: axisT3d6[2] ${ffix(checkZ2)} and axisT3d6[5] ${ffix(checkZ5)} differ`;
		}
		// figBack
		figBack.mergeFigure(scarabaseGeom.fig.faceBack);
		// figAxis0
		figAxis0.addMainOI([contourCircle(0, 0, ARe[0]), contourCircle(0, 0, ARi[0])]);
		figAxis0.addSecond(contourCircle(0, 0, ARe[0] + param.T3));
		figAxis0.addSecond(contourCircle(0, 0, ARee[0] - param.T3));
		figAxis0.addSecond(contourCircle(0, 0, ARee[0]));
		// figAxisA
		figAxisA.addMainOI([contourCircle(0, 0, ARe[1]), contourCircle(0, 0, ARi[1])]);
		figAxisA.addSecond(contourCircle(0, 0, ARe[1] + param.T3));
		figAxisA.addSecond(contourCircle(0, 0, ARee[1] - param.T3));
		figAxisA.addSecond(contourCircle(0, 0, ARee[1]));
		// figAxisB
		figAxisB.addMainOI([contourCircle(0, 0, ARe[2]), contourCircle(0, 0, ARi[2])]);
		figAxisB.addSecond(contourCircle(0, 0, ARe[2] + param.T3));
		figAxisB.addSecond(contourCircle(0, 0, ARee[2] - param.T3));
		figAxisB.addSecond(contourCircle(0, 0, ARee[2]));
		// figAxisE
		figAxisE.addMainOI([contourCircle(0, 0, ARe[3]), contourCircle(0, 0, ARi[3])]);
		figAxisE.addSecond(contourCircle(0, 0, ARe[3] + param.T3));
		figAxisE.addSecond(contourCircle(0, 0, ARee[3] - param.T3));
		figAxisE.addSecond(contourCircle(0, 0, ARee[3]));
		// final figure list
		rGeome.fig = {
			faceTop: figTop,
			faceSide: figSide,
			faceBack: figBack,
			faceAxis0: figAxis0,
			faceAxisA: figAxisA,
			faceAxisB: figAxisB,
			faceAxisE: figAxisE
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		const partInherit: tInherit[] = [];
		const partExtrude: tExtrude[] = [];
		const partList: string[] = [];
		// part3D scarabase
		if ([0, 1, 3].includes(param.output3D)) {
			const fabStepY2 = param.output3D === 0 ? 0 : 4 * ARe[0];
			const partScarabase: tInherit = {
				outName: `inpax_${designName}_base`,
				subdesign: 'pax_scarabase',
				subgeom: scarabaseGeom,
				rotate: [0, 0, 0],
				translate: [0, fabStepY2, 0]
			};
			partInherit.push(partScarabase);
			partList.push(`inpax_${designName}_base`);
		}
		// part3D scaraLeg
		for (let ii = 0; ii < legNb; ii++) {
			if ([0, 1].includes(param.output3D) || ii - param.output3D === -4) {
				const iiName = `inpax_${designName}_leg_${ii + 1}`;
				const iiLegT3d2 = transform3d()
					.addRotation(0, 0, pi2)
					.addTranslation((ii + 1.5) * fabStepX, 4 * ARe[0], 0);
				const iiLegT3d = param.output3D === 0 ? legT3d[ii] : iiLegT3d2;
				const iiPartScaraLeg: tInherit = {
					outName: iiName,
					subdesign: `pax_${scaraLegParam[ii].getPartNameSuffix()}`,
					subgeom: scaraLegGeom[ii],
					rotate: iiLegT3d.getRotation(),
					translate: iiLegT3d.getTranslation()
				};
				partInherit.push(iiPartScaraLeg);
				partList.push(iiName);
			}
		}
		// part3D axis
		if ([0, 1, 2].includes(param.output3D)) {
			for (let ii = 0; ii < axisNb; ii++) {
				const iiName = `subpax_${designName}_axis_${ii + 1}`;
				const iiAxisT3d2 = transform3d().addTranslation(
					(ii + 1) * 3 * ARe[0],
					2 * ARe[0],
					0
				);
				const iiAxisT3d = param.output3D === 0 ? axisT3d6[ii] : iiAxisT3d2;
				const iiPartAxis: tExtrude = {
					outName: iiName,
					face: `${designName}_faceAxis${Lidx[ii]}`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: LH[ii] + EH23,
					rotate: iiAxisT3d.getRotation(),
					translate: iiAxisT3d.getTranslation()
				};
				partExtrude.push(iiPartAxis);
				partList.push(iiName);
			}
		}
		// part3D output
		rGeome.vol = {
			inherits: partInherit,
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
		const subBase: tSubInst = {
			partName: scarabaseParam.getPartName(),
			dparam: scarabaseParam.getDesignParamList(),
			orientation: [0, 0, 0],
			position: [0, 0, 0]
		};
		rGeome.sub = {
			scaraBase: subBase
		};
		for (let ii = 0; ii < legNb; ii++) {
			const subLeg: tSubInst = {
				partName: scaraLegParam[ii].getPartName(),
				dparam: scaraLegParam[ii].getDesignParamList(),
				orientation: legT3d[ii].getRotation(),
				position: legT3d[ii].getTranslation()
			};
			rGeome.sub[`scaraLeg_${ii + 1}`] = subLeg;
		}
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
const losangeDef: tPageDef = {
	pTitle: 'losange',
	pDescription: 'A losange geometry for a scara bot',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { losangeDef };
