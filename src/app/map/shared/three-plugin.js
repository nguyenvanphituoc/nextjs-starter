// const THREEJS = require("three");
import { Threebox, THREE } from "threebox-plugin";

export const ThreeboxLayer = {
  id: "custom-threebox-model",
  type: "custom",
  renderingMode: "3d",
  onAdd: function (map, gl) {
    // initialize the threebox class
    const tb = new Threebox(map, gl, {
      defaultLights: true,
      enableSelectingObjects: true,
    });
    window.tb = tb;
    var geometry = new THREE.BoxGeometry(30, 60, 120);
    let cube = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({ color: 0x660000 })
    );
    cube = tb.Object3D({ obj: cube, units: "meters" });
    cube.setCoords([103.8233, 1.2514]);
    tb.add(cube);
  },
  render(gl, matrix) {
    tb.update(); //update Threebox scene
  },
};

export const EiffelTowerLayer = {
  id: "custom-eiffel-model",
  type: "custom",
  renderingMode: "3d",
  onAdd: function (map, gl) {
    // initialize the threebox class
    // we can add Threebox to mapbox to add built-in mouseover/mouseout and click behaviors
    const tb = new Threebox(map, gl, {
      defaultLights: true,
      enableSelectingObjects: true, //change this to false to disable 3D objects selection
      enableTooltips: true, // change this to false to disable default tooltips on fill-extrusion and 3D models
    });

    window.tb = tb;
    //
    // Creative Commons License attribution:  Eiffel Tower model by https://www.cgtrader.com/lefabshop
    // https://www.cgtrader.com/items/108594/download-page
    const options = {
      obj: "/3d-models/eiffel.glb",
      type: "gltf",
      scale: { x: 1621.06, y: 1480.4, z: 1621.06 },
      units: "meters",
      rotation: { x: 90, y: 0, z: 0 }, //default rotation
    };
    tb.loadObj(options, function (model) {
      console.log("model loaded", model);
      model.setCoords([103.82469932419053, 1.251529806121539]);
      model.setRotation({ x: 0, y: 0, z: 45.7 });
      model.addTooltip("Eiffel Tower", true);
      model.castShadow = true;
      tb.add(model);
    });
    //
    var geometry = new THREE.BoxGeometry(15, 30, 20);
    let cube = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({ color: 0x660000 })
    );
    cube = tb.Object3D({ obj: cube, units: "meters" });
    cube.setCoords([103.82022958706034, 1.253343886383064]);
    cube.setRotation({ x: 0, y: 0, z: 33 });

    cube.addTooltip("Cube cute", true);
    tb.add(cube);
  },
  render(gl, matrix) {
    tb.update(); //update Threebox scene
  },
};
