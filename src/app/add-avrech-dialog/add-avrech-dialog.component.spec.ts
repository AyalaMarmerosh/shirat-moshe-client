import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAvrechDialogComponent } from './add-avrech-dialog.component';

describe('AddAvrechDialogComponent', () => {
  let component: AddAvrechDialogComponent;
  let fixture: ComponentFixture<AddAvrechDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAvrechDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAvrechDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
