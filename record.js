function recordSelection() {
    const empNo = document.getElementById('empNo').textContent;
    const factory = document.getElementById('factory').textContent;
    const selectedFood = document.getElementById('foodDropdown').value;

    if (!selectedFood) {
        Swal.fire('Error', 'Please select an item from the dropdown.', 'error');
        return;
    }

    Swal.fire({
        title: 'Checking data',
        text: 'รอสักครู่..',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    liff.getProfile().then(profile => {
        const uid = profile.userId;
        checkUserColumnJ(uid, empNo, factory, selectedFood);
    }).catch(err => {
        console.error('Failed to get user profile:', err);
        Swal.fire('Error', 'Failed to get user profile.', 'error');
    });
}

function checkUserColumnJ(uid, empNo, factory, selectedFood) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=checkUserColumnJ&uid=${uid}`)
        .then(response => response.json())
        .then(data => {
            Swal.close();
            if (data.status === 'TRUE') {
                saveSelection(empNo, factory, selectedFood, uid);
            } else if (data.status === 'FALSE') {
                Swal.fire('Error', `วันนี้คุณบันทึกข้อมูลไปแล้วเมื่อ ${new Date(data.lastTimestamp).toLocaleString()}. พรุ่งนี้ค่อยมาใหม่นะ`, 'info');
            } else {
                Swal.fire('Error', 'Failed to check user status.', 'error');
            }
        })
        .catch(error => {
            console.error('Error checking user column J:', error);
            Swal.fire('Error', 'Failed to check user status. Please try again later.', 'error');
        });
}

function saveSelection(empNo, factory, selectedFood, uid) {
    Swal.fire({
        title: 'Saving data',
        text: 'รอสักครู่..',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=saveRedeemData&empNo=${encodeURIComponent(empNo)}&factory=${encodeURIComponent(factory)}&code=${encodeURIComponent(selectedFood)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                Swal.close();
                Swal.fire('Success', 'Data saved successfully.', 'success').then(() => {
                    showBlankPage();
                });
            } else {
                Swal.fire('Error', data.message || 'Failed to save data.', 'error');
            }
        })
        .catch(error => {
            console.error('Error saving data:', error);
            Swal.fire('Error', `Network error: ${error.message}`, 'error');
        });
}

function showBlankPage() {
    document.body.innerHTML = '<p style="font-size: 20px; text-align: center; margin-top: 20%;">บันทึกข้อมูลในระบบเรียบร้อยแล้ว</p>';
}
