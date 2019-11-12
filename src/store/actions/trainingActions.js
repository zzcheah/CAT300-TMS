export const createTraining = (training) => {
    return (dispatch, getState, {getFirebase, getFirestore }) =>{
        //make asyn call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile
        const authorId = getState().firebase.auth.uid
        firestore.collection('trainings').add({
            ...training,
            dateTime: new Date(2020, 11, 24 ,10, 33, 30,0),
            imagePath: 'test',
            organizer:'test',
            price:10,
            seat: 9,
            venue: 'gg',
            tag:['react'],


            // authorFirstName: profile.firstName,
            // authorLastName: profile.lastName,
            // authorId: authorId,
            createdAt: new Date()
        }).then(()=>{
            dispatch({type: 'CREATE_TRAINING', training });
        }).catch((err) =>{
            dispatch({type: 'CREATE_TRAINING_ERROR', err });

        })





        
        
    }
};