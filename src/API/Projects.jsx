import React, { Component } from 'react';
import { Button, Table, Loader } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Link} from 'react-router-dom';
import awsmobile from './../aws-exports';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import './../css/general.css';

export default class Projects extends Component{

    state = {
        loading: false,
        data: []
    }

    componentDidMount() {
        this.fetchProjects();
    }

    fetchProjects = async () => {
        this.setState(() => {
            return {
                loading: true
            }
        });

        API.get('PROJECTSCRUD','/PROJECTS')
            .then(data => {
                console.log(data);
                this.setState({
                    data: data,
                    loading: false
                });
            })
            .catch ( err => console.log(err))
    }

    addNewProject(){

    }

    render() {
        return (
            <CSSTransitionGroup
                transitionName="sample-app"
                transitionEnterTimeout={500}
                transitionAppearTimeout={500}
                transitionLeaveTimeout={300}
                transitionAppear={true}
                transitionEnter={true}
                transitionLeave={true}>
                <div className="content">
                    <h4>Les projets</h4>
                    {this.state.loading &&  <Loader active inline='centered' />}
                    {!this.state.loading && (
                        <div>
                            <Button className="button"><Link to="newproject">Add new project</Link></Button>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Nom</Table.HeaderCell>
                                        <Table.HeaderCell>Categorie</Table.HeaderCell>
                                        <Table.HeaderCell>Debut</Table.HeaderCell>
                                        <Table.HeaderCell>Fin</Table.HeaderCell>
                                        <Table.HeaderCell>Lieu</Table.HeaderCell>
                                        <Table.HeaderCell></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {this.state.data.map((data) =>
                                        <Table.Row key={data.ID}>
                                            <Table.Cell><Link to={`projects/${data.ID}`}>{data.NAME}</Link></Table.Cell>
                                            <Table.Cell>{data.CATEGORY}</Table.Cell>
                                            <Table.Cell>{data.START_DATE}</Table.Cell>
                                            <Table.Cell>{data.END_DATE}</Table.Cell>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell></Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                    )}
            </div>
            </CSSTransitionGroup>
        );
    }
}
