import React, { Component } from 'react';
import './../css/api.css';
import { ToastContainer, toast } from 'react-toastify';
import './../css/ReactToastify.css';
import Projects from '../Components/Projects';

export default class ProjectsContainer extends Component{

    displayNotification = (success, message) => {
        if(level === "success"){
            toast.success(
                <div style ={{textAlign:'center'}}>
                    {message}
                </div>
            );
        }else if(level === "error"){
            toast.error(
                <div style ={{textAlign:'center'}}>
                    {message}
                </div>
            );
        }else{
            toast.info(
                <div style ={{textAlign:'center'}}>
                    {message}
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <Projects 
                    displayNotification={this.displayNotification}
                />
                <ToastContainer 
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange={false}
                    draggable={false}
                    pauseOnHover={false}
                />
            </div>
        );
    }
}


