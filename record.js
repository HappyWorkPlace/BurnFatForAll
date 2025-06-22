// NMB Wellness App - Complete Index.js
// Author: Assistant
// Version: 2.0

// Global Variables
let userPoints = 0;
let selectedFood = '';
let userData = null;
let lineProfile = null;
let giftData = [];

// =================
// LIFF Integration
// =================

function navigateTo(page) {
    window.location.href = page;
}

function getUserData(uid) {
    console.log("Fetching user data for UID:", uid);
    return fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getUserData2&uid=${uid}`)
        .then(response => {
            console.log("User data response received");
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            console.log("User data:", data);
            if (data.error) {
                displayRegisterSection();
            } else {
                displayInputSection(data.data);
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            Swal.fire('Error', 'Failed to fetch user data.', 'error');
        });
}

function displayRegisterSection() {
    document.querySelector('.app-container').innerHTML = `
        <div style="padding: 40px 20px; text-align: center;">
            <div style="background: white; padding: 30px; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                <i class="fas fa-user-plus" style="font-size: 3rem; color: #10b981; margin-bottom: 20px;"></i>
                <h2 style="color: #1e293b; margin-bottom: 15px;">ลงทะเบียนใช้งาน</h2>
                <p style="color: #64748b; margin-bottom: 30px;">กรุณาลงทะเบียนเพื่อเริ่มใช้งานระบบ</p>
                <button onclick="window.location.reload()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600;">ลงทะเบียน</button>
            </div>
        </div>
    `;
}

function displayInputSection(data) {
    userData = data;
    
    // Use LINE profile name primarily, fallback to system name
    const displayName = lineProfile ? lineProfile.displayName : (data[2] || 'ผู้ใช้งาน');
    
    // Update member info
    document.getElementById('memberName').textContent = displayName;
    document.getElementById('memberDept').textContent = data[3] || 'แผนกไม่ระบุ';
    document.getElementById('memberBadge').textContent = data[4] || 'Factory';
    
    // Update profile picture
    if (lineProfile && lineProfile.pictureUrl) {
        document.getElementById('profileAvatar').innerHTML = 
            `<img src="${lineProfile.pictureUrl}" style="width: 100%; height: 100%; border-radius: 14px; object-fit: cover;" alt="Profile">`;
    }
    
    // Update points if available
    if (data[5]) {
        userPoints = parseInt(data[5]) || 0;
        updatePointsDisplay(userPoints);
    }

    // Load food list and gift data
    Promise.all([loadFoodList(), loadGiftData()]).then(() => {
        console.log('All data loaded successfully');
        hideLoading();
    }).catch(error => {
        console.error('Error loading data:', error);
        hideLoading();
    });
}

function hideLoading() {
    const loadingMsg = document.getElementById('loadingMessage');
    if (loadingMsg) {
        loadingMsg.style.display = 'none';
    }
    console.log('Loading complete');
}

window.onload = function() {
    console.log("Window loaded, initializing LIFF");
    if (typeof liff !== 'undefined') {
        initializeLiff('2004752543-O6bmBeMw');
    } else {
        console.error("LIFF SDK is not defined");
        Swal.fire('Error', 'LIFF SDK is not loaded. Please check your script inclusion.', 'error');
    }
};

function initializeLiff(myLiffId) {
    liff.init({
        liffId: myLiffId
    }).then(() => {
        console.log("LIFF initialized");
        if (liff.isLoggedIn()) {
            console.log("User is logged in, getting profile");
            liff.getProfile().then(profile => {
                console.log("Profile obtained: ", profile);
                lineProfile = profile; // Store LINE profile globally
                const uid = profile.userId;
                
                getUserData(uid);
            }).catch(err => {
                console.error('Failed to get user profile:', err);
                Swal.fire('Error', 'Failed to get user profile.', 'error');
            });
        } else {
            console.log("User is not logged in, logging in");
            liff.login();
        }
    }).catch(err => {
        console.error('LIFF Initialization failed:', err);
        Swal.fire('Error', 'Initialization failed.', 'error');
    });
}

// =================
// Food System
// =================

function loadFoodList() {
    return fetch('https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getFoodList&sheetName=MENU&column=A')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateDropdown(data.data);
                return data.data;
            } else {
                console.error('Failed to fetch food list:', data.message);
                throw new Error('Failed to fetch food list');
            }
        })
        .catch(error => {
            console.error('Error fetching food list:', error);
            throw error;
        });
}

function populateDropdown(foodList) {
    const dropdownList = document.getElementById('foodDropdown');
    if (!dropdownList) return;
    
    dropdownList.innerHTML = '';
    
    foodList.forEach(food => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = food;
        dropdownList.appendChild(item);
    });
}

function updateRecordButton(food) {
    const button = document.getElementById('recordBtn');
    if (!button) return;
    
    if (food && food.trim() !== '') {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-save"></i> บันทึกการรับประทาน';
    } else {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-save"></i> เลือกเมนูก่อน';
    }
}

function recordSelection() {
    if (!userData || !selectedFood) {
        Swal.fire('Error', 'กรุณาเลือกเมนูอาหาร', 'error');
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
            checkUserColumnJ(uid, userData[1], userData[4], selectedFood, userData[2]);
        })
        .catch(err => {
            console.error('Failed to get user profile:', err);
            Swal.fire('Error', 'Failed to get user profile. Please try again later.', 'error');
        });
}

function checkUserColumnJ(uid, empNo, factory, selectedFood, name) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=checkUserColumnJ&uid=${uid}`)
        .then(response => response.json())
        .then(data => {
            Swal.close();
            if (data.status === 'TRUE') {
                saveSelection(empNo, factory, selectedFood, uid, name);
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

function saveSelection(empNo, factory, selectedFood, uid, name) {
    Swal.fire({
        title: 'กำลังบันทึกข้อมูล',
        text: 'รอสักครู่..',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=saveRedeemData&empNo=${encodeURIComponent(empNo)}&factory=${encodeURIComponent(factory)}&code=${encodeURIComponent(selectedFood)}&name=${encodeURIComponent(name)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            Swal.close();
            if (data.success) {
                // Add points and update UI
                userPoints += 5;
                updatePointsDisplay(userPoints);
                
                Swal.fire({
                    title: 'สำเร็จ!',
                    html: '<img src="https://raw.githubusercontent.com/HappyWorkPlace/BurnFatForAll/main/picture/healthy-food_1.png" alt="success" style="width:100px;height:100px;"><p>บันทึกข้อมูลแล้ว +5 คะแนน</p>',
                    showConfirmButton: true,
                    confirmButtonText: 'ตกลง'
                });
                
                // Reset form
                const foodSearch = document.getElementById('foodSearch');
                if (foodSearch) foodSearch.value = '';
                selectedFood = '';
                updateRecordButton('');
                
                // Update gift buttons
                updateGiftButtons(userPoints);
            } else {
                Swal.fire('Error', data.message || 'Failed to save data.', 'error');
            }
        })
        .catch(error => {
            console.error('Error saving data:', error);
            Swal.fire('Error', `Network error: ${error.message}`, 'error');
        });
}

// =================
// History Loading
// =================

function loadHistory() {
    if (!userData) return;
    
    const loading = document.getElementById('historyLoading');
    const list = document.getElementById('historyList');
    
    if (loading) loading.style.display = 'block';
    if (list) list.style.display = 'none';
    
    liff.getProfile().then(profile => {
        const uid = profile.userId;
        
        fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getUserRecords&uid=${uid}`)
            .then(response => response.json())
            .then(data => {
                if (loading) loading.style.display = 'none';
                
                if (data.success && data.records.length > 0) {
                    if (list) {
                        list.innerHTML = '';
                        
                        // Show last 5 records
                        data.records.slice(0, 5).forEach(record => {
                            const historyItem = document.createElement('div');
                            historyItem.className = 'history-item';
                            historyItem.innerHTML = `
                                <div class="history-date">${new Date(record.TimeStamp).toLocaleDateString('th-TH')} - ${new Date(record.TimeStamp).toLocaleTimeString('th-TH', {hour: '2-digit', minute: '2-digit'})}</div>
                                <div class="history-food">${record.Menu}</div>
                            `;
                            list.appendChild(historyItem);
                        });
                    }
                } else {
                    if (list) {
                        list.innerHTML = '<div style="text-align: center; padding: 40px; color: #64748b;"><i class="fas fa-history" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.3;"></i><p>ยังไม่มีประวัติการบันทึก</p></div>';
                    }
                }
                
                if (list) list.style.display = 'block';
            })
            .catch(error => {
                console.error('Error loading history:', error);
                if (loading) loading.style.display = 'none';
                if (list) {
                    list.innerHTML = '<div style="text-align: center; padding: 40px; color: #ef4444;"><p>ไม่สามารถโหลดประวัติได้</p></div>';
                    list.style.display = 'block';
                }
            });
    });
}

// =================
// Gift Management
// =================

function loadGiftData() {
    return fetchGiftList().then(gifts => {
        giftData = gifts;
        updateGiftCards(userData, gifts, userPoints);
        return gifts;
    }).catch(error => {
        console.error('Error loading gift data:', error);
        return [];
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

function updateGiftCards(userData, gifts, points) {
    if (!userData || !gifts) return;
    
    gifts.forEach((gift, index) => {
        const giftSlide = document.querySelector(`.gift-slide:nth-child(${index + 1})`);
        if (!giftSlide) return;
        
        const button = giftSlide.querySelector('.gift-button-large');
        const stockElement = giftSlide.querySelector('.gift-stock-large');
        
        // Update stock info
        if (stockElement && gift.Balance !== undefined) {
            stockElement.textContent = `คงเหลือ ${gift.Balance} ชิ้น`;
        }
        
        if (button) {
            const columnIndex = getColumnIndexByLevel(gift.Level);
            const userGiftStatus = userData[columnIndex];
            
            // Update button based on user status and points
            if (userGiftStatus === 'R') {
                button.textContent = 'รับแล้ว';
                button.disabled = true;
                button.style.background = '#22c55e';
            } else if (userGiftStatus === 'O' || gift.Balance <= 0) {
                button.textContent = 'ของหมด';
                button.disabled = true;
            } else if (points >= gift.Level) {
                button.textContent = 'แลกรับ';
                button.disabled = false;
                button.onclick = () => redeemGift(gift.Level);
            } else {
                button.textContent = 'คะแนนไม่พอ';
                button.disabled = true;
            }
        }
    });
}

function getColumnIndexByLevel(level) {
    switch (level) {
        case 15: return 6;  // Column G
        case 30: return 7;  // Column H
        case 45: return 8;  // Column I
        case 60: return 9;  // Column J
        case 75: return 10; // Column K
        case 90: return 11; // Column L
        default: return null;
    }
}

function redeemGift(level) {
    liff.getProfile().then(profile => {
        const uid = profile.userId;
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
                        Swal.close();
                        if (data.success) {
                            Swal.fire({
                                title: 'สำเร็จ',
                                html: '<img src="https://raw.githubusercontent.com/HappyWorkPlace/BurnFatForAll/main/picture/redeemGIF.gif" alt="success" style="width:300px;height:300px;"><p>แลกรับรางวัลเรียบร้อยแล้ว</p>'
                            }).then(() => {
                                // Refresh gift data and user data
                                loadGiftData();
                                // Optionally reload user data to get updated gift status
                                liff.getProfile().then(profile => {
                                    getUserData(profile.userId);
                                });
                            });
                        } else {
                            Swal.fire('ผิดพลาด', data.message, 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error redeeming gift:', error);
                        Swal.close();
                        Swal.fire('ผิดพลาด', 'ไม่สามารถรับของรางวัลได้', 'error');
                    });
            }
        });
    });
}

function updateGiftButtons(points = userPoints) {
    if (!giftData || !userData) return;
    
    updateGiftCards(userData, giftData, points);
}

// =================
// UI Functions
// =================

function updatePointsDisplay(points) {
    const pointsElement = document.getElementById('pointsValue');
    if (pointsElement) {
        pointsElement.textContent = points;
    }
    
    const maxPoints = 152;
    const progressPercent = Math.min((points / maxPoints) * 100, 100);
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
    
    const milestones = document.querySelectorAll('.milestone');
    const milestoneValues = [0, 30, 60, 90, 120, 150, 152];
    
    milestones.forEach((milestone, index) => {
        const milestoneValue = milestoneValues[index];
        milestone.classList.remove('achieved', 'current');
        
        if (points >= milestoneValue) {
            milestone.classList.add('achieved');
        } else if (index > 0 && points >= milestoneValues[index - 1] && points < milestoneValue) {
            milestone.classList.add('current');
        }
    });

    updateGiftButtons(points);
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.closest('.nav-tab').classList.add('active');

    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(tabName + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }

    if (tabName === 'history') {
        loadHistory();
    }
}

// =================
// Carousel Functions
// =================

function scrollToGift(index) {
    const container = document.getElementById('giftsContainer');
    if (container) {
        const giftWidth = container.children[0].offsetWidth;
        container.scrollTo({
            left: giftWidth * index,
            behavior: 'smooth'
        });
        updateIndicators(index);
    }
}

function updateIndicators(activeIndex) {
    const indicators = document.querySelectorAll('.indicator-dot');
    indicators.forEach((indicator, index) => {
        if (index === activeIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// =================
// Utility Functions
// =================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        z-index: 1000;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// =================
// Event Listeners
// =================

document.addEventListener('DOMContentLoaded', function() {
    // Food search functionality
    const foodSearch = document.getElementById('foodSearch');
    if (foodSearch) {
        foodSearch.addEventListener('input', function() {
            const value = this.value;
            const dropdown = document.getElementById('foodDropdown');
            
            if (value.length > 0 && dropdown) {
                dropdown.style.display = 'block';
                const items = dropdown.querySelectorAll('.dropdown-item');
                items.forEach(item => {
                    if (item.textContent.toLowerCase().includes(value.toLowerCase())) {
                        item.style.display = 'block';
                        // Highlight matching text
                        const regex = new RegExp(`(${value})`, 'gi');
                        item.innerHTML = item.textContent.replace(regex, '<mark style="background: #10b981; color: white; padding: 1px 3px; border-radius: 3px;">$1</mark>');
                    } else {
                        item.style.display = 'none';
                    }
                });
            } else if (dropdown) {
                dropdown.style.display = 'none';
            }

            updateRecordButton(value);
        });
    }

    // Dropdown click handler
    const foodDropdown = document.getElementById('foodDropdown');
    if (foodDropdown) {
        foodDropdown.addEventListener('click', function(e) {
            if (e.target.classList.contains('dropdown-item')) {
                const searchInput = document.getElementById('foodSearch');
                if (searchInput) {
                    searchInput.value = e.target.textContent;
                    selectedFood = e.target.textContent;
                    this.style.display = 'none';
                    updateRecordButton(selectedFood);
                }
            }
        });
    }

    // Click outside to close dropdown
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            const dropdown = document.getElementById('foodDropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        }
    });

    // Record button click handler
    const recordBtn = document.getElementById('recordBtn');
    if (recordBtn) {
        recordBtn.addEventListener('click', function() {
            if (selectedFood && userData) {
                recordSelection();
            }
        });
    }

    // Auto-update carousel indicators on scroll
    const giftsContainer = document.getElementById('giftsContainer');
    if (giftsContainer) {
        giftsContainer.addEventListener('scroll', function() {
            const container = this;
            const giftWidth = container.children[0].offsetWidth;
            const scrollLeft = container.scrollLeft;
            const activeIndex = Math.round(scrollLeft / giftWidth);
            updateIndicators(activeIndex);
        });
    }
});

// Add CSS animation for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('NMB Wellness App initialized');
});
