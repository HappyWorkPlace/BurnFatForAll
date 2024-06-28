function displayInputSection(userData) {
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('empNo').textContent = userData[0];
    document.getElementById('name').textContent = userData[1];
    document.getElementById('division').textContent = userData[2];
    document.getElementById('factory').textContent = userData[4];
}

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

    liff.getProfile()
        .then(profile => {
            const uid = profile.userId;
            console.log('User profile obtained:', profile); // Debug log
            checkUserColumnJ(uid, empNo, factory, selectedFood);
        })
        .catch(err => {
            console.error('Failed to get user profile:', err);
            Swal.fire('Error', 'Failed to get user profile. Please try again later.', 'error');
        });
}

function checkUserColumnJ(uid, empNo, factory, selectedFood) {
    fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=checkUserColumnJ&uid=${uid}`)
        .then(response => response.json())
        .then(data => {
            Swal.close();
            console.log('Check user column J response:', data); // Debug log
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

    fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=saveRedeemData&empNo=${encodeURIComponent(empNo)}&factory=${encodeURIComponent(factory)}&code=${encodeURIComponent(selectedFood)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Save selection response:', data); // Debug log
            Swal.close();
            if (data.success) {
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
