import { Component, OnInit } from '@angular/core';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzAlign, NzFlexModule, NzJustify } from 'ng-zorro-antd/flex';
import { NgForOf, CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { SupabaseService } from '../../services/supabase.service';

export type TrisCell = {
  index: number;
  touched: boolean;
  owner?: 'N' | 'L';
  winner?: boolean;
};

export enum GameStatusDictionary {
  START = 0,
  PLAYING = 1,
  WON = 2,
}

@Component({
  selector: 'app-tris-page',
  imports: [NzSplitterModule, NzFlexModule, CommonModule, NzButtonModule, NzTypographyModule],
  templateUrl: './tris-page.component.html',
  styleUrl: './tris-page.component.css',
})
export class TrisPageComponent implements OnInit {
  matrix: TrisCell[][] = [];
  currentGameStatus: GameStatusDictionary = GameStatusDictionary.START;
  noemiTurn: boolean = false;
  currentTitle: string = 'Scegliete chi inizia a giocare!';

  gameStatusDictionary = GameStatusDictionary;

  movies: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.initMatrix();
  }

  startGame(noemiTrun: boolean) {
    this.noemiTurn = noemiTrun;
    this.noemiTurn ? (this.currentTitle = 'Tocca a Noemi!') : (this.currentTitle = 'Tocca a Luca!');
    this.currentGameStatus = GameStatusDictionary.PLAYING;
  }

  resetGame() {
    this.initMatrix();
    this.noemiTurn = false;
    this.currentGameStatus = GameStatusDictionary.START;
    this.currentTitle = 'Scegliete chi inizia a giocare!';
  }

  boxClicked(row: number, col: number) {
    const clickedBox = this.matrix[row][col];
    if (this.currentGameStatus === GameStatusDictionary.PLAYING && !clickedBox.touched) {
      clickedBox.touched = true;
      clickedBox.owner = this.noemiTurn ? 'N' : 'L';
      this.noemiTurn = !this.noemiTurn;
      this.currentTitle = this.noemiTurn ? 'Tocca a Noemi!' : 'Tocca a Luca!';
    }

    if (this.checkWin('N')) {
      this.currentGameStatus = GameStatusDictionary.WON;
      this.currentTitle = 'NOEMI HA VINTO!!!';
    } else if (this.checkWin('L')) {
      this.currentGameStatus = GameStatusDictionary.WON;
      this.currentTitle = 'LUCA HA VINTO!!!';
    } else if (this.checkDraw()) {
      this.currentGameStatus = GameStatusDictionary.WON;
      this.currentTitle = 'Pareggio...lurdi...';
    }
  }

  checkWin(owner: 'N' | 'L'): boolean {
    const m = this.matrix;

    // Controlla righe
    for (let i = 0; i < 3; i++) {
      if (m[i][0].owner === owner && m[i][1].owner === owner && m[i][2].owner === owner) {
        m[i][0].winner = true;
        m[i][1].winner = true;
        m[i][2].winner = true;
        return true;
      }
    }

    // Controlla colonne
    for (let j = 0; j < 3; j++) {
      if (m[0][j].owner === owner && m[1][j].owner === owner && m[2][j].owner === owner) {
        m[0][j].winner = true;
        m[1][j].winner = true;
        m[2][j].winner = true;
        return true;
      }
    }

    // Diagonale principale
    if (m[0][0].owner === owner && m[1][1].owner === owner && m[2][2].owner === owner) {
      m[0][0].winner = true;
      m[1][1].winner = true;
      m[2][2].winner = true;
      return true;
    }

    // Diagonale secondaria
    if (m[0][2].owner === owner && m[1][1].owner === owner && m[2][0].owner === owner) {
      m[0][2].winner = true;
      m[1][1].winner = true;
      m[2][0].winner = true;
      return true;
    }

    return false;
  }

  checkDraw() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!this.matrix[i][j].touched) {
          return false;
        }
      }
    }
    return true;
  }

  initMatrix() {
    this.matrix = [];
    let current = 0;
    for (let i = 0; i < 3; i++) {
      const row: TrisCell[] = [];

      for (let j = 0; j < 3; j++) {
        row.push({
          index: current,
          touched: false,
          owner: undefined,
          winner: undefined,
        });
        current++;
      }

      this.matrix.push(row);
    }
  }
}
