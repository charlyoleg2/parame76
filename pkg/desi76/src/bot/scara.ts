// scara.ts
// A leg of a scara robot

// step-1 : import from geometrix
import type {
	//Contour,
	tContour,
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
	pCheckbox,
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
	partName: 'scara',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('L1', 'mm', 200, 1, 2000, 1),
		pNumber('D11', 'mm', 20, 1, 1000, 1),
		pNumber('D12', 'mm', 60, 1, 1000, 1),
		pNumber('D21', 'mm', 10, 1, 1000, 1),
		pNumber('D22', 'mm', 40, 1, 1000, 1),
		pDropdown('firstEnd', ['intern', 'extern']),
		pDropdown('secondEnd', ['extern', 'intern']),
		pSectionSeparator('Internal details'),
		pNumber('A1', 'degree', 90, 0, 180, 1),
		pNumber('T1', 'mm', 2, 0.1, 100, 0.1),
		pNumber('T2', 'mm', 2, 0.1, 100, 0.1),
		pNumber('S2', 'mm', 30, 1, 1000, 1),
		pNumber('R1i', 'mm', 1, 0, 100, 0.1),
		pNumber('R1e', 'mm', 0.5, 0, 100, 0.1),
		pCheckbox('iiEn', true),
		pSectionSeparator('External details'),
		pNumber('N2', 'legs', 2, 0, 2, 1),
		pNumber('S1', 'mm', 40, 1, 1000, 1),
		pNumber('T3', 'mm', 2, 0.1, 100, 0.1),
		pNumber('R2i', 'mm', 1, 0, 100, 0.1),
		pNumber('R2e', 'mm', 0.5, 0, 100, 0.1),
		pSectionSeparator('Heights'),
		pNumber('H1', 'mm', 50, 1, 1000, 1),
		pNumber('H2', 'mm', 2, 0.1, 200, 0.1),
		pNumber('H3', 'mm', 5, 0, 200, 1),
		pNumber('H41', 'mm', 0, 0, 200, 0.1),
		pNumber('H42', 'mm', 0, 0, 200, 0.1)
	],
	paramSvg: {
		L1: 'scara_top.svg',
		D11: 'scara_top.svg',
		D12: 'scara_top.svg',
		D21: 'scara_top.svg',
		D22: 'scara_top.svg',
		firstEnd: 'scara_ends.svg',
		secondEnd: 'scara_ends.svg',
		A1: 'scara_top.svg',
		T1: 'scara_top.svg',
		T2: 'scara_top.svg',
		S2: 'scara_top.svg',
		R1i: 'scara_top.svg',
		R1e: 'scara_top.svg',
		iiEn: 'scara_top.svg',
		N2: 'scara_top.svg',
		S1: 'scara_top.svg',
		T3: 'scara_top.svg',
		R2i: 'scara_top.svg',
		R2e: 'scara_top.svg',
		H1: 'scara_side2.svg',
		H2: 'scara_side.svg',
		H3: 'scara_side.svg',
		H41: 'scara_side.svg',
		H42: 'scara_side.svg'
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
	const figIntern = figure();
	const figExtern = figure();
	const figH41 = figure();
	const figH42 = figure();
	const figSide = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const a1 = degToRad(param.A1) / 2;
		const R11 = param.D11 / 2;
		const R12 = param.D12 / 2;
		const R21 = param.D21 / 2;
		const R22 = param.D22 / 2;
		const X2 = R12 + param.L1;
		const Ltot = X2 + R22;
		const aIncli = Math.atan2(R22 - R12, param.L1);
		const R7 = R12 - param.T2;
		const R8 = R22 - param.T2;
		const R91 = R11 + param.T3;
		const R92 = R21 + param.T3;
		const a91 = Math.asin(param.T3 / (2 * R91));
		const a92 = Math.asin(param.T3 / (2 * R92));
		const pi2 = Math.PI / 2;
		const aP1 = pi2 + aIncli;
		const He = Math.max(param.H3, param.H41, param.H42);
		const Htot = param.H1 + 2 * (param.H2 + He);
		const Hl5 = He + 2 * param.H2 + param.H1;
		const a7c = aP1 - Math.acos(R7 / R12);
		const a8c = aP1 + Math.acos(R8 / R22);
		const pFirstEnd = param.firstEnd;
		const pSecondEnd = param.secondEnd === 1 ? 0 : 1;
		const T32 = param.T3 / 2;
		// start using 2D objects
		const p1 = point(R12, 0).translatePolar(aP1, R12);
		const p6 = point(X2, 0).translatePolar(aP1, R22);
		const p12 = point(R12, 0).translatePolar(aP1, R12 - param.T2);
		const p62 = point(X2, 0).translatePolar(aP1, R22 - param.T2);
		const p13 = point(R12, 0).translatePolar(aP1, R12 - param.T3);
		const p63 = point(X2, 0).translatePolar(aP1, R22 - param.T3);
		const l1d = (R12 + param.S1 - p1.cx) / Math.cos(aIncli);
		const l12d = (R12 + param.S1 - p12.cx) / Math.cos(aIncli);
		const l13d = (R12 + param.S1 - p13.cx) / Math.cos(aIncli);
		const l6d = (p6.cx - (X2 - param.S2)) / Math.cos(aIncli);
		const l62d = (p62.cx - (X2 - param.S2)) / Math.cos(aIncli);
		const l63d = (p63.cx - (X2 - param.S2)) / Math.cos(aIncli);
		// step-5 : checks on the parameter values
		if (param.L1 < R12 + R22) {
			throw `err095: L1 ${ffix(param.L1)} is too small compare to D12 ${ffix(2 * R12)} and D22 ${ffix(2 * R22)}`;
		}
		if (R12 < R11 + 2 * param.T3) {
			throw `err132: D12 ${ffix(2 * R12)} is too small compare to D11 ${ffix(2 * R11)} and T3 ${ffix(param.T3)}`;
		}
		if (R22 < R21 + 2 * param.T3) {
			throw `err135: D22 ${ffix(2 * R22)} is too small compare to D21 ${ffix(2 * R21)} and T3 ${ffix(param.T3)}`;
		}
		if (R12 < R11 + param.T1 + param.T2) {
			throw `err142: D12 ${ffix(2 * R12)} is too small compare to T1 ${ffix(param.T1)} and T2 ${ffix(param.T2)}`;
		}
		if (R22 < R21 + param.T1 + param.T2) {
			throw `err145: D22 ${ffix(2 * R22)} is too small compare to T1 ${ffix(param.T1)} and T2 ${ffix(param.T2)}`;
		}
		if (aP1 < a1) {
			throw `err148: aIncli ${ffix(radToDeg(aIncli))} is too small compare to A1 ${ffix(radToDeg(2 * a1))}`;
		}
		if (param.iiEn && a7c < a1) {
			throw `err163: aIncli ${ffix(radToDeg(aIncli))} is too small compare to A1 ${ffix(radToDeg(2 * a1))}`;
		}
		if (param.S1 < R12 / 2) {
			throw `err178: S1 ${ffix(param.S1)} is too small compare to D12 ${ffix(2 * R12)}`;
		}
		if (param.S2 < R22 / 2) {
			throw `err181: S2 ${ffix(param.S2)} is too small compare to D22 ${ffix(2 * R22)}`;
		}
		if (param.L1 < param.S1 + param.S2) {
			throw `err184: L1 ${ffix(param.L1)} is too small compare to S1 ${ffix(param.S1)} and S2 ${ffix(param.S2)}`;
		}
		if (l1d <= 0 || l12d <= 0 || l13d <= 0) {
			throw `err189: S1 ${ffix(param.S1)} is too small`;
		}
		if (l6d <= 0 || l62d <= 0 || l63d <= 0) {
			throw `err170: S2 ${ffix(param.S2)} is too small`;
		}
		// warnings
		if (param.H3 === 0) {
			rGeome.logstr += 'warn167: Warning H3 is zero\n';
		}
		// step-6 : any logs
		rGeome.logstr += `length ${ffix(Ltot)}  height ${ffix(Htot)}\n`;
		// step-7 : drawing of the figures
		// fig1
		const p7e = point(R12, 0).translatePolar(Math.PI - a1, R12);
		const p7i = point(R12, 0).translatePolar(Math.PI - a1, R12 - param.T2);
		const p7be = point(R12, 0).translatePolar(a1, R12);
		const p7bi = point(R12, 0).translatePolar(a1, R12 - param.T2);
		const p7c = point(R12, 0).translatePolar(a7c, R12);
		const p8e = point(X2, 0).translatePolar(a1, R22);
		const p8i = point(X2, 0).translatePolar(a1, R22 - param.T2);
		const p8be = point(X2, 0).translatePolar(Math.PI - a1, R22);
		const p8bi = point(X2, 0).translatePolar(Math.PI - a1, R22 - param.T2);
		const p8c = point(X2, 0).translatePolar(a8c, R22);
		const p91 = point(R12, 0).translatePolar(a91, R91);
		const p92 = point(X2, 0).translatePolar(Math.PI - a92, R92);
		const p1d = p1.translatePolar(aP1 - pi2, l1d);
		const p12d = p12.translatePolar(aP1 - pi2, l12d);
		const p13d = p13.translatePolar(aP1 - pi2, l13d);
		const p6d = p6.translatePolar(aP1 + pi2, l6d);
		const p62d = p62.translatePolar(aP1 + pi2, l62d);
		const p63d = p63.translatePolar(aP1 + pi2, l63d);
		// figPlate
		const ctrPlate = contour(p1.cx, p1.cy)
			.addPointA(0, 0)
			.addPointA(p1.cx, -p1.cy)
			.addSegArc2()
			.addSegStrokeA(p6.cx, -p6.cy)
			.addPointA(Ltot, 0)
			.addPointA(p6.cx, p6.cy)
			.addSegArc2()
			.closeSegStroke();
		figPlate.addMainOI([ctrPlate, contourCircle(R12, 0, R11), contourCircle(X2, 0, R21)]);
		// figExtern
		if (param.N2 === 0) {
			if (pFirstEnd === 0 && pSecondEnd === 1) {
				const ctrE1 = contour(p1d.cx, p1d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p13d.cx, p13d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p63.cx, p63.cy)
					.addPointA(Ltot - param.T3, 0)
					.addPointA(p63.cx, -p63.cy)
					.addSegArc2()
					.addSegStrokeA(p13d.cx, -p13d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p1d.cx, -p1d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p6.cx, -p6.cy)
					.addPointA(Ltot, 0)
					.addPointA(p6.cx, p6.cy)
					.addSegArc2()
					.closeSegStroke();
				figExtern.addMainO(ctrE1);
				const ctrE3 = contour(R12 + param.S1, T32)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(R12 + param.S1, -T32)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p92.cx, -p92.cy)
					.addCornerRounded(param.R2i)
					.addPointA(X2 + R92, 0)
					.addPointA(p92.cx, p92.cy)
					.addSegArc2()
					.addCornerRounded(param.R2i)
					.closeSegStroke();
				figExtern.addMainOI([ctrE3, contourCircle(X2, 0, R21)]);
			} else if (pFirstEnd === 1 && pSecondEnd === 0) {
				const ctrE1 = contour(p63d.cx, p63d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p6d.cx, p6d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p1.cx, p1.cy)
					.addPointA(0, 0)
					.addPointA(p1.cx, -p1.cy)
					.addSegArc2()
					.addSegStrokeA(p6d.cx, -p6d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p63d.cx, -p63d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p13.cx, -p13.cy)
					.addPointA(param.T3, 0)
					.addPointA(p13.cx, p13.cy)
					.addSegArc2()
					.closeSegStroke();
				figExtern.addMainO(ctrE1);
				const ctrE3 = contour(p91.cx, p91.cy)
					.addCornerRounded(param.R2i)
					.addPointA(R12 - R91, 0)
					.addPointA(p91.cx, -p91.cy)
					.addSegArc2()
					.addCornerRounded(param.R2i)
					.addSegStrokeA(X2 - param.S2, -T32)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(X2 - param.S2, T32)
					.addCornerRounded(param.R2e)
					.closeSegStroke();
				figExtern.addMainOI([ctrE3, contourCircle(R12, 0, R11)]);
			} else if (pFirstEnd === 1 && pSecondEnd === 1) {
				const ctrE2 = contour(p13.cx, p13.cy)
					.addPointA(param.T3, 0)
					.addPointA(p13.cx, -p13.cy)
					.addSegArc2()
					.addSegStrokeA(p63.cx, -p63.cy)
					.addPointA(Ltot - param.T3, 0)
					.addPointA(p63.cx, p63.cy)
					.addSegArc2()
					.closeSegStroke();
				figExtern.addMainOI([ctrPlate, ctrE2]);
				const ctrE3 = contour(p91.cx, p91.cy)
					.addCornerRounded(param.R2i)
					.addPointA(R12 - R91, 0)
					.addPointA(p91.cx, -p91.cy)
					.addSegArc2()
					.addCornerRounded(param.R2i)
					.addSegStrokeA(p92.cx, -p92.cy)
					.addCornerRounded(param.R2i)
					.addPointA(X2 + R92, 0)
					.addPointA(p92.cx, p92.cy)
					.addSegArc2()
					.addCornerRounded(param.R2i)
					.closeSegStroke();
				figExtern.addMainOI([ctrE3, contourCircle(R12, 0, R11), contourCircle(X2, 0, R21)]);
			} else {
				figExtern.addMainOI([
					ctrPlate,
					contourCircle(R12, 0, R11),
					contourCircle(X2, 0, R21)
				]);
			}
		} else {
			const aB = (2 * Math.PI) / (param.N2 + 1);
			const NaB = (param.N2 - 1) / 2;
			const R93 = R12 - param.T3;
			const R94 = R22 - param.T3;
			const a93 = Math.asin(param.T3 / (2 * R93));
			const a94 = Math.asin(param.T3 / (2 * R94));
			const p93 = point(R12, 0).translatePolar(Math.PI - (NaB * aB + a93), R93);
			const p94 = point(X2, 0).translatePolar(NaB * aB + a94, R94);
			const p95 = point(R12, 0).translatePolar(Math.PI - (NaB * aB + a91), R91);
			const p96 = point(X2, 0).translatePolar(NaB * aB + a92, R92);
			const hollowL: tContour[] = [];
			const hollowR: tContour[] = [];
			hollowL.push(contourCircle(R12, 0, R11));
			hollowR.push(contourCircle(X2, 0, R21));
			function ctrE5(iX: number, iRe: number, iRi: number, iA: number, iP: number): tContour {
				const tae = Math.asin(param.T3 / (2 * iRe));
				const tai = Math.asin(param.T3 / (2 * iRi));
				const tp1 = point(iX, 0).translatePolar(iP - tae, iRe);
				const tp2 = point(iX, 0).translatePolar(iP - tai, iRi);
				const tp3 = point(iX, 0).translatePolar(iP - iA + tai, iRi);
				const tp4 = point(iX, 0).translatePolar(iP - iA + tae, iRe);
				const rCtr = contour(tp2.cx, tp2.cy)
					.addCornerRounded(param.R2i)
					.addPointA(tp3.cx, tp3.cy)
					.addSegArc(iRi, false, false)
					.addCornerRounded(param.R2i)
					.addSegStrokeA(tp4.cx, tp4.cy)
					.addCornerRounded(param.R2i)
					.addPointA(tp1.cx, tp1.cy)
					.addSegArc(iRe, false, true)
					.addCornerRounded(param.R2i)
					.closeSegStroke();
				return rCtr;
			}
			for (let ii = 0; ii < param.N2 - 1; ii++) {
				hollowL.push(ctrE5(R12, R93, R91, aB, Math.PI + (NaB - ii) * aB));
				hollowR.push(ctrE5(X2, R94, R92, aB, (NaB - ii) * aB));
			}
			if (pFirstEnd === 0 && pSecondEnd === 1) {
				const ctrE6 = contour(p13d.cx, p13d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p63.cx, p63.cy)
					.addPointA(p94.cx, p94.cy)
					.addSegArc(R94, false, false)
					.addCornerRounded(param.R2i)
					.addSegStrokeA(p96.cx, p96.cy)
					.addCornerRounded(param.R2i)
					.addPointA(p92.cx, p92.cy)
					.addSegArc(R92, false, true)
					.addCornerRounded(param.R2i)
					.addSegStrokeA(R12 + param.S1, T32)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(R12 + param.S1, -T32)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p92.cx, -p92.cy)
					.addCornerRounded(param.R2i)
					.addPointA(p96.cx, -p96.cy)
					.addSegArc(R92, false, true)
					.addCornerRounded(param.R2i)
					.addSegStrokeA(p94.cx, -p94.cy)
					.addCornerRounded(param.R2i)
					.addPointA(p63.cx, -p63.cy)
					.addSegArc(R94, false, false)
					.addSegStrokeA(p13d.cx, -p13d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p1d.cx, -p1d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p6.cx, -p6.cy)
					.addPointA(Ltot, 0)
					.addPointA(p6.cx, p6.cy)
					.addSegArc2()
					.addSegStrokeA(p1d.cx, p1d.cy)
					.addCornerRounded(param.R2e)
					.closeSegStroke();
				figExtern.addMainOI([ctrE6, ...hollowR]);
			} else if (pFirstEnd === 1 && pSecondEnd === 0) {
				const ctrE6 = contour(p63d.cx, p63d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p13.cx, p13.cy)
					.addPointA(p93.cx, p93.cy)
					.addSegArc(R93, false, true)
					.addCornerRounded(param.R2i)
					.addSegStrokeA(p95.cx, p95.cy)
					.addCornerRounded(param.R2i)
					.addPointA(p91.cx, p91.cy)
					.addSegArc(R91, false, false)
					.addCornerRounded(param.R2i)
					.addSegStrokeA(X2 - param.S2, T32)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(X2 - param.S2, -T32)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p91.cx, -p91.cy)
					.addCornerRounded(param.R2i)
					.addPointA(p95.cx, -p95.cy)
					.addSegArc(R91, false, false)
					.addCornerRounded(param.R2i)
					.addSegStrokeA(p93.cx, -p93.cy)
					.addCornerRounded(param.R2i)
					.addPointA(p13.cx, -p13.cy)
					.addSegArc(R93, false, true)
					.addSegStrokeA(p63d.cx, -p63d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p6d.cx, -p6d.cy)
					.addCornerRounded(param.R2e)
					.addSegStrokeA(p1.cx, -p1.cy)
					.addPointA(0, 0)
					.addPointA(p1.cx, p1.cy)
					.addSegArc2()
					.addSegStrokeA(p6d.cx, p6d.cy)
					.addCornerRounded(param.R2e)
					.closeSegStroke();
				figExtern.addMainOI([ctrE6, ...hollowL]);
			} else if (pFirstEnd === 1 && pSecondEnd === 1) {
				function ctrE4(iyk: number): tContour {
					const rCtr = contour(p13.cx, iyk * p13.cy)
						.addPointA(p93.cx, iyk * p93.cy)
						.addSegArc(R93, false, iyk > 0 ? true : false)
						.addCornerRounded(param.R2i)
						.addSegStrokeA(p95.cx, iyk * p95.cy)
						.addCornerRounded(param.R2i)
						.addPointA(p91.cx, iyk * p91.cy)
						.addSegArc(R91, false, iyk > 0 ? false : true)
						.addCornerRounded(param.R2i)
						.addSegStrokeA(p92.cx, iyk * p92.cy)
						.addCornerRounded(param.R2i)
						.addPointA(p96.cx, iyk * p96.cy)
						.addSegArc(R92, false, iyk > 0 ? false : true)
						.addCornerRounded(param.R2i)
						.addSegStrokeA(p94.cx, iyk * p94.cy)
						.addCornerRounded(param.R2i)
						.addPointA(p63.cx, iyk * p63.cy)
						.addSegArc(R94, false, iyk > 0 ? true : false)
						.closeSegStroke();
					return rCtr;
				}
				figExtern.addMainOI([ctrPlate, ctrE4(1), ctrE4(-1), ...hollowL, ...hollowR]);
			} else {
				figExtern.addMainOI([ctrPlate, hollowL[0], hollowR[0]]);
			}
		}
		figExtern.mergeFigure(figPlate, true);
		// figIntern
		if (pFirstEnd === 0) {
			figIntern.addMainOI([
				contourCircle(R12, 0, R11 + param.T1),
				contourCircle(R12, 0, R11)
			]);
		}
		if (pSecondEnd === 0) {
			figIntern.addMainOI([contourCircle(X2, 0, R21 + param.T1), contourCircle(X2, 0, R21)]);
		}
		function ctrI(iyk: number): tContour {
			let tp0 = p7i;
			if (pFirstEnd === 1) {
				tp0 = p12d;
			}
			const rCtr = contour(tp0.cx, iyk * tp0.cy).addCornerRounded(param.R1e);
			if (pFirstEnd === 0) {
				if (param.iiEn) {
					rCtr.addPointA(p7bi.cx, iyk * p7bi.cy)
						.addSegArc(R7, false, iyk > 0 ? false : true)
						.addCornerRounded(param.R1e)
						.addSegStrokeA(p7be.cx, iyk * p7be.cy)
						.addCornerRounded(param.R1e)
						.addPointA(p7c.cx, iyk * p7c.cy)
						.addSegArc(R12, false, iyk > 0 ? true : false)
						.addCornerRounded(param.R1i);
				} else {
					rCtr.addPointA(p12.cx, iyk * p12.cy).addSegArc(
						R7,
						false,
						iyk > 0 ? false : true
					);
				}
			}
			if (pSecondEnd === 1) {
				rCtr.addSegStrokeA(p62d.cx, iyk * p62d.cy)
					.addCornerRounded(param.R1e)
					.addSegStrokeA(p6d.cx, iyk * p6d.cy)
					.addCornerRounded(param.R1e);
			} else {
				if (param.iiEn) {
					rCtr.addSegStrokeA(p8c.cx, iyk * p8c.cy)
						.addCornerRounded(param.R1i)
						.addPointA(p8be.cx, iyk * p8be.cy)
						.addSegArc(R12, false, iyk > 0 ? true : false)
						.addCornerRounded(param.R1e)
						.addSegStrokeA(p8bi.cx, iyk * p8bi.cy)
						.addCornerRounded(param.R1e);
				} else {
					rCtr.addSegStrokeA(p62.cx, iyk * p62.cy);
				}
				rCtr.addPointA(p8i.cx, iyk * p8i.cy)
					.addSegArc(R8, false, iyk > 0 ? false : true)
					.addCornerRounded(param.R1e)
					.addSegStrokeA(p8e.cx, iyk * p8e.cy)
					.addCornerRounded(param.R1e)
					.addPointA(p6.cx, iyk * p6.cy)
					.addSegArc(R22, false, iyk > 0 ? true : false);
			}
			if (pFirstEnd === 1) {
				rCtr.addSegStrokeA(p1d.cx, iyk * p1d.cy)
					.addCornerRounded(param.R1e)
					.closeSegStroke();
			} else {
				rCtr.addSegStrokeA(p1.cx, iyk * p1.cy)
					.addPointA(p7e.cx, iyk * p7e.cy)
					.addSegArc(R12, false, iyk > 0 ? true : false)
					.addCornerRounded(param.R1e)
					.closeSegStroke();
			}
			return rCtr;
		}
		figIntern.addMainO(ctrI(1));
		figIntern.addMainO(ctrI(-1));
		figIntern.mergeFigure(figPlate, true);
		// figH41
		figH41.addMainOI([contourCircle(R12, 0, R12), contourCircle(R12, 0, R11)]);
		figH41.mergeFigure(figPlate, true);
		// figH42
		figH42.addMainOI([contourCircle(X2, 0, R22), contourCircle(X2, 0, R21)]);
		figH42.mergeFigure(figH41, true);
		// figSide
		figSide.addMainO(ctrRectangle(0, He, Ltot, param.H2));
		figSide.addMainO(ctrRectangle(0, He + param.H2 + param.H1, Ltot, param.H2));
		figSide.addSecond(ctrRectangle(R12 - R11, 0, 2 * R11, Htot));
		figSide.addSecond(ctrRectangle(X2 - R21, 0, 2 * R21, Htot));
		if (param.H41 > 0) {
			figSide.addMainO(ctrRectangle(0, He - param.H41, 2 * R12, param.H41));
			figSide.addMainO(ctrRectangle(0, Hl5, 2 * R12, param.H41));
		}
		if (param.H42 > 0) {
			figSide.addMainO(ctrRectangle(X2 - R22, He - param.H42, 2 * R22, param.H42));
			figSide.addMainO(ctrRectangle(X2 - R22, Hl5, 2 * R22, param.H42));
		}
		// final figure list
		rGeome.fig = {
			facePlate: figPlate,
			faceIntern: figIntern,
			faceExtern: figExtern,
			faceH41: figH41,
			faceH42: figH42,
			faceSide: figSide
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		const eH4List: tExtrude[] = [];
		const vH4List: string[] = [];
		if (param.H3 > 0 && pFirstEnd + pSecondEnd > 0) {
			eH4List.push({
				outName: `subpax_${designName}_ext1`,
				face: `${designName}_faceExtern`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H3,
				rotate: [0, 0, 0],
				translate: [0, 0, He - param.H3]
			});
			eH4List.push({
				outName: `subpax_${designName}_ext5`,
				face: `${designName}_faceExtern`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H3,
				rotate: [0, 0, 0],
				translate: [0, 0, Hl5]
			});
			vH4List.push(`subpax_${designName}_ext1`, `subpax_${designName}_ext5`);
		}
		if (param.H41 > 0) {
			eH4List.push({
				outName: `subpax_${designName}_h41l`,
				face: `${designName}_faceH41`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H41,
				rotate: [0, 0, 0],
				translate: [0, 0, He - param.H41]
			});
			eH4List.push({
				outName: `subpax_${designName}_h41h`,
				face: `${designName}_faceH41`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H41,
				rotate: [0, 0, 0],
				translate: [0, 0, Hl5]
			});
			vH4List.push(`subpax_${designName}_h41l`, `subpax_${designName}_h41h`);
		}
		if (param.H42 > 0) {
			eH4List.push({
				outName: `subpax_${designName}_h42l`,
				face: `${designName}_faceH42`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H42,
				rotate: [0, 0, 0],
				translate: [0, 0, He - param.H42]
			});
			eH4List.push({
				outName: `subpax_${designName}_h42h`,
				face: `${designName}_faceH42`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.H42,
				rotate: [0, 0, 0],
				translate: [0, 0, Hl5]
			});
			vH4List.push(`subpax_${designName}_h42l`, `subpax_${designName}_h42h`);
		}
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}_plate2`,
					face: `${designName}_facePlate`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H2,
					rotate: [0, 0, 0],
					translate: [0, 0, He]
				},
				{
					outName: `subpax_${designName}_int3`,
					face: `${designName}_faceIntern`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H1,
					rotate: [0, 0, 0],
					translate: [0, 0, He + param.H2]
				},
				{
					outName: `subpax_${designName}_plate4`,
					face: `${designName}_facePlate`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H2,
					rotate: [0, 0, 0],
					translate: [0, 0, He + param.H2 + param.H1]
				},
				...eH4List
			],
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eUnion,
					inList: [
						`subpax_${designName}_plate2`,
						`subpax_${designName}_int3`,
						`subpax_${designName}_plate4`,
						...vH4List
					]
				}
			]
		};
		// step-9 : optional sub-design parameter export
		// sub-design
		rGeome.sub = {};
		// step-10 : final log message
		// finalize
		rGeome.logstr += 'Scara drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const scaraDef: tPageDef = {
	pTitle: 'scara',
	pDescription: 'A scara leg',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { scaraDef };
