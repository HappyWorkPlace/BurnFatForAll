function moveToNext(current, nextFieldId) {
    if (current.value.length >= current.maxLength) {
        document.getElementById(nextFieldId).focus();
    }
}
function convertToUpper(inputElement) {
            inputElement.value = inputElement.value.toUpperCase();
        }

        document.addEventListener('DOMContentLoaded', function() {
            const empNoInput = document.getElementById('empNoInput');
            empNoInput.addEventListener('input', function() {
                convertToUpper(this);
            });
        });
function getEmpDateInput() {
    const dateFields = [
        document.getElementById('date1').value,
        document.getElementById('date2').value,
        document.getElementById('date3').value,
        document.getElementById('date4').value,
        document.getElementById('date5').value,
        document.getElementById('date6').value,
        document.getElementById('date7').value,
        document.getElementById('date8').value
    ];
    const empDate = `${dateFields.slice(0, 2).join('')}/${dateFields.slice(2, 4).join('')}/${dateFields.slice(4).join('')}`;
    return empDate;
}

function displayRegisterSection() {
    document.getElementById('registerSection').style.display = 'block';
}

function checkUserInfo() {
    const empNo = document.getElementById('empNoInput').value;
    const empDate = getEmpDateInput();

    if (!empNo || !empDate) {
        Swal.fire('Error', 'Please provide both Employee Number and Employment Date.', 'error');
        return;
    }

    Swal.fire({
        title: 'กำลังตรวจสอบ',
        text: 'รอสักครู่',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=checkUserInfo&empNo=${empNo}&empDate=${empDate}`)
        .then(response => response.json())
        .then(data => {
            Swal.close();
            if (data.status === 'found') {
                Swal.fire({
                    title: 'Confirm Your Details',
                    html: `
                        <p>Employee Number: ${data.details.empNo}</p>
                        <p>Name: ${data.details.name}</p>
                        <p>Division: ${data.details.division}</p>
                        <p>Factory: ${data.details.factory}</p>
                    `,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, register me!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        liff.getProfile().then(profile => {
                            const uid = profile.userId;
                            registerUser(empNo, empDate, uid);
                        }).catch(err => {
                            console.error('Failed to get user profile:', err);
                            Swal.fire('Error', 'Failed to get user profile.', 'error');
                        });
                    }
                });
            } else {
                Swal.fire('Not Found', 'No matching records found. Please check the information provided and try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Failed to process your request. Please try again later.', 'error');
        });
}

function registerUser(empNo, empDate, uid) {
    Swal.fire({
        title: 'กำลังลงทะเบียน…',
        text: 'รอสักครู่',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=registerUser&empNo=${encodeURIComponent(empNo)}&empDate=${encodeURIComponent(empDate)}&uid=${encodeURIComponent(uid)}`
    })
    .then(response => response.json())
    .then(data => {
        Swal.close();
        if (data.success) {
            Swal.fire('Registered!', 'ลงทะเบียนสำเร็จแล้ว', 'success');
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Failed to register. Please try again later.', 'error');
    });
}
