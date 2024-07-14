const backendUrl = '{{BACKEND_IP}}';

console.log('backendUrl', backendUrl);

async function fetchMessage(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.message;
}

async function fetchMessages() {
    const backend_status = document.getElementById('backend-status');
    const db_status = document.getElementById('db-status');

    try {
        const helloResponse = await fetch(`${backendUrl}/api/message`);
        const helloData = await helloResponse.json();

        console.log("helloResponse", helloData)

        if (helloData.success) {
            backend_status.innerText = "Success!";
            backend_status.classList.add("text-green-600");
        } else {
            backend_status.innerText = "Fail!";
            backend_status.classList.add("text-red-600");
        }

        const dbResponse = await fetch(`${backendUrl}/api/check_connection`);
        const dbData = await dbResponse.json();

        if (dbData.status === 'success') {
            db_status.innerText = dbData.message;
            db_status.classList.add("text-indigo-600");
        } else {
            db_status.innerText = dbData.message;
            db_status.classList.add("text-red-600");
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        db_status.innerText = error.message;
        db_status.classList.add("text-red-600");
    }
}

document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch(`${backendUrl}/api/message/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();
        if (response.ok) {
            showToast('success', result.message);

            // Clear the text boxes
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';

        } else {
            showToast('error', result.message);
        }

        fetchRecords();
    } catch (error) {
        showToast('error', 'Failed to send message.');
    }
});

async function fetchRecords() {
    const response = await fetch(`${backendUrl}/api/messages`);
    const data = await response.json();
    const recordsList = document.getElementById('records');
    recordsList.innerHTML = '';

    if (data.length === 0) {
        recordsList.innerHTML = '<p class="mt-10 text-md text-center italic leading-6 text-gray-500">Create a message to populate message records</p>';
    } else {
        data.forEach(record => {
            const li = document.createElement('li');
            li.className = "flex justify-between gap-x-6 py-5";
            li.innerHTML = `
                <div class="flex min-w-0 gap-x-4">
                    <div class="min-w-0 flex-auto">
                        <p class="text-sm font-semibold leading-6 text-gray-900">${record.name}</p>
                        <p class="mt-1 text-sm leading-6 text-gray-900">${record.message}</p>
                    </div>
                </div>
                <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p class="truncate text-xs leading-5 text-gray-500">${record.email}</p>
                    <p class="mt-1 text-xs leading-5 text-gray-500">Created <time datetime="${record.created_at}">${moment(record.created_at).fromNow()}</time></p>
                </div>
                </div>
            `;
            recordsList.appendChild(li);
        });
    }
}

function showToast(type, message) {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800`;
    toast.setAttribute('role', 'alert');

    if (type === 'success') {
        toast.innerHTML = `
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                <span class="sr-only">Check icon</span>
            </div>
            <div class="ms-3 text-sm font-normal">${message}</div>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        `;
    } else if (type === 'error') {
        toast.innerHTML = `
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                </svg>
                <span class="sr-only">Error icon</span>
            </div>
            <div class="ms-3 text-sm font-normal">${message}</div>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        `;
    }

    toast.querySelector('button').addEventListener('click', () => {
        toast.remove();
    });

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

fetchMessages();
fetchRecords();
