// 1. Configuration & Security Check
const API_BASE_URL = 'http://localhost:3000/api/barbers';

function requireAuth() {
    // Check if the token we saved during login exists
    if (!localStorage.getItem('adminToken')) {
        window.location.href = 'admin-login.html';
    }
}

// 2. Main Logic runs once the HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Run security check immediately
    requireAuth();

    const grid = document.getElementById('barbersGrid');

    async function loadBarbers() {
        try {
            console.log("Fetching barbers from:", API_BASE_URL);
            
            // We send the token in the headers so the server knows we are authorized
            const response = await fetch(API_BASE_URL, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const barbers = await response.json();
            console.log("Barbers received:", barbers);

            // Clear the "Loading..." state
            grid.innerHTML = '';

            if (barbers.length === 0) {
                grid.innerHTML = '<div class="no-barbers">No barbers found. Click "ADD NEW BARBER" to add one.</div>';
                return;
            }

            // 3. Create Cards for each barber
            barbers.forEach(barber => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.id = barber.id;

                // Handle Image Logic
                let imageUrl = barber.photo_url;
                if (imageUrl && !imageUrl.startsWith('http')) {
                    imageUrl = `http://localhost:3000/${imageUrl}`;
                } else if (!imageUrl) {
                    imageUrl = 'images/barber1.jpg'; // Fallback if no photo exists
                }

                card.innerHTML = `
                    <img src="${imageUrl}" 
                         alt="${barber.name}" 
                         onerror="this.onerror=null; this.src='images/barber1.jpg';">
                    <div class="card-info">
                        <h3>${barber.name}</h3>
                        <p>Age: <span>${barber.age || 'N/A'}</span></p>
                        <p>Exp: <span>${barber.experience || 0} yrs</span></p>
                        <p>Contact: <span>${barber.phone_no || 'N/A'}</span></p>
                    </div>
                    <button class="btn-delete" title="Delete" data-id="${barber.id}">🗑</button>
                `;

                // 4. Handle Delete Button Click
                const deleteBtn = card.querySelector('.btn-delete');
                deleteBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const confirmDelete = confirm(`Are you sure you want to delete ${barber.name}?`);
                    
                    if (confirmDelete) {
                        await deleteBarber(barber.id);
                    }
                });

                grid.appendChild(card);
            });

        } catch (error) {
            console.error("Error fetching barbers:", error);
            grid.innerHTML = `
                <div style="color: #ff4444; text-align: center; grid-column: 1/-1; padding: 20px;">
                    <p><strong>Connection Error:</strong> ${error.message}</p>
                    <p><small>Check if your backend server is running on port 3000.</small></p>
                </div>
            `;
        }
    }

    // 5. Function to delete a barber from the database
    async function deleteBarber(id) {
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (res.ok) {
                alert('Barber deleted successfully');
                loadBarbers(); // Refresh the list
            } else {
                const data = await res.json();
                alert(`Error: ${data.error || 'Could not delete barber'}`);
            }
        } catch (err) {
            alert('Failed to connect to server to delete barber.');
        }
    }

    // Initialize the page
    loadBarbers();
});

// 6. Logout Function (Keep this outside the DOMContentLoaded so the HTML button can see it)
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
}