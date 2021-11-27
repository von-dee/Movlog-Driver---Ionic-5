import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestResponsePage } from './request-response.page';

describe('RequestResponsePage', () => {
  let component: RequestResponsePage;
  let fixture: ComponentFixture<RequestResponsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestResponsePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestResponsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
