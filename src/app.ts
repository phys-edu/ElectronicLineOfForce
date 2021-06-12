"use strict";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import Stats from 'three/examples/jsm/libs/stats.module';

const camera = new THREE.PerspectiveCamera(45, null, 0.1, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

let params = new function () {
    this.height = 10;
}
function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

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

    camera.position.set(-30, 40, 30);

    const splotLigth = new THREE.SpotLight(0xffffff);
    splotLigth.position.set(-20, 30, -5);
    splotLigth.castShadow = true;
    scene.add(splotLigth);
    scene.add(new THREE.SpotLightHelper(splotLigth,0xff0000));

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);
    
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 10, 0);
    sphere.castShadow = true;
    scene.add(sphere);    

    const controls = new OrbitControls(camera, renderer.domElement);
    const gui = new GUI();
    gui.add(params , 'height', 0, 100);
    gui.open();

    onResize();
    const render = function () {
        stats.update();
        sphere.position.y = params.height;
        window.requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
    render();
});