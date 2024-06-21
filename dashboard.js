document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.btnLogout');
    const makeAppointmentBtn = document.getElementById('makeAppointmentBtn');
    const appointmentPopup = document.getElementById('appointmentPopup');
    const closePopup = document.querySelector('.close-popup');
    const specialtySelect = document.getElementById('specialty');
    const doctorSelect = document.getElementById('doctor');
    const appointmentDate = document.getElementById('appointmentDate');
    const appointmentTime = document.getElementById('appointmentTime');
    const appointmentsContainer = document.querySelector('.appointmentsContainer');
    const appointmentForm = document.getElementById('appointmentForm');

    logoutBtn.addEventListener('click', () => {
        // Clear user session or local storage
        localStorage.removeItem('user_id');
        // Redirect to index.html
        window.location.href = 'index.html';
    });

    makeAppointmentBtn.addEventListener('click', () => {
        appointmentPopup.style.display = 'block';
        fetch('/api/specialties')
            .then(response => response.json())
            .then(data => {
                specialtySelect.innerHTML = `<option value="">Select Medical Specialty</option>` +
                    data.map(specialty => `<option value="${specialty.id}">${specialty.name}</option>`).join('');
            });
    });

    closePopup.addEventListener('click', () => {
        appointmentPopup.style.display = 'none';
    });

    specialtySelect.addEventListener('change', () => {
        const specialtyId = specialtySelect.value;
        if (specialtyId) {
            fetch(`/api/doctors?specialtyId=${specialtyId}`)
                .then(response => response.json())
                .then(data => {
                    doctorSelect.innerHTML = `<option value="">Select Doctor</option>` +
                        data.map(doctor => `<option value="${doctor.id}">${doctor.name}</option>`).join('');
                });
        } else {
            doctorSelect.innerHTML = `<option value="">Select Doctor</option>`;
        }
    });

    appointmentDate.addEventListener('change', () => {
        const doctorId = doctorSelect.value;
        const date = appointmentDate.value;
        if (doctorId && date) {
            fetch(`/api/available-times?doctorId=${doctorId}&date=${date}`)
                .then(response => response.json())
                .then(data => {
                    appointmentTime.innerHTML = `<option value="">Select Time</option>` +
                        data.map(time => {
                            const colorClass = time.available ? 'available' : 'unavailable';
                            return `<option value="${time.time}" class="${colorClass}" ${!time.available ? 'disabled' : ''}>${time.time}</option>`;
                        }).join('');
                   
                });
        }
      
    });


    // Handle appointment form submission
    const userId = localStorage.getItem('user_id');

    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission
    
        // Collect form data
        const formData = new FormData(appointmentForm);
        const data = {
            specialtyId: formData.get('specialty'),
            doctorId: formData.get('doctor'),
            date: formData.get('appointmentDate'),
            time: formData.get('appointmentTime'),
            userId: userId
        };
    
        // Send the form data to the server using fetch
        fetch('/api/book-appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Appointment booked successfully!');
                appointmentPopup.style.display = 'none';
                window.location.reload(); // Refresh the page
            } else {
                alert('Failed to book appointment: ' + result.message);
            }
        });
    });

    if (userId) {
        fetch(`/api/user-appointments?userId=${userId}`)
            .then(response => response.json())
            .then(appointments => {
                appointmentsContainer.innerHTML = '<h2>Your Appointments</h2>';
                appointments.forEach(appointment => {
                    const appointmentElement = document.createElement('div');
                    appointmentElement.className = 'appointment';
                    appointmentElement.innerHTML = `
                        <div>
                            <h3>${appointment.specialty}</h3>
                            <p>Doctor: ${appointment.doctor}</p>
                            <p>Date: ${appointment.date}</p>
                            <p>Time: ${appointment.time}</p>
                        </div>
                        <button class="delete-btn" data-id="${appointment.id}">Delete</button>
                    `;
                    appointmentsContainer.appendChild(appointmentElement);
                });

                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const appointmentId = event.target.getAttribute('data-id');
                        deleteAppointment(appointmentId);
                    });
                });
            });
    }

    function deleteAppointment(id) {
        fetch(`/delete-appointment/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    fetchAppointments(); // Refresh the appointments list
                } else {
                    console.error(result.error);
                }
            });
    }

    function fetchAppointments() {
        fetch(`/api/user-appointments?userId=${userId}`)
            .then(response => response.json())
            .then(appointments => {
                appointmentsContainer.innerHTML = '<h2>Your Appointments</h2>';
                appointments.forEach(appointment => {
                    const appointmentElement = document.createElement('div');
                    appointmentElement.className = 'appointment';
                    appointmentElement.innerHTML = `
                        <div>
                            <h3>${appointment.specialty}</h3>
                            <p>Doctor: ${appointment.doctor}</p>
                            <p>Date: ${appointment.date}</p>
                            <p>Time: ${appointment.time}</p>
                        </div>
                        <button class="delete-btn" data-id="${appointment.id}">Delete</button>
                    `;
                    appointmentsContainer.appendChild(appointmentElement);
                });

                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const appointmentId = event.target.getAttribute('data-id');
                        deleteAppointment(appointmentId);
                    });
                });
            });
    }

    // Set minimum date for appointment date input to today
    const today = new Date().toISOString().split('T')[0];
    appointmentDate.setAttribute('min', today);
});
