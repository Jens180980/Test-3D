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

async function createScene() {
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
  const ground = buildGround();
  const house = buildHouse();
  const roof = buildRoof();

  const semiHouse = buildSemiHouse();
  const semiRoof = buildSemiRoof();
  const combHouse = BABYLON.Mesh.MergeMeshes(
    [house, roof],
    true,
    false,
    null,
    false,
    true
  );

  scene.debugLayer.show();
  return scene;
}

// MODELS BELOW THIS LINE

// GROUND
const buildGround = () => {
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 20,
    height: 20,
  });

  const groundMat = new BABYLON.StandardMaterial("groundMat");
  groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
  ground.material = groundMat;
};

// BUILDINGS

// WALLS
const buildHouse = () => {
  const faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); // rear
  faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); // front
  faceUV[2] = new BABYLON.Vector4(0.25, 0.0, 0.5, 1.0); // right
  faceUV[3] = new BABYLON.Vector4(0.75, 0.0, 1.0, 1.0); // left

  const house = MeshBuilder.CreateBox("house", {
    width: 2,
    height: 1.5,
    depth: 3,
    faceUV: faceUV,
    wrap: true,
  });
  house.position = new Vector3(0, 0.75, 0);

  const houseMat = new BABYLON.StandardMaterial("houseMat");
  houseMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/cubehouse.png"
  );
  house.material = houseMat;
};

const buildSemiHouse = () => {
  const faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0.4, 0.0, 0.6, 1.0); // rear
  faceUV[1] = new BABYLON.Vector4(0.4, 0.0, 0.6, 1.0); // front
  faceUV[2] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); // right
  faceUV[3] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); // left

  const house = MeshBuilder.CreateBox("semihouse", {
    width: 2,
    height: 1.5,
    depth: 6,
    faceUV: faceUV,
    wrap: true,
  });
  house.position = new Vector3(3, 0.75, 0);

  const houseMat = new BABYLON.StandardMaterial("houseMat");
  houseMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/semihouse.png"
  );
  house.material = houseMat;
};

// ROOF
const buildRoof = () => {
  const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.scaling.x = 0.75;
  roof.scaling.y = 2.6;
  roof.scaling.z = 2;
  roof.rotation.z = Math.PI / 2;
  roof.rotation.y = BABYLON.Tools.ToRadians(90);
  roof.position.y = 1.75;

  const roofMat = new BABYLON.StandardMaterial("roofMat");
  roofMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/roof.jpg"
  );
  roof.material = roofMat;
};

const buildSemiRoof = () => {
  const roof = BABYLON.MeshBuilder.CreateCylinder("semiroof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.scaling.x = 0.75;
  roof.scaling.y = 5.2;
  roof.scaling.z = 2;
  roof.rotation.z = Math.PI / 2;
  roof.rotation.y = BABYLON.Tools.ToRadians(90);
  roof.position.y = 1.75;
  roof.position.x = 3;

  const roofMat = new BABYLON.StandardMaterial("roofMat");
  roofMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/roof.jpg"
  );
  roof.material = roofMat;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
