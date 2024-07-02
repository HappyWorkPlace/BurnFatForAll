document.addEventListener('DOMContentLoaded', function() {
    initializeLiff();
});

function initializeLiff() {
    liff.init({
        liffId: "2004752543-O6bmBeMw" // Replace with your actual LIFF ID
    }).then(() => {
        if (liff.isLoggedIn()) {
            liff.getProfile().then(profile => {
                const uid = profile.userId;
                fetchUserPoints(uid);
                fetchGiftList(uid);
            }).catch(err => {
                console.error('Failed to get profile', err);
            });
        } else {
            liff.login();
        }
    }).catch(err => {
        console.error('LIFF initialization failed', err);
    });
}

function fetchUserPoints(uid) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getUserData&uid=${uid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('points-value').textContent = data.data[7]; // Adjust this to match your data structure
            } else {
                console.error('Error fetching user points:', data.message);
            }
        })
        .catch(err => {
            console.error('Error fetching user points:', err);
        });
}

function fetchGiftList(uid) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getGiftList&uid=${uid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateGiftButtons(data.data);
            } else {
                console.error('Error fetching gift list:', data.message);
            }
        })
        .catch(err => {
            console.error('Error fetching gift list:', err);
        });
}

function updateGiftButtons(giftData) {
    giftData.forEach(gift => {
        const button = document.getElementById(`gift-${gift.level}`);
        if (button) {
            button.classList.remove('disabled');
            button.addEventListener('click', () => redeemGift(gift.level));
        } else {
            console.error(`Button for gift level ${gift.level} not found`);
        }
    });
}

function redeemGift(level) {
    Swal.fire({
        title: 'Confirm Redemption',
        text: `Are you sure you want to redeem the gift for level ${level}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, redeem it!',
        cancelButtonText: 'No, cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with redemption
            // Adjust the API call as necessary
            fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=redeemGift&level=${level}&uid=${uid}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('Redeemed!', 'Your gift has been redeemed.', 'success');
                        document.getElementById(`gift-${level}`).classList.add('disabled');
                        document.getElementById(`gift-${level}`).disabled = true;
                    } else {
                        Swal.fire('Error', data.message, 'error');
                    }
                })
                .catch(err => {
                    console.error('Error redeeming gift:', err);
                    Swal.fire('Error', 'Failed to redeem gift.', 'error');
                });
        }
    });
}
