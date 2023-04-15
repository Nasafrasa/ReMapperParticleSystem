// deno-lint-ignore-file adjacent-overload-signatures
import { arrAdd, Bomb, CustomEvent, CUT, Interpolation, KeyframesLinear, KeyframesVec3, KeyframesVec4, Note, rand, rotatePoint, Vec3, Wall } from "https://deno.land/x/remapper@3.1.1/src/mod.ts";

// Particle variables
let pLife = 1;
let pDistance = 1;
let pEasing = "easeLinear" as Interpolation;
let pNoteDirection = CUT.DOWN;
let pWallScale = [1,1,1] as Vec3;

// Generator variables
let gTime: number;
let gDuration: number;
let gParticleAmount: number;
let gShape = "Sphere" as PSShape;
let gType = "Wall" as PSType;
let gScale = [1, 1, 1] as Vec3;
let gPosition = [0, 0, 0] as KeyframesVec3;
let gRotation = [0, 0, 0] as KeyframesVec3;
let gExpansion = [0, 0, 0] as Vec3;
let gName = "ParticleSystem";

// Particle animation variables
let pDissolve = [[1, 0]] as KeyframesLinear;
let pDissolveArrow = [[1, 0]] as KeyframesLinear;
let pColor = [1, 1, 1, 1] as KeyframesVec4;
let pScale = [1, 1, 1] as KeyframesVec3;
let pRotation = [0, 0, 0] as KeyframesVec3;
let pLocalRotation = [0, 0, 0] as KeyframesVec3;

export class ParticleSystem {

    /** Makes a particle system using walls! */
    constructor(time: number, duration: number, amount: number) {
        gTime = time;
        gDuration = duration;
        gParticleAmount = amount;
    }

    /** Class of all the generator properties. */
    generator = new PSGenerator();

    /** Class of all the particle properties. */
    particle = new PSParticles();

    /** Pushes all the walls to the difficulty. In the brackets you can change the properties of each particle, this is useful for randomizing values for each particle. */
    push(particle?: (particle: Note | Wall | Bomb) => void) {
        const pTracks = [];
        for (let i = 1; i <= gParticleAmount; i++) {
            const pTime = rand(0, gDuration);
            const pRandPos = [rand(-gScale[0], gScale[0]), rand(-gScale[1], gScale[1]), rand(-gScale[2], gScale[2])];
            const pRandPosEx = [rand(-gExpansion[0], gExpansion[0]), rand(-gExpansion[1], gExpansion[1]), rand(-gExpansion[2], gExpansion[2])];
            const pRandDistance = [rand(-pDistance, pDistance), rand(-pDistance, pDistance), rand(-pDistance, pDistance)];
            const pRandPoint = [rand(0, 360), rand(0, 360), rand(0, 360)];
            let p;

            switch (gType) {
                case "Wall": {
                    p = new Wall();
                    p.scale = pWallScale;
                    break;
                }
                case "Note": {
                    p = new Note();
                    p.animate.dissolveArrow = [[0, 0], ...pDissolveArrow] as KeyframesLinear;
                    p.direction = pNoteDirection;
                    p.noteLook = false;
                    p.noteGravity = false;
                    break;
                }
                case "Bomb": {
                    p = new Bomb();
                    p.animate.dissolveArrow = [[0, 0], ...pDissolveArrow] as KeyframesLinear;
                    p.noteLook = false;
                    p.noteGravity = false;
                    break;
                }
            }

            switch (gShape) {
                case "Direction": {
                    p.animate.definitePosition = [[pRandPos[0], pRandPos[1], pRandPos[2], 0], [pRandPos[0] + pRandPosEx[0], pRandPos[1] + pDistance + pRandPosEx[1], pRandPos[2] + pRandPosEx[2], 1, pEasing]];
                    break;
                }
                case "Field": {
                    p.animate.definitePosition = [[pRandPos[0], pRandPos[1], pRandPos[2], 0], [pRandPos[0] + pRandDistance[0], pRandPos[1] + pRandDistance[1], pRandPos[2] + pRandDistance[2], 1, pEasing]]
                    break;
                }
                case "Sphere": {
                    p.animate.definitePosition = [[...arrAdd(rotatePoint([0, gExpansion[0], 0], [pRandPoint[0], pRandPoint[1], pRandPoint[2]]), 0), 0], [...arrAdd(rotatePoint([0, gExpansion[0] + pDistance, 0], [pRandPoint[0], pRandPoint[1], pRandPoint[2]]), 0), 1, pEasing]];
                    break;
                }
            }

            p.animate.color = pColor;
            p.animate.scale = pScale;
            p.animate.dissolve = [[0, 0], ...pDissolve] as KeyframesLinear;
            p.animate.rotation = pRotation;
            p.animate.localRotation = pLocalRotation;

            p.life = pLife;
            p.lifeStart = gTime + pTime;
            p.NJS = 1;
            p.interactable = false;
            p.track.value = gName + `Particle${i}`
            pTracks.push(p.track.value);
            if (particle) particle(p);
            p.push(true);
        }
        new CustomEvent().assignTrackParent(pTracks, gName).push();
        const g = new CustomEvent().animateTrack(gName);
        g.animate.position = gPosition;
        g.animate.rotation = gRotation;
        g.push();
    }
}

class PSGenerator {

    /** The time (in beats) when the generator starts generating particles. */
    get time() { return gTime; }
    /** The duration (in beats) of how long the generator will produce particles for. */
    get duration() { return gDuration; }
    /** The amount of particles produced during the duration of the generator. */
    get particleAmount() { return gParticleAmount; }
    /** The shape of the generator. "Sphere" creates particles from one point and fires them in any direction. "Direction" creates particles and fires them in one direction. "Field" creates particles in a field where each particle has its own start and end point within the specified area. */
    get shape() { return gShape; }
    /** The type of particles the generator produces, currently can only produce walls ("Wall"). */
    get type() { return gType; }
    /** Sets the volume of where particles can be generated, does not work on the generator type "Sphere". */
    get scale() { return gScale; }
    /** Sets the position of the generator by moving the parent track. */
    get position() { return gPosition; }
    /** Sets the rotation of the generator by rotation the parent track. */
    get rotation() { return gRotation; }
    /** If the generator shape is "Direction", expansion expands the possible area particles can end in. If the generator shape is "Sphere", expansion expands the area where the particles start from. If the generator shape is "Field", expansion currently does not affect anything. */
    get expansion() { return gExpansion; }
    /** Names the parent track of all particles, defaults to "ParticleSystem". Use this when making more than one particle system in your map to avoid overlapping track names. */
    get name() { return gName; }



    set time(value: number) { gTime = value; }
    set duration(value: number) { gDuration = value; }
    set particleAmount(value: number) { gParticleAmount = value; }
    set shape(value: PSShape) { gShape = value; }
    set type(value: PSType) { gType = value; }
    set scale(value: Vec3) { gScale = value; }
    set position(value: KeyframesVec3) { gPosition = value; }
    set rotation(value: KeyframesVec3) { gRotation = value; }
    set expansion(value: Vec3) { gExpansion = value; }
    set name(value: string) { gName = value; }

}

class PSParticles {

    /** The lifespan of each particle (in beats), cannot be under 1 beat due to hardcoded limitations. */
    get life() { return pLife; }
    /** The distance of how far each particle will travel over its life. */
    get distance() { return pDistance; }
    /** The easing of each particle from start to end. */
    get easing() { return pEasing; }
    /** The direction of the note. Only works for "Note" generator type. */
    get noteDirection() { return pNoteDirection; }
    /** The scale of the wall. Only works for "Wall" generator type. */
    get wallScale() { return pWallScale; }



    set life(value: number) { pLife = value; }
    set distance(value: number) { pDistance = value; }
    set easing(value: Interpolation) { pEasing = value; }
    set noteDirection(value: CUT) { pNoteDirection = value; }
    set wallScale(value: Vec3) { pWallScale = value; }

    /** The animation of this Particle System. */
    animate = new PSAnimation();

}

class PSAnimation {

    /** Animates the dissolve of each particle. */
    get dissolve() { return pDissolve; }
    /** Animates the dissolve of each particle's arrow. Only works for "Note" and "Bomb" generator type. */
    get dissolveArrow() { return pDissolveArrow; }
    /** Animates the color of each particle. */
    get color() { return pColor; }
    /** Animates the scale of each particle. */
    get scale() { return pScale; }
    /** Animates the rotation of each particle. */
    get rotation() { return pRotation; }
    /** Animates the local rotation of each particle. */
    get localRotation() { return pLocalRotation; }



    set dissolve(value: KeyframesLinear) { pDissolve = value; }
    set dissolveArrow(value: KeyframesLinear) { pDissolveArrow = value; }
    set color(value: KeyframesVec4) { pColor = value; }
    set scale(value: KeyframesVec3) { pScale = value; }
    set rotation(value: KeyframesVec3) { pRotation = value; }
    set localRotation(value: KeyframesVec3) { pLocalRotation = value; }

}

type PSShape =
    "Sphere" |
    "Direction" |
    "Field"

type PSType =
    "Wall" |
    "Note" |
    "Bomb"