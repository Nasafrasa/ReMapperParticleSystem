import { KeyframesLinear, Wall, KeyframesVec3, KeyframesVec4, Interpolation, rand, Vec3, arrAdd, rotatePoint } from "https://deno.land/x/remapper@3.1.1/src/mod.ts";

// Generator Features
let generatorTime: number;
let generatorDuration: number;
let generatorParticleAmount: number;

let particleStartThreshold = 0.1;
let particleEndThreshold = 0.1;
let particleLife = 1;
let particleDistance = 1;
let particleEasing = "easeLinear" as Interpolation;

let generatorType = "Point" as ParticleSystemShape;
let generatorPosition = [[0, 0, 0,0]] as KeyframesVec3;
let generatorRotation = [[0, 0, 0,0]] as KeyframesVec3;
let generatorScale = [1, 1, 1] as Vec3;
let generatorExpansion = 0;

// Custom Stuff
let particleAnimateDissolve = [[1,0]] as KeyframesLinear;
let particleAnimateColor = [[1,1,1,1,0]] as KeyframesVec4;
let particleAnimateScale = [[1,1,1,0]] as KeyframesVec3;
let particleAnimateRotation = [[0,0,0,0]] as KeyframesVec3;
let particleAnimateLocalRotation = [[0,0,0,0]] as KeyframesVec3;

export class ParticleSystem {

    constructor(timeStart: number, timeEnd: number, amount: number) {
        generatorTime = timeStart;
        generatorDuration = timeEnd - timeStart;
        generatorParticleAmount = amount;
    }

    /**
     * Make the Particle System
     * @returns 
     */
    push() {
        for (let i = 1; i <= generatorParticleAmount; i++) {

            //// THE WALL

            const particleTime = rand(generatorTime, generatorTime + generatorDuration); // Calculate when the particle will spawn
            const particleRandomX = rand(-generatorScale[0],generatorScale[0]);
            const particleRandomY = rand(-generatorScale[1],generatorScale[1]);
            const particleRandomZ = rand(-generatorScale[2],generatorScale[2]);
            const particleRandomAX = rand(-generatorExpansion,generatorExpansion);
            const particleRandomAZ = rand(-generatorExpansion,generatorExpansion);

            const particle = new Wall(generatorTime + rand(-particleStartThreshold, particleStartThreshold) + particleTime, particleLife + rand(-particleEndThreshold, particleEndThreshold)); // Make the particle
            particle.animate.rotation = generatorRotation; // Set the rotation of the particle generator
            particle.animate.position = generatorPosition; // Set the position of the particle generator
            

            // PARTICLE SYSTEM SHAPE
            if (generatorType == "Direction") {
                particle.animate.definitePosition = [[particleRandomX,particleRandomY,particleRandomZ,0],[particleRandomX+particleRandomAX,particleRandomY+particleDistance,particleRandomZ+particleRandomAZ,1,particleEasing]];
            } else if (generatorType == "Point") {
                particle.animate.definitePosition = [[0,0,0,0], [...arrAdd(rotatePoint([0, particleDistance, 0], [rand(0, 360),rand(0, 360),rand(0, 360)]), 0), 1, particleEasing]];
            }

            particle.scale = [1, 1, 1];

            particle.animate.color = [...particleAnimateColor] as KeyframesVec4;
            particle.animate.scale = [...particleAnimateScale] as KeyframesVec3;
            particle.animate.dissolve = [[0, 0], ...particleAnimateDissolve] as KeyframesLinear;
            particle.animate.rotation = [...particleAnimateRotation] as KeyframesVec3;
            particle.animate.localRotation = [...particleAnimateLocalRotation] as KeyframesVec3;

            particle.NJS = 0;
            particle.interactable = false;
            particle.track.value = `particle${i}`
            particle.push(true);

        }
    }


    get generatorTime() { return generatorTime; }
    get generatorDuration() { return generatorDuration; }
    get generatorParticleAmount() { return generatorParticleAmount; }

    get particleStartThreshold() { return particleStartThreshold; }
    get particleEndThreshold() { return particleEndThreshold; }
    get particleLife() { return particleLife; }
    get particleDistance() { return particleDistance; }
    get particleEasing() { return particleEasing; }

    get generatorType() { return generatorType; }
    get generatorPosition() { return generatorPosition; }
    get generatorRotation() { return generatorRotation; }
    get generatorScale() { return generatorScale; }
    get generatorExpansion() { return generatorExpansion; }

    get particleAnimateDissolve() { return particleAnimateDissolve; }
    get particleAnimateColor() { return particleAnimateColor; }
    get particleAnimateScale() { return particleAnimateScale; }
    get particleAnimateRotation() { return particleAnimateRotation; }
    get particleAnimateLocalRotation() { return particleAnimateLocalRotation; }



    set generatorTime(value: number) { generatorTime = value; }
    set generatorDuration(value: number) { generatorDuration = value; }
    set generatorParticleAmount(value: number) { generatorParticleAmount = value; }

    set particleStartThreshold(value: number) { particleStartThreshold = value; }
    set particleEndThreshold(value: number) { particleEndThreshold = value; }
    set particleLife(value: number) { particleLife = value; }
    set particleDistance(value: number) { particleDistance = value; }
    set particleEasing(value: Interpolation) { particleEasing = value; }

    set generatorType(value: ParticleSystemShape) { generatorType = value; }
    set generatorPosition(value: KeyframesVec3) { generatorPosition = value; }
    set generatorRotation(value: KeyframesVec3) { generatorRotation = value; }
    set generatorScale(value: Vec3) { generatorScale = value; }
    set generatorExpansion(value: number) { generatorExpansion = value; }

    set particleAnimateDissolve(value: KeyframesLinear) { particleAnimateDissolve = value; }
    set particleAnimateColor(value: KeyframesVec4) { particleAnimateColor = value; }
    set particleAnimateScale(value: KeyframesVec3) { particleAnimateScale = value; }
    set particleAnimateRotation(value: KeyframesVec3) { particleAnimateRotation = value; }
    set particleAnimateLocalRotation(value: KeyframesVec3) { particleAnimateLocalRotation = value; }

}

type ParticleSystemShape = 
    "Point" |
    "Hemisphere" |
    "Direction" |
    "Cone" |
    "Box"