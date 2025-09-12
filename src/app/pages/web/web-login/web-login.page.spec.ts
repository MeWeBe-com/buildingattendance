import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebLoginPage } from './web-login.page';

describe('WebLoginPage', () => {
  let component: WebLoginPage;
  let fixture: ComponentFixture<WebLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WebLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
