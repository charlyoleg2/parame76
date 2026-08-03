// foot.ts
// sub-system lift-pivot-wheel of rc-car

// step-1 : import from geometrix
import type {
	//Contour,
	//Figure,
	//tContour,
	//tOuterInner,
	tParamDef,
	tParamVal,
	tGeom,
	//DesignParam,
	tInherit,
	tExtrude,
	tSubInst,
	//tSubDesign
	//Transform2d,
	//Transform3d,
	tPageDef
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
	pCheckbox,
	pDropdown,
	pSectionSeparator,
	initGeom,
	//transform2d,
	transform3d,
	EExtrude,
	EBVolume
} from 'geometrix';
//import { triAPiPi, triAArA, triALArLL, triLALrL, triALLrL, triALLrLAA, triLLLrA, triLLLrAAA } from 'triangule';
import { liftDef } from './lift.ts';
import { pivotDef } from './pivot.ts';
import { wheelDef } from './wheel.ts';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
const pDef: tParamDef = {
	// partName is used in URL. Choose a name without slash, backslash and space.
	partName: 'foot',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('aD1', 'mm', 100, 1, 1000, 1),
		pNumber('pED1', 'mm', 1.4, -5, 10, 0.1),
		pNumber('lED1', 'mm', 2.7, -5, 10, 0.1),
		pNumber('pD2', 'mm', 200, 1, 1000, 1),
		pNumber('lED2', 'mm', 2, -20, 20, 1),
		pNumber('lS1', 'mm', 0, 0, 100, 1),
		pNumber('pS1', 'mm', 3, 0, 100, 1),
		pNumber('lpE', 'mm', 2.7, -5, 10, 0.1),
		pNumber('lH5', 'mm', 0, 0, 5, 0.1),
		pNumber('pH5', 'mm', 1, 0, 5, 0.1),
		pNumber('pEH2', 'mm', 5, 0, 100, 1),
		pSectionSeparator('Wheel axis'),
		pNumber('wD6', 'mm', 250, 1, 2000, 1),
		pNumber('aD3', 'mm', 20, 1, 500, 1),
		pNumber('wED3', 'mm', 1.4, -5, 10, 0.1),
		pNumber('pED3', 'mm', 2.7, -5, 10, 0.1),
		pNumber('wRD2', 'mm', 2, 1, 100, 1),
		pNumber('pwE', 'mm', 2.7, -5, 10, 0.1),
		pSectionSeparator('Wheel main'),
		//pNumber('wD1', 'mm', 20, 1, 1000, 0.1),
		//pNumber('wD6', 'mm', 250, 1, 2000, 1),
		//pNumber('wRD2', 'mm', 1, 1, 500, 1),
		pNumber('wRD3', 'mm', 5, 1, 500, 1),
		pNumber('wRD4', 'mm', 2, 1, 500, 1),
		pNumber('wRD6', 'mm', 4, 1, 500, 1),
		pNumber('wN6', 'teeth', 50, 5, 500, 1),
		pSectionSeparator('Wheel widths'),
		pNumber('wW1', 'mm', 10, 0, 500, 1),
		pNumber('wW2', 'mm', 80, 1, 500, 1),
		pNumber('wW3', 'mm', 20, 0, 500, 1),
		pNumber('wW4', 'mm', 2, 1, 500, 1),
		pNumber('wW5', 'mm', 10, 1, 500, 1),
		pNumber('wW6', 'mm', 5, 0, 500, 1),
		pSectionSeparator('Pivot main'),
		//pNumber('pD1', 'mm', 60, 1, 1000, 1),
		//pNumber('pD2', 'mm', 100, 1, 1000, 1),
		//pNumber('pD3', 'mm', 20, 1, 500, 1),
		pNumber('pT1', 'mm', 5, 1, 100, 1),
		pNumber('pT2', 'mm', 2, 1, 100, 1),
		pNumber('pW4', 'mm', 120, 1, 1000, 1),
		pSectionSeparator('Pivot top details'),
		//pNumber('pS1', 'mm', 2, 0, 500, 1),
		pNumber('pS2min', 'mm', 30, 1, 500, 1),
		pNumber('pS3', 'mm', 30, 1, 1000, 1),
		pCheckbox('pHollowTop', true),
		pNumber('pRR2', 'mm', 2, 0, 100, 1),
		pNumber('pRR3', 'mm', 5, 0, 100, 1),
		pNumber('pA2', 'degree', 100, 0, 200, 1),
		pSectionSeparator('Pivot side'),
		pNumber('pT3a', 'mm', 2, 1, 100, 1),
		pNumber('pT3b', 'mm', 4, 0, 100, 1),
		pNumber('pT4a', 'mm', 2, 1, 100, 1),
		pNumber('pT4b', 'mm', 4, 0, 100, 1),
		pNumber('pT5a', 'mm', 2, 1, 100, 1),
		pNumber('pT5b', 'mm', 4, 0, 100, 1),
		pNumber('pS5a', 'mm', 6, 1, 500, 1),
		//pNumber('pS5b', 'mm', 80, 1, 500, 1),
		pNumber('pRR4', 'mm', 5, 0, 100, 1),
		pNumber('pRR5', 'mm', 5, 0, 100, 1),
		pSectionSeparator('Pivot heigths'),
		pNumber('pH11', 'mm', 3, 1, 100, 1),
		pNumber('pH12', 'mm', 10, 1, 1000, 1),
		pNumber('pH13', 'mm', 70, 1, 1000, 1),
		pNumber('pH14', 'mm', 10, 1, 1000, 1),
		pNumber('pH15', 'mm', 3, 1, 100, 1),
		//pNumber('pH5', 'mm', 1, 0, 20, 1),
		//pNumber('pH2', 'mm', 40, 1, 500, 1),
		pNumber('pH31', 'mm', 3, 1, 100, 1),
		pNumber('pH32', 'mm', 30, 1, 500, 1),
		pNumber('pH33', 'mm', 40, 1, 500, 1),
		pNumber('pH34', 'mm', 0, 0, 500, 1),
		pNumber('pH35', 'mm', 75, 1, 1000, 1),
		pNumber('pH36', 'mm', 30, 1, 1000, 1),
		pSectionSeparator('Pivot relief'),
		pNumber('pU31', 'mm', 2, 1, 100, 1),
		pNumber('pU32', 'mm', 2, 1, 100, 1),
		pNumber('pU33', 'mm', 2, 0, 100, 1),
		pNumber('pRR31', 'mm', 2, 0, 100, 1),
		pNumber('pU41', 'mm', 2, 1, 100, 1),
		pNumber('pU42', 'mm', 3, 1, 100, 1),
		pNumber('pU43', 'mm', 4, 1, 100, 1),
		pNumber('pU51', 'mm', 2, 1, 100, 1),
		pNumber('pU52', 'mm', 3, 1, 100, 1),
		pNumber('pU53', 'mm', 4, 1, 100, 1),
		pSectionSeparator('Lift main'),
		//pNumber('lD1', 'mm', 60, 1, 1000, 1),
		//pNumber('lD2', 'mm', 100, 1, 1000, 1),
		pNumber('lT1', 'mm', 5, 1, 100, 1),
		pNumber('lT2', 'mm', 2, 1, 100, 1),
		pNumber('lA1', 'degree', 120, 1, 200, 1),
		pSectionSeparator('Lift top details'),
		//pNumber('lS1', 'mm', 1, 0, 500, 1),
		pNumber('lT3', 'mm', 6, 1, 100, 1),
		pNumber('lS2min', 'mm', 20, 1, 500, 1),
		pNumber('lRR1', 'mm', 2, 0, 100, 1),
		pNumber('lRR2', 'mm', 2, 0, 100, 1),
		pNumber('lRR3', 'mm', 2, 0, 100, 1),
		pNumber('lT4', 'mm', 3, 1, 100, 1),
		pNumber('lT5', 'mm', 10, 1, 100, 1),
		pNumber('lT6', 'mm', 3, 1, 100, 1),
		pNumber('lT7', 'mm', 10, 1, 100, 1),
		pSectionSeparator('Lift side'),
		//pNumber('lH1', 'mm', 100, 1, 1000, 1),
		pNumber('lH2', 'mm', 3, 1, 100, 1),
		pNumber('lH3', 'mm', 25, 0, 100, 1),
		pNumber('lH4', 'mm', 15, 0, 100, 1),
		//pNumber('lH5', 'mm', 0.5, 0, 100, 0.1),
		pNumber('lLD1', 'mm', 20, 1, 500, 1),
		pNumber('lLD2', 'mm', 50, 1, 500, 1),
		pNumber('lLX1', 'mm', 26, 1, 500, 1),
		pNumber('lLY1', 'mm', 5, 0, 500, 1),
		pNumber('lLX2', 'mm', 0, 0, 500, 1),
		pNumber('lLY2', 'mm', 0, 0, 500, 1),
		pNumber('lLR2', 'mm', 10, 0, 500, 1),
		pNumber('lMD1', 'mm', 20, 1, 500, 1),
		pNumber('lMD2', 'mm', 50, 1, 500, 1),
		pNumber('lMX1', 'mm', 26, 1, 500, 1),
		pNumber('lMY1', 'mm', 50, 0, 500, 1),
		pNumber('lMY2', 'mm', 25, 0, 500, 1),
		pNumber('lMY3', 'mm', 50, 0, 500, 1),
		pSectionSeparator('Assembly'),
		pNumber('aW1', 'mm', 2, 1, 50, 1),
		pNumber('aW3', 'mm', 2, 1, 50, 1),
		pNumber('steeringAngle', 'degrew', 0, -180, 180, 1),
		pDropdown('output3D', ['assembly', 'parts'])
	],
	paramSvg: {
		aD1: 'foot_joints.svg',
		pED1: 'foot_joints.svg',
		lED1: 'foot_joints.svg',
		pD2: 'foot_joints.svg',
		lED2: 'foot_joints.svg',
		lS1: 'foot_joints.svg',
		pS1: 'foot_joints.svg',
		lpE: 'foot_joints.svg',
		lH5: 'foot_joints.svg',
		pH5: 'foot_joints.svg',
		pEH2: 'foot_joints.svg',
		// Wheel axis
		wD6: 'foot_wheel_side.svg',
		aD3: 'foot_joints.svg',
		wED3: 'foot_joints.svg',
		pED3: 'foot_joints.svg',
		wRD2: 'foot_joints.svg',
		pwE: 'foot_joints.svg',
		// Wheel main
		//wD1: 'foot_wheel_side.svg',
		//wD6: 'foot_wheel_side.svg',
		//wRD2: 'foot_wheel_side.svg',
		wRD3: 'foot_wheel_cut.svg',
		wRD4: 'foot_wheel_cut.svg',
		wRD6: 'foot_wheel_side.svg',
		// Wheel widths
		wN6: 'foot_wheel_side.svg',
		wW1: 'foot_wheel_cut.svg',
		wW2: 'foot_wheel_cut.svg',
		wW3: 'foot_wheel_cut.svg',
		wW4: 'foot_wheel_cut.svg',
		wW5: 'foot_wheel_cut.svg',
		wW6: 'foot_wheel_cut.svg',
		// Pivot main
		// pD1: 'foot_pivot_plate.svg',
		// pD2: 'foot_pivot_plate.svg',
		// pD3: 'foot_pivot_plate.svg',
		pT1: 'foot_pivot_plate.svg',
		pT2: 'foot_pivot_plate.svg',
		pW4: 'foot_pivot_plate.svg',
		// Pivot top details
		// pS1: 'foot_pivot_plate.svg',
		pS2min: 'foot_pivot_plate.svg',
		pS3: 'foot_pivot_plate.svg',
		pHollowTop: 'foot_pivot_plate.svg',
		pRR2: 'foot_pivot_plate.svg',
		pRR3: 'foot_pivot_plate.svg',
		pA2: 'foot_pivot_wall.svg',
		// Pivot side
		pT3a: 'foot_pivot_side_x.svg',
		pT3b: 'foot_pivot_side_x.svg',
		pT4a: 'foot_pivot_side_x.svg',
		pT4b: 'foot_pivot_side_x.svg',
		pT5a: 'foot_pivot_side_x.svg',
		pT5b: 'foot_pivot_side_x.svg',
		pS5a: 'foot_pivot_side_x.svg',
		//pS5b: 'foot_pivot_side_x.svg',
		pRR4: 'foot_pivot_relief35.svg',
		pRR5: 'foot_pivot_side_x.svg',
		// Pivot heights
		pH11: 'foot_pivot_relief35.svg',
		pH12: 'foot_pivot_relief35.svg',
		pH13: 'foot_pivot_relief35.svg',
		pH14: 'foot_pivot_relief35.svg',
		pH15: 'foot_pivot_relief35.svg',
		//pH5: 'foot_pivot_relief35.svg',
		//pH2: 'foot_pivot_relief35.svg',
		pH31: 'foot_pivot_relief35.svg',
		pH32: 'foot_pivot_relief35.svg',
		pH33: 'foot_pivot_relief35.svg',
		pH34: 'foot_pivot_relief35.svg',
		pH35: 'foot_pivot_relief35.svg',
		pH36: 'foot_pivot_relief35.svg',
		// Pivot relief
		pU31: 'foot_pivot_relief35.svg',
		pU32: 'foot_pivot_relief35.svg',
		pU33: 'foot_pivot_relief35.svg',
		pRR31: 'foot_pivot_relief35.svg',
		pU41: 'foot_pivot_relief4.svg',
		pU42: 'foot_pivot_relief4.svg',
		pU43: 'foot_pivot_relief4.svg',
		pU51: 'foot_pivot_relief35.svg',
		pU52: 'foot_pivot_relief35.svg',
		pU53: 'foot_pivot_relief35.svg',
		// Lift main
		//lD1: 'foot_lift_top2.svg',
		//lD2: 'foot_lift_top2.svg',
		lT1: 'foot_lift_top2.svg',
		lT2: 'foot_lift_top2.svg',
		lA1: 'foot_lift_top2.svg',
		// lift top details
		//lS1: 'foot_lift_top2.svg',
		lT3: 'foot_lift_top2.svg',
		lS2min: 'foot_lift_top2.svg',
		lRR1: 'foot_lift_top2.svg',
		lRR2: 'foot_lift_top2.svg',
		lRR3: 'foot_lift_top2.svg',
		lT4: 'foot_lift_top2.svg',
		lT5: 'foot_lift_top2.svg',
		lT6: 'foot_lift_top2.svg',
		lT7: 'foot_lift_back.svg',
		// Lift side
		//lH1: 'foot_lift_side1.svg',
		lH2: 'foot_lift_side1.svg',
		lH3: 'foot_lift_side1.svg',
		lH4: 'foot_lift_side1.svg',
		//lH5: 'foot_lift_side1.svg',
		lLD1: 'foot_lift_side1.svg',
		lLD2: 'foot_lift_side1.svg',
		lLX1: 'foot_lift_side1.svg',
		lLY1: 'foot_lift_side1.svg',
		lLX2: 'foot_lift_side1.svg',
		lLY2: 'foot_lift_side1.svg',
		lLR2: 'foot_lift_side1.svg',
		lMD1: 'foot_lift_side2.svg',
		lMD2: 'foot_lift_side2.svg',
		lMX1: 'foot_lift_side2.svg',
		lMY1: 'foot_lift_side2.svg',
		lMY2: 'foot_lift_side2.svg',
		lMY3: 'foot_lift_side2.svg',
		// Assembly
		aW1: 'foot_pivot_axis.svg',
		aW3: 'foot_pivot_relief4.svg',
		steeringAngle: 'foot_pivot_axis.svg',
		output3D: 'foot_pivot_axis.svg'
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
	const figSideExt = figure();
	const figSideInt = figure();
	const figSideArc = figure();
	const figAxis1 = figure();
	const figAxis3 = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const R1 = param.aD1 / 2;
		const R1i = R1 - param.aW1;
		const R3 = param.aD3 / 2;
		const R3i = R3 - param.aW3;
		const wW16 = param.wW1 + param.wW2 + param.wW3 + param.wW4 * 2 + param.wW5 + param.wW6;
		const pS3max = wW16 + param.pwE;
		const pS5b = pS3max - 2 * param.pS5a;
		const lD2 = param.pD2 + 2 * param.lED2; // *2 or *1 ?
		const aPivot = degToRad(param.steeringAngle);
		const lA1 = degToRad(param.lA1);
		const lY0 = param.lT3 + param.lS1 + lD2 / 2;
		const pX0 = param.pD2 / 2 + param.pS1 + param.pT3b + param.pT3a + param.pS3;
		const pX1 = pX0 - wW16 - param.pwE / 2;
		const pX2 = pX0 + param.pT4a + param.pT4b;
		const a3w = param.pT5a + param.pT5b + 2 * param.pS5a + pS5b + param.pT4a + param.pT4b;
		const pX3 = pX2 - a3w;
		const wheelX = pX1 + param.wW1 + param.wW2;
		const wD1 = param.aD3 + param.wED3;
		const wheelY = param.wD6 / 2;
		const wheelRz = Math.sqrt(wheelX ** 2 + wheelY ** 2);
		const pivotX = pX0 + param.pT4b + param.pT4a;
		const pivotY = param.pW4 / 2;
		const pivotRz = Math.sqrt(pivotX ** 2 + pivotY ** 2);
		const DzMin = Math.max(param.pD2, lD2);
		const RzMax = Math.max(wheelRz, pivotRz);
		const RzDiff = RzMax - DzMin / 2;
		const pH15 = param.pH11 + param.pH12 + param.pH13 + param.pH14 + param.pH15;
		const lH1 = pH15 + 2 * (param.pH5 + param.lH5) + param.lpE;
		const pi2 = Math.PI / 2;
		//const epsilon = 0.01;
		const lHtot = lH1 + 2 * param.lH2 + param.lH3 + param.lH4;
		const pH2 = param.pH5 + param.lpE + param.lH5 + param.lH2 + param.lH3 + param.pEH2;
		const pH335 = param.pH33 + param.pH34 + param.pH35;
		const pH325 = param.pH32 + pH335;
		const pH23 = pH2 + param.pH31 + pH325;
		const lXarc = param.pD2 / 2 + param.lED2 + param.lS1 + param.lT3;
		const lYside2 = param.lH3 + param.lH2 + param.lH5 + param.lpE / 2;
		const lYside = pH23 - param.pH5 - lYside2;
		const Htot = wheelY + lYside + lHtot;
		const pHtot = pH23 + param.pH36 + pH15 + param.pH5;
		// step-5 : checks on the parameter values
		if (R1i < 0) {
			throw `err244: aD1 ${ffix(param.aD1)} is too small compare to aW1 ${ffix(param.aW1)}`;
		}
		if (R3i < 0) {
			throw `err248: aD3 ${ffix(param.aD3)} is too small compare to aW3 ${ffix(param.aW3)}`;
		}
		if (Math.abs(aPivot) > lA1) {
			throw `err255: aPivot ${ffix(radToDeg(aPivot))} is too large compare to lA1 ${ffix(radToDeg(lA1))} degree`;
		}
		if (param.pS3 > pS3max) {
			throw `err369: pS3 ${ffix(param.pS3)} is too large compare to pS3max ${ffix(pS3max)} mm`;
		}
		if (param.pS1 <= param.lED2) {
			rGeome.logstr += `warn379: Warning, pS1 ${ffix(param.pS1)} shall be bigger than lED2 ${ffix(param.lED2)} mm\n`;
		}
		const wheelDmargin1 = pH325 - wheelY;
		if (wheelDmargin1 < 0) {
			throw `err382: wD6 ${ffix(param.wD6)} is too large compare to pH32 ${ffix(param.pH32)} and pH35 ${ffix(param.pH35)} mm`;
		}
		const wheelDmargin2 = Math.sqrt((param.pW4 / 2 - param.pT2) ** 2 + pH335 ** 2) - wheelY;
		if (wheelDmargin2 < 0) {
			throw `err390: wD6 ${ffix(param.wD6)} is too large compare to pW4 ${ffix(param.pW4)} and pH35 ${ffix(param.pH35)} mm`;
		}
		// step-6 : any logs
		rGeome.logstr += `wheel-pivot wW16 ${ffix(wW16)} pS5b ${ffix(pS5b)} mm\n`;
		rGeome.logstr += `DzMin ${ffix(DzMin)}  RzMax ${ffix(RzMax)}  RzDiff ${ffix(RzDiff)} mm\n`;
		rGeome.logstr += `wheelD wD6 ${ffix(param.wD6)}  margin1 ${ffix(wheelDmargin1)}  margin2 ${ffix(wheelDmargin2)} mm\n`;
		rGeome.logstr += `pH15 ${ffix(pH15)}  lH1 ${ffix(lH1)}  lHtot ${ffix(lHtot)}  Htot ${ffix(Htot)} mm\n`;
		// step-7 : drawing of the figures
		// inherite
		// sub-wheel
		const wheelParam = designParam(wheelDef.pDef, '');
		wheelParam.setVal('D1', wD1);
		wheelParam.setVal('D6', param.wD6);
		wheelParam.setVal('RD2', param.wRD2);
		wheelParam.setVal('RD3', param.wRD3);
		wheelParam.setVal('RD4', param.wRD4);
		wheelParam.setVal('RD6', param.wRD6);
		wheelParam.setVal('N6', param.wN6);
		wheelParam.setVal('W1', param.wW1);
		wheelParam.setVal('W2', param.wW2);
		wheelParam.setVal('W3', param.wW3);
		wheelParam.setVal('W4', param.wW4);
		wheelParam.setVal('W5', param.wW5);
		wheelParam.setVal('W6', param.wW6);
		const wheelGeom = wheelDef.pGeom(0, wheelParam.getParamVal(), wheelParam.getSuffix());
		checkGeom(wheelGeom);
		rGeome.logstr += prefixLog(wheelGeom.logstr, wheelParam.getPartNameSuffix());
		// sub-pivot
		const pivotParam = designParam(pivotDef.pDef, '');
		pivotParam.setVal('D1', param.aD1 + param.pED1);
		pivotParam.setVal('D2', param.pD2);
		pivotParam.setVal('D3', param.aD3 + param.pED3);
		pivotParam.setVal('T1', param.pT1);
		pivotParam.setVal('T2', param.pT2);
		pivotParam.setVal('W4', param.pW4);
		pivotParam.setVal('S1', param.pS1);
		pivotParam.setVal('S2min', param.pS2min);
		pivotParam.setVal('S3', param.pS3);
		pivotParam.setVal('RR2', param.pRR2);
		pivotParam.setVal('RR3', param.pRR3);
		pivotParam.setVal('A2', param.pA2);
		pivotParam.setVal('T3a', param.pT3a);
		pivotParam.setVal('T3b', param.pT3b);
		pivotParam.setVal('T4a', param.pT4a);
		pivotParam.setVal('T4b', param.pT4b);
		pivotParam.setVal('T5a', param.pT5a);
		pivotParam.setVal('T5b', param.pT5b);
		pivotParam.setVal('S5a', param.pS5a);
		pivotParam.setVal('S5b', pS5b);
		pivotParam.setVal('RR4', param.pRR4);
		pivotParam.setVal('RR5', param.pRR5);
		pivotParam.setVal('H11', param.pH11);
		pivotParam.setVal('H12', param.pH12);
		pivotParam.setVal('H13', param.pH13);
		pivotParam.setVal('H14', param.pH14);
		pivotParam.setVal('H15', param.pH15);
		pivotParam.setVal('H5', param.pH5);
		pivotParam.setVal('H2', pH2);
		pivotParam.setVal('H31', param.pH31);
		pivotParam.setVal('H32', param.pH32);
		pivotParam.setVal('H33', param.pH33);
		pivotParam.setVal('H34', param.pH34);
		pivotParam.setVal('H35', param.pH35);
		pivotParam.setVal('H36', param.pH36);
		pivotParam.setVal('U31', param.pU31);
		pivotParam.setVal('U32', param.pU32);
		pivotParam.setVal('U33', param.pU33);
		pivotParam.setVal('RR31', param.pRR31);
		pivotParam.setVal('U41', param.pU41);
		pivotParam.setVal('U42', param.pU42);
		pivotParam.setVal('U43', param.pU43);
		pivotParam.setVal('U51', param.pU51);
		pivotParam.setVal('U52', param.pU52);
		pivotParam.setVal('U53', param.pU53);
		const pivotGeom = pivotDef.pGeom(0, pivotParam.getParamVal(), pivotParam.getSuffix());
		checkGeom(pivotGeom);
		rGeome.logstr += prefixLog(pivotGeom.logstr, pivotParam.getPartNameSuffix());
		// sub-lift
		const liftParam = designParam(liftDef.pDef, '');
		liftParam.setVal('D1', param.aD1 + param.lED1);
		liftParam.setVal('D2', lD2);
		liftParam.setVal('T1', param.lT1);
		liftParam.setVal('T2', param.lT2);
		liftParam.setVal('A1', param.lA1);
		liftParam.setVal('S1', param.lS1);
		liftParam.setVal('T3', param.lT3);
		liftParam.setVal('S2min', param.lS2min);
		liftParam.setVal('RR1', param.lRR1);
		liftParam.setVal('RR2', param.lRR2);
		liftParam.setVal('RR3', param.lRR3);
		liftParam.setVal('T4', param.lT4);
		liftParam.setVal('T5', param.lT5);
		liftParam.setVal('T6', param.lT6);
		liftParam.setVal('T7', param.lT7);
		liftParam.setVal('H1', lH1);
		liftParam.setVal('H2', param.lH2);
		liftParam.setVal('H3', param.lH3);
		liftParam.setVal('H4', param.lH4);
		liftParam.setVal('H5', param.lH5);
		liftParam.setVal('LD1', param.lLD1);
		liftParam.setVal('LD2', param.lLD2);
		liftParam.setVal('LX1', param.lLX1);
		liftParam.setVal('LY1', param.lLY1);
		liftParam.setVal('LX2', param.lLX2);
		liftParam.setVal('LY2', param.lLY2);
		liftParam.setVal('LR2', param.lLR2);
		liftParam.setVal('MD1', param.lMD1);
		liftParam.setVal('MD2', param.lMD2);
		liftParam.setVal('MX1', param.lMX1);
		liftParam.setVal('MY1', param.lMY1);
		liftParam.setVal('MY2', param.lMY2);
		liftParam.setVal('MY3', param.lMY3);
		const liftGeom = liftDef.pGeom(0, liftParam.getParamVal(), liftParam.getSuffix());
		checkGeom(liftGeom);
		rGeome.logstr += prefixLog(liftGeom.logstr, liftParam.getPartNameSuffix());
		// sub-functions
		// figAxis1
		figAxis1.addMainOI([contourCircle(0, 0, R1), contourCircle(0, 0, R1i)]);
		// figAxis3
		figAxis3.addMainOI([contourCircle(0, 0, R3), contourCircle(0, 0, R3i)]);
		// figTop
		figTop.mergeFigure(liftGeom.fig.faceTopEnd.translate(0, -lY0).rotate(0, 0, -pi2), true);
		figTop.mergeFigure(pivotGeom.fig.faceTopPlate1.rotate(0, 0, aPivot));
		figTop.mergeFigure(wheelGeom.fig.faceCut.translate(pX1, 0).rotate(0, 0, aPivot));
		figTop.mergeFigure(figAxis1);
		figTop.addSecond(contourCircle(0, 0, RzMax));
		// figSideExt
		figSideExt.mergeFigure(liftGeom.fig.faceBack.translate(0, lYside));
		figSideExt.mergeFigure(pivotGeom.fig.faceRelief4.translate(0, -param.pH36));
		figSideExt.mergeFigure(wheelGeom.fig.facePneu);
		figSideExt.mergeFigure(figAxis3);
		const axis11 = ctrRectangle(-R1, lYside, param.aW1, lHtot);
		const axis12 = ctrRectangle(R1 - param.aW1, lYside, param.aW1, lHtot);
		figSideExt.addMainO(axis11);
		figSideExt.addMainO(axis12);
		// figSideInt
		figSideInt.mergeFigure(liftGeom.fig.faceBack.translate(0, lYside));
		figSideInt.mergeFigure(pivotGeom.fig.faceRelief5.translate(0, -param.pH36));
		figSideInt.mergeFigure(wheelGeom.fig.facePneu);
		figSideInt.mergeFigure(figAxis3);
		figSideInt.addMainO(axis11);
		figSideInt.addMainO(axis12);
		// figSideArc
		const lYarc = lYside + param.pH36;
		figSideArc.mergeFigure(liftGeom.fig.faceSideL.translate(-lXarc, lYarc), true);
		figSideArc.mergeFigure(pivotGeom.fig.faceSideArc);
		figSideArc.mergeFigure(wheelGeom.fig.faceCut.translate(pX1, param.pH36));
		figSideArc.addMainO(ctrRectangle(pX3, param.pH36 - R3, a3w, param.aW3));
		figSideArc.addMainO(ctrRectangle(pX3, param.pH36 + R3 - param.aW3, a3w, param.aW3));
		figSideArc.addMainO(axis11.translate(0, lYarc - lYside));
		figSideArc.addMainO(axis12.translate(0, lYarc - lYside));
		// final figure list
		rGeome.fig = {
			faceTop: figTop,
			faceSideExt: figSideExt,
			faceSideInt: figSideInt,
			faceSideArc: figSideArc,
			faceAxis1: figAxis1,
			faceAxis3: figAxis3
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		const partInherit: tInherit[] = [];
		const partExtrude: tExtrude[] = [];
		const partList: string[] = [];
		// spacing for printing
		const spacing = 1.5 * Math.max(param.pD2, param.wD6);
		// part3D wheel
		const wheelT3d = transform3d().addRotation(0, pi2, 0).addTranslation(pX1, 0, param.pH36);
		const wheelT3dP = transform3d().addTranslation(0, spacing, 0);
		const wheelT3dC = param.output3D === 0 ? wheelT3d : wheelT3dP;
		if ([0, 1].includes(param.output3D)) {
			const partWheel: tInherit = {
				outName: `inpax_${designName}_wheel`,
				subdesign: 'pax_wheel',
				subgeom: wheelGeom,
				rotate: wheelT3dC.getRotation(),
				translate: wheelT3dC.getTranslation()
			};
			partInherit.push(partWheel);
			partList.push(`inpax_${designName}_wheel`);
		}
		// part3D pivot
		const pivotT3d = transform3d();
		const pivotT3dP = transform3d()
			.addRotation(0, 2 * pi2, 0)
			.addTranslation(0, 2 * spacing, pHtot);
		const pivotT3dC = param.output3D === 0 ? pivotT3d : pivotT3dP;
		if ([0, 1].includes(param.output3D)) {
			const partPivot: tInherit = {
				outName: `inpax_${designName}_pivot`,
				subdesign: 'pax_pivot',
				subgeom: pivotGeom,
				rotate: pivotT3dC.getRotation(),
				translate: pivotT3dC.getTranslation()
			};
			partInherit.push(partPivot);
			partList.push(`inpax_${designName}_pivot`);
		}
		// part3D lift
		const liftT3d = transform3d().addRotation(0, 0, -pi2).addTranslation(-lXarc, 0, lYarc);
		const liftT3dP = transform3d().addTranslation(0, 3 * spacing, 0);
		const liftT3dC = param.output3D === 0 ? liftT3d : liftT3dP;
		if ([0, 1].includes(param.output3D)) {
			const partLift: tInherit = {
				outName: `inpax_${designName}_lift`,
				subdesign: 'pax_lift',
				subgeom: liftGeom,
				rotate: liftT3dC.getRotation(),
				translate: liftT3dC.getTranslation()
			};
			partInherit.push(partLift);
			partList.push(`inpax_${designName}_lift`);
		}
		// part3D axis1
		const axis1T3d = transform3d().addTranslation(0, 0, lYarc);
		const axis1T3dP = transform3d().addTranslation(0, 0, 0);
		const axis1T3dC = param.output3D === 0 ? axis1T3d : axis1T3dP;
		if ([0, 1].includes(param.output3D)) {
			const partAxis1: tExtrude = {
				outName: `subpax_${designName}_axis1`,
				face: `${designName}_faceAxis1`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: lHtot,
				rotate: axis1T3dC.getRotation(),
				translate: axis1T3dC.getTranslation()
			};
			partExtrude.push(partAxis1);
			partList.push(`subpax_${designName}_axis1`);
		}
		const axis3T3d = transform3d().addRotation(0, pi2, 0).addTranslation(pX3, 0, param.pH36);
		const axis3T3dP = transform3d().addTranslation(spacing, 0, 0);
		const axis3T3dC = param.output3D === 0 ? axis3T3d : axis3T3dP;
		if ([0, 1].includes(param.output3D)) {
			const partAxis3: tExtrude = {
				outName: `subpax_${designName}_axis3`,
				face: `${designName}_faceAxis3`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: a3w,
				rotate: axis3T3dC.getRotation(),
				translate: axis3T3dC.getTranslation()
			};
			partExtrude.push(partAxis3);
			partList.push(`subpax_${designName}_axis3`);
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
		const subWheel: tSubInst = {
			partName: wheelParam.getPartName(),
			dparam: wheelParam.getDesignParamList(),
			orientation: wheelT3d.getRotation(),
			position: wheelT3d.getTranslation()
		};
		const subPivot: tSubInst = {
			partName: pivotParam.getPartName(),
			dparam: pivotParam.getDesignParamList(),
			orientation: pivotT3d.getRotation(),
			position: pivotT3d.getTranslation()
		};
		const subLift: tSubInst = {
			partName: liftParam.getPartName(),
			dparam: liftParam.getDesignParamList(),
			orientation: liftT3d.getRotation(),
			position: liftT3d.getTranslation()
		};
		rGeome.sub = {
			wheel1: subWheel,
			pivot1: subPivot,
			lift1: subLift
		};
		// step-10 : final log message
		// finalize
		rGeome.logstr += 'rccar-foot drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const footDef: tPageDef = {
	pTitle: 'foot',
	pDescription: 'sub-system lift-pivot-wheel of rc-car',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { footDef };
