/* =================================
   🍽️ HARDCODE FOOD SYSTEM
   ================================= */

const HARDCODE_FOOD_LIST = [
    "ก๋วยเตี๋ยวไก่ฉีก ไม่ปรุงเครื่องปรุงเพิ่ม",
    "ก๋วยเตี๋ยวไก่มะระ ไม่ปรุงเครื่องปรุงเพิ่ม",
    "ก๋วยเตี๊ยวบะหมี่เกี๊ยวหมูแดง ไม่ปรุงเครื่องปรุงเพิ่ม",
    "ก๋วยเตี๋ยว ไม่ปรุงเครื่องปรุงเพิ่ม",
    "ก๋วยเตี๋ยว ไม่ใส่กระเทียมเจียว",
    "ก๋วยเตี๋ยวลุยสวน",
    "ก๋วยเตี๋ยวลูกชิ้นเนื้อเปื่อย ไม่ปรุงเครื่องปรุงเพิ่ม",
    "ก๋วยเตี๋ยวหมูตุ๋น, ไก่ตุ๋น ไม่ปรุงเครื่องปรุงเพิ่ม",
    "ก๋วยเตี๋ยวหมูน้ำตก, น้ำใส ไม่ปรุงเครื่องปรุงเพิ่ม",
    "ก๋วยเตี๋ยว อกไก่  ไม่ปรุงเครื่องปรุงเพิ่ม",
    "กะหล่ำปลีผัดไข่",
    "กุ้งอบวุ้นเส้น",
    "เกาเหลา",
    "เกี๊ยวอกไก่",
    "แกงจืดไก่",
    "แกงจืดเต้าหู้สาหร่าย",
    "แกงจืดมะระ",
    "แกงจืดวุ้นเส้นผักกาด",
    "แกงไตปลา",
    "แกงป่า",
    "แกงเปรอะ",
    "แกงเลียง",
    "แกงส้ม",
    "แกงหน่อไม้ใบย่านาง",
    "แกงหน่อไม้ (ไม่ใส่กะทิ)",
    "แกงเห็ด",
    "แกงอ่อม",
    "ไก่ต้ม",
    "ไก่ใต้น้ำ",
    "ไก่ผัดตะไคร้",
    "ไก่ย่างน้ำตก",
    "ไก่รวนปลาร้า",
    "ขนมจีนแกงไตปลา",
    "ขนมจีนน้ำยาป่า",
    "ข้าวไก่ย่างน้ำจิ้มแจ่ว",
    "ข้าวคลุกปลาทู",
    "ข้าวต้ม",
    "ข้าวต้มทรงเครื่อง",
    "ข้าวน้ำพริกลงเรือ",
    "ข้าวมันไก่ต้ม (ข้าวสวย)",
    "ข้าวหน้าไก่ต้ม",
    "ข้าวหมูย่างน้ำจิ้มแจ่ว",
    "ไข่ต้ม",
    "ไข่ตุ๋น",
    "โจ๊ก",
    "ซุปมะเขือยาว",
    "ต้มไก่บ้านใบมะขามอ่อน",
    "ต้มโคล้งปลาย่าง",
    "ต้มจับฉ่าย",
    "ต้มจืด",
    "ต้มจืดไข่น้ำ",
    "ต้มจืดตำลึง",
    "ต้มจืดเต้าหู้",
    "ต้มจืดเต้าหู้หมูสับ",
    "ต้มจืดฟัก",
    "ต้มจืดมะระ",
    "ต้มจืดเลือดหมู",
    "ต้มจืดวุ้นเส้น",
    "ต้มจืดหน่อไม้",
    "ต้มซุปปลา, ต้มซุปเนื้อ",
    "ต้มแซ่บ",
    "ต้มยำ",
    "ต้มยำกระดูกหมู",
    "ต้มยำกุ้งน้ำใส",
    "ต้มยำกุ้งเห็ดน้ำใส",
    "ต้มยำไก่",
    "ต้มยำไข่น้ำ",
    "ต้มยำโครงแก้ว",
    "ต้มยำปลาทู",
    "ต้มยำปลานิลน้ำใส",
    "ต้มยำปลาย่าง",
    "ต้มยำอกไก่ใส่เห็ด",
    "ต้มเล้ง",
    "ต้มเลือดหมู",
    "ต้มส้มปลานิล",
    "ตับหวาน",
    "ตำไทยข้าวโพด",
    "ตำไทยไม่ใส่น้ำตาล",
    "ตำไทยไหลบัว",
    "ตำผลไม้",
    "เต้าเจี้ยวหลน + ผักต้ม",
    "เต้าหู้ไข่(ไม่ทอด)ทรงเครื่อง",
    "ทูน่าคอร์นสลัด",
    "น้ำตกไก่ย่าง",
    "น้ำตกหมู",
    "น้ำพริกกะปิ + ไข่ต้ม + ชะอม",
    "น้ำพริกกะปิ ปลาทู",
    "น้ำพริกกะปิ ผักต้ม",
    "น้ำพริกปลาทู",
    "น้ำพริกปลาร้า +ผักต้ม",
    "น้ำพริกผักต้ม",
    "น้ำพริกเผา + ผักต้ม",
    "น้ำพริกมะขาม ผักลวก",
    "น้ำพริกหนุ่ม ผักลวก",
    "น้ำพริกอ่อง ผักลวก",
    "ปลานึ่งจิ้มแจ่ว",
    "ปลานึ่ง ผักลวก",
    "ปลานึ่ง/ย่าง",
    "ผักกาดขาวลุยสวน",
    "ผัดกะหล่ำปลี",
    "ผัดขิง",
    "ผัดคะน้า",
    "ผัดแตงกวาใส่ไข่",
    "ผัดถั่วงอกเต้าหู้",
    "ผัดบล็อคโคลี่",
    "ผัดบวบใส่ไข่",
    "ผัดเปรี้ยวหวาน",
    "ผัดผักบุ้ง",
    "ผัดผักรวม",
    "ผัดผักรวมหมู",
    "ผัดฟักทอง",
    "ผัดฟักทองใส่ไข่",
    "ผัดมะเขืออกไก่",
    "ผัดมะเขืออ่อน",
    "ผัดมะระใส่ไข่",
    "ผัดวุ้นเส้น",
    "ผัดสายบัวใส่ไก่",
    "ฟักทองนึ่ง/ มันนึ่ง",
    "เมี่ยงปลาทู",
    "ยำขนมจีน",
    "ยำไข่ต้ม",
    "ยำปลากระป๋อง",
    "ยำปลาทู",
    "ยำผักหวาน",
    "ยำรวมมิตร",
    "ยำวุ้นเส้น",
    "ยำเห็ด",
    "ลาบไก่",
    "ลาบปลาดุก",
    "ลาบหมู",
    "ลาบเห็ด",
    "ลาบอกไก่",
    "ลุยสวน",
    "ลูกชิ้นอกไก่ย่าง",
    "สเต็ก",
    "ส้มตำไม่ใส่น้ำตาล",
    "ส้มตำไม่ใส่ผงชูรส",
    "สลัดโรล",
    "สุกี้น้ำทะเล",
    "สุกี้น้ำรวมมิตร",
    "สุกี้น้ำหมูไก่",
    "สุกี้ผักรวม",
    "เส้นเซียงไฮตุ๋นยาจีน",
    "หมูมะนาว",
    "เห็ดย่าง",
    "อกไก่นึ่ง",
    "อกไก่ย่าง"
];

/* =================================
   🍽️ FOOD SYSTEM
   ================================= */
const Food = {
    async loadFoodList() {
        try {
            console.log('โหลดรายการอาหารจาก hardcode...');
            
            // Filter และ validate food list
            validFoodList = HARDCODE_FOOD_LIST.filter(food => 
                food && food.trim() !== '' && food !== '-'
            );
            
            console.log('โหลดรายการอาหารสำเร็จ:', validFoodList.length, 'รายการ');
            
            // Populate dropdown
            this.populateDropdown(validFoodList);
            
            return validFoodList;
        } catch (error) {
            console.error('Error loading hardcode food list:', error);
            validFoodList = [];
            this.populateDropdown(validFoodList);
            throw error;
        }
    },

    populateDropdown(foodList) {
        const dropdownList = document.getElementById('foodDropdown');
        if (!dropdownList) return;
        
        dropdownList.innerHTML = '';
        
        foodList.forEach(food => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = food;
            dropdownList.appendChild(item);
        });
    },

    validateFood(foodName) {
        if (!foodName || foodName.trim() === '') {
            return {
                isValid: false,
                message: '',
                showIcon: false
            };
        }

        const trimmedFood = foodName.trim();
        const isValid = validFoodList.some(food => 
            food.toLowerCase() === trimmedFood.toLowerCase()
        );

        return {
            isValid,
            message: isValid ? 'อาหารถูกต้อง ✓' : 'ไม่พบอาหารนี้ในระบบ โปรดเลือกจากรายการที่แนะนำ',
            showIcon: true
        };
    },

    async recordSelection() {
        if (isSubmitting) {
            console.log('กำลังบันทึกอยู่ กรุณารอ...');
            return;
        }

        if (!userData || !selectedFood) {
            Swal.fire({
                title: 'กรุณาเลือกเมนูอาหาร',
                text: 'กรุณาเลือกเมนูที่ถูกต้องก่อนบันทึก',
                icon: 'warning',
                confirmButtonColor: '#10b981'
            });
            return;
        }

        const validation = this.validateFood(selectedFood);
        if (!validation.isValid) {
            Swal.fire({
                title: 'เมนูไม่ถูกต้อง',
                text: 'กรุณาเลือกเมนูจากรายการที่แนะนำเท่านั้น',
                icon: 'error',
                confirmButtonColor: '#10b981'
            });
            return;
        }

        isSubmitting = true;
        UI.updateRecordButton(selectedFood);

        Swal.fire({
            title: 'วันนี้บันทึกไปรึยังน้า...',
            text: 'ตรวจสอบสักครู่..',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const profile = await liff.getProfile();
            const uid = profile.userId;
            await this.checkAndSave(uid, userData[1], userData[4], selectedFood, userData[2]);
        } catch (error) {
            console.error('Failed to get user profile:', error);
            this.resetSubmitting();
            Swal.fire('Error', 'Failed to get user profile. Please try again later.', 'error');
        }
    },

    async checkAndSave(uid, empNo, factory, selectedFood, name) {
        try {
            const response = await API.checkUserColumnJ(uid);
            Swal.close();
            
            if (response.status === 'TRUE') {
                await this.saveSelection(empNo, factory, selectedFood, uid, name);
            } else if (response.status === 'FALSE') {
                this.resetSubmitting();
                Swal.fire({
                    title: 'แย่จัง..',
                    html: `วันนี้คุณบันทึกข้อมูลไปแล้วเมื่อ ${new Date(response.lastTimestamp).toLocaleString()} พรุ่งนี้ค่อยมาใหม่นะ <br><img src="https://raw.githubusercontent.com/HappyWorkPlace/BurnFatForAll/main/picture/healthy-food_error.png" alt="icon" style="width:100px;height:100px;">`
                });
            } else {
                this.resetSubmitting();
                Swal.fire('Error', 'Failed to check user status.', 'error');
            }
        } catch (error) {
            console.error('Error checking user status:', error);
            this.resetSubmitting();
            Swal.fire('Error', 'Failed to check user status. Please try again later.', 'error');
        }
    },

    async saveSelection(empNo, factory, selectedFood, uid, name) {
        Swal.fire({
            title: 'กำลังบันทึกข้อมูล',
            text: 'รอสักครู่..',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const response = await API.saveRedeemData(empNo, factory, selectedFood, name);
            Swal.close();
            
            if (response.success) {
                // Add points and update UI
                userPoints += 5;
                UI.updatePointsDisplay(userPoints);
                
                Swal.fire({
                    title: 'สำเร็จ!',
                    html: '<img src="https://raw.githubusercontent.com/HappyWorkPlace/BurnFatForAll/main/picture/healthy-food_1.png" alt="success" style="width:100px;height:100px;"><p>บันทึกข้อมูลแล้ว +5 คะแนน</p>',
                    showConfirmButton: true,
                    confirmButtonText: 'ตกลง'
                });
                
                this.resetForm();
                Gift.updateGiftButtons(userPoints);
            } else {
                Swal.fire('Error', response.message || 'Failed to save data.', 'error');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            Swal.fire('Error', `Network error: ${error.message}`, 'error');
        } finally {
            this.resetSubmitting();
        }
    },

    resetForm() {
        const foodSearch = document.getElementById('foodSearch');
        if (foodSearch) {
            foodSearch.value = '';
            foodSearch.classList.remove('valid-food', 'invalid-food');
        }
        selectedFood = '';
        
        const statusContainer = document.querySelector('.validation-status');
        if (statusContainer) {
            statusContainer.textContent = '';
        }
    },

    resetSubmitting() {
        isSubmitting = false;
        UI.updateRecordButton('');
    }
};
