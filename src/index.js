import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  Mesh,
} from "babylonjs";
import * as earcut from "earcut";
window.earcut = earcut;

import "@babylonjs/inspector";
import "@babylonjs/core/Debug/debugLayer";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

function createScene() {
  const scene = new Scene(engine);

  // Camera and lightening
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

  // Build models
  const ground = buildGround(15, 16);
  const dwellings = buildDwellings();
  //const car = buildCar();

  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "https://assets.babylonjs.com/meshes/",
    "car.babylon"
  ).then(() => {
    const car = scene.getMeshByName("car");
    car.position = new BABYLON.Vector3(-6, 0.24, 1);
    car.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
    const wheelRB = scene.getMeshByName("wheelRB");
    const wheelRF = scene.getMeshByName("wheelRF");
    const wheelLB = scene.getMeshByName("wheelLB");
    const wheelLF = scene.getMeshByName("wheelLF");

    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);
    scene.beginAnimation(car, 0, 210, true);
  });

  scene.debugLayer.show();
  // BABYLON.GLTF2Export.GLBAsync(scene, "village").then((glb) => {
  //   glb.downloadFiles();
  // });
  return scene;
}

// GROUND
const buildGround = (width, height) => {
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: width,
    height: height,
  });

  const groundMat = new BABYLON.StandardMaterial("groundMat");
  groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
  ground.material = groundMat;
};

// BUILDINGS

// DWELLINGS

const buildDwellings = () => {
  const detached_house = buildHouse(1);
  detached_house.rotation.y = -Math.PI / 16;
  detached_house.position.x = -6.8;
  detached_house.position.z = 2.5;

  const semi_house = buildHouse(2);
  semi_house.rotation.y = -Math.PI / 16;
  semi_house.position.x = -4.5;
  semi_house.position.z = 3;

  const places = [];
  places.push([1, -Math.PI / 16, -6.8, 2.5]);
  places.push([2, -Math.PI / 16, -4.5, 3]);
  places.push([2, -Math.PI / 16, -1.5, 4]);
  places.push([2, -Math.PI / 3, 1.5, 6]);
  places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
  places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
  places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
  places.push([1, (5 * Math.PI) / 4, 0, -1]);
  places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
  places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
  places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
  places.push([2, Math.PI / 1.9, 4.75, -1]);
  places.push([1, Math.PI / 1.95, 4.5, -3]);
  places.push([2, Math.PI / 1.9, 4.75, -5]);
  places.push([1, Math.PI / 1.9, 4.75, -7]);
  places.push([2, -Math.PI / 3, 5.25, 2]);
  places.push([1, -Math.PI / 3, 6, 4]);

  const houses = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i][0] === 1) {
      houses[i] = detached_house.createInstance("house" + i);
    } else {
      houses[i] = semi_house.createInstance("house" + i);
    }
    houses[i].rotation.y = places[i][1];
    houses[i].position.x = places[i][2];
    houses[i].position.z = places[i][3];
  }
};

// WALLS
const buildHouse = (width) => {
  const box = buildBox(width);
  const roof = buildRoof(width);

  return BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
};

const buildBox = (width) => {
  const boxMat = new BABYLON.StandardMaterial("boxMat");
  if (width == 2) {
    boxMat.diffuseTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/environments/semihouse.png"
    );
  } else {
    boxMat.diffuseTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/environments/cubehouse.png"
    );
  }

  const faceUV = [];
  if (width == 2) {
    faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0);
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0);
    faceUV[2] = new BABYLON.Vector4(0.4, 0.0, 0.6, 1.0);
    faceUV[3] = new BABYLON.Vector4(0.4, 0.0, 0.6, 1.0);
  } else {
    faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0);
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0);
    faceUV[2] = new BABYLON.Vector4(0.25, 0.0, 0.5, 1.0);
    faceUV[3] = new BABYLON.Vector4(0.75, 0.0, 1.0, 1.0);
  }

  const box = BABYLON.MeshBuilder.CreateBox("box", {
    width: width,
    faceUV: faceUV,
    wrap: true,
  });
  box.material = boxMat;
  box.position.y = 0.5;

  return box;
}; // End buildBox Fn

// ROOF
const buildRoof = (width) => {
  const roofMat = new BABYLON.StandardMaterial("roofMat");
  roofMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/roof.jpg"
  );

  const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.material = roofMat;
  roof.scaling.x = 0.75;
  roof.scaling.y = width;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;

  return roof;
};

// CAR

const buildCar = () => {
  const outline = [
    new BABYLON.Vector3(-0.3, 0, -0.1),
    new BABYLON.Vector3(0.2, 0, -0.1),
  ];

  //curved front
  for (let i = 0; i < 20; i++) {
    outline.push(
      new BABYLON.Vector3(
        0.2 * Math.cos((i * Math.PI) / 40),
        0,
        0.2 * Math.sin((i * Math.PI) / 40) - 0.1
      )
    );
  }

  // top
  outline.push(new BABYLON.Vector3(0, 0, 0.1));
  outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

  const carMat = new BABYLON.StandardMaterial("carMat");
  carMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/car.png"
  );

  const faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
  faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
  faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

  const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {
    shape: outline,
    depth: 0.2,
    faceUV: faceUV,
    wrap: true,
  });

  car.material = carMat;

  car.position.y = 0.3;
  car.rotation.x = -Math.PI / 2;

  const wheelMat = new BABYLON.StandardMaterial("wheelMat");
  wheelMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/wheel.png"
  );

  const wheelUV = [];

  wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
  wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
  wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

  const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {
    diameter: 0.125,
    height: 0.05,
    faceUV: wheelUV,
  });

  wheelRB.material = wheelMat;
  wheelRB.parent = car;
  wheelRB.position = new BABYLON.Vector3(-0.2, 0.035, -0.1);

  const wheelRF = wheelRB.clone("wheelRF");
  wheelRF.position.x = 0.1;

  const wheelLB = wheelRB.clone("wheelLB");
  wheelLB.position.y = -0.2 - 0.035;

  const wheelLF = wheelRB.clone("wheelLF");
  wheelLF.position.y = -0.2 - 0.035;
  wheelLF.position.x = 0.1;

  // Wheel animations
  const animWheel = new BABYLON.Animation(
    "wheelAnim",
    "rotation.y",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );
  const wheelKeys = [];
  wheelKeys.push(
    {
      frame: 0,
      value: 0,
    },
    {
      frame: 30,
      value: 2 * Math.PI,
    }
  );

  animWheel.setKeys(wheelKeys);

  wheelRB.animations = [];
  wheelRB.animations.push(animWheel);

  // Car animation
  const animCar = new BABYLON.Animation(
    "carAnimation",
    "position.x",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const carKeys = [];

  carKeys.push({
    frame: 0,
    value: -4,
  });

  carKeys.push({
    frame: 150,
    value: 4,
  });

  carKeys.push({
    frame: 210,
    value: 4,
  });

  animCar.setKeys(carKeys);

  car.animations = [];
  car.animations.push(animCar);

  // Download model
  //const download = doDownload("car", car);
}; // End buildCar Fn

// Download mesh Fn

let objectUrl;
function doDownload(filename, mesh) {
  if (objectUrl) {
    window.URL.revokeObjectURL(objectUrl);
  }

  const serializedMesh = BABYLON.SceneSerializer.SerializeMesh(mesh);

  const strMesh = JSON.stringify(serializedMesh);

  if (
    filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 ||
    filename.length < 9
  ) {
    filename += ".babylon";
  }

  const blob = new Blob([strMesh], { type: "octet/stream" });

  // turn blob into an object URL; saved as a member, so can be cleaned out later
  objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);

  const link = window.document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  const click = document.createEvent("MouseEvents");
  click.initEvent("click", true, false);
  link.dispatchEvent(click);
}

// *****************************************************************
const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
