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
    scene: any = undefined;
    camera: any = undefined;
    renderer: any = undefined;
    controls: any = undefined;
    raycaster: any = undefined;
    pointer: any = undefined;
    onPointerMove: any = undefined;
    animationTimeout: any = undefined;
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
        this.scene = new Scene();
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
        this.animate = this.animate.bind(this);
    }
    componentDidMount(){
        if(this.view === undefined){
            return
        }
        const elem = this.view.current;
        elem.appendChild(this.renderer.domElement);
        this.animate();
    }
    componentDidUpdate(){
        const { objects } = this.props;
        const { scene } = this;
        for(const key in objects){
            const object = objects[key]
            if(object.parent !== scene){
                scene.add(object);
            }
        }
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
        window.clearTimeout(this.animationTimeout);
    }
    animate() {
        this.animationTimeout = window.setTimeout(()=>{
            requestAnimationFrame( this.animate );
        }, 100);
        this.raycaster.setFromCamera( this.pointer, this.camera );
        const intersects = this.raycaster.intersectObjects( this.scene.children );
        if(intersects.length){
            const object = intersects[0].object;
            var restore_required = false;
            var update_required = true;
            if(this.state.selectedObject){
                if(this.state.selectedObject === object){
                    update_required = false;
                }
                else{
                    restore_required = true;
                }
            }
            if(restore_required){
                // Restore object original color
                this.state.selectedObject.material.color.set(this.state.originalColor);
            }
            if(update_required){
                // Update selection
                this.setState({selectedObject: object, originalColor: object.material.color.clone()});
                // Highlight Selected Object
                object.material.color.set(0xffffff)
            }
        }
        else if(this.state.selectedObject){
            // Restore object original color
            this.state.selectedObject.material.color.set(this.state.originalColor);
            // Clear selection
            this.setState({selectedObject: undefined, originalColor: undefined});
        }

        this.controls.update();
        this.renderer.render( this.scene, this.camera );
    }
    render() {
        const {width, height} = this.props;
        
        return <div 
            ref={this.view}
            style={{border: "1px solid grey", width, height}}>
            </div>
    }
}