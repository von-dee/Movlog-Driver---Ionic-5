import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrymodalPage } from './countrymodal.page';

describe('CountrymodalPage', () => {
  let component: CountrymodalPage;
  let fixture: ComponentFixture<CountrymodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountrymodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrymodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
