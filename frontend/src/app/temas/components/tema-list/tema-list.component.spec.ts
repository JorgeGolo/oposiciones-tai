import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemaListComponent } from './tema-list.component';

describe('TemaListComponent', () => {
  let component: TemaListComponent;
  let fixture: ComponentFixture<TemaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
