class TicTocTue {
  constructor() {
    this.dashboardSize = 3; // Количество ячеек (3 * 3 = 9)
    this.app = document.getElementById('tic-toc-toe'); // Стартовая точка
    this.activePlayer = 0;
    this.gameStep = 0;
    this.players = [
      {sign: 'X', score: 0},
      {sign: 'O', score: 0}
    ];
    this.gameMap = [];

    this.init();
  }

  /**
   * Получить игрока по ID
   * @param id
   */
  getPlayer(id) {
    return this.players[id];
  }

  /**
   * Плюс шаг / Обнуляем
   * @param action - plus (+1), reset (Обнуляем)
   */
  updateStep(action = 'plus') {
    if (action === 'plus') this.gameStep++;
    else this.gameStep = 0;
  }

  /**
   * Обновить счет плеера
   * @param playerID
   */
  playerScoreUpdate(playerID) {
    const player = this.getPlayer(playerID);
    player.score++
    document.getElementById(player.sign).innerHTML = player.score;
  }

  /**
   * Определяем победу
   * @returns {boolean} - да / нет
   */
  checkWinner() {
    let res = false;
    const xDirections = this.createGameMapXDirections();
    const xDirectionsReverse = this.createGameMapXDirections().reverse();

    // Проверяем вертикальное совпадение
    this.gameMap.forEach(row => {
      if (this.uniqueAllItemsInArray(row)) {
        res = true;
      }
    });

    // Проверяем горизонтальное совпадение
    this.reverseVerticalArray(this.gameMap).forEach(row => {
      if (this.uniqueAllItemsInArray(row)) {
        res = true;
      }
    });

    // Проверяем совподение X
    if (this.comparisonArrays(xDirections, this.gameMap) ||
        this.comparisonArrays(xDirectionsReverse, this.gameMap)) {
      res = true;
    }

    return res;
  }

  /**
   * Сравнение массивов по индексу заполнения
   * @param array1 - массив откуда нужно брать индексы
   * @param array2 - главный массив
   * @returns {boolean|boolean}
   */
  comparisonArrays(array1, array2) {
    const set = new Set();

    array1.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === this.activePlayer) {
          set.add(array2[rowIndex][colIndex] === this.activePlayer);
        }
      })
    });

    return set.size === 1 && set.values().next().value === true;
  }

  /**
   * Перевернуть массив
   * [[0, 1], [0, 1]] - Получет
   * [[0, 0], [1, 1]] - Результат
   * @param array - массив
   * @returns array
   */
  reverseVerticalArray(array) {
    return array.map((row, rowIndex) => row.map((col, colIndex) => array[colIndex][rowIndex]));
  }

  /**
   * Проверяем все ли значения в массиве равны this.activeSign
   * @param array - массив
   * @returns {boolean|boolean} true - все this.activeSign / false если другой скинвол
   */
  uniqueAllItemsInArray(array) {
    const set = new Set();
    array.forEach(i => set.add(i === this.activePlayer));
    return set.size === 1 && set.values().next().value === true;
  };

  /**
   * Создаем массив X для сравнения
   * [[0,0,0], [0,0,0], [0,0,0]] - Получает
   * [[1,0,0], [0,1,0], [0,0,1]] - Результат
   * @returns {[]}
   */
  createGameMapXDirections() {
    const res = [];

    for (let i = 0; i < this.dashboardSize; i++) {
      res[i] = [];
      for (let j = 0; j < this.dashboardSize; j++) {
        res[i][j] = i === j ? this.activePlayer : '-';
      }
    }

    return res;
  }

  /**
   * Создание массива для хранения состаянии игры
   */
  createGameMap() {
    for (let i = 0; i < this.dashboardSize; i++) {
      this.gameMap[i] = [];
      for (let j = 0; j < this.dashboardSize; j++) {
        this.gameMap[i].push(null);
      }
    }
  }

  /**
   * Создание интерфейс игры - UI
   */
  createGameUi() {
    const table = document.createElement('table');

    for (let i = 0; i < this.dashboardSize; i++) {
      const tr = document.createElement('tr');
      table.append(tr);

      for (let j = 0; j < this.dashboardSize; j++) {
        const td = document.createElement('td');
        const button = document.createElement('button');
        td.append(button);
        tr.append(td);
        button.setAttribute('data-row-index', String(i));
        button.setAttribute('data-index', String(j));
      }
    }

    this.app.append(table);
    this.buttons = Array.from(this.app.querySelectorAll('button'));
  }

  /**
   * При клике меняем текст на кнопках
   * @param button - кнопка на которой надо менять текст
   */
  toggleButtonText(button) {
    button.setAttribute('disabled', 'disabled');
    button.innerHTML = this.getPlayer(this.activePlayer).sign;
  }

  /**
   * Меняем игрока
   */
  toggleSign() {
    this.activePlayer = this.activePlayer === 1 ? 0 : 1;
  }

  /**
   * Обновляем ключи gameMap по индексам и пробуем определить победу
   * @param rowIndex
   * @param colIndex
   */
  updateGameMap(rowIndex, colIndex) {
    this.gameMap[rowIndex][colIndex] = this.activePlayer;
    this.updateStep();

    if (this.checkWinner()) {
      this.winResult();
    } else if (((this.dashboardSize * this.dashboardSize) === this.gameStep) && (this.checkWinner() === false)) {
      this.drawResult()
    }

    this.toggleSign();
  }

  /**
   * Победа
   */
  winResult() {
    let message = this.activePlayer === 0 ? 'Вы выиграли! :)' : 'Вы прогирали! :(';
    this.playerScoreUpdate(this.activePlayer);
    this.showGameMessage(message);
    this.refreshGame();
  }

  /**
   * Ничья
   */
  drawResult() {
    this.showGameMessage('Ничья');
    this.refreshGame();
  }

  /**
   * Письмо победителя
   */
  showGameMessage(message) {
    alert(message);
  }

  /**
   * Обновить игру
   */
  refreshGame() {
    this.createGameMap(); // обновляем карту
    this.updateStep('reset'); // обновляем количество шагов

    /**
     * Уадляем тексти дизайблед с кнопок
     */
    this.buttons.forEach(button => {
      button.innerHTML = '';
      button.removeAttribute('disabled');
    })
  }

  /**
   * Создание информационной панели
   */
  createUiGameInfo() {
    const container = document.createElement('div');
    this.app.append(container);

    this.players.forEach(player => {
      const col = document.createElement('p');

      col.innerHTML = `
            <hr />
            Игрок: <b>${player.sign}</b> </br>
            Счет: <b id="${player.sign}">${player.score}</b>  
         `;

      container.append(col);
    });
  }

  /**
   * ДЕЛО
   */
  init() {
    this.createGameUi(); // Создаем видиние игры
    this.createGameMap(); // Создание массива
    this.createUiGameInfo();

    /**
     * Клик на кнопку
     */
    this.buttons.forEach(button => {
      button.addEventListener('click', () => {
        const rowIndex = button.getAttribute('data-row-index');
        const colIndex = button.getAttribute('data-index');

        this.toggleButtonText(button); // Меняем текст
        this.updateGameMap(rowIndex, colIndex); // Обновляем ключи
      })
    });
  }
}

new TicTocTue();
