class Hashing {
  constructor(hashLength) {
    this.hashCount = hashLength; // Длина хеша
    this.ABC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.points = []; // Поинты
    this.shots = []; // Дроби

    this.createPoints();
  }

  /**
   * Создаем массив с дробями опираясь на количество хешей (this.hashCount)
   * @returns {[]}
   */
  createHashShots() {
    for (let i = 1; i <= this.hashCount; i++) {
      let number = Number('1' + [...new Array(i)].join('0'));
      this.shots.unshift({
        maxRange: number * this.ABC.length,
        shot: number
      });
    }
  }

  /**
   * Конфигурационный массив
   */
  createPoints() {
    // генерируем дроби
    this.createHashShots();

    this.points = this.shots
        .map((value, index, array) => {
          return {
            maxRange: array.slice(0, index + 1).map(i => i.maxRange).reduce((sum, current) => sum + current, 0),
            shot: value.shot
          }
        })
        .map((point, index, array) => {
          return {
            range: [
              index === 0 ? 0 : array[index - 1].maxRange,
              point.maxRange - 1
            ],
            zCount: index,
            shot: point.shot,
          };
        });
  }

  /**
   * Получаем понит по диапазону
   * @param value - от пользователя
   * @returns {*} - объект поинта в массиве {points}
   */
  getPoint(value) {
    return this.points.find(point => {
      const {range} = point;
      return value >= range[0] && value <= range[1];
    });
  }

  /**
   * Добавляем диапазоны для букв опираясь на поинт
   * @param point
   */
  proxyABC(point) {
    const {shot} = point;
    const [minRange, maxRange] = point.range;

    return this.ABC.map((letter, index, array) => {
      const step = (minRange + (shot * index));
      return {
        letter: letter,
        rage: index === array.length - 1 ? [step, maxRange] : [step, step + (shot - 1)]
      }
    });
  }

  /**
   * Получить букву по диазапону из проксированого объекта букв по значению (proxyABC)
   * @param proxyABC -
   * @param value - от пользователя
   */
  getLetterInProxyABC(proxyABC, value) {
    return proxyABC.find((letter) => value >= letter.rage[0] && value <= letter.rage[1]).letter;
  }

  /**
   * Генератор нулей
   * @param count - количество нулей
   * @param symbol - Символ
   * @returns {string}
   */
  generateSymbol(count, symbol) {
    let string = '';
    for (let i = 0; i < count; i++) {
      string += symbol;
    }
    return string;
  }

  /**
   * Показываем результат
   * @param letter - Буква
   * @param point - Поинт (для конфигурации)
   * @param value - от пользователя
   */
  printResult(letter, point, value) {
    const {zCount, shot} = point;
    let shotLength = String(shot).length - 1;
    let result = '';

    // Заполняем букву Z
    if (zCount !== 0) {
      for (let i = 0; i < zCount; i++) {
        result += this.ABC[this.ABC.length - 1];
      }
    }

    if (String(shot).length > String(value).length) {
      const length = +(this.hashCount - (String(result).length + String(letter).length + String(value).length));
      return result + letter + this.generateSymbol(length, '0') + value;
    } else {
      return result + letter + String(value).substr(String(value).length - shotLength)
    }
  }

  /**
   * ДЕЛО
   * @param value - от пользователя
   */
  convert(value) {
    if(value <= this.points[this.points.length - 1].range[1]) {
      /**
       * ДЕЛО
       * @type {*}
       */

      const point = this.getPoint(value)
      const proxyABC = this.proxyABC(point);
      const letter = this.getLetterInProxyABC(proxyABC, value);
      console.log(proxyABC)

      return this.printResult(letter, point, value);

    } else {
      /**
       * Если введенное число больше чем у нас в таблице то вывести последний результат из таблицы
       */
      return this.generateSymbol(this.hashCount, this.ABC[this.ABC.length - 1])
    }
  }
}

/**
 * UI часть
 * @type {HTMLElement}
 */
const input = document.getElementById('js-hash-input');
const print = document.getElementById('js-hash-print');

const hashing = new Hashing(5);

/**
 * Обработка формы показа хеша
 */
input.addEventListener('keyup', (e) => {
  e.preventDefault();
  const value = input.value;

  print.innerHTML = hashing.convert(value);
})
