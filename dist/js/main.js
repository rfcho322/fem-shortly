const menuBtn = document.querySelector('#menuBtn');
const mobileNavToggle = document.querySelector('#mobileNavToggle');
const shortenLinkInput = document.querySelector('#shortenLinkInput');
const shortenLinkBtn = document.querySelector('#shortenLinkBtn');
const errorFeedback = document.querySelector('.error-feedback');
const formControl = document.querySelector('.form-control');
const shortenLinkList = document.querySelectorAll('.shorten-link-list');

checkViewPort();
getShortenedLink();
window.addEventListener('resize', checkViewPort);

function checkViewPort () {
    if (window.innerWidth > 1024) {
        mobileNavToggle.classList.add('open');
    } else {
        mobileNavToggle.classList.remove('open');
    }
}

document.addEventListener('click', (event) => {
    if (!mobileNavToggle.contains(event.target) && !menuBtn.contains(event.target)) {
        mobileNavToggle.classList.remove('open');
    }
});

// HAMBURGER MENU
menuBtn.addEventListener('click', (event) => {
    if (mobileNavToggle.classList.contains('open')) {
        mobileNavToggle.classList.remove('open');
    } else {
        // mobileNavToggle.style.display = 'flex';
        mobileNavToggle.classList.add('open');
    }
});

// SHORTEN LINK
shortenLinkBtn.addEventListener('touchstart', () => {
    const inputLink = shortenLinkInput.value;
    // CHECK IF THE INPUT IS EMPTY
    if (inputLink.trim() !== '') {
        // SHOW LOADING ON SHORTENING LINK ATTEMPT
        const loader = document.querySelector('.fa-circle-notch');
        if (loader.classList.contains('d-none')) {
            loader.classList.remove('d-none');
        }
        // API CALL
        fetch(`https://api.shrtco.de/v2/shorten?url=${inputLink}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.ok) {
                const originalUrl = data.result.original_link;
                const shortenedUrl = data.result.short_link;

                // DO YOUR CODE HERE FOR LOCALSTORAGE SAVING
                const shortenedLinks = JSON.parse(localStorage.getItem('shortenedLinks')) || [];
                // ADD NEW LINK TO THE BEGINNING OF THE ARRAY
                shortenedLinks.unshift({
                    id: Date.now(),
                    original_link: originalUrl,
                    shortened_link: shortenedUrl
                });

                shortenedLinks.splice(4);

                localStorage.setItem("shortenedLinks", JSON.stringify(shortenedLinks));
                getShortenedLink();

                // console.log(`Original URL: ${originalUrl}`);
                // console.log(`Shortened URL: ${shortenedUrl}`);
            } else {
                console.log(`Error: ${data.error_code} : ${data.error}`);
                shortenLinkInput.classList.add('error');
                errorFeedback.style.display = 'block';
                if (data.error_code === 2) {
                    errorFeedback.innerHTML = 'This is not a valid URL';
                } else if (data.error_code === 1) {
                    errorFeedback.innerHTML = 'No URL specified';
                } else {
                    errorFeedback.innerHTML = data.error;
                }
            }
        }).catch(error => console.error(error))
        .finally(() => {
            // HIDE LOADING AFTER A RESPONSE IS SHOWN
            loader.classList.add('d-none');
        });
    } else {
        // DISPLAY ERRORS IF INPUT IS EMPTY
        shortenLinkInput.classList.add('error');
        errorFeedback.style.display = 'block';
        errorFeedback.innerHTML = 'Please add a link';
    }
});

shortenLinkInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        // DISPLAY ERRORS IF INPUT FIELD IS EMPTY
        shortenLinkInput.classList.add('error');
        errorFeedback.style.display = 'block';
        errorFeedback.innerHTML = 'Please add a link';
        // CHECKS IF INPUT HAS ERROR CLASS AND IF IT IS NOT EMPTY, ADD ERRORS
        if (shortenLinkInput.classList.contains('error')) {
            const inputLink = shortenLinkInput.value;
            if (inputLink.trim() !== '') {
                shortenLinkInput.classList.remove('error');
                errorFeedback.style.display = 'none';
            }
        }
    }
});

shortenLinkInput.addEventListener('input', () => {
    const inputLink = shortenLinkInput.value;
    // IF INPUT IS NOT EMPTY REMOVE ERRORS
    if (inputLink.trim() !== '') {
        shortenLinkInput.classList.remove('error');
        errorFeedback.style.display = 'none';
    }
});

function getShortenedLink () {
    const shortenedLinks = JSON.parse(localStorage.getItem('shortenedLinks')) || [];
    const newLinkList = document.querySelector('.newLinkList');
    newLinkList.innerHTML = '';
    shortenedLinks.forEach(links => {

        const newShortenedLink = document.createElement('div');
        newShortenedLink.className = 'card shorten-link-list';
        newShortenedLink.innerHTML = `<div class="card__header">
                                        <p class="shorten-link | text-dark">${links.original_link}</p>
                                      </div>
                                      <div class="card__body">
                                        <p class="shorten-link-preview | text-primary mb-1">${links.shortened_link}</p>
                                        <button type="button" class="copy-link-btn | btn btn--primary">Copy</button>
                                      </div>`;
        newLinkList.appendChild(newShortenedLink);
    });

    // COPY SHORTENED LINK BUTTON
    const copyLinkBtn = document.querySelectorAll('.copy-link-btn');
    const shortenLink = document.querySelectorAll('.shorten-link');
    const shortenLinkPreview = document.querySelectorAll('.shorten-link-preview');
    copyLinkBtn.forEach((copyLinkBtn, value) => {
        copyLinkBtn.addEventListener('click', () => {
        // console.log(shortenLink[value].textContent + ' ' + shortenLinkPreview[value].textContent);

        // COPY TO CLIPBOARD
        navigator.clipboard.writeText(shortenLinkPreview[value].textContent)
        .then(() => {
            console.log('Copied to clipboard: ', shortenLinkPreview[value].textContent);
            // SUCCESS COPY, DISABLE BUTTON AFTER
            copyLinkBtn.textContent = 'Copied!';
            copyLinkBtn.setAttribute('disabled', 'disabled');
            copyLinkBtn.classList.add('btn--dark-violet');
            copyLinkBtn.classList.remove('btn--primary');
        })
        .catch((error) => console.error('Error copying to clipboard: ', error));
        
        // RE-ENABLE THE BUTTON AFTER COPYING
        setTimeout(() => {
            copyLinkBtn.textContent = 'Copy';
            copyLinkBtn.removeAttribute('disabled');
            copyLinkBtn.classList.add('btn--primary');
            copyLinkBtn.classList.remove('btn--dark-violet');
        }, 3000);
        });
    });
}


