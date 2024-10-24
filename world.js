import * as THREE from "three";
import { instance } from "three/webgpu";
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
export class World extends THREE.Group {
  data = [];
  //id means grass, rock , etc
  //instance id is the instance mesh number
  constructor(size = { width: 32, height: 16 }) {
    super();
    this.size = size;
    this.generateData();
  }

  generate() {
    this.generateWorld();
  }
  //generate terrain in the video
  //assigns each block id to 1 that is grass
  generateData() {
    this.data = [];
    for (let x = 0; x < this.size.width; x++) {
      const slice = [];
      for (let y = 0; y < this.size.height; y++) {
        const row = [];
        for (let z = 0; z < this.size.width; z++) {
          row.push({
            id: 1,
            instanceId: null,
          });
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }
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
