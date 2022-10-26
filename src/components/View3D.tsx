import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Vector3,
    Vector2,
    Raycaster,
    Object3D,
    Mesh,
    BufferGeometry,
    MeshBasicMaterial,
    Texture,
    Color,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const cameraHeight = 0;
const cameraInitialHorizontalDistance = 1.5;

function getCamera(width: number, height: number) {
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = cameraHeight;
    camera.position.z = cameraInitialHorizontalDistance;
    return camera;
}

function getControls(camera: PerspectiveCamera, renderer: WebGLRenderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxDistance = 3;
    controls.minDistance = 0.2;
    controls.target = new Vector3(0, cameraHeight, 0);
    return controls;
}

function getRenderer(width: number, height: number) {
    const renderer = new WebGLRenderer();
    renderer.setSize(width, height);
    return renderer;
}

interface View3DProps {
    width: number;
    height: number;
    objects: Object3D[];
}

interface ObjectSelection {
    object: Mesh<BufferGeometry, MeshBasicMaterial>;
    originalTexture: Texture | null;
    originalColor: Color;
}


export default function View3D(props: View3DProps) {
    const { width, height, objects } = props;
    const [scene,] = useState(useMemo(() => new Scene(), []));
    const [camera,] = useState(useMemo(() => getCamera(width, height), [width, height]));
    const [renderer,] = useState(useMemo(() => getRenderer(width, height), [width, height]));
    const [controls,] = useState(useMemo(() => getControls(camera, renderer), [camera, renderer]));
    const [raycaster,] = useState(useMemo(() => new Raycaster(), []));
    const [selection, setSelection] = useState(undefined as undefined | ObjectSelection);
    const [pointer, setPointer] = useState(undefined as undefined | { x: number, y: number });
    const view = useRef(undefined as any);

    useEffect(() => { // Called only once to set the view
        if (view) {
            view.current.appendChild(renderer.domElement);
            view.current.addEventListener('pointermove',
                function onPointerMove(event: any) {
                    const x = event.pageX - event.currentTarget.offsetLeft;
                    const y = event.pageY - event.currentTarget.offsetTop;
                    const pointer_x = x / width * 2 - 1;
                    const pointer_y = - y / height * 2 + 1;
                    const newPointer = { x: pointer_x, y: pointer_y }
                    console.log("Setting pointer at ", newPointer);
                    setPointer(newPointer);
                }
            );
        }
    }, [view, renderer.domElement, height, width]);

    useEffect(() => { // Called whenever the content of the 3D world changes
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
        for (const key in objects) {
            const object = objects[key]
            if (object.parent !== scene) {
                scene.add(object);
            }
        }
    }, [objects, scene]);

    console.log("Current pointer ", pointer);


    if (pointer) {
        console.log("Settings raycaster from camera to ", pointer)
        raycaster.setFromCamera(new Vector2(pointer.x, pointer.y), camera);
    }
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length) {
        console.log("Intersected objects: ", intersects)
        const object = intersects[0].object as Mesh<BufferGeometry, MeshBasicMaterial>;
        var restore_required = false;
        var update_required = true;
        if (selection) {
            if (selection.object === object) {
                update_required = false;
            }
            else {
                restore_required = true;
            }
        }
        if (restore_required && selection) {
            // Restore object original color
            console.log("Restoring...", selection.originalColor, selection.originalTexture)
            selection.object?.material.color.set(selection.originalColor);
            selection.object.material.map = selection.originalTexture;
            selection.object.material.needsUpdate = true;
        }
        if (update_required) {
            // Update selection
            setSelection({
                object: object,
                originalColor: object.material.color.clone(),
                originalTexture: object.material.map?.clone() || null
            });
            console.log("Selected Object: ", object);
            // Highlight Selected Object
            object.material = object.material.clone();
            object.material.color.set(0xffffff)
            object.material.map = null;
            object.material.needsUpdate = true;
            //object.material.map
            console.log("Object texture: ", object.material)
        }
    }
    else if (selection) {
        // Restore object original color
        console.log("Restoring...", selection.originalColor, selection.originalTexture)
        selection.object.material.color.set(selection.originalColor);
        selection.object.material.map = selection.originalTexture;
        selection.object.material.needsUpdate = true;
        // Clear selection
        setSelection(undefined)
    }

    controls.update();
    renderer.render(scene, camera);
    return (
        <div
            ref={view}
            style={{ border: "1px solid grey", width, height }}>
            {selection &&
                <p style={{
                    position: "absolute",
                    bottom: 20,
                    left: 0,
                    right: 0,
                    textAlign: "center"
                }}>{selection.object.name}</p>}
        </div>
    )
}