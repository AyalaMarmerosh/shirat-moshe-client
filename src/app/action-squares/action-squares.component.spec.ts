import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSquaresComponent } from './action-squares.component';

describe('ActionSquaresComponent', () => {
  let component: ActionSquaresComponent;
  let fixture: ComponentFixture<ActionSquaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSquaresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionSquaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
