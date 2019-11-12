import React, { Component } from 'react'
import { createTraining } from '../../store/actions/trainingActions'
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'


class CreateTraining extends Component {
    state={
        title:'',
        description:''

    }
    handleChange = (e) =>{
        this.setState({
            [e.target.id] : e.target.value
        })
    }
    handleSubmit = (e) =>{
        e.preventDefault()
      //  console.log(this.state)
      this.props.createTraining(this.state)
      this.props.history.push('/')
    }


    render() {
        const {auth} = this.props
        if(auth.isEmpty) return <Redirect to='/signin' />

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Create Training</h5>
                    <div className="input-field">
                        
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" onChange={this.handleChange}/>
                    </div>

                    <div className="input-field">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" className="materialize-textarea" onChange={this.handleChange}></textarea>
                    </div>

                    <div className="input-field">
                        <button className="btn pink lighten-1 z-depth-0">Create</button>
                    </div>

                </form>
            </div>
        )
    }
}


const mapStateToProps = (state) =>{
    return {
       auth: state.firebase.auth
    }
}

const mapDispatchToProps =(dispatch)=>{
    return {
        createTraining:(training) => dispatch(createTraining(training))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (CreateTraining)
