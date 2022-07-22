import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export default async function ThreeDObject(path:string) {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(path, resolve, undefined, reject);
    });
}
