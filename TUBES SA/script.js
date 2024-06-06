let jsonData;

const bruteforceRadio = document.getElementById("Bruteforce");
const greedyRadio = document.getElementById("Greedy");

bruteforceRadio.addEventListener("change", () => {
    if (bruteforceRadio.checked) {
        console.log("Bruteforce strategy selected");
    }
});

greedyRadio.addEventListener("change", () => {
    if (greedyRadio.checked) {
        console.log("Greedy strategy selected");
    }
});


document.getElementById('fileInput').addEventListener('change', handleFile, false);
document.getElementById('processButton').addEventListener('click', () => {
    console.log('Process button clicked');
    if(bruteforceRadio.checked){
        processDataBruteForce(jsonData);
    }  else if (greedyRadio.checked) {
        processDataGreedy(jsonData);
    }
});

function handleFile(e) {
    const file = e.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                console.log('Parsed CSV data:', results.data);
                jsonData = results.data;
                document.getElementById('processButton').disabled = false; // Enable the process button
                console.log('Process button enabled');
            },
            error: function(error) {
                console.error('Error reading file:', error);
                displayError('Error reading file');
            }
        });
    } else {
        displayError('No file selected');
    }
}

function processDataBruteForce(data) {
    if (!data || data.length < 1) {
        displayError('No data found in the file');
        return;
    }
    console.log('Processing data');

    const startTime = performance.now(); // Record start time for processing

    // Step 1: Create an object to store tasks by employee name
    const tasksByEmployee = {};

    // Step 2: Iterate through the data and add tasks to the object
    data.forEach(row => {
        const employee = row['Nama Pegawai'];
        if (!tasksByEmployee[employee]) {
            tasksByEmployee[employee] = [];
        }
        tasksByEmployee[employee].push({
            customer: row['Nama Pelanggan'],
            service: row['Jenis Layanan'],
            duration: parseInt(row['Durasi'], 10)
        });
    });

    // Step 3: Generate all permutations of tasks for each employee
    const bestSchedules = {};
    let minTotalServerTime = Infinity;

    function permute(arr) {
        if (arr.length <= 1) return [arr];
        const permutations = [];
        for (let i = 0; i < arr.length; i++) {
            const current = arr[i];
            const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
            const remainingPerms = permute(remaining);
            for (let perm of remainingPerms) {
                permutations.push([current].concat(perm));
            }
        }
        return permutations;
    }

    // Step 4: Calculate total server time for each permutation
    for (const employee in tasksByEmployee) {
        const tasks = tasksByEmployee[employee];
        const permutations = permute(tasks);
        let bestScheduleForEmployee = null;
        let bestTimeForEmployee = Infinity;

        for (const perm of permutations) {
            let totalServerTime = 0;
            const serverTimes = [];

            perm.forEach((task, index) => {
                const waitTime = perm.slice(0, index).reduce((total, task) => total + task.duration, 0);
                const startTime = addMinutes(data[0]['Jam Mulai'], waitTime);
                totalServerTime += perm.slice(0, index + 1).reduce((total, task) => total + task.duration, 0);
                serverTimes.push({
                    ...task,
                    employee: employee,
                    startTime: startTime
                });
            });

            console.log(`Permutation for ${employee}:`, perm, 'Total Server Time:', totalServerTime);

            // Check if this permutation is better than the current best for the employee
            if (totalServerTime < bestTimeForEmployee) {
                bestTimeForEmployee = totalServerTime;
                bestScheduleForEmployee = serverTimes;
            }
        }

        bestSchedules[employee] = bestScheduleForEmployee;
        minTotalServerTime = Math.min(minTotalServerTime, bestTimeForEmployee);
    }

    // Combine all best schedules into one final schedule
    const finalSchedule = [];
    for (const employee in bestSchedules) {
        finalSchedule.push(...bestSchedules[employee]);
    }

    const endTime = performance.now(); // Record end time for processing
    const executionTime = endTime - startTime; // Calculate execution time in milliseconds
    console.log('Execution time:', executionTime.toFixed(2), 'ms');

    const executionTimeDiv = document.getElementById('executionTime');
    
    executionTimeDiv.textContent = `Execution time: ${executionTime.toFixed(2)} ms`;


    console.log('Best scheduled result:', finalSchedule);
    displaySchedule(finalSchedule);
}

function addMinutes(time, minutes) {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

function displaySchedule(schedule) {
    const outputContainer = document.getElementById('outputContainer');
    const outputBody = document.getElementById('outputBody');
    outputBody.innerHTML = ''; // Clear previous content

    // Sort schedule based on start time
    schedule.sort((a, b) => {
        if (a.startTime < b.startTime) return -1;
        if (a.startTime > b.startTime) return 1;
        return 0;
    });

    schedule.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.customer}</td>
            <td>${item.service}</td>
            <td>${item.employee}</td>
            <td>${item.startTime}</td>
            <td>${item.duration}</td>
        `;
        outputBody.appendChild(row);
    });

    // Display table after data is processed
    outputContainer.style.display = 'block';
}


function processDataGreedy(data) {
    if (!data || data.length < 1) {
        displayError('No data found in the file');
        return;
    }
    console.log('Processing data');

    const startTime = performance.now(); // Catat waktu mulai pemrosesan

    // Step 1: Buat objek untuk menyimpan tugas berdasarkan nama pegawai
    const tasksByEmployee = {};

    // Step 2: Iterasi melalui data dan masukkan tugas ke dalam objek
    data.forEach(row => {
        const employee = row['Nama Pegawai'];
        if (!tasksByEmployee[employee]) {
            tasksByEmployee[employee] = [];
        }
        tasksByEmployee[employee].push({
            customer: row['Nama Pelanggan'],
            service: row['Jenis Layanan'],
            duration: parseInt(row['Durasi'], 10)
        });
    });

    // Step 3: Urutkan tugas-tugas di dalam setiap kelompok berdasarkan durasinya
    for (const employee in tasksByEmployee) {
        tasksByEmployee[employee].sort((a, b) => a.duration - b.duration);
    }

    // Step 4: Gabungkan tugas-tugas dari setiap kelompok ke dalam satu array
    const result = [];
    for (const employee in tasksByEmployee) {
        let totalServerTime = 0; // Initialize total server time for each employee
        tasksByEmployee[employee].forEach((task, index) => {
            // Hitung waktu mulai berdasarkan tugas sebelumnya di dalam kelompok
            const waitTime = tasksByEmployee[employee].slice(0, index).reduce((total, task) => total + task.duration, 0);
            const startTime = addMinutes(data[0]['Jam Mulai'], waitTime);

            totalServerTime += tasksByEmployee[employee].slice(0, index + 1).reduce((total, task) => total + task.duration, 0);
            
            result.push({
                ...task,
                employee: employee,
                startTime: startTime
            });
        });
        console.log(`TotalwaktuServer for ${employee}:`, totalServerTime, 'minutes');
    }

    const endTime = performance.now(); // Catat waktu selesai pemrosesan
    const executionTime = endTime - startTime; // Hitung waktu eksekusi dalam milidetik
    console.log('Execution time:', executionTime.toFixed(2), 'ms');

    const executionTimeDiv = document.getElementById('executionTime');
    
    executionTimeDiv.textContent = `Execution time: ${executionTime.toFixed(2)} ms`;

    console.log('Scheduled result:', result);
    displaySchedule(result);
}

function addMinutes(time, minutes) {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

function displaySchedule(schedule) {
    const outputContainer = document.getElementById('outputContainer');
    const outputBody = document.getElementById('outputBody');
    outputBody.innerHTML = ''; // Clear previous content

    // Sort schedule based on start time
    schedule.sort((a, b) => {
        if (a.startTime < b.startTime) return -1;
        if (a.startTime > b.startTime) return 1;
        return 0;
    });

    schedule.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.customer}</td>
            <td>${item.service}</td>
            <td>${item.employee}</td>
            <td>${item.startTime}</td>
            <td>${item.duration}</td>
        `;
        outputBody.appendChild(row);
    });

    // Tampilkan tabel setelah data diproses
    outputContainer.style.display = 'block';
}
