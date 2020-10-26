const mongoose = require('mongoose');

//below line changes when we are deploying to a production string
//this connect method returns a promise, so we can chain using 'then'
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.log("could not connect to mongo db", err));



//below defines the shape of course documents in mongodb

const courseSchema = new mongoose.Schema({

    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now},
    isPublished: Boolean

});

//below is just defining a course class in our application, we are going to make instances of it.


const Course = mongoose.model('Course', courseSchema);

const course = new Course({
    name: 'Angular Course',
    author: 'marcus',
    tags: [ 'angular', 'frontend'],
    isPublished: true 
});


//below is an async operation, it doesn't happen instantly. It returns a promise so we can 'await' it.

async function createCourse() {
const result = await course.save();
console.log(result);
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

   const course = await Course.findById(id);
   if (!course) return;
   course.isPublished = true;
   course.author = 'some dude';

   //the two lines above this will do the same as below
//    course.set({
//        isPublished: true,
//        author: 'some other dude'
//    });

//below saves the changes back in the db. save is an out of the box mongoose method. 
const result = await course.save();
console.log(result);


    //Update first Approach 
    // Update directly, can optionally get the updated document 

}



updateCourse("5f9478981e967404dc5e6f43");
// getCourses();

