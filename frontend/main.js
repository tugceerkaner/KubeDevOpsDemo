async function fetchMessage(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.message;
}

async function fetchMessages() {
    const messages = document.getElementById('messages');

    const helloMessage = await fetchMessage('http://backend-service/backend/hello');
    const dbMessage = await fetchMessage('http://backend-service/backend/db_test');

    messages.innerHTML = `
        <p class="text-green-500">${helloMessage}</p>
        <p class="text-green-500">${dbMessage}</p>
    `;
}

async function fetchRecords() {
    const response = await fetch('http://backend-service/backend/messages');
    const data = await response.json();
    const recordsList = document.getElementById('records');
    recordsList.innerHTML = '';

    data.messages.forEach(record => {
        const li = document.createElement('li');
        li.textContent = `${record[0]} - ${record[1]}: ${record[2]}`;
        recordsList.appendChild(li);
    });
}

document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const response = await fetch('http://backend-service/backend/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
    });

    const result = await response.json();
    alert(result.message);

    fetchRecords();  // Refresh the records list after submission
});

// Initial fetch
fetchMessages();
fetchRecords();
