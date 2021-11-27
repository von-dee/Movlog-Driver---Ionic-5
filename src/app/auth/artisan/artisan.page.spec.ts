import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisanPage } from './artisan.page';

describe('ArtisanPage', () => {
  let component: ArtisanPage;
  let fixture: ComponentFixture<ArtisanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtisanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtisanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
