import './App.css';
import ThreeDView from './components/ThreeDView';
import {
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three';
import { useState } from 'react';

function App() {
  const [objects, setObjects] = useState([])
  const addbox = () => {
    const cube = new Mesh(
      new BoxGeometry( 1, 1, 1 ) ,
      new MeshBasicMaterial( { color: 0x00ff00 } ) 
    );
    cube.position.x = objects.length;
    setObjects([...objects, cube])
  } 
  return (
    <div className="App">
      <button onClick={addbox}>Add box</button>
      <header className="App-header">
        <ThreeDView width={1000} height={500} objects={objects}/>
      </header>
    </div>
  );
}

export default App;
