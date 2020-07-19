//функция, фильтрующая значения из массива values по типу type
const filterByType = (type, ...values) => values.filter(value => typeof value === type),
	//функция, которая прячет все блоки с ответами
	hideAllResponseBlocks = () => {
		//находим все блоки с ответами по их селектору
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		//и отключаем их отображение с помощью css свойства display
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},
	//функция для отображения блока с ответом
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		hideAllResponseBlocks(); //прячем все блоки с ответом
		//показываем нужный блок, найденный по селектору, задав его css свойству display значение block
		document.querySelector(blockSelector).style.display = 'block'; 
		if (spanSelector) {  //если передан блок сообщения
			//то выводим в него сообщение 
			document.querySelector(spanSelector).textContent = msgText;  
		}
	},
	//функция для вывода ошибки
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),
	//функция для вывода результата
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),
	//функция для вывода сообщения о том, что результата пока нет
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),
	//функция, запускающая фильтрацию значений values по типу type
	tryFilterByType = (type, values) => {
		try { //начинаем отслеживание ошибки
			//запускаем функцию, фильтрующую значения, которые объединяем в одну строку через запятую
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			//если массив с отфильтрованными значениями не пуст, то формируем сообщение с результатом
			const alertMsg = (valuesArray.length) ?
				`Данные с типом ${type}: ${valuesArray}` :
				`Отсутствуют данные типа ${type}`;
			//выводим результат
			showResults(alertMsg);
		} catch (e) {  //перехватываем ошибку
			showError(`Ошибка: ${e}`);  //выводим ошибку
		}
	};

const filterButton = document.querySelector('#filter-btn'); //нашли кнопку
//вешаем на кнопку событие
filterButton.addEventListener('click', e => { 
	const typeInput = document.querySelector('#type'); //нашли поле с типом
	const dataInput = document.querySelector('#data'); //нашли поле с данными

	if (dataInput.value === '') { //если поле с данными пустое,
		dataInput.setCustomValidity('Поле не должно быть пустым!'); //то ссобщаем об этом строкой ошибки
		showNoResults(); //показываем, что результата нет
	} else { //в противном случае
		dataInput.setCustomValidity(''); //очищаем строку ошибки
		e.preventDefault(); //предотвращаем стандартное действие
		//фильтруем данные по типу из поля dataInput по выбранному типу
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim()); 
	}
});

