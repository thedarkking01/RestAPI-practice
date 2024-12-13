const express = require('express');
const app = express();
const PORT = 8000;
const users = require('./MOCK_DATA.json');

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes


// Get all users with pagination
app.get('/api/users', (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    // Calculate start and end indices
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedUsers = users.slice(startIndex, endIndex);
    return res.json({
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.length,
        users: paginatedUsers,
    });
});


// Render users as HTML
app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>`;
    res.send(html);
});

// Get a specific user by ID
app.get('/api/user/:id', (req, res) => {
    const userId = parseInt(req.params.id); 
    const user = users.find(user => user.id === userId);
    if (!user) return res.status(404).send('User not found');
    return res.json(user);
});

// Delete a user by ID
app.delete('/api/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === userId);
    
    if (index === -1) return res.status(404).send('User not found');

    // Remove user from the array
    const deletedUser = users.splice(index, 1);
    return res.json({ message: 'User deleted', user: deletedUser[0] });
});

// Update a user by ID (PUT - updates the entire user object)
app.put('/api/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === userId);

    if (index === -1) return res.status(404).send('User not found');

    // Replace the user data with the new data from the request body
    users[index] = { id: userId, ...req.body };
    return res.json({ message: 'User updated', user: users[index] });
});

// Partially update a user by ID (PATCH - updates only specified fields)
app.patch('/api/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);

    if (!user) return res.status(404).send('User not found');

    // Update only the fields provided in req.body
    Object.assign(user, req.body);
    return res.json({ message: 'User partially updated', user });
});

// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
