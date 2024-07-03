document.addEventListener('DOMContentLoaded', function() {
    initializeLiff('2004752543-O6bmBeMw'); 
});

function initializeLiff(myLiffId) {
    liff.init({
        liffId: myLiffId
    }).then(() => {
        if (liff.isLoggedIn()) {
            liff.getProfile().then(profile => {
                const uid = profile.userId;
                fetchUserPoints(uid);
                fetchGiftList(uid);
            }).catch(err => {
                console.error('Failed to get profile:', err);
                document.getElementById('points-value').innerText = 'ไม่สามารถดึงคะแนนของผู้ใช้ได้';
            });
        } else {
            liff.login();
        }
    }).catch(err => {
        console.error('LIFF initialization failed', err);
        document.getElementById('gift-container').innerText = 'ไม่สามารถดึงข้อมูลของขวัญได้';
    });
}

function fetchUserPoints(uid) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getUserPoints&uid=${uid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('points-value').innerText = data.points;
            } else {
                console.error('Error fetching user points:', data.message);
                document.getElementById('points-value').innerText = 'ไม่สามารถดึงคะแนนของผู้ใช้ได้';
            }
        })
        .catch(error => {
            console.error('Error fetching user points:', error);
            document.getElementById('points-value').innerText = 'ไม่สามารถดึงคะแนนของผู้ใช้ได้';
        });
}

function fetchGiftList(uid) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getGiftList`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateGiftButtons(data.gifts, uid);
            } else {
                console.error('Error fetching gift list:', data.message);
                document.getElementById('gift-container').innerText = 'ไม่สามารถดึงข้อมูลของขวัญได้';
            }
        })
        .catch(error => {
            console.error('Error fetching gift list:', error);
            document.getElementById('gift-container').innerText = 'ไม่สามารถดึงข้อมูลของขวัญได้';
        });
}

function updateGiftButtons(gifts, uid) {
    gifts.forEach(gift => {
        const button = document.getElementById(`gift${gift.Level}`);
        if (button) {
            button.disabled = gift.Balance <= 0;
            if (!button.disabled) {
                checkIfRedeemed(uid, gift.Level).then(redeemed => {
                    button.disabled = redeemed || document.getElementById('points-value').innerText < gift.Level;
                });
            }
        } else {
            console.error(`Button for gift level ${gift.Level} not found`);
        }
    });
}

function checkIfRedeemed(uid, level) {
    return fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=checkIfRedeemed&uid=${uid}&level=${level}`)
        .then(response => response.json())
        .then(data => data.redeemed)
        .catch(error => {
            console.error('Error checking if redeemed:', error);
            return false;
        });
}

function redeemGift(uid, level) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=redeemGift&uid=${uid}&level=${level}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire('สำเร็จ', 'คุณได้ทำการรับของรางวัลแล้ว', 'success').then(() => {
                    location.reload();
                });
            } else {
                Swal.fire('ผิดพลาด', data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error redeeming gift:', error);
            Swal.fire('ผิดพลาด', 'ไม่สามารถรับของรางวัลได้', 'error');
        });
}

