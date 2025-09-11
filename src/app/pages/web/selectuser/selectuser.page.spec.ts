import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectuserPage } from './selectuser.page';

describe('SelectuserPage', () => {
  let component: SelectuserPage;
  let fixture: ComponentFixture<SelectuserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
