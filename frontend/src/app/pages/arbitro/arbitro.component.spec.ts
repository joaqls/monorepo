import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ArbitroComponent } from './arbitro.component';

describe('ArbitroComponent', () => {
  let component: ArbitroComponent;
  let fixture: ComponentFixture<ArbitroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ArbitroComponent]
    });
    fixture = TestBed.createComponent(ArbitroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });
});
