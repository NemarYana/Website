function getPlantIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function renderPlantDetail(plantId) {
    const plant = plantsDatabase[plantId];
    const container = document.getElementById('plantDetail');
    
    if (!plant) {
        container.innerHTML = `
            <a href="javascript:history.back()" class="back-link">← Назад</a>
            <div class="error-container">
                <h2>Растение не найдено</h2>
                <p>Проверьте правильность ссылки или&nbsp;вернитесь в каталог</p>
                <a href="./catalog.html" class="btn-main">Перейти в каталог</a>
            </div>
        `;
        return;
    }
    
    let characteristicsHtml = '';
    for (const [label, value] of Object.entries(plant.characteristics)) {
        characteristicsHtml += `
            <div class="char-item">
                <div class="char-label">${label}:</div>
                <div class="char-value">${value}</div>
            </div>
        `;
    }
    
    let careTipsHtml = '';
    plant.careTips.forEach(tip => {
        careTipsHtml += `<li>${tip}</li>`;
    });
    
    container.innerHTML = `
        <a href="javascript:history.back()" class="back-link">← Назад</a>
        
        <div class="plant-container">
            <div class="plant-image">
                <img src="${plant.image}" alt="${plant.name}">
            </div>
        
            <div class="plant-info-detailed">
                <h1>${plant.name}</h1>
                <div class="plant-description">
                    <p>${plant.fullDescription}</p>
                </div>
            
                <div class="characteristics">
                    <h3>Характеристики</h3>
                    ${characteristicsHtml}
                </div>
            
                <div class="care-tips">
                    <h3>Советы по уходу</h3>
                    <ul>
                        ${careTipsHtml}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const plantId = getPlantIdFromUrl();
    renderPlantDetail(plantId);
});