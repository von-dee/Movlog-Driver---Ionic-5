import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPage } from './merchant.page';

describe('MerchantPage', () => {
  let component: MerchantPage;
  let fixture: ComponentFixture<MerchantPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
