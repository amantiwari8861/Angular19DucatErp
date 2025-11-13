# What is Angular? (SPA vs MPA)

Angular Architecture (Components, Modules, Services, Templates)

Node.js + npm + Angular CLI setup

Project Structure (src/app, assets, environments)

Angular 20 Standalone Components

Component Decorator (@Component)

Data Binding

Interpolation {{}}

Property Binding [property]

Event Binding (event)

Two-Way Binding [(ngModel)]

Directives

Structural (*ngIf, *ngFor, *ngSwitch)

Attribute ([ngClass], [ngStyle])

Custom Directives

Pipes

Built-in Pipes (date, uppercase, currency, etc.)

Parameterized & Custom Pipes

Lifecycle Hooks (ngOnInit, ngOnChanges, etc.)



<input (keyup)="onType($event)">
onType(event: any) {
  console.log(event.target.value);
}

<input [(ngModel)]="username" placeholder="Enter name">


<p>Hello {{ username }}!</p>
export class DemoComponent {
  username = 'Aman';
}

import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  ...
})


<p *ngIf="isLoggedIn">Welcome back!</p>
<p *ngIf="!isLoggedIn">Please log in</p>
isLoggedIn = true;

<ul>
  <li *ngFor="let user of users; index as i">
    {{ i + 1 }}. {{ user.name }}
  </li>
</ul>
users = [{ name: 'Aman' }, { name: 'Riya' }, { name: 'John' }];


<div [ngSwitch]="role">
  <p *ngSwitchCase="'admin'">Welcome Admin</p>
  <p *ngSwitchCase="'user'">Welcome User</p>
  <p *ngSwitchDefault>Guest Access</p>
</div>
role = 'admin';


<p [ngClass]="{ 'active': isActive, 'disabled': !isActive }">
  Status: {{ isActive ? 'Active' : 'Inactive' }}
</p>
isActive = true;




import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'background', 'yellow');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeStyle(this.el.nativeElement, 'background');
  }
}
Using it in HTML:
<p appHighlight>Hover over this text!</p>



| Type                     | Syntax                         | Direction           | Example                          |
| ------------------------ | ------------------------------ | ------------------- | -------------------------------- |
| **Interpolation**        | `{{property}}`                 | One-way (TS → HTML) | `<p>{{ name }}</p>`              |
| **Property Binding**     | `[property]="value"`           | One-way (TS → HTML) | `<img [src]="url">`              |
| **Event Binding**        | `(event)="handler()"`          | One-way (HTML → TS) | `<button (click)="save()">`      |
| **Two-Way Binding**      | `[(ngModel)]="prop"`           | Two-way             | `<input [(ngModel)]="username">` |
| **Structural Directive** | `*ngIf`, `*ngFor`, `*ngSwitch` | Template control    | `<li *ngFor="let x of list">`    |
| **Attribute Directive**  | `[ngClass]`, `[ngStyle]`       | Element appearance  | `<p [ngStyle]="...">`            |
| **Custom Directive**     | `@Directive()`                 | Behavior extension  | `<div appHighlight>`             |



