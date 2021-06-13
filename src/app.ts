"use strict";
import * as THREE from 'three';
import { Line, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import Stats from 'three/examples/jsm/libs/stats.module';

const camera = new THREE.PerspectiveCamera(45, null, 0.1, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

const params = { height: 10 };

function onResize() :void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

}
function createDenkirikisen() {
    const num = 100;
    const raduius = 10;
    const group = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff2222 });
    const centerP = new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < num; i++) {
        const p = i + 0.5;
        const phi = Math.acos(1 - 2.0 * p / num);
        const theta = Math.PI * (1 + Math.sqrt(5.0)) * p;
        const p1 = new THREE.Vector3(
            raduius * Math.cos(theta) * Math.sin(phi),
            raduius * Math.sin(theta) * Math.sin(phi),
            raduius * Math.cos(phi));
        const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), p1]);
        group.add(new THREE.Line(geo, lineMaterial));
    }

    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    group.add(sphere);

    return group;
}

window.addEventListener('resize', onResize, false);
window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('container');
    container.append(renderer.domElement)

    renderer.setClearColor(0xE1FCFF);
    renderer.shadowMap.enabled = true;
    
    const stats = Stats();
    stats.setMode(0);
    container.appendChild(stats.dom);

    camera.position.set(30, 30, 40);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const splotLigth = new THREE.SpotLight(0xffffff);
    splotLigth.position.set(-5, -20, 30);
    splotLigth.castShadow = true;
    scene.add(splotLigth);
   // scene.add(new THREE.SpotLightHelper(splotLigth, 0xff0000));

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    scene.add(plane);
    
    const denkirikisen = createDenkirikisen();
    denkirikisen.position.z = 10;
    scene.add(denkirikisen);

    const controls = new OrbitControls(camera, renderer.domElement);
    const gui = new GUI();
    gui.add(params , 'height', 0, 100);
    gui.open();

    onResize();
    const render = function () {
        stats.update();
        //denkirikisen.position.z = params.height;
        window.requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
    render();
});