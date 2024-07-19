function navigateTo(page) {
    window.location.href = page;
}

function getUserData(uid) {
    console.log("Fetching user data for UID:", uid);
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getUserData2&uid=${uid}`)
        .then(response => {
            console.log("User data response received");
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            console.log("User data:", data);
            if (data.error) {

                displayRegisterSection();
            } else {

                displayInputSection(data.data);
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            Swal.fire('Error', 'Failed to fetch user data.', 'error');
        });
}

function displayUserInfo(userName) {
    document.getElementById('userInfo').innerHTML = `<p>สวัสดีค่ะคุณ ${userName}</p>`;
    document.getElementById('loadingMessage').style.display = 'none';
}
function hideLoading() {
    document.getElementById('loadingMessage').style.display = 'none';
}
window.onload = function() {
    console.log("Window loaded, initializing LIFF");
    if (typeof liff !== 'undefined') {
        initializeLiff('2004752543-O6bmBeMw');
    } else {
        console.error("LIFF SDK is not defined");
        Swal.fire('Error', 'LIFF SDK is not loaded. Please check your script inclusion.', 'error');
    }
};

function initializeLiff(myLiffId) {
    liff.init({
        liffId: myLiffId
    }).then(() => {
        console.log("LIFF initialized");
        if (liff.isLoggedIn()) {
            console.log("User is logged in, getting profile");
            liff.getProfile().then(profile => {
                console.log("Profile obtained: ", profile);
                const uid = profile.userId;
                displayUserInfo(profile.displayName);
                getUserData(uid);

            }).catch(err => {
                console.error('Failed to get user profile:', err);
                Swal.fire('Error', 'Failed to get user profile.', 'error');
            });
        } else {
            console.log("User is not logged in, logging in");
            liff.login();
        }
    }).catch(err => {
        console.error('LIFF Initialization failed:', err);
        Swal.fire('Error', 'Initialization failed.', 'error');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const checkButton = document.getElementById('checkButton');
    if (checkButton) {
        checkButton.onclick = checkUserInfo;
    } else {
        console.error('checkButton not found');
    }
});
