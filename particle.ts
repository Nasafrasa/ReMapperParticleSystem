import { Wall } from "./wall.ts";
import { CustomEvent } from "./custom_event.ts";
import { rand, Vec3, arrAdd, rotatePoint } from "./general.ts";
import { KeyframesLinear, KeyframesVec3, KeyframesVec4, Interpolation } from "./animation.ts";

// Generator Features
let generatorTime: number;
let generatorDuration: number;
let generatorParticleAmount: number;

let particleLife = 1;
let particleDistance = 1;
let particleEasing = "easeLinear" as Interpolation;

let generatorShape = "Sphere" as ParticleSystemShape;
let generatorType = "Wall" as ParticleSystemType;
let generatorScale = [1, 1, 1] as Vec3;
let generatorExpansion = 0;
let generatorName = "ParticleSystem";

// Custom Stuff
let particleAnimateDissolve = [[1, 0]] as KeyframesLinear;
let particleAnimateColor = [[1, 1, 1, 1, 0]] as KeyframesVec4;
let particleAnimateScale = [[1, 1, 1, 0]] as KeyframesVec3;
let particleAnimateRotation = [[0, 0, 0, 0]] as KeyframesVec3;
let particleAnimateLocalRotation = [[0, 0, 0, 0]] as KeyframesVec3;

export class ParticleSystem {

    constructor(time: number, duration: number, amount: number) {
        generatorTime = time;
        generatorDuration = duration;
        generatorParticleAmount = amount;
    }


    generator = new PSGenerator();


    particle = new PSParticles();


    /**
     * Make the Particle System
     * @returns 
     */
    push() {

        const particleTracks = [];

        for (let i = 1; i <= generatorParticleAmount; i++) {

            //// THE WALL

            const particleTime = rand(generatorTime, generatorTime + generatorDuration); // Calculate when the particle will spawn
            const particleRandomX = rand(-generatorScale[0], generatorScale[0]);
            const particleRandomY = rand(-generatorScale[1], generatorScale[1]);
            const particleRandomZ = rand(-generatorScale[2], generatorScale[2]);
            const particleRandomAX = rand(-generatorExpansion, generatorExpansion);
            const particleRandomAZ = rand(-generatorExpansion, generatorExpansion);
            const particleRandomDistanceX = rand(-particleDistance, particleDistance);
            const particleRandomDistanceY = rand(-particleDistance, particleDistance);
            const particleRandomDistanceZ = rand(-particleDistance, particleDistance);
            const pointX = rand(0,360);
            const pointY = rand(0,360);
            const pointZ = rand(0,360);
            let particle;

            if (generatorType == "Wall") {
                particle = new Wall();
            } else {
                particle = new Wall();
            }

            // PARTICLE SYSTEM SHAPE
            if (generatorShape == "Direction") {
                particle.animate.definitePosition = [[particleRandomX, particleRandomY, particleRandomZ, 0], [particleRandomX + particleRandomAX, particleRandomY + particleDistance, particleRandomZ + particleRandomAZ, 1, particleEasing]];
            } else if (generatorShape == "Sphere") {
                particle.animate.definitePosition = [[...arrAdd(rotatePoint([0, generatorExpansion, 0], [pointX, pointY, pointZ]), 0), 0], [...arrAdd(rotatePoint([0, particleDistance, 0], [pointX, pointY, pointZ]), 0), 1, particleEasing]];
            } else if (generatorShape == "Field") {
                particle.animate.definitePosition = [[particleRandomX, particleRandomY, particleRandomZ, 0], [particleRandomX + particleRandomDistanceX, particleRandomY + particleRandomDistanceY, particleRandomZ + particleRandomDistanceZ, 1, particleEasing]]
            }

            particle.scale = [1, 1, 1];

            particle.animate.color = [...particleAnimateColor] as KeyframesVec4;
            particle.animate.scale = [...particleAnimateScale] as KeyframesVec3;
            particle.animate.dissolve = [[0, 0], ...particleAnimateDissolve] as KeyframesLinear;
            particle.animate.rotation = [...particleAnimateRotation] as KeyframesVec3;
            particle.animate.localRotation = [...particleAnimateLocalRotation] as KeyframesVec3;

            particle.life = particleLife;
            particle.lifeStart = generatorTime + particleTime;
            particle.NJS = 0;
            particle.interactable = false;
            particle.track.value = generatorName + `Particle${i}`
            particleTracks.push(particle.track.value);
            particle.push(true);
        }
        new CustomEvent().assignTrackParent(particleTracks, generatorName).push();
    }
}

class PSGenerator {

    get time() { return generatorTime; }
    get duration() { return generatorDuration; }
    get particleAmount() { return generatorParticleAmount; }

    get shape() { return generatorShape; }
    get type() { return generatorType; }
    get scale() { return generatorScale; }
    get expansion() { return generatorExpansion; }
    get name() { return generatorName; }



    set time(value: number) { generatorTime = value; }
    set duration(value: number) { generatorDuration = value; }
    set particleAmount(value: number) { generatorParticleAmount = value; }

    set shape(value: ParticleSystemShape) { generatorShape = value; }
    set type(value: ParticleSystemType) { generatorType = value; }
    set scale(value: Vec3) { generatorScale = value; }
    set expansion(value: number) { generatorExpansion = value; }
    set name(value: string) { generatorName = value; }

}

class PSParticles {

    get life() { return particleLife; }
    get distance() { return particleDistance; }
    get easing() { return particleEasing; }


    set life(value: number) { particleLife = value; }
    set distance(value: number) { particleDistance = value; }
    set easing(value: Interpolation) { particleEasing = value; }

    /** The animation of this Particle System. */
    animate = new PSWallAnimation();

}

class PSWallAnimation {

    get dissolve() { return particleAnimateDissolve; }
    get color() { return particleAnimateColor; }
    get scale() { return particleAnimateScale; }
    get rotation() { return particleAnimateRotation; }
    get localRotation() { return particleAnimateLocalRotation; }

    set dissolve(value: KeyframesLinear) { particleAnimateDissolve = value; }
    set color(value: KeyframesVec4) { particleAnimateColor = value; }
    set scale(value: KeyframesVec3) { particleAnimateScale = value; }
    set rotation(value: KeyframesVec3) { particleAnimateRotation = value; }
    set localRotation(value: KeyframesVec3) { particleAnimateLocalRotation = value; }

}

type ParticleSystemShape =
    "Sphere" |
    "Direction" |
    "Field"

type ParticleSystemType =
    "Wall"
