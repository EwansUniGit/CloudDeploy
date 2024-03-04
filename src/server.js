const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors');

const app = express();

const port = 3001;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'binturong',
    password: 'eloquent-glancing',
    port: 5432
});
//added a comment here for push purposes
client.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.stack);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

app.use(cors());

app.use(bodyParser.json());

//get tasks
app.get('/tasks', async (req, res) => {
    const result = await client.query('SELECT * FROM tasks');
    res.json(result.rows)
});
//new task
app.post('/tasks', async (req, res) => {
    const { description } = req.body;
    const result = await client.query('INSERT INTO tasks (task_description) VALUES ($1) RETURNING *', [description]);
    res.json(result.rows[0]);
});
//toggle done
app.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const result = await client.query('UPDATE tasks SET completed = NOT completed WHERE task_id = $1 RETURNING *', [taskId]);
    res.json(result.rows[0])
})
//delete
app.delete('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    await client.query('DELETE FROM tasks WHERE task_id = $1', [taskId]);
    res.json({ message: 'To-do item deleted successfully' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});