import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectbuildingPage } from './selectbuilding.page';

describe('SelectbuildingPage', () => {
  let component: SelectbuildingPage;
  let fixture: ComponentFixture<SelectbuildingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectbuildingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
