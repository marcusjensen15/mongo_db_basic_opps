const mongoose = require('mongoose');

//below line changes when we are deploying to a production string
//this connect method returns a promise, so we can chain using 'then'
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.log("could not connect to mongo db", err));



//below defines the shape of course documents in mongodb
//we are making these fields required. this 'required' modifier only exists in mongoose. mongodb doesn't know what that is. 
// we also use joi to make sure that the data the client is sending us is valid. we use this type of validation to make sure the data is
// in the right shape for the DB. 
//below are a bunch more validators 

const courseSchema = new mongoose.Schema({

    name: {type: String, 
           required: true,
            minlength: 5,
            maxlength: 100
            },

    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network']
    },
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now},
    isPublished: Boolean,

    //if isPublished is true, price will be required. THIS CANNOT BE AN ARROW FUNCTION
    price: {
        type: Number,
        min: 10,
        max: 200,
        required: function() { return this.isPublished; }
    }

});

//below is just defining a course class in our application, we are going to make instances of it.


const Course = mongoose.model('Course', courseSchema);

const course = new Course({
    name: 'Angular Course',
    author: 'marcus',
    category: '-',
    tags: [ 'angular', 'frontend'],
    isPublished: true,
    price: 15
});


//below is an async operation, it doesn't happen instantly. It returns a promise so we can 'await' it.

async function createCourse() {


    try{

        //course has this validate method built in
        // await course.validate((err) => {

        // });
        const result = await course.save();
        console.log(result);
    }
    catch(ex){
        console.log(ex.message);
    }

}

//below is how we are retrieving courses from the database. there are a bunch of out of the box methods that come with mongoose (find, limit, sort, etc)

async function getCourses() {
    const pageNumber = 2;
    const pageSize = 10; 
    
    //below are nodejs comparison operators:
    // eq (equal)
    //ne (not equal)
    //gt (greater than)
    //gte (greater than or equal to)
    //lt (less than)
    //lte (less than or equal to)
    //in
    // nin (not in)


    const courses = await Course
        // .find({ author: 'marcus', isPublished: true})

        //in order to query the concept of greater than 10, we must user one of these operators as a key. These operators are decorated with a '$' when used. 
        //also needs to be passed within an object.
        //we can pass multiple comparison operators. (below is greater than 10 dollars and less than 20) 
        // .find({ price: {$gt: 10, $lte: 20 }})
        //below is a query returning courses that are either: 10, 15 or 20 dollars
        // .find({price: { $in: [10,15,20]}})


        //The logical operators in Node are 'or' and 'and'. below is them being used
        //in the or statement below, we are gettin courses where author is marcus and where isPublished equals true. The 'and' operator is used in the same way.


        // .find()
        // .or([{author: 'marcus'}, {isPublished: true}])
        // .and([])

        //below is how regex works in node. below is how we would write a query: starts with marcus. ^ is 'starts with'

        // .find({author: /^marcus/})

        //below is 'ends with'. annotated by '$'. 'i' means case insensitive.
        // .find({author: /jensen$/i})

        //below is 'contains' marcus. .*stuff.* means we can have 0 or more characters before or after. the i at the end makes it case insensitive. 

        // .count() returns the number of documents that match a search criteria. Can be tacked on to the end.

        // the .skip() method is used to implement paginaton.


// .find({ author: /.*marcus.*/i})

        .find({ author: 'marcus', isPublished: true})
        // .skip(( pageNumber - 1) * pageSize)
        // .limit(pageSize)
        .sort({ name: 1})
        .select({ name: 1, tags: 1});

        

    console.log(courses);

}

async function updateCourse(id){

    //Approach: Query first document updating: findById() -> modify its properties -> save()

//    const course = await Course.findById(id);
//    if (!course) return;
//    course.isPublished = true;
//    course.author = 'some dude';

   //the two lines above this will do the same as below
//    course.set({
//        isPublished: true,
//        author: 'some other dude'
//    });

//below saves the changes back in the db. save is an out of the box mongoose method. 
// const result = await course.save();


//below is how we can upate a course directly without finding it first (not recommended if you are taking user input). you can also bulk update courses with this method
const result = await Course.update({ _id: id }, {

    $set: {
        author: 'piggy',
        isPublished: false
    }
});

console.log(result);


    //Update first Approach 
    // Update directly, can optionally get the updated document 

}




//below is how to delete a course. it is going to find one course and delete that course. don't use as a bulk delete. 
//you can bulk delete documents by using the 'delete many' method

async function removeCourse(id){

    const result = await Course.deleteOne({ _id: id});

    //can also use the findByIdAndRemove() method.
    // const result = await Course.findByIdAndRemove(id);
    console.log(result);

}


// removeCourse("5f9478981e967404dc5e6f43");
// getCourses();
createCourse();

