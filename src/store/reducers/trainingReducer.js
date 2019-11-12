const initState = {
    trainings: [
        {id: '1', title: 'help me find peach', content: 'blah blah blah'},
        {id: '2', title: 'collect all the stars', content: 'blah blah blah'},
        {id: '3', title: 'egg hunt with yoshi', content: 'blah blah blah'}
      ]
}

const trainingReducer = (state = initState, action) =>{
    switch(action.type){
        case 'CREATE_TRAINING':
            console.log('create training', action.training);
            return state;
        case 'CREATE_TRAINING_ERROR':
            console.log('create prj error',action.err);
            return state;
        default:
            return state;

    }
}

export default trainingReducer