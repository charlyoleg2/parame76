// long2d.ts
// A long arm with many legs moving in one 2D-plan

// step-1 : import from geometrix
import type {
	//Contour,
	Figure,
	//tContour,
	//tOuterInner,
	tParamDef,
	tParamVal,
	tGeom,
	tExtrude,
	tInherit,
	tPageDef
	//tSubInst
	//tSubDesign
} from 'geometrix';
import {
	designParam,
	checkGeom,
	prefixLog,
	//point,
	//Point,
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
	transform2d,
	transform3d,
	EExtrude,
	EBVolume
} from 'geometrix';
//import { triAPiPi, triAArA, triALArLL, triLALrL, triALLrL, triALLrLAA, triLLLrA, triLLLrAAA } from 'triangule';
import { scaraDef } from './scara';
import { scarabaseDef } from './scarabase';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
const pDef: tParamDef = {
	// partName is used in URL. Choose a name without slash, backslash and space.
	partName: 'long2d',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('NB', 'leg', 3, 1, 10, 1),
		pNumber('LA', 'L-factor', 1, 0.1, 10, 0.1),
		pNumber('LB', 'L-add', 0, -10, 100, 0.1),
		pNumber('DA', 'D-factor', 1, 0.1, 10, 0.1),
		pNumber('DB', 'D-add', 0, -10, 100, 0.1),
		pNumber('HA', 'L-factor', 1, 0.1, 10, 0.1),
		pNumber('HB', 'L-add', 0, -10, 100, 0.1),
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
		pSectionSeparator('Leg details'),
		pNumber('S12', 'mm', 1, 0, 100, 1),
		pNumber('Ri', 'mm', 1, 0, 10, 0.1),
		pNumber('Re', 'mm', 0.4, 0, 10, 0.1),
		pSectionSeparator('Angles and 3D parts'),
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
		pDropdown('D3Enable', [
			'assembly',
			'parts',
			'axisall',
			'base',
			'leg1',
			'leg2',
			'leg3',
			'leg4',
			'leg5',
			'leg6',
			'leg7',
			'leg8',
			'leg9',
			'leg10'
		])
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
		S12: 'long2d_top.svg',
		Ri: 'long2d_top.svg',
		Re: 'long2d_top.svg',
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
		D3Enable: 'long2d_top.svg'
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
	const figAxis = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const ER1 = param.ED1 / 2;
		const ER2 = param.ED2 / 2;
		const ER1i = ER1 - param.T1;
		const R8 = param.D8 / 2;
		const PAall: number[] = [
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
		const PA = PAall.slice(0, param.NB).map((iAngle) => degToRad(iAngle));
		const BL: number[] = Array(param.NB).fill(param.EL);
		const BD2: number[] = Array(param.NB + 1).fill(param.ED2);
		const BH1: number[] = Array(param.NB + 1).fill(param.EH1);
		for (let ii = param.NB - 2; ii >= 0; ii--) {
			BL[ii] = BL[ii + 1] * param.LA + param.LB;
		}
		const EH23 = 2 * (param.EH2 + param.EH3);
		for (let ii = param.NB - 1; ii >= 0; ii--) {
			BD2[ii] = BD2[ii + 1] * param.DA + param.DB;
			BH1[ii] = BH1[ii + 1] * param.HA + param.HB + 2 * (param.EH2 + param.E1);
		}
		const BR2 = BD2.map((aD1: number) => aD1 / 2);
		const CH1 = BH1[0];
		const BLtot = BL.reduce((acc: number, val: number) => acc + val, 0);
		const L432 = param.L4 + param.L3 + BR2[0];
		const Ltot = L432 + BLtot + BR2[param.NB];
		const Htot = CH1 + param.EH23;
		const lastOrientation = PA.reduce((acc: number, val: number) => acc + val, 0);
		const W52 = param.W5 / 2;
		const X8 = (param.W5 - param.W8) / 2;
		const Y8 = (CH1 - param.H8) / 2;
		const pi2 = Math.PI / 2;
		// step-5 : checks on the parameter values
		if (ER2 < ER1 + 2 * param.T3) {
			throw `err192: ED2 ${ffix(2 * ER2)} is too small compare to ED1 ${ffix(2 * ER1)} and T3 ${ffix(param.T3)}`;
		}
		if (ER1i < 0) {
			throw `err216: ED1 ${ffix(2 * ER1)} is too small compare to T1 ${ffix(param.T1)}`;
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
		rGeome.logstr += `length ${ffix(Ltot)}  height ${ffix(Htot)}\n`;
		rGeome.logstr += `lastOrientation ${ffix(radToDeg(lastOrientation))}\n`;
		for (let ii = 0; ii < param.NB; ii++) {
			rGeome.logstr += `leg-${ii + 1} : BL ${ffix(BL[ii])}, D12 ${ffix(BD2[ii])}, D22 ${ffix(BD2[ii + 1])},`;
			rGeome.logstr += ` BH1 ${ffix(BH1[ii + 1])}\n`;
		}
		// step-7 : drawing of the figures
		// inherite
		// sub-scarabase
		const scarabaseParam = designParam(scarabaseDef.pDef, '');
		scarabaseParam.setVal('D1', 2 * (ER1 + param.E3));
		scarabaseParam.setVal('D2', 2 * BR2[0]);
		scarabaseParam.setVal('L3', param.L3);
		scarabaseParam.setVal('L4', param.L4);
		scarabaseParam.setVal('W5', param.W5);
		scarabaseParam.setVal('Nac', 0); // single
		scarabaseParam.setVal('R34', param.R34);
		scarabaseParam.setVal('A5', 0);
		scarabaseParam.setVal('W6', 10);
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
		//const scaraLegParam: DesignParam[] = [];
		const scaraLegGeom: tGeom[] = [];
		for (let ii = 0; ii < param.NB; ii++) {
			const iiParam = designParam(scaraDef.pDef, (ii + 1).toString());
			iiParam.setVal('L1', BL[ii]);
			iiParam.setVal('D11', param.ED1 + param.E2);
			iiParam.setVal('D12', BD2[ii]);
			iiParam.setVal('D21', param.ED1 + param.E3);
			iiParam.setVal('D22', BD2[ii + 1]);
			iiParam.setVal('firstEnd', 0);
			iiParam.setVal('secondEnd', 0);
			iiParam.setVal('A1', 90);
			iiParam.setVal('T1', param.T3);
			iiParam.setVal('T2', param.T3);
			iiParam.setVal('S2', BR2[ii + 1] + param.S12);
			iiParam.setVal('R1i', param.Ri);
			iiParam.setVal('R1e', param.Re);
			iiParam.setVal('iiEn', 1);
			iiParam.setVal('N2', 2);
			iiParam.setVal('S1', BR2[ii] + param.S12);
			iiParam.setVal('T3', param.T3);
			iiParam.setVal('R2i', param.Ri);
			iiParam.setVal('R2e', param.Re);
			iiParam.setVal('H1', BH1[ii + 1]);
			iiParam.setVal('H2', param.EH2);
			iiParam.setVal('H3', param.EH3);
			iiParam.setVal('H41', 0);
			iiParam.setVal('H42', 0);
			const iiGeom = scaraDef.pGeom(0, iiParam.getParamVal(), iiParam.getSuffix());
			checkGeom(iiGeom);
			rGeome.logstr += prefixLog(iiGeom.logstr, iiParam.getPartNameSuffix());
			//scaraLegParam.push(iiParam);
			scaraLegGeom.push(iiGeom);
		}
		// sub-functions
		function figAxisCut(ix: number, iy: number, ih: number): Figure {
			const rFig = figure();
			rFig.addMainO(ctrRectangle(ix, iy, param.T1, ih));
			rFig.addMainO(ctrRectangle(ix + 2 * ER1 - param.T1, iy, param.T1, ih));
			return rFig;
		}
		// figTop
		figTop.mergeFigure(scarabaseGeom.fig.faceT3);
		for (let ii = 0; ii < param.NB; ii++) {
			const iiT2d = transform2d().addRotation(pi2 + PA[ii]);
			for (let jj = ii; jj > 0; jj--) {
				iiT2d.addTranslation(0, BL[jj - 1]).addRotation(PA[jj - 1]);
			}
			iiT2d.addTranslation(W52, L432);
			const iiTa = iiT2d.getRotation();
			const [iiTx, iiTy] = iiT2d.getTranslation();
			figTop.mergeFigure(
				scaraLegGeom[ii].fig.faceExtern
					.translate(-BR2[ii], 0)
					.rotate(0, 0, iiTa)
					.translate(iiTx, iiTy)
			);
		}
		// figSide
		figSide.mergeFigure(scarabaseGeom.fig.faceSide);
		let posX = param.L4 + param.L3;
		let posY = 0;
		for (let ii = 0; ii < param.NB; ii++) {
			if (ii > 0) {
				posX += BR2[ii - 1] + BL[ii - 1] - BR2[ii];
			}
			figSide.mergeFigure(figAxisCut(posX + BR2[ii] - ER1, posY, BH1[ii] + EH23));
			posY += param.EH2 + param.E1;
			figSide.mergeFigure(scaraLegGeom[ii].fig.faceSide.translate(posX, posY));
		}
		// figBack
		figBack.mergeFigure(scarabaseGeom.fig.faceBack);
		// figAxis
		figAxis.addMainOI([contourCircle(0, 0, ER1), contourCircle(0, 0, ER1i)]);
		figAxis.addSecond(contourCircle(0, 0, ER1 + param.T3));
		// final figure list
		rGeome.fig = {
			faceTop: figTop,
			faceSide: figSide,
			faceBack: figBack,
			faceAxis: figAxis
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		const partInherit: tInherit[] = [];
		const partExtrude: tExtrude[] = [];
		const partList: string[] = [];
		// part3D scarabase
		const partScarabase: tInherit = {
			outName: `inpax_${designName}_base`,
			subdesign: 'pax_scarabase',
			subgeom: scarabaseGeom,
			rotate: [0, 0, 0],
			translate: [0, 0, 0]
		};
		partInherit.push(partScarabase);
		partList.push(`inpax_${designName}_base`);
		// part3D axis
		const axis0T3d = transform3d();
		const partAxis0: tExtrude = {
			outName: `subpax_${designName}_axis0`,
			face: `${designName}_faceAxis`,
			extrudeMethod: EExtrude.eLinearOrtho,
			length: BH1[0],
			rotate: axis0T3d.getRotation(),
			translate: axis0T3d.getTranslation()
		};
		partExtrude.push(partAxis0);
		partList.push(`subpax_${designName}_axis0`);
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
