document.addEventListener('DOMContentLoaded', function() {
    preloadFoodLists();
});

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

function showDishOptions() {
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('dishOptionsSection').style.display = 'block';
}

function showSingleDishOptions() {
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('singleDishOptionsSection').style.display = 'block';
    populateFoodDropdown(foodLists.singleDish, 'foodDropdownSingleDish');
}

function backToMain() {
    document.getElementById('dishOptionsSection').style.display = 'none';
    document.getElementById('singleDishOptionsSection').style.display = 'none';
    document.getElementById('inputSection').style.display = 'block';
}

function preloadFoodLists() {
    let promises = [];
    promises.push(fetchFoodList('SideDish', 'A', (data) => { foodLists.sideDish.boiled = data; }));
    promises.push(fetchFoodList('SideDish', 'B', (data) => { foodLists.sideDish.fried = data; }));
    promises.push(fetchFoodList('SideDish', 'C', (data) => { foodLists.sideDish.curry = data; }));
    promises.push(fetchFoodList('SideDish', 'D', (data) => { foodLists.sideDish.grilled = data; }));
    promises.push(fetchFoodList('OverRice', 'A', (data) => { foodLists.singleDish = data;}));

    Promise.all(promises).then(() => {
        console.log('Single Dish List:', foodLists.singleDish);
    }).catch(error => {
        console.error('Error loading food lists:', error);
    });
}

function fetchFoodList(sheetName, column, callback) {
    return fetch(`https://script.google.com/macros/s/AKfycbz5i0Xp6HXqm9gmnraGzkgFoQOLY2ub6qEthUOFRn7yoLabUd3vkfl2VimiEqar_W8/exec?action=getFoodList&sheetName=${sheetName}&column=${column}`)
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
    populateFoodDropdown(list, 'foodDropdown');
    document.getElementById('dropdownContainer').style.display = 'block';
}

function populateFoodDropdown(list, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
        console.error('Dropdown element not found');
        return;
    }
    dropdown.innerHTML = '';
    list.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
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
