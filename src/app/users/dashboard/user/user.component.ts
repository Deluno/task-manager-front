import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @Input() user: User;

  constructor(private router: Router, private usersService: UsersService) {}

  ngOnInit(): void {}

  onView() {
    this.router.navigate(['/users', this.user.username, 'calendar']);
  }

  onDelete() {
    this.usersService.deleteUser(this.user.username).subscribe();
  }
}
