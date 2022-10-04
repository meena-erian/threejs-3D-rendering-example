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
    animationTimeout: any = undefined;
    state: any = {
        selectedObject: undefined,
        originalColor: undefined,
        pointer: {x:0, y:0}
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
        this.view = React.createRef();
        this.renderer.setSize( width, height );
        this.animate = this.animate.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
    }
    componentDidMount(){
        if(this.view === undefined){
            return
        }
        const elem = this.view.current;
        console.log("Adding event listener to ", elem)
        elem.appendChild(this.renderer.domElement);
        elem.addEventListener( 'pointermove', this.onPointerMove );
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
        while(elem.firstChild) {
            elem.removeChild(elem.lastChild);
        }
        window.clearTimeout(this.animationTimeout);
    }
    onPointerMove( event: any ) {
        const {width, height} = this.props;
        const x = event.pageX - event.currentTarget.offsetLeft; 
        const y = event.pageY - event.currentTarget.offsetTop; 
        const pointer_x = x / width * 2 - 1;
        const pointer_y = - y / height * 2 + 1;
        this.setState({pointer: {x:pointer_x, y:pointer_y}})
        console.log("onPointerMove called: ", pointer_x, pointer_y)
    }
    animate() {
        this.animationTimeout = window.setTimeout(()=>{
            requestAnimationFrame( this.animate );
        }, 100);
        this.raycaster.setFromCamera( new Vector2(this.state.pointer.x, this.state.pointer.y), this.camera );
        console.log("animate this.raycaster.setFromCamera ", this.state.pointer.x, this.state.pointer.y)
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
                console.log("Selected Object: ", object);
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
                {this.state.selectedObject && 
                <p style={{
                    position: "absolute",
                    bottom: 20,
                    left: 0,
                    right: 0,
                    textAlign: "center"
                }}>{this.state.selectedObject.name}</p>}
            </div>
    }
}