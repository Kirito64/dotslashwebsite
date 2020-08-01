import React, { Component} from 'react';
import {Card, CardImg, CardBody, CardHeader, CardText, CardImgOverlay, CardTitle} from 'reactstrap';
import logo from '../footer/1.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './body.css';

class IdeasNVision extends Component {
    render() {
        return (
            <div className="container"> 
                <Card className="card-events">
                    <CardHeader className="card-event-header">Events and Vision</CardHeader>
                    <CardImg className="cardimg" src={logo}></CardImg>
                    <CardTitle>NOtice</CardTitle>
                    {/* <CardImgOverlay src={logo}></CardImgOverlay> */}
                </Card>
            </div>
        );
    }
}

export default IdeasNVision;  