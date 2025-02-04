import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculationConfigService {

  private _sumIsChabura = 300;
  private _sumTest = 500;
  
  constructor() { }

  get sumIsChabura(): number {
    return this._sumIsChabura;
  }

  set sumIsChabura(value: number) {
    this._sumIsChabura = value;
  }

  get sumTest(): number {
    return this._sumTest;
  }

  set sumTest(value: number) {
    this._sumTest = value;
  }
}
