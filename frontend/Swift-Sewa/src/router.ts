import { loginPage } from "./loader/login";
import { AboutusPage } from "./loader/about-us";
import { HomePage } from "./loader/homepage";
import { SignUpPage } from "./loader/signUp";
import { DashboardPage } from "./loader/user/dashboard";
import { ProfilePage } from "./loader/user/profile";
import { CompanyRegistrationPage } from "./loader/supplier/companyRegistration";
import { CompaniesPage } from "./loader/supplier/companies";
import { SelectedCompanyPage } from "./loader/supplier/selectedCompany";
import { UserSearchPage } from "./loader/user/search";

const routes: { [key: string]: { component: any } } = {
  "#/": {
    component: HomePage,
  },
  "#/login": {
    component: loginPage,
  },
  "#/signup": {
    component: SignUpPage,
  },
  "#/dashboard": {
    component: DashboardPage,
  },

  "#/profile": {
    component: ProfilePage,
  },

  "#/user/search": {
    component: UserSearchPage,
  },

  "#/supplier/registration": {
    component: CompanyRegistrationPage,
  },

  "#/supplier/companies": {
    component: CompaniesPage,
  },

  "#/supplier/companies/selected": {
    component: SelectedCompanyPage,
  },

  "#/about-us": { component: AboutusPage },
};

export class Router {
  static async loadContent() {
    const hash = window.location.hash || "#/home";
    const route = routes[hash];
    if (route) {
      const content = await route.component.load();
      document.getElementById("app")!.innerHTML = content;

      route.component.initEventListeners();
    }
  }

  static handleRouteChange() {
    Router.loadContent();
  }
  static init() {
    window.addEventListener("popstate", () => this.handleRouteChange());
    this.handleRouteChange();
  }
}
