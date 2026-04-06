<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barber Detail - Olulu Cuts</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/barber-detail.css">
</head>
<body>

    <header class="bg-primary d-flex align-items-center justify-content-between py-1 px-3">
        <div>
            <img src="images/logo.jpg" alt="logo" class="logo-img">
        </div>

        <nav class="d-none d-md-flex gap-4">
            <a href="index.html" class="nav-link">Home</a>
            <a href="about.html" class="nav-link">About us</a>
            <a href="#" class="nav-link">Services</a>
            <a href="#" class="nav-link">Contacts</a>
        </nav>
        <div></div>
        <button class="d-md-none border-0 bg-transparent p-1 ms-auto" id="hamburgerBtn" aria-label="Toggle menu">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>
    </header>

    <div id="mobileNav" class="d-none bg-primary px-3 py-2">
        <a href="index.html" class="nav-link d-block py-1">Home</a>
        <a href="about.html" class="nav-link d-block py-1">About us</a>
        <a href="#" class="nav-link d-block py-1">Services</a>
        <a href="#" class="nav-link d-block py-1">Contacts</a>
    </div>

    <main class="detail-card">
        <div class="profile-side">
            <img id="barber-photo" src="images/placeholder.jpg" alt="Barber Profile">
            <div id="barber-name-large" class="highlight-name">...</div>
        </div>

        <div class="info-side">
            <h2>Barber’s Detail</h2>
            <div class="stats-box">
                <p><strong>Name:</strong> <span id="db-name"></span></p>
                <p><strong>Age:</strong> <span id="db-age"></span></p>
                <p><strong>Experience:</strong> <span id="db-exp"></span> yrs.</p>
                <p><strong>Contact:</strong> <span id="db-phone"></span></p>
                <p><strong>Barber’s message:</strong> <em id="db-message"></em></p>
            </div>
         <a href="booking.html" id="booking-btn" class="btn-book">BOOK NOW</a>
        </div>
    </main>

    <footer class="bg-dark d-flex flex-column flex-md-row justify-content-between px-3 px-md-5 py-4">
        <div class="mb-3 mb-md-0">
            <h4 class="footer-heading">Olulu Cuts</h4>
            <p class="footer-text">Your most trusted barber shop in the town.</p>
        </div>
        <div class="mb-3 mb-md-0">
            <p class="footer-text">Phone: +358 121212212</p>
            <p class="footer-text">Located at: Olulu</p>
            <p class="footer-text">Copyright@olulu - 2026</p>
        </div>
        <div>
            <h4 class="footer-heading">Follow us</h4>
            <p class="footer-text">
                <a href="https://www.instagram.com/oulucuts/" class="footer-link">Instagram</a>
            </p>
        </div>
    </footer>

    <script>
        
        document.getElementById('hamburgerBtn').addEventListener('click', function () {
            document.getElementById('mobileNav').classList.toggle('d-none');
        });

   
        async function fetchBarberDetail() {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            if (!id) return;

            const BACKEND_BASE = "http://localhost:3000"; 
            const FALLBACK_IMAGE = 'images/barber1.jpg'; 

            try {
                const response = await fetch(`${BACKEND_BASE}/api/barbers/${id}`);
                if (!response.ok) throw new Error("Barber not found");
                
                const barber = await response.json();
                const img = document.getElementById('barber-photo');
                const bookingBtn = document.getElementById('booking-btn');
                bookingBtn.href = `booking.html?id=${barber.id}&name=${encodeURIComponent(barber.name)}`;
                
             
                if (barber.photo_url) {
                    img.src = barber.photo_url.startsWith('http') ? 
                              barber.photo_url : `${BACKEND_BASE}/${barber.photo_url}`;
                } else {
                   
                    img.src = FALLBACK_IMAGE;
                }

          
                img.onerror = function() {
                    this.src = FALLBACK_IMAGE;
                    this.onerror = null; 
                };

               
                document.getElementById('barber-name-large').innerText = (barber.name || "").toUpperCase();
                document.getElementById('db-name').innerText = barber.name || "N/A";
                document.getElementById('db-age').innerText = barber.age || "N/A";
                document.getElementById('db-exp').innerText = barber.experience || "0";
                document.getElementById('db-phone').innerText = barber.phone_no || "N/A";
                document.getElementById('db-message').innerText = barber.special_message || "you choose, i style.";
                
            } catch (err) {
                console.error("Error:", err);
               
            }
        }
        window.addEventListener('DOMContentLoaded', fetchBarberDetail);
    </script>
</body>
</html>
