import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'ngx-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'host';
  protected readonly isDarkTheme = signal(false);

  protected toggleTheme(): void {
    this.isDarkTheme.update((isDark) => !isDark);

    document.documentElement.toggleAttribute(
      'data-ngx-theme',
      false,
    );

    if (this.isDarkTheme()) {
      document.documentElement.setAttribute('data-ngx-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-ngx-theme');
    }
  }
}
