document.addEventListener('DOMContentLoaded', function () {
    initializeLiff('2004752543-26ldj6RO'); 
});

function initializeLiff(myLiffId) {
    liff.init({
        liffId: myLiffId
    }).then(() => {
        if (liff.isLoggedIn()) {
            liff.getProfile().then(profile => {
                const uid = profile.userId;
                fetchDataAndUpdateUI(uid);
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

function fetchDataAndUpdateUI(uid) {
    Promise.all([fetchUserPoints(uid), fetchGiftList(uid)])
        .then(([points, gifts]) => {
            updateGiftButtons(gifts, uid, points);
            displayPoints(points);
        }).catch(err => {
            console.error('Error fetching data:', err);
            document.getElementById('points-value').innerText = 'ไม่สามารถดึงคะแนนของผู้ใช้ได้';
            document.getElementById('gift-container').innerText = 'ไม่สามารถดึงข้อมูลของขวัญได้';
        });
}

function fetchUserPoints(uid) {
    return fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getUserPoints&uid=${uid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.points;
            } else {
                console.error('Error fetching user points:', data.message);
                throw new Error('Error fetching user points');
            }
        })
        .catch(error => {
            console.error('Error fetching user points:', error);
            throw error;
        });
}

function fetchGiftList(uid) {
    return fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getGiftList`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.gifts;
            } else {
                console.error('Error fetching gift list:', data.message);
                throw new Error('Error fetching gift list');
            }
        })
        .catch(error => {
            console.error('Error fetching gift list:', error);
            throw error;
        });
}

function updateGiftButtons(gifts, uid, points) {
    const buttonPromises = gifts.map(gift => {
        const button = document.getElementById(`gift${gift.Level}`);
        if (button) {
            button.disabled = gift.Balance <= 0 || points < gift.Level;
            if (!button.disabled) {
                return checkIfRedeemed(uid, gift.Level).then(redeemed => {
                    button.disabled = redeemed;
                    if (button.disabled) {
                        disableButton(button);
                    } else {
                        enableButton(button);
                    }
                });
            } else {
                disableButton(button);
                return Promise.resolve();
            }
        } else {
            console.error(`Button for gift level ${gift.Level} not found`);
            return Promise.resolve();
        }
    });

    return Promise.all(buttonPromises);
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

function redeemGift(level) {
    liff.getProfile().then(profile => {
        const uid = profile.userId;
        // แสดง Swal หมุนๆ พร้อมรูปภาพ
        Swal.fire({
            title: 'กำลังจองของรางวัล',
            html: '<img src="https://raw.githubusercontent.com/HappyWorkPlace/BurnFatForAll/main/picture/giftAnimattion.gif" alt="loading" style="width:300px;height:300px;"><p>กรุณารอสักครู่...</p>',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=redeemGift&uid=${uid}&level=${level}`)
                    .then(response => response.json())
                    .then(data => {
                        Swal.close(); // ปิด Swal หมุนๆ เมื่อ fetch สำเร็จ
                        if (data.success) {
                           Swal.fire({
                                title: 'สำเร็จ',
                                html: '<img src="https://raw.githubusercontent.com/HappyWorkPlace/BurnFatForAll/main/picture/redeemGIF.gif" alt="success" style="width:300px;height:300px;"><p>กดรับของขวัญแล้ว</p>'
                               // ,icon: 'success'
                            }).then(() => {
                                // เปลี่ยนหน้าไปที่เพจเปล่าพร้อมข้อความ
                                document.body.innerHTML = '<p>บันทึกข้อมูลเรียบร้อยแล้ว</p>';
                            });
                        } else {
                            Swal.fire('ผิดพลาด', data.message, 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error redeeming gift:', error);
                        Swal.close(); // ปิด Swal หมุนๆ เมื่อ fetch ล้มเหลว
                        Swal.fire('ผิดพลาด', 'ไม่สามารถรับของรางวัลได้', 'error');
                    });
            }
        });
    });
}


function disableButton(button) {
    button.classList.add('disabled');
    button.style.pointerEvents = 'none';
}

function enableButton(button) {
    button.classList.remove('disabled');
    button.style.pointerEvents = 'auto';
}

function displayPoints(points) {
    const pointsElement = document.getElementById('points-value');
    if (pointsElement) {
        pointsElement.innerText = points;
    } else {
        console.error('Points element not found');
    }
}
