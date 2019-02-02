import React from 'react';
import PropTypes from 'prop-types';
import {API} from 'aws-amplify';
import { Button} from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {addCategory} from '../actions/index.js';
import './../css/api.css';
import { toast } from 'react-toastify';


class CategoryModal extends React.Component {

    static propTypes = {
        onClose: PropTypes.func.isRequired,
        show: PropTypes.bool,
        children: PropTypes.node,
        hasError: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            date: new Date()
        };
        this.handleSubmit = this.handleSubmit.bind(this);
      }


      //Create a new category on server side
      handleSubmit(event) {
        event.preventDefault();
        const categoryName = this.state.name;
        
        if(this.hasNoDuplicate(categoryName)){
            let requestParams = {
                headers: {'content-type': 'application/json'},
                body : {
                    'NAME': categoryName
                }
            }
            API.post('CATEGORIESCRUD','/CATEGORIES', requestParams)
            .then(data => {
                console.log(data);
                this.props.addCategory(categoryName);
                this.props.hasError(false);
            })
            .catch((error) => {
                console.log(error);
                this.props.hasError(true);
            });
            this.props.onClose();
        }
    };

    //Check if there is a category with the name chosen by the user already exist
    hasNoDuplicate = (categoryName) => {
        let result = true;
        this.props.data.map((cat) => {
            if(cat.name === categoryName){
                toast.info(
                    <div style ={{textAlign:'center'}}>
                        Cette catégorie existe déjà
                    </div>
                );
                result = false;
            }
        })
        return result;
    }

    //Update the name of the category to add
    handleChange(event) {
        this.setState({name: event.target.value})
      }

    render() {
        if(!this.props.show) {
        return null;
        }

        return (
        <div className="backdrop-content">
            <div className="modal-content">
                <div>
                    <img src={require('../Images/closeIcon2.png')} 
                        onClick={() => {this.props.onClose();}}
                        className="icon-style"
                        width="16" 
                        height="16" 
                    />
                </div>
                <div 
                    className ="modal-title">
                    Création d'une nouvelle catégorie 
                </div>
                <form onSubmit={this.handleSubmit}> 
                    <label> 
                        Nom : 
                        <input 
                            autoFocus 
                            onChange={this.handleChange.bind(this)} 
                            type="text" 
                            name="categoryName" 
                            value={this.state.name} />
                    </label>
                    <button 
                        className='saveData' >
                        Créer
                    </button>
                </form>
            </div>
        </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({addCategory}, dispatch);
}

export default connect(null,mapDispatchToProps)(CategoryModal);

  