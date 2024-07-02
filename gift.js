document.addEventListener('DOMContentLoaded', function() {
    initializeLiff('2004752543-O6bmBeMw');
});

function initializeLiff() {
    liff.init({
        liffId: "YOUR_LIFF_ID" // Replace with your LIFF ID
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
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getUserPoints&uid=${uid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('points-value').innerText = data.points;
            } else {
                console.error('Failed to get user points:', data.message);
            }
        })
        .catch(err => {
            console.error('Error fetching user points:', err);
        });
}

function fetchGiftList(uid) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getGiftList`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const points = parseInt(document.getElementById('points-value').innerText, 10);
                data.gifts.forEach(gift => {
                    const button = document.getElementById(`gift-${gift.Level}`);
                    if (points >= gift.Level && gift.Balance > 0) {
                        checkIfRedeemed(uid, gift.Level, button);
                    } else {
                        button.classList.add('disabled');
                        button.disabled = true;
                    }
                });
            } else {
                console.error('Failed to get gift list:', data.message);
            }
        })
        .catch(err => {
            console.error('Error fetching gift list:', err);
        });
}

function checkIfRedeemed(uid, level, button) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=checkIfRedeemed&uid=${uid}&level=${level}`)
        .then(response => response.json())
        .then(data => {
            if (data.redeemed) {
                button.classList.add('disabled');
                button.disabled = true;
            } else {
                button.addEventListener('click', () => redeemGift(uid, level, button));
            }
        })
        .catch(err => {
            console.error('Error checking if redeemed:', err);
        });
}

function redeemGift(uid, level, button) {
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to redeem this gift?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, redeem it!',
        cancelButtonText: 'No, cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=redeemGift&uid=${uid}&level=${level}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        button.classList.add('disabled');
                        button.disabled = true;
                        Swal.fire('Redeemed!', 'Your gift has been redeemed.', 'success');
                    } else {
                        Swal.fire('Failed!', data.message, 'error');
                    }
                })
                .catch(err => {
                    console.error('Error redeeming gift:', err);
                    Swal.fire('Failed!', 'An error occurred while redeeming the gift.', 'error');
                });
        }
    });
}
