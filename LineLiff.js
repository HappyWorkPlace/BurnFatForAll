
function displayUserInfo(userName) {
    document.getElementById('userInfo').innerHTML = `<p>สวัสดีค่ะคุณ ${userName}</p>`;
}
window.onload = function() {
    console.log("Window loaded, initializing LIFF");
    initializeLiff('2004752543-O6bmBeMw');
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
                preloadFoodLists();
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
