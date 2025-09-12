import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectUserTypePage } from './select-user-type.page';

describe('SelectUserTypePage', () => {
  let component: SelectUserTypePage;
  let fixture: ComponentFixture<SelectUserTypePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUserTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
