document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.wrapper');
    const overlay = document.querySelector('.overlay');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const btnPopup = document.querySelector('.btnLogin-popup');
    const iconClose = document.querySelector('.icon-close');

    function showPopup() {
        wrapper.classList.add('active-popup');
        overlay.classList.add('active');
    }

    function hidePopup() {
        wrapper.classList.remove('active-popup');
        overlay.classList.remove('active');
    }

    registerLink.addEventListener('click', () => {
        wrapper.classList.add('active');
        showPopup();
    });

    loginLink.addEventListener('click', () => {
        wrapper.classList.remove('active');
        showPopup();
    });

    btnPopup.addEventListener('click', showPopup);
    iconClose.addEventListener('click', hidePopup);

    // Handle registration
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            localStorage.setItem('user_id', result.userId); // Store user_id in localStorage
            window.location.href = result.redirectTo;
        } else {
            alert('Registration failed: ' + result);
        }
    });

    // Handle login
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            localStorage.setItem('user_id', result.userId); // Store user_id in localStorage
            window.location.href = result.redirectTo;
        } else {
            alert('Login failed: ' + result);
        }
    });

    // Carousel Functionality
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dots = document.querySelectorAll('.dot');
    let currentItem = 0;

    function showItem(index) {
        carouselItems.forEach((item, i) => {
            item.classList.remove('active');
            dots[i].classList.remove('active');
        });
        carouselItems[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextItem() {
        currentItem = (currentItem + 1) % carouselItems.length;
        showItem(currentItem);
    }

    function prevItem() {
        currentItem = (currentItem - 1 + carouselItems.length) % carouselItems.length;
        showItem(currentItem);
    }

    prevBtn.addEventListener('click', prevItem);
    nextBtn.addEventListener('click', nextItem);

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentItem = parseInt(e.target.dataset.index);
            showItem(currentItem);
        });
    });

    showItem(currentItem);
    setInterval(nextItem, 5000);

    // Scroll Animation for Stats
    const statsSection = document.querySelector('.stats');
    const doctorsCount = document.getElementById('doctorsCount');
    const patientsCount = document.getElementById('patientsCount');
    const bedsCount = document.getElementById('bedsCount');
    const clinicsCount = document.getElementById('clinicsCount');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;

        let doctors = 0;
        let patients = 0;
        let beds = 0;
        let clinics = 0;

        const intervalDoctors = setInterval(() => {
            doctors++;
            doctorsCount.textContent = doctors;
            if (doctors === 50) {
                clearInterval(intervalDoctors);
                doctorsCount.textContent += "+";
            }
        }, 50);

        const intervalPatients = setInterval(() => {
            patients++;
            patientsCount.textContent = patients;
            if (patients === 1000) {
                clearInterval(intervalPatients);
                patientsCount.textContent += "+";
            }
        }, 0.1);

        const intervalBeds = setInterval(() => {
            beds++;
            bedsCount.textContent = beds;
            if (beds === 500) {
                clearInterval(intervalBeds);
                bedsCount.textContent += "+";
            }
        }, 6);

        const intervalClinics = setInterval(() => {
            clinics++;
            clinicsCount.textContent = clinics;
            if (clinics === 10) {
                clearInterval(intervalClinics);
                clinicsCount.textContent += "+";
            }
        }, 200);
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    window.addEventListener('scroll', () => {
        if (isElementInViewport(statsSection)) {
            animateStats();
        }
    });

});