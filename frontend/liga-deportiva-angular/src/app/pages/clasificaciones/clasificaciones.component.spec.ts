import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ClasificacionesComponent } from './clasificaciones.component';

describe('ClasificacionesComponent', () => {
  let component: ClasificacionesComponent;
  let fixture: ComponentFixture<ClasificacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [ClasificacionesComponent]
    });
    fixture = TestBed.createComponent(ClasificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });
});
