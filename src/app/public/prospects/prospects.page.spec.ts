import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectsPage } from './prospects.page';

describe('ProspectsPage', () => {
  let component: ProspectsPage;
  let fixture: ComponentFixture<ProspectsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
