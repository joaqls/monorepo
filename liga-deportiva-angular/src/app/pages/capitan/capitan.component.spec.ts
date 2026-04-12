import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CapitanComponent } from './capitan.component';

describe('CapitanComponent', () => {
  let component: CapitanComponent;
  let fixture: ComponentFixture<CapitanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [CapitanComponent]
    });
    fixture = TestBed.createComponent(CapitanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });
});
