import './App.css';
import ThreeDView from './components/ThreeDView';
import {
  // BoxGeometry,
  // MeshBasicMaterial,
  // Mesh,
  PointLight,
} from 'three';
import { useState, useEffect } from 'react';
import ThreeDObject from './components/ThreeDObject';


var lights = [
  new PointLight(0xAAAAAA, 1, 0),
  new PointLight(0xAAAAAA, 1, 0),
  new PointLight(0xAAAAAA, 1, 0),
  new PointLight(0xAAAAAA, 1, 0),
  new PointLight(0xAAAAAA, 1, 0),
  new PointLight(0xAAAAAA, 1, 0),
];
lights[0].position.set(1000, 0, 0);
lights[1].position.set(-1000, 0, 0);
lights[2].position.set(0, 1000, 0);
lights[3].position.set(0, -1000, 0);
lights[4].position.set(0, 0, 1000);
lights[5].position.set(0, 0, -1000);



function App() {
  const [objects, setObjects] = useState([...lights])
  // const addbox = () => {
  //   const cube = new Mesh(
  //     new BoxGeometry( 1, 1, 1 ) ,
  //     new MeshBasicMaterial( { color: 0x00ff00 } ) 
  //   );
  //   cube.position.x = objects.length;
  //   cube.rotateX(objects.length*11.25);
  //   cube.rotateY(objects.length*11.25);
  //   cube.rotateZ(objects.length*11.25);
  //   setObjects([...objects, cube])
  // }
  useEffect(() => {
    (async () => {
      const obj = await ThreeDObject('man/man.gltf');
      if (obj) {
        setObjects([...objects, obj.scene]);
      } else {
        console.log("Failed to load object");
      }
    })();
    // eslint-disable-next-line
  }, [])

  return (
    <div className="App">
      {/* <button onClick={addbox}>Add box</button>
      <button onClick={add3D}>Add 3D Object</button> */}
      <header className="App-header">
        <ThreeDView width={window.innerWidth -2} height={window.innerHeight-2} objects={objects} />
      </header>
    </div>
  );
}

export default App;
