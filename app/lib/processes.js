const si = require('systeminformation');
const Fuse = require('fuse.js')

let currentProcesses = [];
document.getElementById('filterSearch').addEventListener('keyup', (event) => {
    searchProcesses(event.target.value);
});

function searchProcesses(value) {
    const currentValue = value;
    const options = {
        threshold: 0.0,
        keys: [
            "pid",
            "name",
            "state",
            "user"
        ]
    };
    const fuse = new Fuse(currentProcesses, options);
    if (currentValue) {
        showProcesses(fuse.search(currentValue));
    } else {
        showProcesses(currentProcesses);
    }
}

function getProcesses() {
    si.processes().then(processes => {
        currentProcesses = processes.list;
        searchProcesses(document.getElementById('filterSearch').value)
    });

    setTimeout(getProcesses, 3000);
}

function showProcesses(processeslist) {
    const processTable = document.getElementById('processTable');
    processTable.innerHTML = '';
    processeslist.forEach(process => {
        let currentItem = process;
        if (process.item) {
            currentItem = process.item;
        }

        const tr = document.createElement('tr');
        const pidData = document.createElement('td');
        const processNameData = document.createElement('td');
        const cpuUsageData = document.createElement('td');
        const memoryUsageData = document.createElement('td');
        const stateData = document.createElement('td');
        const userData = document.createElement('td');
        const runningSinceData = document.createElement('td');
        pidData.appendChild(document.createTextNode(currentItem.pid));
        processNameData.appendChild(document.createTextNode(currentItem.name));
        cpuUsageData.appendChild(document.createTextNode(`${currentItem.cpuu.toFixed(2)} %`));
        memoryUsageData.appendChild(document.createTextNode(`${currentItem.mem.toFixed(2)} %`));
        stateData.appendChild(document.createTextNode(currentItem.state));
        userData.appendChild(document.createTextNode(currentItem.user));
        runningSinceData.appendChild(document.createTextNode(currentItem.started));
        tr.appendChild(pidData);
        tr.appendChild(processNameData);
        tr.appendChild(cpuUsageData);
        tr.appendChild(memoryUsageData);
        tr.appendChild(stateData);
        tr.appendChild(userData);
        tr.appendChild(runningSinceData);
        processTable.appendChild(tr);
    });
}

getProcesses();

