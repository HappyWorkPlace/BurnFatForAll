document.addEventListener('DOMContentLoaded', preloadFoodLists);

let foodLists = {
    withRice: [],
    singleDish: [],
    sideDish: {
        boiled: [],
        fried: [],
        curry: [],
        grilled: []
    }
};

function preloadFoodLists() {
    fetchFoodList('SideDish', 'A', (data) => { foodLists.sideDish.boiled = data; });
    fetchFoodList('SideDish', 'B', (data) => { foodLists.sideDish.fried = data; });
    fetchFoodList('SideDish', 'C', (data) => { foodLists.sideDish.curry = data; });
    fetchFoodList('SideDish', 'D', (data) => { foodLists.sideDish.grilled = data; });
    fetchFoodList('OverRice', 'A', (data) => { 
        foodLists.withRice = data;
        foodLists.singleDish = data; // Preloading the same list for singleDish
    });
}

function fetchFoodList(sheetName, column, callback) {
    fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getFoodList&sheetName=${sheetName}&column=${column}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                callback(data.data);
            } else {
                Swal.fire('Error', data.message || 'Failed to fetch food list.', 'error');
            }
        })
        .catch(error => {
            console.error('Error fetching food list:', error);
            Swal.fire('Error', `Failed to fetch food list: ${error.message}`, 'error');
        });
}

function clearDishIcons() {
    document.getElementById('boiledImg').classList.add('grayscale');
    document.getElementById('boiledImg').classList.remove('selected');
    document.getElementById('friedImg').classList.add('grayscale');
    document.getElementById('friedImg').classList.remove('selected');
    document.getElementById('curryImg').classList.add('grayscale');
    document.getElementById('curryImg').classList.remove('selected');
    document.getElementById('grilledImg').classList.add('grayscale');
    document.getElementById('grilledImg').classList.remove('selected');
}

function selectDishType(type, imgId) {
    clearDishIcons();
    document.getElementById(imgId).classList.remove('grayscale');
    document.getElementById(imgId).classList.add('selected');
    showDropdown(type);
}

function showDropdown(type) {
    let list;
    switch(type) {
        case 'ต้ม':
            list = foodLists.sideDish.boiled;
            break;
        case 'ผัด':
            list = foodLists.sideDish.fried;
            break;
        case 'แกง':
            list = foodLists.sideDish.curry;
            break;
        case 'นึ่ง/ปิ้ง/ย่าง':
            list = foodLists.sideDish.grilled;
            break;
    }
    populateFoodDropdown(list);
    document.getElementById('dropdownContainer').style.display = 'block';
}

function populateFoodDropdown(list) {
    const dropdown = document.getElementById('foodDropdown');
    dropdown.innerHTML = '';
    list.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
    });
}
