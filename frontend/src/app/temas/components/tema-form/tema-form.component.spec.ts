import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemaFormComponent } from './tema-form.component';

describe('TemaFormComponent', () => {
  let component: TemaFormComponent;
  let fixture: ComponentFixture<TemaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
