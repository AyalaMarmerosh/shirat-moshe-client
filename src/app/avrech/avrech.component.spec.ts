import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvrechComponent } from './avrech.component';

describe('AvrechComponent', () => {
  let component: AvrechComponent;
  let fixture: ComponentFixture<AvrechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvrechComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvrechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
