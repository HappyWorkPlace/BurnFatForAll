function displayInputSection(userData) {
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('empNo').textContent = userData[1];
    document.getElementById('name').textContent = userData[2];
    document.getElementById('division').textContent = userData[3];
    document.getElementById('factory').textContent = userData[4];

    // Load food list
    loadFoodList();
    hideLoading();
}

function loadFoodList() {
    fetch('https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getFoodList&sheetName=MENU&column=A')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateDropdown(data.data);
            } else {
                console.error('Failed to fetch food list:', data.message);
            }
        })
        .catch(error => console.error('Error fetching food list:', error));
}

function populateDropdown(foodList) {
    const dropdownList = document.getElementById('foodDropdownList');
    dropdownList.innerHTML = '';
    foodList.forEach(food => {
        const item = document.createElement('div');
        item.textContent = food;
        dropdownList.appendChild(item);
    });

    const input = document.querySelector('.dropdown-input');
    const items = dropdownList.getElementsByTagName('div');
    const saveButton = document.querySelector('.save-button');

    function highlight(text, query) {
        const startIndex = text.toUpperCase().indexOf(query.toUpperCase());
        if (startIndex === -1) return text;
        const endIndex = startIndex + query.length;
        return text.slice(0, startIndex) + '<span class="highlight">' + text.slice(startIndex, endIndex) + '</span>' + text.slice(endIndex);
    }

    input.addEventListener('input', function() {
        let filter = this.value.toUpperCase();
        let matchFound = false;

        for (let i = 0; i < items.length; i++) {
            let txtValue = items[i].textContent || items[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                items[i].style.display = "";
                items[i].innerHTML = highlight(txtValue, this.value);
                if (txtValue.toUpperCase() === filter) {
                    matchFound = true;
                }
            } else {
                items[i].style.display = "none";
            }
        }

        dropdownList.style.display = filter ? 'block' : 'none';
        saveButton.disabled = !matchFound;
    });

    input.addEventListener('focus', function() {
        dropdownList.style.display = 'block';
    });

    dropdownList.addEventListener('click', function(e) {
        if (e.target && e.target.matches("div")) {
            input.value = e.target.textContent;
            dropdownList.style.display = 'none';
            saveButton.disabled = false;
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.matches('.dropdown-input')) {
            dropdownList.style.display = 'none';
        }
    });
}

function recordSelection() {
    const empNo = document.getElementById('empNo').textContent;
    const factory = document.getElementById('factory').textContent;
    const selectedFood = document.querySelector('.dropdown-input').value;

    if (!selectedFood || selectedFood === '') {
        Swal.fire('Error', 'Please select an item from the dropdown.', 'error');
        return;
    }

    Swal.fire({
        title: 'วันนี้บันทึกไปรึยังน้า...',
        text: 'ตรวจสอบสักครู่..',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    liff.getProfile()
        .then(profile => {
            const uid = profile.userId;
            checkUserColumnJ(uid, empNo, factory, selectedFood);
        })
        .catch(err => {
            console.error('Failed to get user profile:', err);
            Swal.fire('Error', 'Failed to get user profile. Please try again later.', 'error');
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
                Swal.fire({
                    title: 'แย่จัง..',
                    html: `วันนี้คุณบันทึกข้อมูลไปแล้วเมื่อ ${new Date(data.lastTimestamp).toLocaleString()} พรุ่งนี้ค่อยมาใหม่นะ <br><img src="https://raw.githubusercontent.com/HappyWorkPlace/BurnFatForAll/main/picture/healthy-food_error.png" alt="icon" style="width:100px;height:100px;">`
                });
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
        title: 'กำลังบันทึกข้อมูล',
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
            Swal.close();
            if (data.success) {
                Swal.fire({
                    title: 'สำเร็จ',
                    html: '<img src="https://raw.githubusercontent.com/HappyWorkPlace/BurnFatForAll/main/picture/healthy-food_1.png" alt="success" style="width:100px;height:100px;"><p>บันทึกข้อมูลแล้ว</p>'
                    })
                    .then(() => {
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
function filterDropdown() {
    const input = document.getElementById('foodInput');
    const filter = input.value.toUpperCase();
    const dropdownList = document.getElementById('foodDropdownList');
    const items = dropdownList.getElementsByTagName('div');
    let matchFound = false;

    function highlight(text, query) {
        const startIndex = text.toUpperCase().indexOf(query.toUpperCase());
        if (startIndex === -1) return text;
        const endIndex = startIndex + query.length;
        return text.slice(0, startIndex) + '<span class="highlight">' + text.slice(startIndex, endIndex) + '</span>' + text.slice(endIndex);
    }

    for (let i = 0; i < items.length; i++) {
        let txtValue = items[i].textContent || items[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = "";
            items[i].innerHTML = highlight(txtValue, input.value);
            if (txtValue.toUpperCase() === filter) {
                matchFound = true;
            }
        } else {
            items[i].style.display = "none";
        }
    }

    dropdownList.style.display = filter ? 'block' : 'none';
    document.getElementById('saveButton').disabled = !matchFound;
}

function showBlankPage() {
    document.body.innerHTML = '<p style="font-size: 20px; text-align: center; margin-top: 50%;">บันทึกข้อมูลในระบบเรียบร้อยแล้ว</p>';
}
