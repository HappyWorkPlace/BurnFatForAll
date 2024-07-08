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
                fetchUserData(uid)
                    .then(userData => {
                        const points = userData[5]; // Assuming points is at index 5
                        updateGiftButtons(userData, points);
                        displayPoints(points);
                    }).catch(err => {
                        console.error('Error fetching user data:', err);
                        document.getElementById('points-value').innerText = 'ไม่สามารถดึงคะแนนของผู้ใช้ได้';
                    });
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
                return data.data;
            } else {
                throw new Error('Error fetching user data');
            }
        });
}

function updateGiftButtons(userData, points) {
    const giftLevels = [15, 30, 45, 60, 75];
    giftLevels.forEach(level => {
        const columnIndex = getColumnIndexByLevel(level);
        const button = document.getElementById(`gift${level}`);
        if (button) {
            button.disabled = userData[columnIndex] === 'N' || points < level;
            if (button.disabled) {
                disableButton(button);
            } else {
                enableButton(button);
            }
        } else {
            console.error(`Button for gift level ${level} not found`);
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
