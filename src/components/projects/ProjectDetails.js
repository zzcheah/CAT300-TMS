import React from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'

const ProjectDetails = (props) => {
    // console.log(props)
    const { project } = props;
    if(project){
        return (
            <div className="container section project-details">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">{project.title}</span>
                        <p>{project.content}</p>
                    </div>
                    <div className="card-action grey lighten-4 grey-text">
                        <div>posted by {project.authorFirstName}</div>
                        <div>2nd september,2am</div>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className="container center">
                <p>Loading project. . . </p>
            </div>
        )
    }

}

const mapStateToProps = (state, ownProps) =>{
    const id = ownProps.match.params.id;
    const projects = state.firestore.data.projects;
    const project = projects? projects[id] : null
    return{
        project : project 
    }
}


export default compose(
    connect(mapStateToProps),
    firestoreConnect(['projects'])
)(ProjectDetails)
