import { Component, OnInit } from '@angular/core';

class Card {
  id: number;
  icon: string;
  state: string;

  constructor(data: any) {
    this.icon = data.icon;
    this.id = data.id;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public items: Card[] = [];
  public cardMove = 0;
  public gameOver = false;
  private countMatch = 0;
  // time vars
  public second = 0;
  public minute = 0;
  public hour = 0;
  private interval;

  ngOnInit() {
    this.initData();
  }

  public cardOpen(card: Card) {
    card.state = 'open';
    this.cardMove++;
    if (this.cardMove === 1) {
      this.startTimer();
    }
    // find match card
    let matchCard = this.items.find((el: Card) => (el.icon === card.icon && el.state === 'open' && el.id !== card.id));
    if (matchCard) {
      this.countMatch++;
      card.state += ' match';
      matchCard.state += ' match';
      if (this.countMatch === 8) {
        clearInterval(this.interval);
        this.gameOver = true;
        this.countMatch = 0;
      }
      return;
    }
    // if card is not the same
    let unMatchCard = this.items.find((el: Card) => (el.state === 'open' && el.id !== card.id));
    if (unMatchCard) {
      card.state += ' unmatch';
      unMatchCard.state += ' unmatch';
      setTimeout(() => {
        card.state = '';
        unMatchCard.state = '';
      }, 1000);
      return;
    }
  }

  public getTotalTime() {
    if (this.hour > 0) {
      return `${this.hour} hour(s) ${this.minute} mins ${this.second} secs`;
    }
    if (this.minute > 0) {
      return `${this.minute} min(s) ${this.second} secs`;
    }
    if (this.second < 60) {
      return `${this.second} secs`;
    }
  }

  /* restart Game clear all data */
  public restartGame() {
    if (this.cardMove > 0) {
      clearInterval(this.interval);
      this.gameOver = false;
      this.hour = 0;
      this.minute = 0;
      this.second = 0;
      this.cardMove = 0;
      this.items.map((el) => el.state = '');
    }
  }

  private initData() {
    let icons = ['leaf', 'bomb', 'diamond', 'cube', 'anchor', 'bicycle', 'bolt', 'plane'];
    icons = icons.concat(icons);
    icons.forEach((el, i) => this.items.push(new Card({id: i, icon: el})));
    this.shuffle(this.items);
  }

  /* shuffles cards */
  private shuffle(array: Card[]): Card[] {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  /* game timer */
  private startTimer() {
    this.interval = setInterval(() => {
      this.second++;
      if (this.second === 60) {
        this.minute++;
        this.second = 0;
      }
      if (this.minute === 60) {
        this.hour++;
        this.minute = 0;
      }
    }, 1000);
  }
}
