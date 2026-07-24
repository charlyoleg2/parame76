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
	//ctrRectangle,
	figure,
	//degToRad,
	//radToDeg,
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
		pNumber('pED1', 'mm', 0.4, -5, 10, 0.1),
		pNumber('lED1', 'mm', 0.7, -5, 10, 0.1),
		pNumber('pD2', 'mm', 200, 1, 1000, 1),
		pNumber('lED2', 'mm', 2, -20, 20, 1),
		pNumber('lS1', 'mm', 0, 0, 100, 1),
		pNumber('pS1', 'mm', 3, 0, 100, 1),
		pNumber('lpE', 'mm', 0.7, -5, 10, 0.1),
		pNumber('lH5', 'mm', 0, 0, 5, 0.1),
		pNumber('pH5', 'mm', 1, 0, 5, 0.1),
		pSectionSeparator('Wheel axis'),
		pNumber('aD3', 'mm', 20, 1, 500, 1),
		pNumber('wED3', 'mm', 0.4, -5, 10, 0.1),
		pNumber('pED3', 'mm', 0.7, -5, 10, 0.1),
		pNumber('wRD2', 'mm', 2, 1, 100, 1),
		pNumber('wRD5', 'mm', 100, 1, 1000, 1),
		pNumber('pwE', 'mm', 0.7, -5, 10, 0.1),
		pSectionSeparator('Wheel main'),
		pNumber('wD1', 'mm', 20, 1, 1000, 0.1),
		//pNumber('wRD2', 'mm', 1, 1, 500, 1),
		pNumber('wRD3', 'mm', 5, 1, 500, 1),
		pNumber('wRD4', 'mm', 2, 1, 500, 1),
		//pNumber('wRD5', 'mm', 40, 1, 500, 1),
		pNumber('wRD6', 'mm', 4, 1, 500, 1),
		pNumber('wN6', 'teeth', 50, 5, 500, 1),
		pSectionSeparator('Wheel widths'),
		pNumber('wW1', 'mm', 1, 0, 500, 1),
		pNumber('wW2', 'mm', 20, 1, 500, 1),
		pNumber('wW3', 'mm', 0, 0, 500, 1),
		pNumber('wW4', 'mm', 2, 1, 500, 1),
		pNumber('wW5', 'mm', 2, 1, 500, 1),
		pNumber('wW6', 'mm', 1, 0, 500, 1),
		pSectionSeparator('Pivot main'),
		pNumber('pD1', 'mm', 60, 1, 1000, 1),
		//pNumber('pD2', 'mm', 100, 1, 1000, 1),
		pNumber('pD3', 'mm', 20, 1, 500, 1),
		pNumber('pT1', 'mm', 5, 1, 100, 1),
		pNumber('pT2', 'mm', 2, 1, 100, 1),
		pNumber('pW4', 'mm', 80, 1, 1000, 1),
		pSectionSeparator('Pivot top details'),
		//pNumber('pS1', 'mm', 2, 0, 500, 1),
		pNumber('pS2min', 'mm', 30, 1, 500, 1),
		pNumber('pS3', 'mm', 40, 1, 1000, 1),
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
		pNumber('pS5a', 'mm', 10, 1, 500, 1),
		pNumber('pS5b', 'mm', 80, 1, 500, 1),
		pNumber('pRR4', 'mm', 5, 0, 100, 1),
		pNumber('pRR5', 'mm', 5, 0, 100, 1),
		pSectionSeparator('Pivot heigths'),
		pNumber('pH11', 'mm', 3, 1, 100, 1),
		pNumber('pH12', 'mm', 10, 1, 1000, 1),
		pNumber('pH13', 'mm', 70, 1, 1000, 1),
		pNumber('pH14', 'mm', 10, 1, 1000, 1),
		pNumber('pH15', 'mm', 3, 1, 100, 1),
		//pNumber('pH5', 'mm', 1, 0, 20, 1),
		pNumber('pH2', 'mm', 40, 1, 500, 1),
		pNumber('pH31', 'mm', 3, 1, 100, 1),
		pNumber('pH32', 'mm', 30, 1, 500, 1),
		pNumber('pH33', 'mm', 30, 1, 500, 1),
		pNumber('pH34', 'mm', 0, 0, 500, 1),
		pNumber('pH35', 'mm', 60, 1, 1000, 1),
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
		pNumber('lD1', 'mm', 60, 1, 1000, 1),
		pNumber('lD2', 'mm', 100, 1, 1000, 1),
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
		pNumber('lH1', 'mm', 100, 1, 1000, 1),
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
		pNumber('orientation', 'degrew', -180, 180, 0, 1),
		pDropdown('output3D', ['assembly', 'parts'])
	],
	paramSvg: {
		//L0: 'foot_joints.svg',
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
		aD3: 'foot_joints.svg',
		wED3: 'foot_joints.svg',
		pED3: 'foot_joints.svg',
		wRD2: 'foot_joints.svg',
		wRD5: 'foot_joints.svg',
		pwE: 'foot_joints.svg',
		wD1: 'foot_wheel_side.svg',
		//wRD2: 'foot_wheel_side.svg',
		wRD3: 'foot_wheel_cut.svg',
		wRD4: 'foot_wheel_cut.svg',
		//wRD5: 'foot_wheel_side.svg',
		wRD6: 'foot_wheel_side.svg',
		wN6: 'foot_wheel_side.svg',
		wW1: 'foot_wheel_cut.svg',
		wW2: 'foot_wheel_cut.svg',
		wW3: 'foot_wheel_cut.svg',
		wW4: 'foot_wheel_cut.svg',
		wW5: 'foot_wheel_cut.svg',
		wW6: 'foot_wheel_cut.svg',
		output3D: 'foot_joints.svg'
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
	const figAxis1 = figure();
	const figAxis3 = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const R1 = param.aD1;
		const R2 = param.aD1 + param.aD3;
		//const pi2 = Math.PI / 2;
		//const epsilon = 0.01;
		const Htot = 999;
		const Ltot = 999;
		// step-5 : checks on the parameter values
		if (param.wN6 < 2) {
			throw `err195: W5 ${ffix(param.W5)} is too small compare to D8 ${ffix(2 * param.R8)} and W8 ${ffix(param.W8)}`;
		}
		// step-6 : any logs
		rGeome.logstr += `length ${ffix(Ltot)}  height ${ffix(Htot)}\n`;
		// step-7 : drawing of the figures
		// inherite
		// sub-wheel
		const wheelParam = designParam(wheelDef.pDef, '');
		wheelParam.setVal('D1', param.aD3 + param.wED3);
		wheelParam.setVal('RD2', param.wRD2);
		wheelParam.setVal('RD3', param.wRD3);
		wheelParam.setVal('RD4', param.wRD4);
		wheelParam.setVal('RD5', param.wRD5);
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
		pivotParam.setVal('D1', param.pD1);
		pivotParam.setVal('D2', param.pD2);
		pivotParam.setVal('D3', param.pD3);
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
		pivotParam.setVal('S5b', param.pS5b);
		pivotParam.setVal('RR4', param.pRR4);
		pivotParam.setVal('RR5', param.pRR5);
		pivotParam.setVal('H11', param.pH11);
		pivotParam.setVal('H12', param.pH12);
		pivotParam.setVal('H13', param.pH13);
		pivotParam.setVal('H14', param.pH14);
		pivotParam.setVal('H15', param.pH15);
		pivotParam.setVal('H5', param.pH5);
		pivotParam.setVal('H2', param.pH2);
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
		liftParam.setVal('D1', param.lD1);
		liftParam.setVal('D2', param.lD2);
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
		liftParam.setVal('H1', param.lH1);
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
		// figTop
		// figSide
		// figAxis1
		figAxis1.addMainOI([contourCircle(0, 0, R2), contourCircle(0, 0, R1)]);
		// figAxis3
		figAxis3.addMainOI([contourCircle(0, 0, R2), contourCircle(0, 0, R1)]);
		// final figure list
		rGeome.fig = {
			faceTop: figTop,
			faceSide: figSide,
			faceAxis1: figAxis1,
			faceAxis3: figAxis3
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		const partInherit: tInherit[] = [];
		const partExtrude: tExtrude[] = [];
		const partList: string[] = [];
		// part3D wheel
		if ([0, 1].includes(param.output3D)) {
			const partWheel: tInherit = {
				outName: `inpax_${designName}_wheel`,
				subdesign: 'pax_wheel',
				subgeom: wheelGeom,
				rotate: [0, 0, 0],
				translate: [0, 0, 0]
			};
			partInherit.push(partWheel);
			partList.push(`inpax_${designName}_wheel`);
		}
		// part3D pivot
		if ([0, 1].includes(param.output3D)) {
			const partPivot: tInherit = {
				outName: `inpax_${designName}_pivot`,
				subdesign: 'pax_pivot',
				subgeom: pivotGeom,
				rotate: [0, 0, 0],
				translate: [0, 0, 0]
			};
			partInherit.push(partPivot);
			partList.push(`inpax_${designName}_pivot`);
		}
		// part3D lift
		if ([0, 1].includes(param.output3D)) {
			const partLift: tInherit = {
				outName: `inpax_${designName}_lift`,
				subdesign: 'pax_lift',
				subgeom: liftGeom,
				rotate: [0, 0, 0],
				translate: [0, 0, 0]
			};
			partInherit.push(partLift);
			partList.push(`inpax_${designName}_lift`);
		}
		// part3D axis
		if ([0, 1].includes(param.output3D)) {
			for (const ii of [1, 3]) {
				const iiName = `subpax_${designName}_axis_${ii}`;
				const iiAxisT3d2 = transform3d().addTranslation(0, 0, 0);
				const iiAxisT3d = param.output3D === 0 ? transform3d() : iiAxisT3d2;
				//rGeome.logstr += `dbg511: ii ${ii}  iiAxisT3d ${ffix(iiAxisT3d.getTranslation()[2])}\n`;
				const iiPartAxis: tExtrude = {
					outName: iiName,
					face: `${designName}_faceAxis${ii}`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: 10,
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
		const subWheel: tSubInst = {
			partName: wheelParam.getPartName(),
			dparam: wheelParam.getDesignParamList(),
			orientation: [0, 0, 0],
			position: [0, 0, 0]
		};
		const subPivot: tSubInst = {
			partName: pivotParam.getPartName(),
			dparam: pivotParam.getDesignParamList(),
			orientation: [0, 0, 0],
			position: [0, 0, 0]
		};
		const subLift: tSubInst = {
			partName: liftParam.getPartName(),
			dparam: liftParam.getDesignParamList(),
			orientation: [0, 0, 0],
			position: [0, 0, 0]
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
