import React, { RefObject } from 'react';
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer
} from 'three';


interface ThreeDViewProps{
    width: number;
    height: number;

    objects: any[];
}

export default class ThreeDView extends React.Component<ThreeDViewProps>{
    view: RefObject<any>|undefined = undefined;
    camera: any = undefined;
    renderer: any = undefined;

    constructor(props:ThreeDViewProps){
        super(props);
        var {width, height} = props;
        this.camera = new PerspectiveCamera( 75, width/height, 0.1, 1000 );
        this.renderer = new WebGLRenderer();
        this.view = React.createRef();
        this.renderer.setSize( width, height );
    }
    componentDidMount(){
        if(this.view === undefined){
            return
        }
        const elem = this.view.current;
        elem.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
    }
    componentWillUnmount(){
        if(!this.view){
            return 
        }
        const elem = this.view.current;
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
        this.renderer.render( scene, this.camera );
        return <div 
            ref={this.view}
            style={{border: "1px solid grey", width, height}}>
            </div>
    }
}