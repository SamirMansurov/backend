// const form = document.forms.namedItem('add')
// const baseUrl = "http://localhost:8080/todos"

// form.onsubmit = (e) => {
//     e.preventDefault()

//     let task = {
//         id: crypto.randomUUID,
//         title: new FormData(e.target).get('title')
//     }

//     fetch(baseUrl + '/todos', {
//         method: "POST",
//         body: JSON.stringify(task)
//     })
//     .then(res => console.log(res))
// }


// fetch(baseUrl + '/todos')
//     .then(res => res.json())
//     .then(res => console.log(res))


const form = document.forms.namedItem('add');
const baseUrl = "http://localhost:8080/todos";

form.onsubmit = async (e) => {
    e.preventDefault();

    let title = new FormData(e.target).get('title');

    if (!title) {
        alert("Please enter a task title.");
        return;
    }

    let task = {
        id: crypto.randomUUID(), // Corrected to call randomUUID as a function
        title: title
    };

    try {
        let response = await fetch(baseUrl + '/todos', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            throw new Error('Failed to add task.');
        }

        let addedTask = await response.json();
        displayTask(addedTask); // Function to display task in the frontend list
    } catch (error) {
        console.error('Error adding task:', error);
    }
};

// Function to display task in the frontend list
function displayTask(task) {
    let taskList = document.getElementById('taskList');
    let li = document.createElement('li');
    li.textContent = task.title;

    let removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeTask(task.id));
    
    li.appendChild(removeButton);
    taskList.appendChild(li);
}


async function removeTask(taskId) {
    try {
        let response = await fetch(baseUrl + '/todos/' + taskId, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error('Failed to remove task.');
        }

        // Remove task from frontend list
        let taskElement = document.querySelector(`li[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
        }
    } catch (error) {
        console.error('Error removing task:', error);
    }
}

// Fetch and display existing tasks on page load
fetch(baseUrl + '/todos')
    .then(res => res.json())
    .then(tasks => {
        tasks.forEach(task => displayTask(task));
    })
    .catch(error => console.error('Error fetching tasks:', error));