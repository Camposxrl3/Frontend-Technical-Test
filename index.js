(() => {
    const App = (() => {
        const values = {
            pageSize: 10,
            currentPage: 1,
            data: [],
            originalData: [],

            userIdSelected: false,
            idSelected: false,
            titleSelected: false,
            completedSelected: false,

            favoritePageSize: 10,
            favoriteCurrentPage: 1,
            favoriteData: [],
            

        }
        const htmlElements = {
            form: document.querySelector('form'),
            table: document.querySelector('.data-table'),
            pagination: document.querySelector('.pagination'),

            favoriteDialog: document.querySelector('#favoriteDialog'),
            openFavoriteBtn: document.querySelector('#openFavorites'),
            closeFavoriteBtn: document.querySelector('#closeFavorite'),
            favoriteTable: document.querySelector('.favorite-data-table'),
            favoritePagination: document.querySelector('.favoritePagination'),
            
            filterDialog: document.querySelector('#filterDialog'),
            openFilterBtn: document.querySelector('#openFilters'),
            closeFilterBtn: document.querySelector('#closeFilters'),
            resetFilterBtn: document.querySelector("#reset"),
            
            selectUserId: document.querySelector("#userId"),
            selectId: document.querySelector('#id'),
            selectTitle: document.querySelector('#title'),
            selectCompleted: document.querySelector('#completed'),
            
        }

        const methods = {
            // FAVORITE MODAL METHODS
            renderFavoriteData: ({data}, start, end) => {
                let dataLength = Object.values(data).length;
                if(dataLength === 0){
                    htmlElements.favoriteTable.innerHTML = `
                    <tr>
                        <th colspan="5">No Items</td>
                    </tr>`;
                    htmlElements.favoritePagination.innerHTML = "";
                }else{
                    const totalPages = Math.ceil(dataLength / values.favoritePageSize);
                    htmlElements.favoriteTable.innerHTML = data.slice(start,end).map((d) => `
                        <tr class="even:bg-[#333] odd:bg-[#444] hover:bg-[#555] transition">
                            <td class="p-2 border-2 border-sky-700">${d.userId}</td>
                            <td class="p-2 border-2 border-sky-700">${d.id}</td>
                            <td class="p-2 border-2 border-sky-700">${d.title}</td>
                            <td class="p-2 border-2 border-sky-700">${d.completed}</td>
                            <td class="p-2 border-2 border-sky-700">
                                <button class="px-3 py-1 bg-[#2c6f92] rounded hover:bg-yellow-600">X</button>
                            </td>
                        </tr>
                    `).join("");
                    
                    methods.renderFavoritePagination(totalPages);
                }
            },
            renderFavoritePagination: (totalPages) => {
                htmlElements.favoritePagination.innerHTML = Array.from(
                    {length: totalPages}, 
                    (_, i) => {
                        const page = i + 1;
                        const isActive = page === values.favoriteCurrentPage;
                        return `
                            <button
                                data-page="${page}"
                                class="px-3 py-1 rounded transition
                                ${isActive 
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-[#2c6f92] hover:bg-yellow-600'}">
                                ${page}
                            </button>
                        `;
                    }).join("");
            },
            deleteFromFavorites: function() {
                const row = this.closest('tr');
                const cells = row.querySelectorAll('td');
                const data = Array.from(cells).map(cell => cell.textContent);
                const getStorage = JSON.parse(localStorage.getItem("favorites"));
                const item = getStorage.findIndex(storage => storage.id == data [1]);
                getStorage.splice(item, 1);
                localStorage.setItem("favorites", JSON.stringify(getStorage));
                handlers.loadFavoriteModal();
            },
            // HOME PAGE METHODS
            fetchData: async () => {
                const response = await fetch("https://jsonplaceholder.typicode.com/todos");
                const data = await response.json();
                return data;
            },
            renderData: ({data}, start, end) => {
                let dataLength = Object.values(data).length;
                if(dataLength === 0){
                    htmlElements.table.innerHTML = `
                    <tr>
                        <th colspan="5">No Items</td>
                    </tr>`;
                    htmlElements.pagination.innerHTML = "";
                }else{
                    const totalPages = dataLength / values.pageSize;
                    htmlElements.table.innerHTML = data.slice(start,end).map((d) => `
                        <tr class="even:bg-[#333] odd:bg-[#444] hover:bg-[#555] transition">
                            <td class="p-2 border-2 border-sky-700">${d.userId}</td>
                            <td class="p-2 border-2 border-sky-700">${d.id}</td>
                            <td class="p-2 border-2 border-sky-700">${d.title}</td>
                            <td class="p-2 border-2 border-sky-700">${d.completed? "Yes" : "No"}</td>
                            <td class="p-2 border-2 border-sky-700">
                                <button class="px-3 py-1 bg-[#2c6f92] rounded hover:bg-yellow-600">Add</button>
                            </td>
                        </tr>
                    `).join("");
                    
                    methods.renderPagination(totalPages);
                }
            },
            renderPagination: (totalPages) => {
                htmlElements.pagination.innerHTML = Array.from(
                    {length: totalPages}, 
                    (_, i) => {
                        const page = i + 1;
                        const isActive = page === values.currentPage;
                        return `
                            <button
                                data-page="${page}"
                                class="px-3 py-1 rounded transition
                                ${isActive 
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-[#2c6f92] hover:bg-yellow-600'}">
                                ${page}
                            </button>
                        `;
                    }).join("");
            },
            renderSelectOptions: () => {
                if(!values.userIdSelected){
                    console.log(values.data);
                    const uniqueUserIds = [...new Set(values.originalData.map(d => d.userId))];
                    htmlElements.selectUserId.innerHTML = `<option class="text-gray-500" value="select">- Select an option -</option>` 
                    + uniqueUserIds
                        .map(userId => `<option value="${userId}">${userId}</option>`)
                        .join("");
                }
                if(!values.idSelected && values.userIdSelected){
                    const uniqueIds = [...new Set(values.data.map(d => d.id))];
                    htmlElements.selectId.innerHTML = `<option value="select">- Select an option -</option>` 
                    + uniqueIds
                        .map(id => `<option value="${id}">${id}</option>`)
                        .join("");
                }
                else{
                    htmlElements.selectId.innerHTML = "";
                }
                if(!values.titleSelected && values.userIdSelected){
                    const uniquetitles = [...new Set(values.data.map(d => d.title))];
                    htmlElements.selectTitle.innerHTML = `<option value="select">- Select an option -</option>`
                    + uniquetitles
                        .map(title => `<option value="${title}">${title}</option>`)
                        .join("");
                }else{
                    htmlElements.selectTitle.innerHTML = "";
                }
                if(!values.completedSelected && values.userIdSelected){
                    const uniqueCompleted = [...new Set(values.originalData.map(d => d.completed? "Yes" : "No"))];
                    htmlElements.selectCompleted.innerHTML = `<option value="select">- Select an option -</option>`
                    + uniqueCompleted
                    .map(completed => `<option value="${completed}">${completed}</option>`)
                    .join("");
                }
                else{
                    htmlElements.selectCompleted.innerHTML = "";
                }
                
            },
            searchItems: (items, value) => {
                const filteredItems = items.filter(item =>
                    item.title.toLowerCase().includes(value) ||
                    item.userId.toString().includes(value) ||
                    item.id.toString().includes(value) ||
                    item.completed.toString().toLowerCase().includes(value)
                );
                return filteredItems;
            },

            // FILTER MODAL METHODS
            filterUserId: (items, value) => {
                if(value !== "select"){
                    const filteredData = items.filter(item => item.userId.toString() === value);
                    values.userIdSelected = true;
                    return filteredData;
                }else{
                    return items;
                }
                
            },
            filterId: (items, value) => {
                const filteredData = items.filter(item => item.id.toString() === value);
                values.idSelected = true;
                return filteredData;
            },
            filterTitle: (items, value) => {
                const filteredData = items.filter(item => item.title.toString() === value);
                values.titleSelected = true;
                return filteredData;
            },
            filterCompleted: (items, value) => {
                const filteredData = items.filter(item => item.completed == true? "Yes" == value.toString(): "No" == value.toString()); 
                values.completedSelected = true; 
                return filteredData;
            },
            resetValues: () => {
                values.userIdSelected = false;
                values.idSelected = false;
                values.titleSelected = false;
                values.completedSelected = false;
            },
            addToFavorites: function() {
                const row = this.closest('tr');
                const userId = row.cells[0].textContent;
                const id = row.cells[1].textContent;
                const title = row.cells[2].textContent;
                const completed = row.cells[3].textContent;

                const favData = { userId, id, title, completed };

                const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
                const alreadyExists = storedFavorites.some(item => item.id === id);
                if (alreadyExists) {
                    alert("This item is already in favorites");
                    return;
                }
                storedFavorites.push(favData);
                localStorage.setItem("favorites", JSON.stringify(storedFavorites));
                alert("Data added to favorites");
            }
        }

        const handlers = {
            // FAVORITE MODAL HANDLERS
            loadFavoriteModal: async () => {
                values.favoriteData = JSON.parse(localStorage.getItem("favorites")) || [];
                values.favoriteCurrentPage = 1;
                const data = values.favoriteData;
                methods.renderFavoriteData({data}, 0, values.favoritePageSize);
            },
            favoritePaginationEvent: () => {
                htmlElements.favoritePagination.addEventListener('click', async (e) => {
                    const pageSelected = Number(e.target.textContent);
                    values.favoriteCurrentPage = pageSelected
                    const end = pageSelected * values.favoritePageSize;
                    const start = end - values.favoritePageSize;
                    const data = values.favoriteData;
                    methods.renderFavoriteData({data}, start, end);
                });
            },
            favoriteTableButton: (e) => {
                const tagName = e.target.tagName.toLowerCase();
                if(tagName === 'button'){
                    methods.deleteFromFavorites.call(e.target);
                }
            },

            // HOME PAGE HANDLERS
            loadPage: async () => {
                const allData = await methods.fetchData();
                values.originalData = allData;
                values.data = allData
                values.currentPage = 1;
                const data = values.data;
                methods.renderData({data}, 0, values.pageSize);
            },
            paginationEvent: () => {
                htmlElements.pagination.addEventListener('click', async (e) => {
                    const pageSelected = Number(e.target.textContent);
                    values.currentPage = pageSelected;
                    const end = pageSelected * values.pageSize;
                    const start = end - values.pageSize;
                    const data = values.data;
                    methods.renderData({data}, start, end);
                });
            },
            search: async (e) => {
                e.preventDefault();
                const value = htmlElements.form.searchBar.value;
                values.data = methods.searchItems(values.originalData, value);
                const data = values.data;
                methods.renderData({data}, 0, values.pageSize);
            },
            tableButton: (e) => {
                const tagName = e.target.tagName.toLowerCase();
                if(tagName === 'button'){
                    methods.addToFavorites.call(e.target);
                }
            },
            
            // FILTER SELECT HANDLERS
            selectedUserId: async (e) => {
                values.idSelected = false;
                values.titleSelected = false;
                values.completedSelected = false;
                const userIdSelectedValue = e.target.value;
                if(userIdSelectedValue != "select"){
                    values.data = methods.filterUserId(values.originalData, userIdSelectedValue);
                    const dataUserId = values.data;
                    methods.renderData({data: dataUserId}, 0, values.pageSize);
                    methods.renderSelectOptions();
                }
                else{
                    methods.resetValues();
                    handlers.loadPage();
                }
            },
            selectedId: async (e) => {
                const idSelectedValue = e.target.value;
                if(idSelectedValue != "select"){
                    values.data = methods.filterId(values.originalData, idSelectedValue);
                    const dataId = values.data;
                    methods.renderData({data: dataId}, 0, values.pageSize);
                }
                else{
                    methods.resetValues();
                    handlers.loadPage();
                }
            },
            selectedTitle: async (e) => {
                const titleSelectedValue = e.target.value;
                if(titleSelectedValue != "select"){
                    values.data = methods.filterTitle(values.originalData, titleSelectedValue);
                    const dataTitle = values.data;
                    methods.renderData({data: dataTitle}, 0, values.pageSize);
                }
                else{
                    methods.resetValues();
                    handlers.loadPage(); 
                }
            },
            selectedCompleted: async (e) => {
                const completedSelectedValue = e.target.value;
                if(completedSelectedValue != "select"){
                    values.data = methods.filterCompleted(values.originalData, completedSelectedValue);
                    const dataCompleted = values.data;
                    methods.renderData({data: dataCompleted}, 0, values.pageSize);
                }
                else{
                    methods.resetValues();
                    handlers.loadPage();
                }
            },

            // FAVORITE MODAL HANDLERS
            openFavorite: () => {
                handlers.loadFavoriteModal();
                handlers.favoritePaginationEvent();
                htmlElements.favoriteDialog.classList.remove("hidden");
                htmlElements.favoriteDialog.classList.add("flex");
            },
            closeFavorite: () => {
                htmlElements.favoriteDialog.classList.add("hidden");
                htmlElements.favoriteDialog.classList.remove("flex");
            },
            closeFavoriteDialog: (e) => {
                if(e.target === htmlElements.favoriteDialog) {
                    htmlElements.favoriteDialog.classList.add("hidden");
                    htmlElements.favoriteDialog.classList.remove("flex");
                }
            },
            
            // FILTER MODAL HANDLERS
            openFilter: () => {
                handlers.resetFilter();
                methods.renderSelectOptions();
                htmlElements.filterDialog.classList.remove("hidden");
                htmlElements.filterDialog.classList.add("flex");
            },
            closeFilter: () => {
                htmlElements.filterDialog.classList.add("hidden");
                htmlElements.filterDialog.classList.remove("flex");
            },
            closeFilterDialog: (e) => {
                if(e.target === htmlElements.filterDialog) {
                    htmlElements.filterDialog.classList.add("hidden");
                    htmlElements.filterDialog.classList.remove("flex");
                }
            },
            resetFilter: () => {
                methods.resetValues();
                values.data = [...values.originalData]
                handlers.loadPage();
            }
        };

        return {
            init: () => {
                // HOME INIT
                handlers.loadPage();
                handlers.paginationEvent();
                htmlElements.form.addEventListener('click', handlers.search);
                htmlElements.table.addEventListener('click', handlers.tableButton);

                htmlElements.openFilterBtn.addEventListener('click', handlers.openFilter);
                htmlElements.closeFilterBtn.addEventListener('click', handlers.closeFilter);
                htmlElements.resetFilterBtn.addEventListener('click', handlers.resetFilter);
                htmlElements.filterDialog.addEventListener('click', handlers.closeFilterDialog);
                htmlElements.favoriteTable.addEventListener('click', handlers.favoriteTableButton);
                
                htmlElements.openFavoriteBtn.addEventListener('click', handlers.openFavorite);
                htmlElements.closeFavoriteBtn.addEventListener('click', handlers.closeFavorite);
                htmlElements.favoriteDialog.addEventListener('click', handlers.closeFavoriteDialog);

                htmlElements.selectUserId.addEventListener('change', handlers.selectedUserId);
                htmlElements.selectId.addEventListener('change', handlers.selectedId);
                htmlElements.selectTitle.addEventListener('change', handlers.selectedTitle);
                htmlElements.selectCompleted.addEventListener('change', handlers.selectedCompleted);

            }
        }
    })();
    App.init();
})();