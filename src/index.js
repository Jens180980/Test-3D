import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  Mesh,
} from "babylonjs";

import "@babylonjs/inspector";
import "@babylonjs/core/Debug/debugLayer";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

function createScene() {
  const scene = new Scene(engine);

  const camera = new ArcRotateCamera(
    "Camera",
    35,
    Math.PI / 2.5,
    15, // Distance
    Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  const light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

  // MODELS BELOW THIS LINE

  const box1 = MeshBuilder.CreateBox("box", {}, scene);
  box1.scaling = new Vector3(2, 1.5, 3);
  box1.position = new Vector3(-3, 0.75, 0);

  const box2 = MeshBuilder.CreateBox("box2", {
    width: 2,
    height: 1.5,
    depth: 3,
  });
  box2.position = new Vector3(0, 0.75, 0);

  const box3 = MeshBuilder.CreateBox("box3", {});
  box3.scaling.x = 2;
  box3.scaling.y = 1.5;
  box3.scaling.z = 3;
  box3.position = new Vector3(3, 0.75, 0);

  box1.rotation.y = BABYLON.Tools.ToRadians(45);
  box2.rotation.y = BABYLON.Tools.ToRadians(45);
  box3.rotation.y = BABYLON.Tools.ToRadians(45);

  // GROUND

  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 20,
    height: 20,
  });

  // const sound = new BABYLON.Sound("sound", "./ambient.wav", scene, null, {
  //   loop: true,
  //   autoplay: true,
  // });

  // CODE ABOVE THIS LINE //

  scene.debugLayer.show();
  return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
