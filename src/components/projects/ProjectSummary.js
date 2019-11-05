import React from 'react'

const ProjectSummary = ({project}) => {
    return (
        <div className="card z-depth-0 project-summary">
            <div className="card-content grey-text text-darken-3">
                <span className="card-title">{project.title}</span>
                <p>Posted by Level 51</p>
                <p className="grey-text">11/11/2011 11:11:11</p>
            </div>
    </div>
    )
}

export default ProjectSummary