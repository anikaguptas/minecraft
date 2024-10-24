import GUI from "lil-gui";

export function createGui(world) {
  const gui = new GUI();
  const worldFolder = gui.addFolder("World");
  worldFolder.add(world.size, "width", 8, 128, 1).name("Width");
  worldFolder.add(world.size, "height", 8, 64, 1).name("Height");
  const terrainFolder = gui.addFolder("Terrain");
  terrainFolder.add(world.params.terrain, "scale", 10, 100).name("scale");
  terrainFolder.add(world.params.terrain, "offset", 0, 1).name("offset");
  terrainFolder.add(world.params.terrain, "magnitude", 0, 1).name("magnitude");
  gui.onChange(() => {
    world.generate();
  });
  return gui;
}
