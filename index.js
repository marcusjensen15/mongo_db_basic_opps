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

    const courses = await Course
        .find({ author: 'marcus', isPublished: true})
        .limit(10)
        .sort({ name: 1})
        .select({ name: 1, tags: 1});

    console.log(courses);

}

getCourses();

