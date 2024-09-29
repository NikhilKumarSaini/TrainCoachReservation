import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-train-reservation',
  template: `
    <div class="container">
      <h1>Train Seat Reservation System</h1>
      <div class="reservation-form">
        <label for="seatCount">Number of seats:</label>
        <input id="seatCount" type="number" [(ngModel)]="seatCount" min="1" max="7">
        <button (click)="reserveSeats()">Reserve Seats</button>
      </div>
      <div *ngIf="reservedSeats.length > 0" class="reservation-info">
        <h3>Your Reservation:</h3>
        <p>Seats: {{ reservedSeats.join(', ') }}</p>
      </div>
      <div class="coach-container">
        <h2>Coach Layout</h2>
        <div class="coach">
          <div *ngFor="let row of seatLayout; let i = index" class="row">
            <div *ngFor="let seat of row; let j = index" 
                 class="seat" 
                 [ngClass]="{'reserved': seat === 1, 'available': seat === 0}">
              {{ getSeatNumber(i, j) }}
            </div>
          </div>
        </div>
      </div>
      <div class="legend">
        <div class="legend-item">
          <div class="seat-sample available"></div>
          <span>Available</span>
        </div>
        <div class="legend-item">
          <div class="seat-sample reserved"></div>
          <span>Reserved</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h1, h2 {
      color: #333;
      text-align: center;
    }
    .reservation-form {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
    }
    label {
      margin-right: 10px;
    }
    input {
      width: 50px;
      padding: 5px;
      margin-right: 10px;
    }
    button {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    button:hover {
      background-color: #45a049;
    }
    .reservation-info {
      background-color: #e7f3fe;
      border: 1px solid #b2d4ff;
      border-radius: 5px;
      padding: 10px;
      margin-bottom: 20px;
    }
    .coach-container {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .coach {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .row {
      display: flex;
      margin-bottom: 5px;
    }
    .seat {
      width: 40px;
      height: 40px;
      margin: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .seat:hover {
      transform: scale(1.1);
    }
    .available {
      background-color: #90EE90;
      border: 1px solid #45a049;
    }
    .reserved {
      background-color: #FF6347;
      color: white;
      border: 1px solid #d32f2f;
    }
    .legend {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      margin: 0 10px;
    }
    .seat-sample {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      border-radius: 3px;
    }
  `]
})
export class TrainReservationComponent implements OnInit {
  seatLayout: number[][] = [];
  seatCount: number = 1;
  reservedSeats: number[] = [];
  totalRows: number = 12;
  seatsPerRow: number = 7;

  ngOnInit() {
    this.initializeSeatLayout();
  }

  initializeSeatLayout() {
    for (let i = 0; i < this.totalRows; i++) {
      this.seatLayout.push(new Array(i === this.totalRows - 1 ? 3 : this.seatsPerRow).fill(0));
    }
    // Pre-book some seats for demonstration
    this.seatLayout[2][3] = 1;
    this.seatLayout[2][4] = 1;
    this.seatLayout[5][1] = 1;
    this.seatLayout[8][5] = 1;
    this.seatLayout[8][6] = 1;
  }

  reserveSeats() {
    if (this.seatCount < 1 || this.seatCount > 7) {
      alert('Please enter a number between 1 and 7');
      return;
    }

    const seats = this.findSeats(this.seatCount);
    if (seats.length === 0) {
      alert('Sorry, no suitable seats available');
      return;
    }

    this.reservedSeats = seats;
    this.updateSeatLayout(seats);
  }

  findSeats(count: number): number[] {
    // Try to find seats in one row
    for (let i = 0; i < this.totalRows; i++) {
      const availableSeats = this.findConsecutiveSeats(this.seatLayout[i], count);
      if (availableSeats.length === count) {
        return availableSeats.map(seat => this.getSeatNumber(i, seat));
      }
    }

    // If not possible, find nearby seats
    let seats: number[] = [];
    for (let i = 0; i < this.totalRows; i++) {
      for (let j = 0; j < this.seatLayout[i].length; j++) {
        if (this.seatLayout[i][j] === 0) {
          seats.push(this.getSeatNumber(i, j));
          if (seats.length === count) {
            return seats;
          }
        }
      }
    }

    return [];
  }

  findConsecutiveSeats(row: number[], count: number): number[] {
    let consecutive: number[] = [];
    for (let i = 0; i < row.length; i++) {
      if (row[i] === 0) {
        consecutive.push(i);
        if (consecutive.length === count) {
          return consecutive;
        }
      } else {
        consecutive = [];
      }
    }
    return [];
  }

  updateSeatLayout(seats: number[]) {
    seats.forEach(seatNumber => {
      const [row, col] = this.getSeatPosition(seatNumber);
      this.seatLayout[row][col] = 1;
    });
  }

  getSeatNumber(row: number, col: number): number {
    return row * this.seatsPerRow + col + 1;
  }

  getSeatPosition(seatNumber: number): [number, number] {
    const row = Math.floor((seatNumber - 1) / this.seatsPerRow);
    const col = (seatNumber - 1) % this.seatsPerRow;
    return [row, col];
  }
}