import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MybidsPage } from './mybids.page';

describe('MybidsPage', () => {
  let component: MybidsPage;
  let fixture: ComponentFixture<MybidsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MybidsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MybidsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
