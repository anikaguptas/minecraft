import GUI from "lil-gui";

export function createGui(world) {
  const gui = new GUI();
  const worldFolder = gui.addFolder("World");
  worldFolder.add(world.size, "width", 8, 128, 1).name("Width");
  worldFolder.add(world.size, "height", 8, 64, 1).name("Height");
  gui.onChange(() => {
    world.generate();
  });
  return gui;
}
