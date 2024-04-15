const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const fs = require('fs');
const performance = require('performance-now');
const app = express();

app.use(bodyParser.json());
function logMetricsToCSV(endpoint, cpuUsage, memoryUsage, executionTime) {
    const timestamp = new Date().toISOString();
    const csvLine = `${timestamp},${endpoint},${cpuUsage},${memoryUsage},${executionTime}\n`;
    fs.appendFileSync('metrics.csv', csvLine);
}
app.get('/async-task', async (req, res) => {
    try {
        const startTime = performance();
        const cpuUsage = os.loadavg()[0];
        const memoryUsage = os.totalmem() - os.freemem();

        // Simulating an async task that takes time to complete (e.g., fetching data from a database)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const endTime = performance();
        const executionTime = (endTime - startTime).toFixed(2);
        logMetricsToCSV('/async-task', cpuUsage, memoryUsage, executionTime);

        res.send(`Async task completed in ${executionTime} milliseconds`);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});


// Simulating a CPU intensive task
app.post('/cpu-intensive-task', (req, res) => {
    // Simulating a CPU intensive task (e.g., processing large amounts of data)
    const {number} = req.body
    try {
         const startTime = performance(); // Start measuring execution time
        // Log CPU usage
        const cpuUsage = os.loadavg()[0];
        // Log memory usage
        const memoryUsage = os.totalmem() - os.freemem();
        const result = fibonacci(number);
        const endTime = performance(); // Stop measuring execution time
        const executionTime = (endTime - startTime).toFixed(2); // Calculate elapsed time
        logMetricsToCSV('/async-and-cpu-intensive-task', cpuUsage, memoryUsage, executionTime);
        res.send(`CPU intensive task completed , fib number : ${result}`);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Simulating a task that is both async and CPU intensive (POST request)
app.post('/async-and-cpu-intensive-task', async (req, res) => {
     const {number} = req.body
    try {
        const startTime = performance(); // Start measuring execution time

        // Log CPU usage
        const cpuUsage = os.loadavg()[0];
        // Log memory usage
        const memoryUsage = os.totalmem() - os.freemem();

        // Simulating an async task (e.g., fetching data from a database)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulating a CPU intensive task (e.g., processing large amounts of data)
        const result = fibonacci(number);

        const endTime = performance(); // Stop measuring execution time
        const executionTime = (endTime - startTime).toFixed(2); // Calculate elapsed time

        // Log metrics to CSV file
        logMetricsToCSV('/async-and-cpu-intensive-task', cpuUsage, memoryUsage, executionTime);

        // Send response with execution time
        res.send(`Async and CPU intensive task completed in ${executionTime} milliseconds with fib number : ${result}`);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

// Helper function to calculate fibonacci sequence (for simulating CPU intensive task)
function fibonacci(n) {
    if (n <= 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
