import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMonthlyRecordComponent } from './edit-monthly-record.component';

describe('EditMonthlyRecordComponent', () => {
  let component: EditMonthlyRecordComponent;
  let fixture: ComponentFixture<EditMonthlyRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMonthlyRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMonthlyRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
