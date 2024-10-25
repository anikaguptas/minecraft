import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";
import { RNG } from "./rng";
import { blocks } from "./blocks";
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
export class World extends THREE.Group {
  data = [];

  params = {
    seed: 0,
    terrain: {
      scale: 15,
      magnitude: 0.5,
      offset: 0.5,
    },
  };

  //id means grass, rock , etc
  //instance id is the instance mesh number
  constructor(size = { width: 32, height: 16 }) {
    super();
    this.size = size;
    this.generateData();
    this.generateTerrain();
    this.generateWorld();
  }
  generate() {
    this.generateData();
    this.generateTerrain();

    this.generateWorld();
  }

  //assigns each block id to 1 that is grass
  generateData() {
    this.data = [];
    for (let x = 0; x < this.size.width; x++) {
      const slice = [];
      for (let y = 0; y < this.size.height; y++) {
        const row = [];
        for (let z = 0; z < this.size.width; z++) {
          row.push({
            id: blocks.empty.id,
            instanceId: null,
          });
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }

  //noised terrain
  generateTerrain() {
    const rng = new RNG(this.params.seed);
    const simplex = new SimplexNoise(rng);
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        const value = simplex.noise(
          x / this.params.terrain.scale,
          z / this.params.terrain.scale
        );
        const scalednoise =
          this.params.terrain.offset + this.params.terrain.magnitude * value;
        let height = Math.floor(this.size.height * scalednoise);
        height = Math.max(0, Math.min(this.size.height - 1, height));

        for (let y = 0; y < this.size.height; y++) {
          if (y < height) {
            this.setblockid(x, y, z, blocks.dirt.id);
          } else if (y == height) {
            this.setblockid(x, y, z, blocks.grass.id);
          } else {
            this.setblockid(x, y, z, blocks.empty.id);
          }
        }
      }
    }
  }

  //instance generation and setting positions
  generateWorld() {
    this.clear();
    let maxCount = this.size.width * this.size.width * this.size.height;
    const mesh = new THREE.InstancedMesh(geometry, material, maxCount);
    mesh.count = 0;
    const matrix = new THREE.Matrix4();
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        for (let y = 0; y < this.size.height; y++) {
          const blockid = this.getblock(x, y, z).id;
          if (blockid != 0) {
            const instanceId = mesh.count;
            matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
            mesh.setMatrixAt(instanceId, matrix);
            this.setinstanceid(x, y, z, instanceId);
            mesh.count++;
          }
        }
      }
    }
    this.add(mesh);
  }
  getblock(x, y, z) {
    if (this.inbounds(x, y, z)) {
      return this.data[x][y][z];
    } else {
      return null;
    }
  }

  setblockid(x, y, z, id) {
    if (this.inbounds(x, y, z)) {
      this.data[x][y][z].id = id;
    }
  }
  setinstanceid(x, y, z, id) {
    if (this.inbounds(x, y, z)) {
      this.data[x][y][z].instanceId = id;
    }
  }
  inbounds(x, y, z) {
    if (
      x >= 0 &&
      x < this.size.width &&
      y >= 0 &&
      y < this.size.height &&
      z >= 0 &&
      z < this.size.width
    ) {
      return true;
    } else {
      console.log("Out of bounds");
      return false;
    }
  }
}
