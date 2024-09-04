import chalk from 'chalk';
import readlineSync from 'readline-sync';

class LogClass {
  static #logs = [];
  static push(value) {
    this.#logs.push(value);
  }
  static printLog() {
    this.#logs.forEach((log) => {
      this.print(log);
    });
  }
  static logClear() {
    this.#logs = [];
  }
  static print(value) {
    console.log(value);
  }
  static stdOutWrite(value) {
    process.stdout.write(value);
  }
  static reLog(stage, player, monster) {
    console.clear();
    displayStatus(stage, player, monster);
    LogClass.printLog();
  }
}

class Monster {
  constructor(hp, minDamage, maxDamage) {
    this._hp = hp;
    this._minDamage = minDamage;
    this._maxDamage = maxDamage;
  }

  set hp(value) {
    this._hp = value;
  }

  get hp() {
    return this._hp;
  }

  set minDamage(value) {
    this._minDamage = value;
  }

  get minDamage() {
    return this._minDamage;
  }

  set maxDamage(value) {
    this._maxDamage = value;
  }

  get maxDamage() {
    return this._maxDamage;
  }

  attack(turn, enemy) {
    const damage = this.makeDamage();
    enemy.hp -= damage;

    const isPlayer = enemy instanceof Player;
    const logMessage = isPlayer
      ? chalk.red(`[${turn}] ${damage} 피해를 봤습니다.`)
      : chalk.blue(`[${turn}] 몬스터에게 ${damage} 피해를 입혔습니다`);

    LogClass.push(`${logMessage}`);
    this.printEnemyHP(turn, enemy);
  }

  makeDamage() {
    return Math.floor(Math.random() * (this._maxDamage - this._minDamage + 1)) + this._minDamage;
  }

  printEnemyHP(turn, enemy) {
    const isPlayer = enemy instanceof Player;
    const hpMessage = isPlayer
      ? chalk.red(`[${turn}] 체력이 ${enemy.hp} 남았습니다\n`)
      : chalk.blue(`[${turn}] 몬스터의 체력이 ${enemy.hp} 남았습니다\n`);
    LogClass.push(hpMessage);
  }
  elementUpgrade(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  upgradeMinMaxDamage(min, max) {
    let minAdd, maxAdd;

    do {
      minAdd = this.elementUpgrade(min, max);
      maxAdd = this.elementUpgrade(min, max);
    } while (minAdd + this.minDamage >= maxAdd + this.maxDamage);

    return [minAdd, maxAdd];
  }

  upgrade(minAddHp, maxAddHp, minAddDamage, maxAddDamage) {
    this.hp += this.elementUpgrade(minAddHp, maxAddHp);
    const temp = this.upgradeMinMaxDamage(minAddDamage, maxAddDamage);
    this.minDamage += temp[0];
    this.maxDamage += temp[1];
  }
}

class Player extends Monster {
  #doubleAttackProbability; // 2번 공격할 확률
  #defenseProbability; // 방어할 확률
  #revengeProbability; // 방어했을 때 반격할 확률
  #runAwayProbability; // 도망갈 확률
  constructor(
    hp,
    minDamage,
    maxDamage,
    doubleAttackProbability,
    defenseProbability,
    revengeProbability,
    runAwayProbability,
  ) {
    super(hp, minDamage, maxDamage);
    this.#doubleAttackProbability = doubleAttackProbability;
    this.#defenseProbability = defenseProbability;
    this.#revengeProbability = revengeProbability;
    this.#runAwayProbability = runAwayProbability;
  }

  set doubleAttackProbability(doubleAttackProbability) {
    this.#doubleAttackProbability = doubleAttackProbability;
  }

  get doubleAttackProbability() {
    return this.#doubleAttackProbability;
  }

  set defenseProbability(defenseProbability) {
    this.#defenseProbability = defenseProbability;
  }

  get defenseProbability() {
    return this.#defenseProbability;
  }

  set revengeProbability(revengeProbability) {
    this.#revengeProbability = revengeProbability;
  }

  get revengeProbability() {
    return this.#revengeProbability;
  }

  set runAwayProbability(runAwayProbability) {
    this.#runAwayProbability = runAwayProbability;
  }

  get runAwayProbability() {
    return this.#runAwayProbability;
  }

  doubleAttack(turn, enemy) {
    if (this.#Gambling(this.#doubleAttackProbability)) {
      LogClass.push(chalk.yellow(`\n[${turn}] 연속 공격을 성공했습니다!!\n`));
      this.attack(turn, enemy);
      this.attack(turn, enemy);
    } else {
      LogClass.push(chalk.yellow(`\n[${turn}] 연속 공격을 실패했습니다...\n`));
    }
  }

  defense(turn, enemy) {
    if (this.#Gambling(this.#defenseProbability)) {
      if (this.#Gambling(this.revengeProbability)) {
        LogClass.push(chalk.yellow(`\n[${turn}] 방어와 반격에 성공했습니다!!\n`));
        this.attack(turn, enemy);
      } else LogClass.push(chalk.yellow(`\n[${turn}] 방어에 성공했습니다!!\n`));
      return true;
    } else {
      LogClass.push(chalk.yellow(`\n[${turn}] 방어에 실패했습니다...\n`));
      return false;
    }
  }

  runAway(turn) {
    const check = this.#Gambling(this.#runAwayProbability);
    let temp = chalk.blue(`\n[${turn}] 도망을 시도했습니다\n`);
    LogClass.push(temp);
    temp = check ? `도망쳤습니다!!\n` : `실패했습니다...\n`;
    LogClass.push(chalk.yellow(`[${turn}] ${temp}`));
    return check;
  }

  #Gambling(probability) {
    return Math.floor(Math.random() * 100) < probability;
  }

  upgrade(minAddDamage, maxAddDamage) {
    const addDamage = this.upgradeMinMaxDamage(minAddDamage, maxAddDamage);
    this.minDamage += addDamage[0];
    this.maxDamage += addDamage[1];
    LogClass.print(chalk.cyan(`최소 공격력이 ${addDamage[0]} 증가 했습니다!!\n`));
    LogClass.print(chalk.cyan(`최대 공격력이 ${addDamage[1]} 증가 했습니다!!\n`));

    // 현재 증가 범위 수치가 하드 코딩 상태라
    // 라운드를 더 늘릴 경우 최소 ~ 최대 증가 값을
    // 변경해야 합니다.
    const upgradeOptions = [
      { range: [3, 7], prop: `doubleAttackProbability`, message: '연속 공격 성공 확률이' },
      { range: [3, 10], prop: `defenseProbability`, message: '방어 성공 확률이' },
      { range: [3, 5], prop: `revengeProbability`, message: '반격 성공 확률이' },
      { range: [1, 3], prop: `runAwayProbability`, message: '도망 성공 확률이' },
    ];

    const statetoUpgrade = upgradeOptions[Math.floor(Math.random() * upgradeOptions.length)];
    const temp = this.elementUpgrade(...statetoUpgrade.range);
    this[statetoUpgrade.prop] += temp;

    LogClass.print(chalk.cyan(`${statetoUpgrade.message} ${temp} 증가 했습니다!!\n`));
  }
}

const MakeLog = (turn, action) => {
  LogClass.push(chalk.blue(`[${turn}] ${action} 선택했습니다`));
};

const moveNextRound = () => {
  readlineSync.question(chalk.bgBlue('Please [Enter] key push'));
};

const displayPlayerStatus = (player) => {
  LogClass.print(chalk.magentaBright(`\n=== Current Status ===`));
  LogClass.print(
    chalk.blueBright(
      `|\n  Player HP : ${player.hp}\n  공격력 : ${player.minDamage} - ${player.maxDamage}\n  연속 공격 확률 : ${player.doubleAttackProbability}%\n  방어 확률 : ${player.defenseProbability}%\n  (반격 확률 : ${player.revengeProbability}%)\n  도망 확률 : ${player.runAwayProbability}%\n|\n`,
    ),
  );
  LogClass.print(chalk.magentaBright(`=====================\n`));
};

const roundClear = (stage, maxStage, player, monster) => {
  if (monster.hp <= 0) {
    LogClass.reLog(stage, player, monster);
    LogClass.print(chalk.yellow(`\n몬스터를 처치했습니다!!\n`));
    if (stage < maxStage) {
      player.upgrade(3, 7);
      displayPlayerStatus(player);
    }
    moveNextRound();
    return true;
  }
};

const displayStatus = (stage, player, monster) => {
  LogClass.print(chalk.magentaBright(`\n=== Current Status ===`));
  LogClass.print(
    chalk.cyanBright(`| Stage: ${stage} |\n`) +
      chalk.blueBright(
        `|\n  Player HP : ${player.hp}\n  공격력 : ${player.minDamage} - ${player.maxDamage}\n  연속 공격 확률 : ${player.doubleAttackProbability}%\n  방어 확률 : ${player.defenseProbability}%\n  (반격 확률 : ${player.revengeProbability}%)\n  도망 확률 : ${player.runAwayProbability}%\n|\n`,
      ) +
      chalk.redBright(
        `| Monster HP : ${monster.hp}, 공격력 : ${monster._minDamage} - ${monster.maxDamage} |`,
      ),
  );
  LogClass.print(chalk.magentaBright(`=====================\n`));
};

const battle = async (stage, maxStage, player, monster) => {
  let turn = 1;
  while (player.hp > 0) {
    LogClass.reLog(stage, player, monster);

    LogClass.print(
      chalk.green(
        `1. 공격 2. 연속 공격 (${player.doubleAttackProbability}%) 3. 방어 (${player.defenseProbability}%)(반격 : ${player.revengeProbability}%) 4. 도망 (${player.runAwayProbability}%)`,
      ),
    );
    const choice = readlineSync.question('선택 : ');

    switch (choice) {
      case '1':
        MakeLog(turn, '공격을');
        player.attack(turn, monster);
        break;
      case '2':
        MakeLog(turn, '연속 공격을');
        player.doubleAttack(turn, monster);
        break;
      case '3':
        MakeLog(turn, '방어를');
        const defenseSuccess = player.defense(turn, monster);
        if (roundClear(stage, maxStage, player, monster)) return true;
        else if (defenseSuccess) {
          turn++;
          continue;
        }
        break;
      case '4':
        if (player.runAway(turn++)) {
          LogClass.reLog(stage, player, monster);
          moveNextRound();
          return true;
        } else turn--;
        break;
      default:
        continue;
    }
    if (roundClear(stage, maxStage, player, monster)) {
      return true;
    }
    monster.attack(turn, player);
    LogClass.reLog(stage, player, monster);
    turn++;
  }
  return false;
};

export async function startGame() {
  console.clear();
  const player = new Player(50, 3, 7, 40, 50, 33, 10);
  //HP, 최소 공격력, 최대 공격력, 연속공격 성공률
  //방어 성공률, 반격 성공률, 도망 성공률
  //순서 입니다
  let stage = 1;
  let maxStage = 10;
  const monster = new Monster(20, 5, 10);
  while (stage <= maxStage) {
    let result = await battle(stage, maxStage, player, monster);
    LogClass.logClear();
    // 스테이지 클리어 및 게임 종료 조건
    if (result) {
      player.hp += 50;
      LogClass.push(chalk.bgBlue(`체력을 50 회복했습니다\n`));
      monster.hp = (stage + 1) * 20;
      monster.upgrade(5, 10, 3, 7);
    } else {
      LogClass.print(chalk.bgRed(`\n패배했습니다...\n`));
      return;
    }
    stage++;
  }
  LogClass.print(chalk.yellowBright(`\n승리했습니다!!\n`));
}
