// Function to update dashboard stats
function updateDashboardStats() {
    document.querySelector('.h2').textContent = `Welcome, ${clientData.name}`;
    document.querySelector('[data-stat="appointments"]').textContent = clientData.upcomingAppointments.length;
    document.querySelector('[data-stat="visits"]').textContent = clientData.totalVisits;
    document.querySelector('[data-stat="membership"]').textContent = clientData.membershipStatus.toUpperCase();
    document.querySelector('[data-stat="points"]').textContent = clientData.points.toLocaleString();
}

// Function to update recent appointments
function updateRecentAppointments() {
    const recentList = document.querySelector('.recent-appointments');
    recentList.innerHTML = clientData.recentAppointments.map(appointment => `
        <div class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${appointment.service}</h6>
                <small class="text-muted">${new Date(appointment.date).toLocaleDateString()}</small>
            </div>
            <p class="mb-1">${appointment.status}</p>
            <small class="text-muted">Service Provider: ${appointment.provider}</small>
        </div>
    `).join('');
}

// Function to update upcoming services
function updateUpcomingServices() {
    const upcomingList = document.querySelector('.upcoming-services');
    upcomingList.innerHTML = clientData.upcomingAppointments.map(appointment => `
        <div class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${appointment.service}</h6>
                <small class="text-muted">${new Date(appointment.date).toLocaleDateString()}</small>
            </div>
            <p class="mb-1">${appointment.status}</p>
            <small class="text-muted">Service Provider: ${appointment.provider}</small>
        </div>
    `).join('');
}

// Function to update profile information
function updateProfileInfo() {
    document.getElementById('profile-name').textContent = clientData.name;
    document.getElementById('profile-email').textContent = clientData.email;
    document.getElementById('profile-phone').textContent = clientData.phone;
    document.getElementById('profile-address').textContent = clientData.address;
    document.getElementById('profile-membership').textContent = clientData.membershipStatus.toUpperCase();
    document.getElementById('profile-member-since').textContent = clientData.memberSince;
    document.getElementById('membership-type').textContent = clientData.membershipStatus.toUpperCase();
    document.getElementById('membership-expiry').textContent = clientData.membershipExpiry;
    document.getElementById('membership-points').textContent = clientData.points.toLocaleString();
    document.getElementById('loyalty-tier').textContent = clientData.loyaltyTier;
}

// Function to update appointments list
function updateAppointmentsList() {
    const appointmentsList = document.querySelector('.upcoming-appointments-list');
    appointmentsList.innerHTML = clientData.upcomingAppointments.map(appointment => `
        <div class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${appointment.service}</h6>
                <small class="text-muted">${new Date(appointment.date).toLocaleDateString()}</small>
            </div>
            <p class="mb-1">${appointment.status}</p>
            <small class="text-muted">Service Provider: ${appointment.provider}</small>
        </div>
    `).join('');
}

// Function to update service history
function updateServiceHistory(filter = 'all') {
    const historyTableBody = document.getElementById('history-table-body');
    let filteredHistory = clientData.serviceHistory;

    if (filter === 'grooming') {
        filteredHistory = clientData.serviceHistory.filter(service => 
            service.service.toLowerCase().includes('grooming')
        );
    } else if (filter === 'vet') {
        filteredHistory = clientData.serviceHistory.filter(service => 
            service.service.toLowerCase().includes('vaccination') || 
            service.provider.toLowerCase().includes('dr.')
        );
    }

    historyTableBody.innerHTML = filteredHistory.map(service => `
        <tr>
            <td>${new Date(service.date).toLocaleDateString()}</td>
            <td>${service.service}</td>
            <td>${service.provider}</td>
            <td>${service.status}</td>
            <td>${service.amount}</td>
            <td>${service.points}</td>
        </tr>
    `).join('');
}

// Function to update notification settings
function updateNotificationSettings() {
    document.getElementById('emailNotifications').checked = clientData.notificationSettings.email;
    document.getElementById('smsNotifications').checked = clientData.notificationSettings.sms;
    document.getElementById('appointmentReminders').checked = clientData.notificationSettings.appointmentReminders;
    document.getElementById('promotionalOffers').checked = clientData.notificationSettings.promotionalOffers;
}

// Handle form submissions and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    updateDashboardStats();
    updateRecentAppointments();
    updateUpcomingServices();
    updateProfileInfo();
    updateAppointmentsList();
    updateServiceHistory();
    updateNotificationSettings();

    // Handle navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            
            // Hide all sections
            document.querySelectorAll('.section-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Show selected section
            document.getElementById(`${section}-section`).style.display = 'block';
            
            // Update active link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Handle profile form submission
    const profileForm = document.getElementById('profileForm');
    const saveProfileButton = document.getElementById('saveProfile');

    saveProfileButton.addEventListener('click', function() {
        if (profileForm.checkValidity()) {
            const formData = new FormData(profileForm);
            
            // Update client data
            clientData.name = formData.get('fullName');
            clientData.email = formData.get('email');
            clientData.phone = formData.get('phone');
            clientData.address = formData.get('address');
            clientData.membershipStatus = formData.get('membershipStatus');

            // Update dashboard and profile
            updateDashboardStats();
            updateProfileInfo();

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
            modal.hide();
            
            // Show success message
            alert('Profile updated successfully!');
        } else {
            profileForm.reportValidity();
        }
    });

    // Handle appointment scheduling
    const appointmentForm = document.getElementById('appointmentForm');
    const scheduleAppointmentButton = document.getElementById('scheduleAppointment');

    scheduleAppointmentButton.addEventListener('click', function() {
        if (appointmentForm.checkValidity()) {
            const formData = new FormData(appointmentForm);
            const newAppointment = {
                id: clientData.upcomingAppointments.length + 1,
                service: formData.get('serviceType'),
                date: formData.get('appointmentDate'),
                provider: "To be assigned",
                status: "scheduled"
            };

            clientData.upcomingAppointments.push(newAppointment);
            updateDashboardStats();
            updateAppointmentsList();
            updateUpcomingServices();

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleAppointmentModal'));
            modal.hide();
            
            // Show success message
            alert('Appointment scheduled successfully!');
        } else {
            appointmentForm.reportValidity();
        }
    });

    // Handle history filters
    document.getElementById('filter-all').addEventListener('click', function() {
        updateServiceHistory('all');
    });

    document.getElementById('filter-grooming').addEventListener('click', function() {
        updateServiceHistory('grooming');
    });

    document.getElementById('filter-vet').addEventListener('click', function() {
        updateServiceHistory('vet');
    });

    // Handle notification settings
    const notificationSettingsForm = document.getElementById('notificationSettings');
    notificationSettingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clientData.notificationSettings = {
            email: document.getElementById('emailNotifications').checked,
            sms: document.getElementById('smsNotifications').checked,
            appointmentReminders: document.getElementById('appointmentReminders').checked,
            promotionalOffers: document.getElementById('promotionalOffers').checked
        };
        alert('Notification preferences updated successfully!');
    });

    // Handle security settings
    const securitySettingsForm = document.getElementById('securitySettings');
    securitySettingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real application, you would handle password change here
        alert('Password updated successfully!');
    });
});
