document.addEventListener('DOMContentLoaded', function() {
    initializeLiff('2004752543-O6bmBeMw'); 
});

function initializeLiff(myLiffId) {
    liff.init({ liffId: myLiffId })
        .then(() => {
            if (liff.isLoggedIn()) {
                liff.getProfile().then(profile => {
                    const uid = profile.userId;
                    fetchGiftList(uid);
                    fetchUserPoints(uid);
                }).catch(err => {
                    console.error('Error fetching profile:', err);
                    displayError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
                });
            } else {
                liff.login();
            }
        })
        .catch(err => {
            console.error('LIFF initialization failed:', err);
            displayError('ไม่สามารถเริ่มการทำงานของ LIFF ได้');
        });
}

function fetchGiftList(uid) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getGiftList&uid=${uid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateGiftButtons(data.data);
            } else {
                displayError('ไม่สามารถดึงข้อมูลของขวัญได้');
            }
        })
        .catch(err => {
            console.error('Error fetching gift list:', err);
            displayError('ไม่สามารถดึงข้อมูลของขวัญได้');
        });
}

function fetchUserPoints(uid) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getUserPoints&uid=${uid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('points-value').innerText = data.points;
            } else {
                displayError('ไม่สามารถดึงคะแนนของผู้ใช้ได้');
            }
        })
        .catch(err => {
            console.error('Error fetching user points:', err);
            displayError('ไม่สามารถดึงคะแนนของผู้ใช้ได้');
        });
}

function updateGiftButtons(giftStatus) {
    giftStatus.forEach(gift => {
        const button = document.getElementById(`btn-level-${gift.level}`);
        if (button) {
            if (gift.enabled) {
                button.classList.remove('disabled');
                button.disabled = false;
                button.addEventListener('click', () => redeemGift(gift.level));
            } else {
                button.classList.add('disabled');
                button.disabled = true;
            }
        }
    });
}

function redeemGift(level) {
    Swal.fire({
        title: 'คุณต้องการแลกของรางวัลหรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ยกเลิก'
    }).then(result => {
        if (result.isConfirmed) {
            const uid = liff.getProfile().userId;
            fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=redeemGift&uid=${uid}&level=${level}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('สำเร็จ', 'คุณแลกของรางวัลสำเร็จ', 'success');
                        document.getElementById(`btn-level-${level}`).classList.add('disabled');
                        document.getElementById(`btn-level-${level}`).disabled = true;
                    } else {
                        Swal.fire('ผิดพลาด', data.message, 'error');
                    }
                })
                .catch(err => {
                    console.error('Error redeeming gift:', err);
                    Swal.fire('ผิดพลาด', 'ไม่สามารถแลกของรางวัลได้', 'error');
                });
        }
    });
}

function displayError(message) {
    document.body.innerHTML = `<div class="container"><p>${message}</p></div>`;
}
