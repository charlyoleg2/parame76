// wheel.ts
// one wheel of the rc-car

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
	//pCheckbox,
	//pDropdown,
	pSectionSeparator,
	EExtrude,
	EBVolume,
	initGeom
} from 'geometrix';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
const pDef: tParamDef = {
	partName: 'wheel',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('D1', 'mm', 20, 1, 1000, 0.1),
		pNumber('RD2', 'mm', 1, 1, 500, 1),
		pNumber('RD3', 'mm', 5, 1, 500, 1),
		pNumber('RD4', 'mm', 2, 1, 500, 1),
		pNumber('RD5', 'mm', 20, 1, 500, 1),
		pNumber('RD6', 'mm', 4, 1, 500, 1),
		pNumber('N6', 'teeth', 20, 5, 1000, 1),
		pSectionSeparator('widths'),
		pNumber('W1', 'mm', 1, 0, 500, 1),
		pNumber('W2', 'mm', 20, 1, 500, 1),
		pNumber('W3', 'mm', 0, 0, 500, 1),
		pNumber('W4', 'mm', 2, 1, 500, 1),
		pNumber('W5', 'mm', 2, 1, 500, 1),
		pNumber('W6', 'mm', 1, 0, 500, 1)
	],
	paramSvg: {
		D1: 'wheel_side.svg',
		RD2: 'wheel_side.svg',
		RD3: 'wheel_cut.svg',
		RD4: 'wheel_cut.svg',
		RD5: 'wheel_side.svg',
		RD6: 'wheel_side.svg',
		N6: 'wheel_side.svg',
		W1: 'wheel_cut.svg',
		W2: 'wheel_cut.svg',
		W3: 'wheel_cut.svg',
		W4: 'wheel_cut.svg',
		W5: 'wheel_cut.svg',
		W6: 'wheel_cut.svg'
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
	const figTube = figure();
	const figPneu = figure();
	const figTrans1 = figure();
	const figTrans2 = figure();
	const figCut = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const R1 = param.D1 / 2;
		//const pi2 = Math.PI / 2;
		//const epsilon = 0.01;
		const Rpneu = R1 + param.RD2 + param.RD5 + param.RD6;
		const Rtrans = R1 + param.RD2 + param.RD3 + param.RD4;
		const Wtot = param.W1 + param.W2 + param.W3 + 2 * param.W4 + param.W5 + param.W6;
		// step-5 : checks on the parameter values
		if (Rpneu < Rtrans) {
			throw `err230: Dpneu ${ffix(2 * Rpneu)} is too small compare to Dtrans ${ffix(2 * Rtrans)}`;
		}
		// step-6 : any logs
		rGeome.logstr += `Wtot ${ffix(Wtot)}  Dpneu ${ffix(2 * Rpneu)}  Dtrans ${ffix(2 * Rtrans)} mm\n`;
		// step-7 : drawing of the figures
		// figTube
		figTube.addMainO(contourCircle(0, 0, R1));
		// figPneu
		// figTrans1
		// figTrans2
		// figCut
		// final figure list
		rGeome.fig = {
			faceTube: figTube,
			facePneu: figPneu,
			faceTrans1: figTrans1,
			faceTrans2: figTrans2,
			faceCut: figCut
		};
		// step-8 : recipes of the 3D construction
		// volume
		const designName = rGeome.partName;
		//const partInherit: tInherit[] = [];
		const partExtrude: tExtrude[] = [];
		const partList: string[] = [];
		if (param.W2 > 0) {
			const eName = `subpax_${designName}_pneu`;
			partExtrude.push({
				outName: eName,
				face: `${designName}_facePneu`,
				extrudeMethod: EExtrude.eLinearOrtho,
				length: param.W2,
				rotate: [0, 0, 0],
				translate: [0, 0, param.W1]
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
		rGeome.logstr += 'wheel drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const wheelDef: tPageDef = {
	pTitle: 'wheel',
	pDescription: 'one wheel of the rc-car',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { wheelDef };
