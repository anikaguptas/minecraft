import GUI from "lil-gui";

export function createGui(world) {
  const gui = new GUI();
  gui.addFolder("World Settings");
  gui.add(world.size, "width", 8, 128, 1).name("Width");
  gui.add(world.size, "height", 8, 64, 1).name("Height");
  gui.onChange(() => {
    world.generateWorld();
  });
  return gui;
}
