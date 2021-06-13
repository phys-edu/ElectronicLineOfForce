"use strict";
import * as THREE from 'three';
import { Line, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import Stats from 'three/examples/jsm/libs/stats.module';

const camera = new THREE.PerspectiveCamera(45, null, 0.1, 100);
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
class Denkirikisen{
    group: THREE.Group;
    private lines : THREE.Line[];
    
    constructor(public shellD: number) {
        const num = 250;    // 電気力線の本数
        const radius = 15;  // 電気力線の半径
        const objColor1 = 0xff3333; // 電気力線の色（通常）
        const objColor2 = 0x33ff33; // 電気力線の色 (交差)
        const shellAngle = 0.5; // shellの立体角の制御
        const lineMaterial1 = new THREE.LineBasicMaterial({ color: objColor1 });
        const lineMaterial2 = new THREE.LineBasicMaterial({ color: objColor2 });
        const centerP = new THREE.Vector3(0, 0, 0);
  
        this.group = new THREE.Group;
        this.lines = new Array(num);
        for (let i = 0; i < num; i++) {
            const p = i + 0.5;
            const phi = Math.acos(1 - 2.0 * p / num);
            const theta = Math.PI * (1 + Math.sqrt(5.0)) * p;
            const p1 = (new THREE.Vector3(
                Math.cos(theta) * Math.sin(phi),
                Math.cos(phi),
                Math.sin(theta) * Math.sin(phi)
            )).multiplyScalar(radius);
            const geo = new THREE.BufferGeometry().setFromPoints([centerP, p1]);
            this.lines[i] = new THREE.Line(geo, phi > shellAngle ? lineMaterial1 : lineMaterial2);
            this.group.add(this.lines[i]);
        }

        const sphereGeometry = new THREE.SphereBufferGeometry(0.5, 10, 10);
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: objColor1 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.castShadow = true;
        this.group.add(sphere);

        const shellGeometry = new THREE.SphereBufferGeometry(shellD, 30, 10, 0, Math.PI * 2, 0, shellAngle);
        const shellMaterial = new THREE.MeshLambertMaterial({ color: 0x5555ff, side: THREE.DoubleSide });
        const shell = new THREE.Mesh(shellGeometry, shellMaterial);
        shell.castShadow = true;
        this.group.add(shell);
        this.group.rotation.x = Math.PI / 2;
    }
    setPosition(pos: THREE.Vector3) {
        this.group.position.copy(pos);
    }
    setShellAngle(angle: number) {
        for (const l of this.lines) {
            l.material = new THREE.LineBasicMaterial({ color: 0x888888 });
            ////////////////////
        }
    }
}


window.addEventListener('resize', onResize, false);
window.addEventListener("DOMContentLoaded", () => {
    const targetPos = new Vector3(0,0, 10);
    const container = document.getElementById('container');
    container.append(renderer.domElement)

    renderer.setClearColor(0xE1FCFF);
    renderer.shadowMap.enabled = true;
    
    const stats = Stats();
    stats.setMode(0);
    container.appendChild(stats.dom);

    camera.position.set(30, 30, 40);
    camera.up.set(0, 0, 1);
    camera.lookAt(targetPos);

    const splotLigth = new THREE.SpotLight(0xffffff);
    splotLigth.position.set(0, 0, 30);
    splotLigth.lookAt(targetPos);
    splotLigth.castShadow = true;
    scene.add(splotLigth);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    scene.add(plane);
    
    const denkirikisen = new Denkirikisen(10);
    denkirikisen.setPosition(targetPos);
    scene.add(denkirikisen.group);

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