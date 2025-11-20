import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  username!: string;
  email!: string
  role: "USER" | "ADMIN" = 'USER'
  isLoggedIn: boolean = true
  userProfileImg: string = "https://media.licdn.com/dms/image/v2/D5603AQF6Jg0zTVWBzQ/profile-displayphoto-scale_200_200/B56ZjazRsiH8Ac-/0/1756017532600?e=2147483647&v=beta&t=ZjjwETYcdYZ464B7MlBjEaAzoNvkmWwalikR8gYsnUE"
  constructor() {
    this.username = "amantiwari8861";
    this.email = "amantiwari8861@gmail.com"
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoggedIn = false;
    }, 4000);
  }
  isMenuOpen: boolean = false;
  toggleUI() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
