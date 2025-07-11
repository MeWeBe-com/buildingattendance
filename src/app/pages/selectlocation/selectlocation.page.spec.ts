import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectlocationPage } from './selectlocation.page';

describe('SelectlocationPage', () => {
  let component: SelectlocationPage;
  let fixture: ComponentFixture<SelectlocationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectlocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
