# ReMapper Particle System (Beta)
Welcome! This is a particle system built using ReMapper to emulate a particle system. If you find any issues or have an idea, feel free to open an issue or make a pull request. Feel free to ask any questions, you can contact me by my discord (`nasafrasa#8239`).

### Installation

To use the ReMapper Particle System in your maps, first put this line at the top of your code:
```ts
import { ParticleSystem } from "https://deno.land/x/rmps@0.1.0/src/mod.ts";
```
If there is a red line under the link, jst hover your mouse over it, press quick fix, and cache the dependency. You're now free to use the ReMapper Particle System!

Here's a basic intro on how to use this:
```ts
const PS = new ParticleSystem(0,100,1000);
PS.push();
```
The first value is the time the generator starts generating particles. The second value is how long the generator will generate particles. The third value is how many particles will be produced. You can find more properties by typing out `PS.` and looking at the list of properties. To see all the features this has, click the links to the documentation below.


### Documentation

- [Generator](https://github.com/Nasafrasa/ReMapperParticleSystem/wiki/Generator-Documentation)
- [Particle](https://github.com/Nasafrasa/ReMapperParticleSystem/wiki/Particle-Documentation)
- [Functions](https://github.com/Nasafrasa/ReMapperParticleSystem/wiki/Functions-Documentation)

### Example Effects

- [Fire](https://github.com/Nasafrasa/ReMapperParticleSystem/wiki/Example-Effects#fire)
- [Rain](https://github.com/Nasafrasa/ReMapperParticleSystem/wiki/Example-Effects#rain)
- [Fireflies](https://github.com/Nasafrasa/ReMapperParticleSystem/wiki/Example-Effects#fireflies)
- [Rainbow Swirl](https://github.com/Nasafrasa/ReMapperParticleSystem/wiki/Example-Effects#rainbow-swirl)
- [Stars](https://github.com/Nasafrasa/ReMapperParticleSystem/wiki/Example-Effects#stars)
- [Explosion](https://github.com/Nasafrasa/ReMapperParticleSystem/wiki/Example-Effects#explosion)
