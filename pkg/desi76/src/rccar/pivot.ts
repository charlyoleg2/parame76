// pivot.ts
// the motor-wheel block of rc-car

// step-1 : import from geometrix
import type {
	//tContour,
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
	//contour,
	contourCircle,
	//ctrRectangle,
	figure,
	//degToRad,
	//radToDeg,
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
		pNumber('S1', 'mm', 1, 0, 500, 1),
		pNumber('S2min', 'mm', 20, 1, 500, 1),
		pNumber('S3', 'mm', 40, 1, 1000, 1),
		pNumber('T3a', 'mm', 2, 1, 100, 1),
		pNumber('T3b', 'mm', 4, 1, 100, 1),
		pNumber('T4a', 'mm', 2, 1, 100, 1),
		pNumber('T4b', 'mm', 4, 1, 100, 1),
		pCheckbox('hollowTop', true),
		pNumber('RR2', 'mm', 2, 0, 100, 1),
		pSectionSeparator('side')
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
		T3a: 'pivot_plate.svg',
		T3b: 'pivot_plate.svg',
		T4a: 'pivot_plate.svg',
		T4b: 'pivot_plate.svg',
		hollowTop: 'pivot_plate.svg',
		RR2: 'pivot_plate.svg'
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
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const R1 = param.D1 / 2;
		const R2 = param.D2 / 2;
		//const pi2 = Math.PI / 2;
		//const epsilon = 0.01;
		const Lextra = param.S1 + param.T3a + param.T3b + param.S3 + param.T4a + param.T4b;
		// step-5 : checks on the parameter values
		if (R2 < R1 + param.T1 + param.T2) {
			throw `err230: D2 ${ffix(2 * R2)} is too small compare to D1 ${ffix(2 * R1)}, T1 ${ffix(param.T1)} and T2 ${ffix(param.T2)}`;
		}
		// step-6 : any logs
		rGeome.logstr += `Lextra ${ffix(Lextra)} mm\n`;
		// step-7 : drawing of the figures
		// figTopPlate1
		figTopPlate1.addMainOI([contourCircle(0, 0, R2), contourCircle(0, 0, R1)]);
		// figTopPlate2
		// final figure list
		rGeome.fig = {
			faceTopPlate1: figTopPlate1,
			faceTopPlate2: figTopPlate2
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
