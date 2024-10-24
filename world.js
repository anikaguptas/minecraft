import * as THREE from "three";
import { instance } from "three/webgpu";
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
export class World extends THREE.Group {
  data = [];

  constructor(size = { width: 32, height: 16 }) {
    super();
    this.size = size;
  }

  generate() {
    this.generateData();
    this.generateWorld();
  }

  generateData() {
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
          matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
          mesh.setMatrixAt(mesh.count++, matrix);
        }
      }
    }
    this.add(mesh);
  }
}
