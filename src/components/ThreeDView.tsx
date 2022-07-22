import React, { RefObject } from 'react';
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    //sRGBEncoding,
    Vector3,
    Vector2,
    Raycaster,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


interface ThreeDViewProps{
    width: number;
    height: number;

    objects: any[];
}

export default class ThreeDView extends React.Component<ThreeDViewProps>{
    view: RefObject<any>|undefined = undefined;
    camera: any = undefined;
    renderer: any = undefined;
    controls: any = undefined;
    raycaster: any = undefined;
    pointer: any = undefined;
    onPointerMove: any = undefined;
    state: any = {
        selectedObject: undefined,
        originalColor: undefined
    }

    constructor(props:ThreeDViewProps){
        super(props);
        var {width, height} = props;
        this.camera = new PerspectiveCamera( 75, width/height, 0.1, 1000 );
        this.camera.position.y = 30;
        this.camera.lookAt(new Vector3(0,0,0));
        this.renderer = new WebGLRenderer();
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.raycaster = new Raycaster();
        this.pointer = new Vector2();
        const pointer = this.pointer;
        this.onPointerMove = function ( event: any ) {
            const x = event.pageX - event.currentTarget.offsetLeft; 
            const y = event.pageY - event.currentTarget.offsetTop; 
            pointer.x = x / width * 2 - 1
            pointer.y = - y / height * 2 + 1
        }
        this.view = React.createRef();
        this.renderer.setSize( width, height );
        this.render = this.render.bind(this) 
    }
    componentDidMount(){
        if(this.view === undefined){
            return
        }
        const elem = this.view.current;
        elem.appendChild(this.renderer.domElement);
    }
    componentWillUnmount(){
        if(!this.view){
            return 
        }
        const elem = this.view.current;
        elem.addEventListener( 'pointermove', this.onPointerMove );
        while(elem.firstChild) {
            elem.removeChild(elem.lastChild);
        }
    }
    render() {
        const {width, height, objects} = this.props;
        const scene = new Scene();
        for(const key in objects){
            scene.add( objects[key] );
        }
        const renderer = this.renderer;
        const camera = this.camera;
        const controls = this.controls;
        const raycaster = this.raycaster;
        const pointer = this.pointer;
        const state = this.state;
        const updateObj = (obj:any) => {
            this.setState({selectedObject: obj});
        }
        const updateColor = (color:any) => {
            this.setState({originalColor: color});
        }
        //const setState = this.setState;
        var animate = function () {
            requestAnimationFrame( animate );
            raycaster.setFromCamera( pointer, camera );
            const intersects = raycaster.intersectObjects( scene.children );

            //console.log(intersects);
            if(intersects.length){
                const obj = intersects[0].object;
                if(obj !== state.selectedObject){
                    if(state.selectedObject){
                        // Reset the color of the last selected object and remove it
                        state.selectedObject.material.color.set(state.originalColor);
                    }
                    // Update selection
                    updateObj(obj);
                    updateColor(obj.material.color);
                    // console.log(setState);
                    // Highlight selected object
                    obj.material.color.set(0xff0000)
                }
            }
            else if(state.selectedObject) {
                // Reset the color of the last selected object and remove it
                state.selectedObject.material.color.set(state.originalColor);
                // Clear selection
                //setState({selectedObject: undefined, originalColor: undefined});
            }
            // for ( let i = 0; i < intersects.length; i ++ ) {
            //     console.log(intersects[ i ].object.material.color);
            //     // intersects[ i ].object.scale.set(new Vector3(1, 1, 1)) ;
            // }
            controls.update();
            renderer.render( scene, camera );
        }
        animate = animate.bind(this);
        animate();
        //this.renderer.render( scene, this.camera );
        return <div 
            ref={this.view}
            style={{border: "1px solid grey", width, height}}>
            </div>
    }
}