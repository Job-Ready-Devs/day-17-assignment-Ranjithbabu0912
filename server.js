const express = require('express'); // Import the Express library
const mongoose = require('mongoose'); // Import the mongoose library to interact with MongoDB
const Student = require('./models/Student');

const app = express(); // Create an instance of an Express application
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static('public')); // Middleware to serve static files from the "public" folder

// Define the MongoDB connection URI
// Replace 'localhost:27017/student-management' with your MongoDB URI (local or cloud-based)
const mongoURI = 'mongodb://localhost:27017/student-management';

// Connect to the MongoDB database using mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...')) // If the connection is successful, log a confirmation message
    .catch(err => console.error('MongoDB connection error:', err)); // If the connection fails, log an error message with the details


    app.post('/students', async (req, res) => {
        try {
            const { name, email } = req.body; // Extract name and email from the request body
            const student = new Student({ name, email }); // Create a new student instance
            await student.save(); // Save the student to the database
            res.status(201).json({ message: 'Student created successfully', student }); // Respond with success
        } catch (error) {
            res.status(400).json({ error: error.message }); // Handle errors and send a response
        }
    });



    app.get('/students', async (req, res) => {
        try {
            const students = await Student.find(); // Retrieve all student records
            res.status(200).json(students); // Send the list of students
        } catch (error) {
            res.status(500).json({ error: error.message }); // Handle errors and send a response
        }
    });



    app.get('/students/:id', async (req, res) => {
        try {
            const student = await Student.findById(req.params.id); // Retrieve a specific student record using id
            if (!student) return res.status(404).json({ error: 'Student not found' }); // If the id not found
            res.status(200).json(student); // Send the student record
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });



    app.put('/students/:id', async (req, res) => {
        try {
            const { name, email } = req.body; // Extract updated data from the request body
            const student = await Student.findByIdAndUpdate(
                req.params.id, // Find the student by ID
                { name, email }, // Update the fields
                { new: true, runValidators: true } // Return the updated document and validate fields
            );
            if (!student) return res.status(404).json({ error: 'Student not found' }); // Handle not found
            res.status(200).json({ message: 'Student updated successfully', student }); // Respond with success
        } catch (error) {
            res.status(400).json({ error: error.message }); // Handle errors
        }
    });




    app.delete('/students/:id', async (req, res) => {
        try {
            const student = await Student.findByIdAndDelete(req.params.id); // Find the student by id and delete the record
            if (!student) return res.status(404).json({ error: 'Student not found' });
            res.status(200).json({ message: 'Student deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });  // handle the error while delete the student record
        }
    });




// Define a POST route to handle adding a student
app.post('/add-student', async (req, res) => { // If you are using browser to create a student then call get method app.get()
    try {
        // Create a new instance of the Student model with sample data
        const student = new Student({
            name: 'John Doe',
            email: 'johnson.doe@example.com'
        });
        await student.save(); // Save the new student to the database
        res.send('Student added successfully!'); // Send a success response to the client
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).send('Error adding student: ' + error.message);
    }
});


// Define a basic route for the root URL
// app.get('/', (req, res) => {
//     res.send('Welcome to the Student Management App!');
// });

// Array of student objects with id, name, and email
const students = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com' }
];

// Route to get all students
app.get('/students', (req, res) => {
    res.json(students); // Send the array of students as a JSON response
});

// Route to get a student by ID
app.get('/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id); // Convert the id from the request parameter to an integer
    const student = students.find(s => s.id === studentId); // Search for the student with the matching id

    if (student) {
        res.json(student); // Send the matched student data as JSON
    } else {
        res.status(404).json({ error: 'Student not found' }); // Send a 404 response if no student is found
    }
});

// Route to handle GET /about
app.get('/about', (req, res) => {
    // Respond with a message
    res.send('This is the Student Management App API!');
});

// Middleware to handle undefined routes
app.use((req, res) => {
    // Respond with a 404 status and a custom message
    res.status(404).send('Route not found');
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Define the port for the server to listen on
const PORT = 3000;

// Start the server and log a message to the console
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});