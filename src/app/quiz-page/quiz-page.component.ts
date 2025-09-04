import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Question, Option } from '../../models/common.models';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CommonModule } from '@angular/common';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzImageModule } from 'ng-zorro-antd/image';

export enum QuizStatus {
  START,
  QUIZ,
  RESULTS,
}

@Component({
  selector: 'app-quiz-page',
  imports: [
    NzRadioModule,
    ReactiveFormsModule,
    CommonModule,
    NzFlexModule,
    NzCarouselModule,
    NzDividerModule,
    NzButtonModule,
    NzImageModule,
  ],
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.css',
})
export class QuizPageComponent implements OnInit {
  form!: FormGroup;
  questions: Question[] = [];
  submitted = false;
  score = 0;
  scoreEmojis: string = ''
  status: QuizStatus = QuizStatus.START;
  quizStatus = QuizStatus;

  ngOnInit(): void {
    this.questions = this.getSampleQuestions();

    // Creazione FormGroup con id stringa
    const group: { [key: string]: FormControl } = {};
    this.questions.forEach(q => {
      group[q.id.toString()] = new FormControl(null, Validators.required);
    });
    this.form = new FormGroup(group);
  }

  getSampleQuestions(): Question[] {
    return [
      {
        id: 1,
        text: 'In Friends, durante la sfida "Nomina tutti i 50 stati degli USA", Ross non si arrende e porta di notte a Chandler la lista completa solo per scoprire che "You got ___ twice". "I know". Quale stato aveva scritto due volte Ross?',
        options: [
          { id: 11, text: 'Colorado', correct: false },
          { id: 12, text: 'Maine', correct: false },
          { id: 13, text: 'Nevada', correct: true },
          { id: 14, text: 'Ohio', correct: false },
        ],
      },
      {
        id: 2,
        text: "Quale di questi tipi di carte non compare nel nostro fantastico gioco 'It's a date!'© ?",
        options: [
          { id: 21, text: 'Veicolo', correct: false },
          { id: 22, text: 'Luogo', correct: true },
          { id: 23, text: 'Attività', correct: false },
          { id: 24, text: 'Cibo', correct: true },
        ],
      },
      {
        id: 3,
        text: 'Che modello è la vespa di Lucabba? 125...',
        options: [
          { id: 31, text: 'PK', correct: false },
          { id: 32, text: 'TS', correct: true },
          { id: 33, text: 'GT', correct: false },
          { id: 34, text: 'PH', correct: false },
        ],
      },
      {
        id: 4,
        text: "La Toyota corolla è l'auto più venduta di sempre, avendo avuto numerosi modelli e varianti durante gli anni. Quando è stato prodotto il primissimo modello di corollina?",
        options: [
          { id: 41, text: '1966', correct: true },
          { id: 42, text: '1956', correct: false },
          { id: 43, text: '1946', correct: false },
          { id: 44, text: '1936', correct: false },
        ],
      },
      {
        id: 5,
        text: "Quanto distano all'incirca via Magalotti a Siena e via Elba a Torino? (Una media tra percorso in macchina e a piedi)",
        options: [
          { id: 51, text: '350km', correct: false },
          { id: 52, text: '450km', correct: true },
          { id: 53, text: '550km', correct: false },
          { id: 54, text: '650km', correct: false },
        ],
      },
      {
        id: 6,
        text: 'Secondo l\'etimologia, cosa significherebbe il nome "Noemi"?',
        options: [
          { id: 61, text: 'Pasqua del signore', correct: false },
          { id: 62, text: 'Patatine fritte', correct: false },
          { id: 63, text: 'Amore infinito', correct: false },
          { id: 64, text: 'Mia gioia', correct: true },
        ],
      },
      {
        id: 7,
        text: 'Quale di queste parole assomiglia maggiormente alla nostra parola segreta?',
        options: [
          { id: 71, text: 'Kæøœ', correct: false },
          { id: 72, text: 'Pøä', correct: false },
          { id: 73, text: 'Sbœæ', correct: true },
          { id: 74, text: 'Æ€þð', correct: false },
        ],
      },
      {
        id: 8,
        text: 'Senza la domanda, scegli la risposta giusta',
        options: [
          { id: 81, text: 'Buongiorno dice', correct: false },
          { id: 82, text: 'Buon pomeriggio dice', correct: false },
          { id: 83, text: 'Buonasera dice', correct: false },
          { id: 84, text: 'Buonanotte dice', correct: true },
        ],
      },
      {
        id: 9,
        text: 'In "Barbie in le 12 principesse danzanti" come si chiama il ciabattino di corte innamorato di Genevieve?',
        options: [
          { id: 91, text: 'Pino', correct: false },
          { id: 92, text: 'Johnny', correct: false },
          { id: 93, text: 'Derek', correct: true },
          { id: 94, text: 'Raoul', correct: false },
        ],
      },
      {
        id: 10,
        text: 'Con quali di questi appellativi Luca (probabilmente) non si è mai riferito a Noemi?',
        options: [
          { id: 101, text: 'Avvocato', correct: false },
          { id: 102, text: 'Dottoressa', correct: false },
          { id: 103, text: 'Santo padre', correct: true },
          { id: 104, text: 'Dottor Scotti', correct: false },
        ],
      },
    ];
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = QuizStatus.RESULTS;
    this.submitted = true;
    this.score = 0;

    for (const question of this.questions) {
      const selectedOptionId = this.form.get(question.id.toString())?.value;
      const selectedOption = question.options.find(o => o.id === selectedOptionId);
      if (selectedOption?.correct) {
        this.score++;
      }
    }

    if (this.score >= 9) {
      this.scoreEmojis = '⭐⭐⭐';
    } else if (this.score >= 6) {
      this.scoreEmojis = '😍😍😍';
    } else if (this.score >= 4) {
      this.scoreEmojis = '😡😡😡';
    } else {
      this.scoreEmojis = '💀💀💀';
    }
  }

  getCorrectOption(question: Question): Option | undefined {
    return question.options.find(o => o.correct);
  }

  isCorrect(question: Question): boolean {
    const selectedOptionId = this.form.get(question.id.toString())?.value;
    const selectedOption = question.options.find(o => o.id === selectedOptionId);
    return !!selectedOption?.correct;
  }

  getResultImgSrc(): string {
    const base = 'assets/img/';
    let img = '';
    if (this.score >= 9) {
      img = 'great.png';
    } else if (this.score >= 6) {
      img = 'good.png';
    } else if (this.score >= 4) {
      img = 'bad.png';
    } else {
      img = 'sad.png';
    }
    return base + img;
  }
}
