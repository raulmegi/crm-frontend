import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import other Angular Material modules you want globally

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    // ...other Material modules
  ],
  exports: [
    CommonModule,
    MatSnackBarModule,
    // ...other Material modules
  ]
})
export class UiModule {}
