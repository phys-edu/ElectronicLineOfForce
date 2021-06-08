"use strict";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

window.addEventListener("DOMContentLoaded", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const container = document.getElementById('container');
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width , height);
    container.append(renderer.domElement)
    renderer.setClearColor(0xE1FCFF);
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.up.set(0, 0, 1);
    camera.position.set(1000, 0, 300);

    const controls = new OrbitControls(camera, renderer.domElement);
    const gui = new GUI();
    /*
    gui.add(params, 'uniform');
    gui.add(params, 'tension', 0, 1).step(0.01).onChange(function (value) {

        splines.uniform.tension = value;
        updateSplineOutline();

    });
    */
    gui.open();

    const render = function () {
        window.requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
    render();
});