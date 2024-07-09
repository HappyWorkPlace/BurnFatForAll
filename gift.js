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
    Promise.all([fetchUserData(uid), fetchGiftList()])
        .then(([userData, gifts]) => {
            const points = userData.data[5]; // Assuming points is at index 5
            updateGiftButtons(userData.data, gifts, points);
            displayPoints(points);
        }).catch(err => {
            console.error('Error fetching data:', err);
            document.getElementById('points-value').innerText = 'ไม่สามารถดึงคะแนนของผู้ใช้ได้';
            document.getElementById('gift-container').innerText = 'ไม่สามารถดึงข้อมูลของขวัญได้';
        });
}

function fetchUserData(uid) {
    return fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getUserData&uid=${uid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                return data;
            } else {
                throw new Error('Error fetching user data');
            }
        });
}

function fetchGiftList() {
    return fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getGiftList`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                return data.gifts;
            } else {
                throw new Error('Error fetching gift list');
            }
        });
}


function getColumnIndexByLevel(level) {
    switch (level) {
        case 15:
            return 6; // Column G
        case 30:
            return 7; // Column H
        case 45:
            return 8; // Column I
        case 60:
            return 9; // Column J
        case 75:
            return 10; // Column K
        default:
            return null;
    }
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

function displayPoints(points) {
    const pointsElement = document.getElementById('points-value');
    if (pointsElement) {
        pointsElement.innerText = points;
    } else {
        console.error('Points element not found');
    }
}
function checkIfRedeemed(uid, level) {
    return fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_URL/exec?action=checkIfRedeemed&uid=${uid}&level=${level}`)
        .then(response => response.json())
        .then(data => {
            if (data.redeemed) {
                return "รับสิทธิ์แล้ว";
            } else {
                return null;
            }
        })
        .catch(error => {
            console.error('Error checking if redeemed:', error);
            return null;
        });
}

function updateGiftButtons(gifts, uid, points) {
    const buttonPromises = gifts.map(gift => {
        const button = document.getElementById(`gift${gift.Level}`);
        if (button) {
            button.disabled = gift.Balance <= 0 || points < gift.Level;
            if (!button.disabled) {
                return checkIfRedeemed(uid, gift.Level).then(status => {
                    if (status === "รับสิทธิ์แล้ว") {
                        button.disabled = true;
                        button.innerText = 'รับสิทธิ์แล้ว';
                    } else {
                        enableButton(button);
                    }
                });
            } else {
                if (gift.Balance <= 0) {
                    button.innerText = 'ของรางวัลหมด';
                } else if (points < gift.Level) {
                    button.innerText = `${gift.Level} points`;
                }
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

function disableButton(button) {
    button.classList.add('disabled');
    button.style.pointerEvents = 'none';
}

function enableButton(button) {
    button.classList.remove('disabled');
    button.style.pointerEvents = 'auto';
}

